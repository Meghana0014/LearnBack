import crypto from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import OpenAI from "openai";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = "/tmp/learnback.db";

// Copy seed db if exists, else create fresh
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode=WAL;");
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,grade TEXT DEFAULT 'College',goal TEXT DEFAULT 'Build strong understanding',preferred_input TEXT DEFAULT 'Text',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,topic TEXT,concept TEXT,question TEXT,answer TEXT,confidence TEXT,is_correct INTEGER,misconception INTEGER,misconception_id TEXT,summary TEXT,explanation TEXT,recovery TEXT,next_question TEXT,mastery_signal REAL,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS mastery(user_id INTEGER,concept TEXT,score REAL DEFAULT 50,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(user_id,concept));
`);

let user = null;
const hashPassword = p => crypto.scryptSync(String(p), "learnback-salt-v1", 64).toString("hex");
const newToken = () => crypto.randomBytes(32).toString("hex");
const getToken = req => String(req.headers["x-session-token"] || "");
const authUser = req => { const token = getToken(req); if (!token) return null; return db.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?").get(token) || null; };

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const ENGINE = {
  dbms: {
    primary_key: { label: "Primary Key", parents: [], children: ["foreign_key", "candidate_key"], misconceptions: ["PK_FK_CONFUSION", "PK_NOT_UNIQUE"], questions: [
      ["CONCEPT CHECK", "What is the main purpose of a primary key in a database table?", "Explain it in your own words.", 1],
      ["TARGETED RETEST", "Which column could uniquely identify every student in a Students table, and why?", "Think about uniqueness.", 2],
      ["TRANSFER", "Can a student's phone number always be used as a primary key? Explain one problem that could occur.", "Think about uniqueness and stability.", 3],
      ["CHALLENGE", "A table has StudentID and DepartmentID. Which one is more likely to be a primary key, and why?", "Think about unique row identification.", 4]
    ]},
    foreign_key: { label: "Foreign Key", parents: ["primary_key"], children: [], misconceptions: ["PK_FK_CONFUSION"], questions: [
      ["CONCEPT CHECK", "What is the purpose of a foreign key?", "Think about relationships between tables.", 1],
      ["TRANSFER", "If Students.DepartmentID references Departments.DepartmentID, what role does DepartmentID play in Students?", "Trace the relationship.", 3]
    ]},
    candidate_key: { label: "Candidate Key", parents: ["primary_key"], children: [], misconceptions: ["CANDIDATE_PK_CONFUSION"], questions: [
      ["CONCEPT CHECK", "What makes a column or set of columns a candidate key?", "Think about uniqueness and minimality.", 1],
      ["TRANSFER", "If both StudentID and Email are unique, what can you say about them as candidate keys?", "There may be more than one.", 3]
    ]},
    normalization: { label: "Normalization", parents: [], children: [], misconceptions: ["NORMALIZATION_DUPLICATION"], questions: [
      ["CONCEPT CHECK", "Why is database normalization used?", "Think about repeated data and anomalies.", 1],
      ["TRANSFER", "What problem can happen when the same department name is repeated in many student rows?", "Think about updates.", 3]
    ]}
  },
  java: {
    encapsulation: { label: "Encapsulation", parents: [], children: ["inheritance"], misconceptions: ["ENCAPSULATION_INHERITANCE_CONFUSION"], questions: [
      ["CONCEPT CHECK", "What does encapsulation mean in object-oriented programming?", "Describe what happens to data and the code that works with it.", 1],
      ["TARGETED RETEST", "Why might a Java class keep a field private and expose a public getter?", "Think about controlling access.", 2],
      ["TRANSFER", "Give one example of how a class can protect an object's state using encapsulation.", "Think about validation.", 3]
    ]},
    inheritance: { label: "Inheritance", parents: ["encapsulation"], children: ["polymorphism"], misconceptions: ["INHERITANCE_REUSE_CONFUSION"], questions: [
      ["CONCEPT CHECK", "What is inheritance in Java?", "Think about a general class and a specialized class.", 1],
      ["TRANSFER", "Give one real-world example where inheritance could reduce repeated code.", "Start with a general type and a specific type.", 3]
    ]},
    polymorphism: { label: "Polymorphism", parents: ["inheritance"], children: [], misconceptions: ["OVERRIDING_POLYMORPHISM_CONFUSION"], questions: [
      ["CONCEPT CHECK", "What does polymorphism allow in object-oriented programming?", "Think about one interface and different implementations.", 1],
      ["CHALLENGE", "How is method overriding related to polymorphism?", "Think about one method call producing different behavior.", 4]
    ]}
  },
  python: {
    lists: { label: "Lists", parents: [], children: ["functions"], misconceptions: ["LIST_VARIABLE_CONFUSION"], questions: [
      ["CONCEPT CHECK", "What is a Python list and when would you use one?", "Think about storing multiple values in order.", 1],
      ["TARGETED RETEST", "When would you choose a Python list instead of a single variable?", "Think about collections.", 2],
      ["TRANSFER", "If you need to store the names of five students, why might a list be useful?", "Think about repeated values.", 3]
    ]},
    functions: { label: "Functions", parents: ["lists"], children: ["exceptions"], misconceptions: ["FUNCTION_CALL_CONFUSION"], questions: [
      ["CONCEPT CHECK", "Why are functions useful in Python programs?", "Think about reuse and organization.", 1],
      ["TRANSFER", "What is one benefit of putting repeated logic inside a function?", "Think about reuse and maintenance.", 3]
    ]},
    oop_python: { label: "OOP in Python", parents: ["functions"], children: [], misconceptions: ["CLASS_OBJECT_CONFUSION"], questions: [
      ["CONCEPT CHECK", "What is the difference between a Python class and an object?", "Think about blueprint versus instance.", 2],
      ["TRANSFER", "Why might you create multiple objects from one class?", "Think about shared structure with different data.", 3]
    ]},
    exceptions: { label: "Exceptions", parents: ["functions"], children: [], misconceptions: ["EXCEPTION_SYNTAX_CONFUSION"], questions: [
      ["CONCEPT CHECK", "Why does Python use exceptions?", "Think about handling unexpected situations.", 1],
      ["TRANSFER", "What is the purpose of try and except in Python?", "Think about controlled error handling.", 3]
    ]}
  }
};

const schema = { type:"object", additionalProperties:false, properties:{
  is_correct:{type:"boolean"}, concept:{type:"string"}, concept_label:{type:"string"}, misconception:{type:"boolean"},
  misconception_id:{type:["string","null"]}, confidence_assessment:{type:"string",enum:["low","medium","high"]}, summary:{type:"string"},
  explanation:{type:"string"}, recovery:{type:"string"}, next_question:{type:"string"}, mastery_signal:{type:"number"}
}, required:["is_correct","concept","concept_label","misconception","misconception_id","confidence_assessment","summary","explanation","recovery","next_question","mastery_signal"] };

const system = `You are LearnBack's diagnosis engine. Determine what the learner actually understands. Use only concept IDs from the supplied knowledge engine. Distinguish correctness from confidence. Wrong + high confidence can indicate a high-confidence misconception; wrong + low confidence usually indicates uncertainty. Do not invent a misconception when evidence is weak. Choose a next question that targets the diagnosed concept. mastery_signal must be between -0.20 and 0.20. Keep explanations concise and student-friendly.`;

const send = (res, status, data) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Session-Token");
  res.status(status).json(data);
};

const getMastery = (userId) => Object.fromEntries(db.prepare("SELECT concept,score FROM mastery WHERE user_id=?").all(userId).map(x => [x.concept, x.score]));
const clamp = n => Math.max(5, Math.min(98, n));

function allConcepts(topic, userId) {
  const m = getMastery(userId);
  return Object.entries(ENGINE[topic]).map(([id, c]) => ({ id, label: c.label, score: Number(m[id] ?? 50), parents: c.parents, children: c.children }));
}

function adaptiveQuestion(topic, userId, excludeConcept = null) {
  const m = getMastery(userId);
  const recent = db.prepare("SELECT concept,misconception,misconception_id FROM attempts WHERE user_id=? AND topic=? ORDER BY id DESC LIMIT 6").all(userId, topic);
  const engine = ENGINE[topic] || ENGINE.dbms;
  const recentMis = recent.find(x => x.misconception && x.concept !== excludeConcept);
  let targetId = recentMis?.concept;
  if (!targetId) {
    const concepts = Object.entries(engine).map(([id, c]) => ({ id, c, score: Number(m[id] ?? 50), recent: recent.findIndex(x => x.concept === id) })).filter(x => x.id !== excludeConcept);
    concepts.sort((a, b) => {
      const pa = a.score < 60 ? 0 : a.score < 80 ? 1 : 2, pb = b.score < 60 ? 0 : b.score < 80 ? 1 : 2;
      if (pa !== pb) return pa - pb;
      if (a.recent !== -1 || b.recent !== -1) return (a.recent === -1 ? 99 : a.recent) - (b.recent === -1 ? 99 : b.recent);
      return a.score - b.score;
    });
    targetId = concepts[0]?.id || Object.keys(engine)[0];
    const c = engine[targetId];
    const parent = (c.parents || []).find(id => Number(m[id] ?? 50) < 55);
    if (parent && parent !== excludeConcept) targetId = parent;
  }
  const target = engine[targetId] || engine[Object.keys(engine)[0]];
  const qs = target.questions;
  const score = Number(m[targetId] ?? 50);
  const recentCount = recent.filter(x => x.concept === targetId).length;
  const idx = Math.min(qs.length - 1, Math.max(0, Math.floor(score / 25) + Math.min(recentCount, 1)));
  const chosen = qs[idx] || qs[0];
  const reason = recentMis?.concept === targetId ? "Revisits a recent misconception signal" : score < 60 ? "Targets your lowest-mastery concept" : (target.parents || []).some(id => Number(m[id] ?? 50) < 55) ? "Repairs a prerequisite before moving on" : "Keeps a weaker concept active";
  return { concept: targetId, concept_label: target.label, type: chosen[0], question: chosen[1], hint: chosen[2], difficulty: chosen[3], focus: target.label, reason };
}

function fallback(b, userId) {
  const a = b.answer.toLowerCase(), high = b.confidence === "Very confident";
  if (b.topic === "dbms" && b.concept_hint === "primary_key" && /(connect|relationship|another table|link)/.test(a) && !/(unique|uniquely|identify)/.test(a)) return {
    is_correct: false, concept: "primary_key", concept_label: "Primary Key", misconception: true, misconception_id: "PK_FK_CONFUSION", confidence_assessment: high ? "high" : "medium",
    summary: "Your answer describes a foreign-key relationship more than the core purpose of a primary key.", explanation: "A primary key uniquely identifies a row in its own table. A foreign key usually connects a row to another table.",
    recovery: "In a Students table, StudentID can uniquely identify each student. DepartmentID could point to a department table.", next_question: "Which column could uniquely identify every student in a Students table, and why?", mastery_signal: -.04
  };
  const ok = b.topic === "dbms" ? /(unique|uniquely|identify)/.test(a) : b.topic === "java" ? /(data|access|private|protect|object|class|subclass|parent|reuse|different behavior|overrid)/.test(a) : /(multiple|many|collection|values|ordered|sequence|reuse|function|error|exception|class|object|instance)/.test(a);
  const concept = b.concept_hint || (b.topic === "dbms" ? "primary_key" : "encapsulation");
  const c = ENGINE[b.topic][concept] || ENGINE[b.topic][Object.keys(ENGINE[b.topic])[0]];
  return { is_correct: ok, concept, concept_label: c.label, misconception: false, misconception_id: null, confidence_assessment: high ? "high" : b.confidence === "Not sure" ? "low" : "medium", summary: ok ? "Your answer contains the core idea." : "LearnBack needs another signal before deciding what you understand.", explanation: ok ? "You connected your answer to the target concept." : "This looks more like a knowledge gap or incomplete explanation, so the next step is a targeted check.", recovery: b.topic === "dbms" ? "A primary key uniquely identifies a row in its own table." : b.topic === "java" ? "Encapsulation controls access to an object's internal state through a clear public interface." : "A Python list stores multiple values in an ordered collection that you can access and modify.", next_question: adaptiveQuestion(b.topic, userId, concept).question, mastery_signal: ok ? .08 : .01 };
}

async function diagnose(b, userId) {
  if (!client) return { ...fallback(b, userId), mode: "demo" };
  const engine = ENGINE[b.topic] || ENGINE.dbms;
  const input = { ...b, known_mastery: getMastery(userId), allowed_concepts: Object.entries(engine).map(([id, c]) => ({ id, label: c.label, misconceptions: c.misconceptions })) };
  try {
    const out = await client.responses.create({ model: process.env.OPENAI_MODEL || "gpt-4o", input: [{ role: "system", content: system }, { role: "user", content: JSON.stringify(input) }], text: { format: { type: "json_schema", name: "learnback_diagnosis", strict: true, schema } } });
    const d = JSON.parse(out.output_text);
    if (!engine[d.concept]) d.concept = b.concept_hint || Object.keys(engine)[0];
    d.concept_label = engine[d.concept].label;
    return { ...d, mode: "ai" };
  } catch (e) {
    console.warn("AI unavailable:", e?.message || e);
    return { ...fallback(b, userId), mode: "demo-fallback" };
  }
}

async function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", c => raw += c);
    req.on("end", () => { try { resolve(JSON.parse(raw)); } catch { resolve({}); } });
  });
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Session-Token");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    return res.status(204).end();
  }

  const url = req.url.replace(/^\/api/, "").split("?")[0];
  user = authUser(req);

  try {
    // Signup
    if (req.method === "POST" && url === "/signup") {
      const b = await readBody(req);
      const name = String(b.name || "").trim().slice(0, 60), email = String(b.email || "").trim().toLowerCase().slice(0, 120), password = String(b.password || "");
      if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return send(res, 400, { error: "Enter a name, valid email, and password of at least 6 characters." });
      if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) return send(res, 409, { error: "An account with that email already exists." });
      const r = db.prepare("INSERT INTO users(name,email,password_hash,grade,goal,preferred_input) VALUES(?,?,?,?,?,?)").run(name, email, hashPassword(password), String(b.grade || "College"), String(b.goal || "Build strong understanding"), "Text");
      const token = newToken(); db.prepare("INSERT INTO sessions(token,user_id) VALUES(?,?)").run(token, r.lastInsertRowid);
      user = db.prepare("SELECT * FROM users WHERE id=?").get(r.lastInsertRowid);
      return send(res, 201, { token, user });
    }

    // Login
    if (req.method === "POST" && url === "/login") {
      const b = await readBody(req);
      const email = String(b.email || "").trim().toLowerCase(), password = String(b.password || "");
      const found = db.prepare("SELECT * FROM users WHERE email=?").get(email);
      if (!found || !found.password_hash || hashPassword(password) !== found.password_hash) return send(res, 401, { error: "Email or password is incorrect." });
      const token = newToken(); db.prepare("INSERT INTO sessions(token,user_id) VALUES(?,?)").run(token, found.id);
      user = found; return send(res, 200, { token, user });
    }

    // Logout
    if (req.method === "POST" && url === "/logout") {
      const token = getToken(req); if (token) db.prepare("DELETE FROM sessions WHERE token=?").run(token);
      user = null; return send(res, 200, { ok: true });
    }

    // Me
    if (req.method === "GET" && url === "/me") {
      if (!user) return send(res, 401, { error: "Authentication required" });
      return send(res, 200, { user });
    }

    // All routes below require auth
    if (!user) return send(res, 401, { error: "Authentication required" });

    // Profile GET
    if (req.method === "GET" && url === "/profile") {
      const mastery = getMastery(user.id), vals = Object.values(mastery);
      const avg = vals.length ? Math.round(vals.reduce((a, b) => a + Number(b), 0) / vals.length) : 0;
      return send(res, 200, { user, mastery, attempts: db.prepare("SELECT COUNT(*) c FROM attempts WHERE user_id=?").get(user.id).c, overall: avg, concepts: allConcepts("dbms", user.id).concat(allConcepts("java", user.id)) });
    }

    // Profile POST
    if (req.method === "POST" && url === "/profile") {
      const b = await readBody(req);
      const name = String(b.name || "Student").trim().slice(0, 60) || "Student";
      const grade = String(b.grade || "College").slice(0, 40);
      const goal = String(b.goal || "Build strong understanding").slice(0, 120);
      const preferred_input = String(b.preferred_input || "Text").slice(0, 30);
      db.prepare("UPDATE users SET name=?,grade=?,goal=?,preferred_input=? WHERE id=?").run(name, grade, goal, preferred_input, user.id);
      user = db.prepare("SELECT * FROM users WHERE id=?").get(user.id);
      return send(res, 200, { user });
    }

    // Next question
    if (req.method === "GET" && url === "/next-question") {
      const topic = new URL(req.url, "http://localhost").searchParams.get("topic") || "dbms";
      return send(res, 200, adaptiveQuestion(ENGINE[topic] ? topic : "dbms", user.id));
    }

    // Engine
    if (req.method === "GET" && url === "/engine") {
      return send(res, 200, { engine: ENGINE, mastery: getMastery(user.id) });
    }

    // Reset
    if (req.method === "POST" && url === "/reset") {
      db.prepare("DELETE FROM attempts WHERE user_id=?").run(user.id);
      db.prepare("DELETE FROM mastery WHERE user_id=?").run(user.id);
      return send(res, 200, { ok: true });
    }

    // History
    if (req.method === "GET" && url === "/history") {
      return send(res, 200, { items: db.prepare("SELECT id,topic,concept,is_correct,misconception,misconception_id,confidence,summary,created_at FROM attempts WHERE user_id=? ORDER BY id DESC LIMIT 30").all(user.id) });
    }

    // Analyze
    if (req.method === "POST" && url === "/analyze") {
      const b = await readBody(req);
      const d = await diagnose(b, user.id);
      const old = Number(getMastery(user.id)[d.concept] ?? 50);
      const next = clamp(old + Number(d.mastery_signal) * 100);
      db.prepare("INSERT INTO attempts(user_id,topic,concept,question,answer,confidence,is_correct,misconception,misconception_id,summary,explanation,recovery,next_question,mastery_signal) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(user.id, b.topic, d.concept, b.question, b.answer, b.confidence, d.is_correct ? 1 : 0, d.misconception ? 1 : 0, d.misconception_id, d.summary, d.explanation, d.recovery, d.next_question, d.mastery_signal);
      db.prepare("INSERT INTO mastery(user_id,concept,score) VALUES(?,?,?) ON CONFLICT(user_id,concept) DO UPDATE SET score=excluded.score,updated_at=CURRENT_TIMESTAMP").run(user.id, d.concept, next);
      const nextAdaptive = adaptiveQuestion(b.topic, user.id, d.concept);
      return send(res, 200, { ...d, old_mastery: old, new_mastery: next, adaptive_next: nextAdaptive });
    }

    return send(res, 404, { error: "Not found" });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: e?.message || "Server error." });
  }
}
