# LearnBack — Deep Technical Documentation

> **Understand. Adapt. Improve.**
> A prototype adaptive learning system that treats every answer as a learning signal, not just a pass/fail verdict.

---

## Table of Contents

1. [Project Philosophy](#1-project-philosophy)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Directory Structure](#3-directory-structure)
4. [Database Design](#4-database-design)
5. [The Knowledge Engine (ENGINE)](#5-the-knowledge-engine-engine)
6. [Adaptive Question Selection Algorithm](#6-adaptive-question-selection-algorithm)
7. [Answer Diagnosis — AI Mode vs Demo Mode](#7-answer-diagnosis--ai-mode-vs-demo-mode)
8. [Mastery Tracking & Score Update](#8-mastery-tracking--score-update)
9. [Backend API — All Endpoints](#9-backend-api--all-endpoints)
10. [Frontend Architecture (main.ts)](#10-frontend-architecture-maints)
11. [State Management](#11-state-management)
12. [All Views & What They Do](#12-all-views--what-they-do)
13. [Authentication Flow](#13-authentication-flow)
14. [Session & Confidence Model](#14-session--confidence-model)
15. [Peer Reasoning Feature](#15-peer-reasoning-feature)
16. [Classroom Copilot View](#16-classroom-copilot-view)
17. [Learning Intelligence View](#17-learning-intelligence-view)
18. [Voice Input](#18-voice-input)
19. [Demo Mode & the 60-Second Demo Flow](#19-demo-mode--the-60-second-demo-flow)
20. [Deployment — Local vs Vercel](#20-deployment--local-vs-vercel)
21. [Configuration Reference](#21-configuration-reference)
22. [Data Flow: End-to-End Walkthrough](#22-data-flow-end-to-end-walkthrough)
23. [Misconception Taxonomy](#23-misconception-taxonomy)
24. [Known Limitations & Roadmap](#24-known-limitations--roadmap)

---

## 1. Project Philosophy

Most quiz-based learning tools ask a question and record *right* or *wrong*. LearnBack takes a different stance:

> **Every learner response is a learning signal. The goal is to infer *what the learner understands*, not just whether they selected the right answer.**

This produces a richer feedback loop:

```
Answer → Diagnose concept + confidence + misconception
       → Update mastery score for that specific concept
       → Select the next question that most repairs understanding
       → Re-test → Measure whether mastery moved
```

The system is designed around four key ideas:

| Idea | What it means in practice |
|---|---|
| **Concept-level mastery** | Mastery is tracked per concept (e.g., "Primary Key"), not as a total score. |
| **Misconception detection** | The engine tries to identify *why* an answer is wrong, not just *that* it is wrong. |
| **Confidence-aware diagnosis** | A wrong answer with high confidence is treated differently from a wrong answer with low confidence. |
| **Prerequisite-aware sequencing** | If a student hasn't mastered a prerequisite concept, the system targets that first. |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                            │
│                                                         │
│  src/main.ts (TypeScript + Vite)                        │
│  ├── Single-page app, no framework                      │
│  ├── All views rendered as HTML string templates        │
│  ├── State object `s` drives all rendering              │
│  └── apiFetch() → X-Session-Token header on all calls   │
│                                                         │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (JSON)
                         │ Header: X-Session-Token
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND                               │
│                                                         │
│  server/server.mjs  ← Local dev (Node.js HTTP server)  │
│  api/index.mjs      ← Vercel serverless function        │
│                                                         │
│  Both share the same ENGINE, schema, diagnose logic.    │
│                                                         │
│  ├── Auth: scrypt password hash + random session token  │
│  ├── SQLite via node:sqlite (built-in Node 22+)         │
│  ├── Adaptive engine: pure JS, no ML library            │
│  └── Optional: OpenAI API for richer diagnosis          │
│                                                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│             SQLite Database (learnback.db)              │
│                                                         │
│  users │ sessions │ attempts │ mastery                  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              OpenAI API  (optional)                     │
│  Used only in /api/analyze if OPENAI_API_KEY is set.    │
│  Falls back to local `fallback()` engine if unavailable. │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
LearnBack/
├── .env                  ← Runtime environment variables (not in git)
├── .env.example          ← Template: OPENAI_API_KEY, OPENAI_MODEL, PORT
├── index.html            ← Single HTML shell; mounts <div id="app">
├── package.json          ← Scripts: dev, server, dev:all, build, preview
├── package-lock.json
├── tsconfig.json         ← Strict ES2020, moduleResolution: Bundler
├── vercel.json           ← Rewrites /api/* → api/index.mjs
├── learnback.db          ← SQLite file (WAL mode)
├── learnback.db-wal      ← WAL journal (auto-created)
├── learnback.db-shm      ← Shared memory file (auto-created)
│
├── src/
│   ├── main.ts           ← Entire frontend: state, views, API calls
│   ├── style.css         ← All CSS: layout, cards, modals, charts
│   └── engine.ts         ← Standalone local diagnosis engine (older)
│
├── server/
│   └── server.mjs        ← Node.js HTTP server for local development
│
├── api/
│   └── index.mjs         ← Vercel serverless function (same logic as server.mjs)
│
└── LearnBack/            ← Nested copy of the project (packaging artifact)
    └── LearnBack_Web/    ← Another nested copy
```

> **Note:** `LearnBack/` and `LearnBack_Web/` are nested duplicates created during packaging/archiving. The canonical source files are the ones at the root level (`src/`, `server/`, `api/`).

---

## 4. Database Design

The app uses **SQLite** via Node.js's built-in `node:sqlite` module (available in Node 22+). The database runs in WAL (Write-Ahead Logging) mode for better concurrent read performance.

### Tables

#### `users`
```sql
CREATE TABLE users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  password_hash  TEXT NOT NULL,
  grade          TEXT DEFAULT 'College',
  goal           TEXT DEFAULT 'Build strong understanding',
  preferred_input TEXT DEFAULT 'Text',
  created_at     TEXT DEFAULT CURRENT_TIMESTAMP
);
```

| Column | Purpose |
|---|---|
| `password_hash` | scrypt-derived hash using salt `"learnback-salt-v1"`, 64-byte output, stored as hex |
| `grade` | School / College / University / Professional |
| `goal` | Drives framing in the UI (not adaptive logic) |
| `preferred_input` | Text / Voice / Both (stored but voice uses browser API directly) |

#### `sessions`
```sql
CREATE TABLE sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```
Sessions are 32-byte random hex strings. The frontend stores the token in `localStorage` under key `learnback_session` and sends it as the `X-Session-Token` header on every API call.

#### `attempts`
```sql
CREATE TABLE attempts (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER,
  topic            TEXT,           -- "dbms" | "java" | "python"
  concept          TEXT,           -- e.g. "primary_key"
  question         TEXT,
  answer           TEXT,
  confidence       TEXT,           -- "Not sure" | "Somewhat" | "Confident" | "Very confident"
  is_correct       INTEGER,        -- 0 or 1
  misconception    INTEGER,        -- 0 or 1
  misconception_id TEXT,           -- e.g. "PK_FK_CONFUSION" or NULL
  summary          TEXT,
  explanation      TEXT,
  recovery         TEXT,
  next_question    TEXT,
  mastery_signal   REAL,           -- delta applied to mastery score (-0.20 to 0.20)
  created_at       TEXT DEFAULT CURRENT_TIMESTAMP
);
```

Each row is one complete question-answer-diagnosis cycle. It stores both the input (question, answer, confidence) and the engine's full output.

#### `mastery`
```sql
CREATE TABLE mastery (
  user_id    INTEGER,
  concept    TEXT,
  score      REAL DEFAULT 50,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, concept)
);
```

Mastery scores start at 50 (no prior evidence) and are clamped between 5 and 98. Updates use `INSERT … ON CONFLICT DO UPDATE` (upsert).

---

## 5. The Knowledge Engine (ENGINE)

The `ENGINE` object is a static JavaScript object defined in both `server.mjs` and `api/index.mjs`. It is the backbone of the adaptive system — a hand-authored concept graph with questions and misconception identifiers.

### Structure

```js
ENGINE = {
  <topic>: {
    <concept_id>: {
      label: string,           // Human-readable name
      parents: string[],       // Prerequisite concept IDs
      children: string[],      // Concepts unlocked by this one
      misconceptions: string[], // Misconception IDs that can be detected
      questions: [
        [type, question_text, hint, difficulty_level],
        ...
      ]
    }
  }
}
```

### Topics and Concepts

#### `dbms` — Database Systems
| Concept ID | Label | Parents | Children | Misconception IDs |
|---|---|---|---|---|
| `primary_key` | Primary Key | — | `foreign_key`, `candidate_key` | `PK_FK_CONFUSION`, `PK_NOT_UNIQUE` |
| `foreign_key` | Foreign Key | `primary_key` | — | `PK_FK_CONFUSION` |
| `candidate_key` | Candidate Key | `primary_key` | — | `CANDIDATE_PK_CONFUSION` |
| `normalization` | Normalization | — | — | `NORMALIZATION_DUPLICATION` |

#### `java` — Java OOP
| Concept ID | Label | Parents | Children | Misconception IDs |
|---|---|---|---|---|
| `encapsulation` | Encapsulation | — | `inheritance` | `ENCAPSULATION_INHERITANCE_CONFUSION` |
| `inheritance` | Inheritance | `encapsulation` | `polymorphism` | `INHERITANCE_REUSE_CONFUSION` |
| `polymorphism` | Polymorphism | `inheritance` | — | `OVERRIDING_POLYMORPHISM_CONFUSION` |

#### `python` — Python Foundations
| Concept ID | Label | Parents | Children | Misconception IDs |
|---|---|---|---|---|
| `lists` | Lists | — | `functions` | `LIST_VARIABLE_CONFUSION` |
| `functions` | Functions | `lists` | `exceptions` | `FUNCTION_CALL_CONFUSION` |
| `oop_python` | OOP in Python | `functions` | — | `CLASS_OBJECT_CONFUSION` |
| `exceptions` | Exceptions | `functions` | — | `EXCEPTION_SYNTAX_CONFUSION` |

### Question Types

Each concept has up to 4 questions at increasing difficulty levels:

| Type | When used | Difficulty |
|---|---|---|
| `CONCEPT CHECK` | First contact, checking raw understanding | 1 |
| `TARGETED RETEST` | After a misconception or low mastery | 2 |
| `TRANSFER` | Applying the concept to a new context | 3 |
| `CHALLENGE` | Deep or multi-concept application | 4 |

---

## 6. Adaptive Question Selection Algorithm

`adaptiveQuestion(topic, userId, excludeConcept)` — defined in both server files.

This is the core of LearnBack's adaptive behavior. It runs every time the frontend calls `GET /api/next-question`.

### Step-by-step

```
1. Load mastery scores for this user from the database.

2. Load the last 6 attempts for this topic to detect recent patterns.

3. Check for a RECENT MISCONCEPTION:
   - If any of the last 6 attempts has misconception=true and its concept
     is not the just-answered concept (excludeConcept), target it.
   - Reason shown: "Revisits a recent misconception signal"

4. If no misconception found, SCORE-BASED SELECTION:
   - Score every concept as:
     priority = 0 (score < 60), 1 (60–80), or 2 (score >= 80)
   - Sort ascending by priority, then by recency (recently seen concepts
     are prioritized within the same priority tier), then by raw score.
   - Pick the lowest-priority concept as the target.
   - Reason shown: "Targets your lowest-mastery concept"

5. PREREQUISITE CHECK:
   - If the selected concept has a parent whose mastery < 55,
     switch to that parent instead.
   - Reason shown: "Repairs a prerequisite before moving on"

6. QUESTION SELECTION within the target concept:
   - Compute idx = floor(score / 25) + min(recentAttemptCount, 1)
   - This means: lower score → easier question; more prior attempts → step up slightly.
   - Clamp idx to the available questions array length.
```

### Example

A student has:
- `primary_key`: 45% mastery (2 recent attempts, no misconception)
- `foreign_key`: 68% mastery
- `normalization`: 50% mastery

Step 4 sorts: `primary_key (priority 0, score 45)` → `normalization (priority 0, score 50)` → `foreign_key (priority 1)`.

Target = `primary_key`. No parent with low mastery. Score 45 → idx = floor(45/25) = 1. Plus 1 for recent attempts → idx = 2 → question[2] = TRANSFER question.

---

## 7. Answer Diagnosis — AI Mode vs Demo Mode

When a student submits an answer, the server calls `diagnose(body, userId)`.

### Diagnosis Decision Tree

```
Is OPENAI_API_KEY set in environment?
│
├── YES → Call OpenAI API with structured JSON schema
│         Response must conform to `learnback_diagnosis` schema
│         Parse and validate concept against ENGINE
│         Return result with mode: "ai"
│
│         On any error/timeout:
│         └── Fall back to local fallback() → mode: "demo-fallback"
│
└── NO  → Call local fallback() directly → mode: "demo"
```

### The OpenAI Prompt

The system prompt is:
> *"You are LearnBack's diagnosis engine. Determine what the learner actually understands. Use only concept IDs from the supplied knowledge engine. Distinguish correctness from confidence. Wrong + high confidence can indicate a high-confidence misconception; wrong + low confidence usually indicates uncertainty. Do not invent a misconception when evidence is weak. Choose a next question that targets the diagnosed concept. mastery_signal must be between -0.20 and 0.20. Keep explanations concise and student-friendly."*

The user message includes:
- `topic`, `question`, `answer`, `confidence`, `concept_hint`
- `known_mastery`: current mastery scores for all concepts
- `allowed_concepts`: list of valid concept IDs + their misconception IDs

The response is enforced via a **strict JSON schema** (`json_schema` response format) so the output is always parseable.

### Diagnosis Schema

```json
{
  "is_correct": boolean,
  "concept": string,
  "concept_label": string,
  "misconception": boolean,
  "misconception_id": string | null,
  "confidence_assessment": "low" | "medium" | "high",
  "summary": string,
  "explanation": string,
  "recovery": string,
  "next_question": string,
  "mastery_signal": number   // between -0.20 and 0.20
}
```

### Local Fallback Engine (`fallback()`)

The fallback uses **keyword-based heuristics** on the answer text:

**DBMS — Primary Key (special case):**
If the answer contains words like *"connect," "relationship," "another table," "link"* but does NOT contain *"unique," "uniquely," "identify"* → classify as `PK_FK_CONFUSION` misconception.

**General correctness heuristics:**
| Topic | Keywords that indicate correctness |
|---|---|
| `dbms` | "unique", "uniquely", "identify" |
| `java` | "data", "access", "private", "protect", "object", "class", "subclass", "parent", "reuse", "different behavior", "overrid" |
| `python` | "multiple", "many", "collection", "values", "ordered", "sequence", "reuse", "function", "error", "exception", "class", "object", "instance" |

If correct → `mastery_signal = 0.08`
If not correct → `mastery_signal = 0.01`

---

## 8. Mastery Tracking & Score Update

After `diagnose()` returns, the server:

```js
const old = getMastery(userId)[concept] ?? 50;  // default 50 if unseen
const next = clamp(old + mastery_signal * 100);
// clamp = Math.max(5, Math.min(98, n))
```

So a `mastery_signal` of `+0.08` on a concept at 50% → new score = 58%.
A signal of `-0.04` on a concept at 50% → new score = 46%.

The score is stored in the `mastery` table via upsert. The old and new scores are returned to the frontend so it can update its local `s.mastery` state and show the before/after delta.

**Score meaning:**

| Range | Status label |
|---|---|
| < 60 | Needs attention (priority 0) |
| 60–79 | Developing (priority 1) |
| ≥ 80 | Strong (priority 2) |

---

## 9. Backend API — All Endpoints

Both `server/server.mjs` (local) and `api/index.mjs` (Vercel) implement identical endpoints.

### Public (no auth required)

| Method | URL | Body | Response |
|---|---|---|---|
| `POST` | `/api/signup` | `{name, email, password, grade?, goal?}` | `{token, user}` |
| `POST` | `/api/login` | `{email, password}` | `{token, user}` |
| `POST` | `/api/logout` | — | `{ok: true}` |
| `GET` | `/api/me` | — | `{user}` |

### Authenticated (requires `X-Session-Token` header)

| Method | URL | Body / Params | Response |
|---|---|---|---|
| `GET` | `/api/profile` | — | `{user, mastery, attempts, overall, concepts}` |
| `POST` | `/api/profile` | `{name, grade, goal, preferred_input}` | `{user}` |
| `GET` | `/api/next-question?topic=dbms` | `topic` query param | `{concept, concept_label, type, question, hint, difficulty, focus, reason}` |
| `GET` | `/api/engine` | — | `{engine: ENGINE, mastery}` |
| `POST` | `/api/analyze` | `{topic, question, answer, confidence, concept_hint}` | Full diagnosis + `old_mastery`, `new_mastery`, `adaptive_next` |
| `GET` | `/api/history` | — | `{items: [...last 30 attempts]}` |
| `POST` | `/api/reset` | — | `{ok: true}` — deletes all attempts and mastery for user |

### Error format

All errors return `{"error": "message"}` with the appropriate HTTP status code:
- `400` — Validation error
- `401` — Authentication required or invalid credentials
- `404` — Route not found
- `409` — Email already exists
- `500` — Internal server error

---

## 10. Frontend Architecture (main.ts)

The frontend is a **zero-framework, single-file TypeScript SPA** running on Vite. There is no React, Vue, or Angular. Everything is:

1. A global **state object** `s`
2. A collection of **view functions** that return HTML strings
3. A single `render()` function that writes to `document.querySelector("#app")`
4. A `bind()` function that attaches event listeners after every render
5. `async` API call functions that mutate state and call `render()`

This is intentionally minimal — the whole UI lives in one file and is completely transparent.

### API Base URL Resolution

```ts
const API = (
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8787"
    : window.location.origin)
).replace(/\/$/, "");
```

- In local dev: points to `http://localhost:8787` (the Node server)
- On Vercel: uses the same origin (the serverless function is on the same domain)
- Override with `VITE_API_URL` in `.env` if needed

### apiFetch

```ts
const apiFetch = (url, options = {}) => {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem("learnback_session");
  if (token) headers.set("X-Session-Token", token);
  const requestUrl = url.startsWith("http") ? url : `${API}${url}`;
  return fetch(requestUrl, { ...options, headers });
};
```

All API calls go through `apiFetch` which automatically injects the session token.

---

## 11. State Management

The entire app state lives in a single `State` object `s`:

```ts
type State = {
  // Auth
  authenticated: boolean;
  authMode: "login" | "signup";
  authName: string;
  authEmail: string;
  authPassword: string;
  authError: string;

  // Navigation
  modal: View | null;       // null means no modal open
  view: View;               // current main view

  // Learning session
  topic: Topic;             // "dbms" | "java" | "python"
  q: Q | null;             // current question
  answer: string;           // text in the answer textarea
  confidence: string;       // selected confidence level
  d: D | null;             // current diagnosis result
  loading: boolean;         // true while /api/analyze is in flight
  session: SessionSignal[]; // signals collected this session
  sessionStarted: number;   // Date.now() at session start
  sessionTarget: number;    // target number of questions (3)
  demoMode: boolean;        // true when running the hackathon demo

  // User data
  mastery: Record<string, number>;
  attempts: number;
  name: string;
  grade: string;
  goal: string;
  preferred_input: string;
  history: any[];
  map: any[];

  // UI
  booting: boolean;
  toast: string;
};
```

State mutations follow this pattern everywhere:
```ts
s.someField = newValue;
render();
```

There is no batching or diffing — `render()` rebuilds the entire DOM on every state change.

---

## 12. All Views & What They Do

The `view` field (and `modal` field) control what is displayed. Views rendered inline vs in a modal sheet:

### Inline Views (inside main content area)
| View ID | Function | What it shows |
|---|---|---|
| `dashboard` | `dashboard()` | Overview, mastery orb, learning tracks, hero actions |
| `learn` | `learn()` / `diagnosis()` | Active question or diagnosis result |
| `summary` | `summary()` | Post-session report with accuracy, misconceptions, evidence |
| `progress` | `progress()` | Concept graph + mastery bars |
| `plan` | `plan()` | Adaptive study plan: repair → review → transfer |
| `intelligence` | `intelligence()` | Learning fingerprint: retention, transfer, calibration |
| `history` | `history()` | Last 30 analyzed answers |

### Modal Views (overlaid in a sheet)
All views above can also be opened as modals via `data-modal` attributes. The modal closes on Escape key, overlay click, or the × button.

### `dashboard()` — The Main Hub
- **Hero section**: CTA to start adaptive session, run demo
- **Stats bar**: learning signals, concepts tracked, understanding %, high-confidence errors
- **Knowledge map preview**: 3 weakest concepts
- **Learner insight card**: explains the current confidence pattern
- **Topic selector**: DBMS, Java OOP, Python Foundations

### `learn()` — The Question Screen
- Shows current adaptive question with its type badge and reason
- Textarea for free-text answer
- Voice input button (if browser supports Speech Recognition)
- Confidence selector: "Not sure" / "Somewhat" / "Confident" / "Very confident"
- Session progress bar (n of target)
- Demo strip: fill sample misconception answer for presentations
- Submit button disabled until answer + confidence are both set

### `diagnosis()` — The Result Screen
- Green/red banner: correct / misconception+gap detected
- Diagnosis pipeline: Answer captured → Signal diagnosed → Next move
- What LearnBack saw: concept, correctness, confidence assessment, misconception ID
- Recovery explanation + targeted next question
- Mastery delta: `old% → new%`
- **Peer reasoning section** (anonymous peer examples)

### `summary()` — Session Report
- Accuracy percentage, duration, session evidence list
- Misconception count, high-confidence error count
- Narrative insight + call to action

### `intelligence()` — Learning Intelligence
- "Learning fingerprint": Understanding, Retention, Transfer, Recovery, Confidence calibration — all as progress meters
- Misconception DNA, Confidence Calibration, Forgetting Radar, Transfer Testing, Recovery Ability, Next Best Action
- Transparency section explaining how the model is computed

### `progress()` — Knowledge Map
- Visual concept graph (CSS-positioned nodes colored by mastery)
- All concepts listed with mastery bars
- "Why the next question changes" explainer

### `classroom()` — Classroom Copilot
- Class-level aggregated stats (simulated from user data)
- AI recommendation: bottleneck concept
- Learning groups: Foundation, Misconception Recovery, Developing, Advanced
- Intervention outcome: before/after mastery comparison

### `plan()` — Personal Learning Plan
- Today's goal progress ring
- 3 adaptive plan cards: Repair → Review → Transfer
- Learning trend bar chart (recent answer signals)

### `profile()` — User Profile
- Edit name, grade, goal, preferred input
- Logout button
- Personalization explainer

### `history()` — Answer History
- Last 30 analyzed attempts
- Each entry: concept label, summary, confidence, correct/needs work, misconception ID, timestamp

### `subjects()` — Subject Catalog
- Cards for DBMS, Java OOP, Python Foundations
- Each shows chapters and a start button

---

## 13. Authentication Flow

```
SIGNUP:
  User fills name + email + password (min 6 chars)
  → POST /api/signup
  → Server validates input, checks email uniqueness
  → Hashes password with scrypt (salt: "learnback-salt-v1", 64 bytes)
  → Inserts into users table
  → Creates session token (32 random bytes as hex)
  → Inserts into sessions table
  → Returns {token, user}
  → Frontend: localStorage.setItem("learnback_session", token)
  → boot(true) loads profile data

LOGIN:
  User fills email + password
  → POST /api/login
  → Server looks up user by email
  → Hashes submitted password and compares
  → Creates new session token
  → Returns {token, user}
  → Same as signup from here

LOGOUT:
  → POST /api/logout (with X-Session-Token header)
  → Server deletes session row
  → Frontend: localStorage.removeItem("learnback_session")
  → State reset, re-render to auth screen

SESSION RESTORE (on page load):
  boot() called
  → GET /api/profile (with token from localStorage)
  → 401 → show auth screen (unauthenticated)
  → 200 → restore name, grade, goal, mastery, attempts
  → GET /api/history → restore history
  → render() with full state
```

---

## 14. Session & Confidence Model

### Session Lifecycle

```
start(topic) called:
  s.session = []             reset session signals
  s.sessionStarted = Date.now()
  s.sessionTarget = 3        default target questions
  s.demoMode = false         (or true for demo)
  GET /api/next-question → s.q

submit() called (student submits answer):
  POST /api/analyze
  → s.d = diagnosis result
  → s.session.push({ correct, confidence, misconception, concept, label })
  → s.mastery[concept] updated locally

continueSession() called (after seeing diagnosis):
  if session.length >= sessionTarget → show summary
  else → clear diagnosis, GET next question → new question screen
```

### Confidence Levels & Their Diagnostic Role

| Level | Diagnostic meaning |
|---|---|
| `"Not sure"` | `confidence_assessment: "low"` — suggests knowledge gap, not misconception |
| `"Somewhat"` | `confidence_assessment: "medium"` |
| `"Confident"` | `confidence_assessment: "medium/high"` |
| `"Very confident"` | `confidence_assessment: "high"` — wrong + high confidence = **high-confidence misconception** |

The confidence level is sent to the AI (or fallback) as part of the analysis payload and influences how the misconception is characterized. High-confidence errors are flagged throughout the UI (dashboard stats, classroom copilot, learning intelligence).

---

## 15. Peer Reasoning Feature

After a diagnosis, the `peerReasoning(concept)` function renders anonymous peer examples.

The `peerBank` object contains 3 pre-authored examples per concept:

```ts
peerBank = {
  primary_key: [
    { reasoning: "Student ID, because...", signal: "Strong reasoning", note: "..." },
    { reasoning: "Phone number, because...", signal: "Partially correct", note: "..." },
    { reasoning: "Student name, because...", signal: "Common misconception", note: "..." }
  ],
  foreign_key: [...],
  encapsulation: [...],
  lists: [...],
  normalization: [...]
}
```

Each card shows:
- An anonymous label (A1, A2, A3)
- The signal type: "Strong reasoning" (green), "Partially correct" (yellow), "Common misconception" (red)
- A "Notice the reasoning →" button that expands a hidden explanation note
- A "Revise my reasoning →" button that returns the student to the answer textarea with focus and highlight, so they can revise based on peer comparison

The peer data is entirely static (not live peer data). It serves as a pedagogical scaffold for comparison thinking.

---

## 16. Classroom Copilot View

The classroom view aggregates the current user's data into a simulated classroom picture. It is a **prototype UX**, not a real multi-student dashboard.

### Data Sources
- `s.history` — user's own answer history
- `s.mastery` — user's concept mastery
- Simulated: total student count, group sizes derived from user's own error rate

### What it shows

**AI Recommendation:**
- Identifies the concept with the lowest mastery as the "current bottleneck"
- Shows how many students (simulated) have signals needing recovery
- Suggests a "5-min intervention" action

**Learning Groups:**
- Foundation (needs core concepts)
- Misconception Recovery (targeted repair)
- Developing (guided practice)
- Advanced (challenge path)
- Group sizes are computed from the user's own data with scaling formulas

**Intervention Outcome:**
- Hard-coded before/after (61% → 79%) as a prototype demo of what "did teaching change understanding?" could look like

**Teacher Actions:**
- "Create intervention →" and "Generate activity" buttons trigger toast notifications explaining the feature intent

---

## 17. Learning Intelligence View

The `intelligence()` view computes a "learning fingerprint" — a multi-dimensional profile derived from the user's stored answers and mastery.

### Computed Metrics

All values are derived from `s.history` and `s.mastery`:

| Metric | Formula |
|---|---|
| **Understanding** | Average of all mastery scores |
| **Retention** | `max(48, min(96, understanding - misconceptions*3 + (attempts>5 ? 8 : 0)))` |
| **Transfer** | `max(42, min(95, accuracy*0.65 + understanding*0.35))` |
| **Recovery** | `max(45, min(98, 70 + recovered*7 + (accuracy-50)*0.15))` |
| **Confidence calibration** | `max(35, min(96, 100 - |confidentAccuracy - 100| * 0.7))` |

These are **prototype approximations** — not validated knowledge-tracing models. The view includes a transparency note explaining this.

### Insight cards

- **Misconception DNA** — latest misconception concept + total count
- **Confidence Calibration** — ratio of high-confidence answers that were correct
- **Forgetting Radar** — weakest concept as a proxy "forgetting risk"
- **Transfer Testing** — estimated transfer readiness percentage
- **Recovery Ability** — tracks whether misconceptions disappear post-intervention
- **Next Best Action** — recommends revisiting the weakest concept

---

## 18. Voice Input

Uses the **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`) built into modern browsers.

```ts
function speak() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;  // button hidden if not supported
  const rec = new SR();
  rec.lang = "en-IN";       // Indian English
  rec.interimResults = false;
  rec.continuous = false;
  rec.onresult = (e) => {
    s.answer = Array.from(e.results)
      .map(r => r[0].transcript)
      .join(" ");
    render();
  };
  rec.start();
}
```

The voice button is shown only if the browser supports Speech Recognition. Language is set to `en-IN` (Indian English). The transcript replaces the entire answer field.

---

## 19. Demo Mode & the 60-Second Demo Flow

Demo mode is triggered by clicking **"▶ Run 60-sec demo"** on the dashboard or via `data-demo="1"`.

```ts
async function start(topic: Topic, demo = false) {
  s.demoMode = demo;
  // ...
}
```

In demo mode:
- The question screen shows a **"DEMO STORY"** chip
- A **"Fill sample answer"** button appears, pre-loading: `"It connects two tables, like a link between records."` with confidence `"Very confident"`
- This answer is specifically designed to trigger the `PK_FK_CONFUSION` misconception in the fallback engine
- A toast confirms: *"Sample misconception loaded — analyze it to see LearnBack adapt."*

**Intended demo script:**
1. Open the app, create or use an account
2. Click "Run 60-sec demo"
3. Click "Fill sample answer" → submit
4. Show the diagnosis: PK_FK_CONFUSION detected, high-confidence misconception
5. Show mastery delta update
6. Show peer reasoning comparison
7. Continue session → adaptive question targets the misconception
8. Open Classroom Copilot to show teacher-facing view
9. Open Learning Intelligence to show the fingerprint

---

## 20. Deployment — Local vs Vercel

### Local Development

```bash
npm install
cp .env.example .env
# Edit .env: set OPENAI_API_KEY if you want AI mode
npm run dev:all
```

`npm run dev:all` uses `concurrently` to run:
- `npm run server` → `node server/server.mjs` on port 8787
- `npm run dev` → `vite` on port 5173 (default)

The Vite dev server proxies nothing; the frontend calls `http://localhost:8787` directly (CORS headers are set on the server).

### Vercel Deployment

`vercel.json`:
```json
{
  "rewrites": [{ "source": "/api/:path*", "destination": "/api/index.mjs" }],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

- `npm run build` → Vite builds `src/main.ts` into `dist/`
- `/api/*` requests are rewritten to `api/index.mjs` (serverless function)
- The serverless function uses `/tmp/learnback.db` (ephemeral — resets on cold start)
- The frontend is served as static files from `dist/`

> **Important:** On Vercel, the SQLite database lives in `/tmp` and is ephemeral. Data is lost on cold starts. For production persistence, the roadmap includes Supabase/PostgreSQL.

---

## 21. Configuration Reference

### `.env` / `.env.example`

```env
OPENAI_API_KEY=           # If empty, app runs in demo/local mode
OPENAI_MODEL=gpt-5.6-luna # Model name to use (falls back to gpt-4o in api/index.mjs)
PORT=8787                 # Backend server port
VITE_API_URL=             # Override API base URL (optional)
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,       // Type-checking only; Vite handles bundling
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### `package.json` Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Start Vite dev server (frontend only) |
| `server` | `node server/server.mjs` | Start Node backend (backend only) |
| `dev:all` | `concurrently "..."` | Run both together |
| `build` | `vite build` | Build frontend to `dist/` |
| `preview` | `vite preview` | Preview the production build locally |

---

## 22. Data Flow: End-to-End Walkthrough

Here is the complete data flow for one question-answer cycle:

```
1. BOOT
   frontend: boot()
   → GET /api/profile (X-Session-Token header)
   ← {user, mastery, attempts, concepts}
   → GET /api/history
   ← {items: [...]}
   State: s.mastery, s.attempts, s.history populated

2. START SESSION
   User clicks "Start adaptive session →" (topic: dbms)
   → frontend: start("dbms")
   → GET /api/next-question?topic=dbms
   Server: adaptiveQuestion("dbms", userId)
     → reads mastery from DB
     → reads last 6 attempts
     → selects target concept (e.g., primary_key at 45%)
     → selects question index 0: CONCEPT CHECK
   ← {concept: "primary_key", type: "CONCEPT CHECK",
       question: "What is the main purpose of a primary key...",
       hint: "Explain it in your own words.", difficulty: 1,
       reason: "Targets your lowest-mastery concept"}
   State: s.q = question, s.view = "learn"

3. STUDENT ANSWERS
   User types: "It connects two tables."
   User selects: "Very confident"
   User clicks "Analyze my answer →"
   → frontend: submit()
   → POST /api/analyze
     body: {topic: "dbms", question: "...", answer: "It connects two tables.",
            confidence: "Very confident", concept_hint: "primary_key"}

4. DIAGNOSIS (demo mode, no OpenAI key)
   Server: diagnose(body, userId) → fallback(body, userId)
   Checks: /(connect|relationship|another table|link)/.test("it connects two tables") → TRUE
   Checks: /(unique|uniquely|identify)/.test("it connects two tables") → FALSE
   → PK_FK_CONFUSION misconception detected!
   Result: {
     is_correct: false,
     concept: "primary_key",
     misconception: true,
     misconception_id: "PK_FK_CONFUSION",
     confidence_assessment: "high",   // "Very confident"
     summary: "Your answer describes a foreign-key relationship...",
     mastery_signal: -0.04
   }

5. MASTERY UPDATE
   old mastery: 45 (from DB)
   new mastery: clamp(45 + (-0.04 * 100)) = clamp(41) = 41
   → INSERT INTO attempts (...) VALUES (...)
   → UPDATE mastery SET score=41 WHERE user_id=1 AND concept='primary_key'
   → adaptiveQuestion("dbms", userId, "primary_key")
     (excludes primary_key since we just answered it)
     → targets normalization or foreign_key next

6. RESPONSE TO FRONTEND
   ← {
     is_correct: false, misconception: true, misconception_id: "PK_FK_CONFUSION",
     confidence_assessment: "high", summary: "...", explanation: "...",
     recovery: "...", next_question: "...",
     old_mastery: 45, new_mastery: 41,
     adaptive_next: {concept: "foreign_key", type: "CONCEPT CHECK", ...},
     mode: "demo"
   }

7. FRONTEND UPDATES STATE
   s.d = diagnosis result
   s.mastery["primary_key"] = 41
   s.session.push({correct: false, confidence: "Very confident",
                   misconception: true, concept: "primary_key", label: "Primary Key"})
   s.attempts++
   s.history.unshift({...})
   render() → shows diagnosis() view

8. STUDENT SEES DIAGNOSIS
   - Red banner: "MISCONCEPTION / GAP DETECTED • LOCAL ENGINE"
   - Summary: "Your answer describes a foreign-key relationship..."
   - Recovery: "A primary key uniquely identifies a row..."
   - Mastery: "45% → 41%"
   - Peer reasoning examples

9. STUDENT CONTINUES
   Clicks "Continue adaptive session →"
   → continueSession()
   → session.length (1) < sessionTarget (3): continue
   → GET /api/next-question?topic=dbms
   → This time, excludes "primary_key"
   → May target "foreign_key" to build on the misconception
   → New question shown
```

---

## 23. Misconception Taxonomy

Full list of all misconception IDs in the system:

| ID | Concept | Description |
|---|---|---|
| `PK_FK_CONFUSION` | Primary Key / Foreign Key | Describing what a foreign key does when asked about primary keys |
| `PK_NOT_UNIQUE` | Primary Key | Thinking a primary key does not need to be unique |
| `CANDIDATE_PK_CONFUSION` | Candidate Key | Confusing candidate keys with primary keys |
| `NORMALIZATION_DUPLICATION` | Normalization | Not understanding why repeated data causes update anomalies |
| `ENCAPSULATION_INHERITANCE_CONFUSION` | Encapsulation | Mixing up encapsulation with inheritance |
| `INHERITANCE_REUSE_CONFUSION` | Inheritance | Thinking inheritance is only about code reuse (not specialization) |
| `OVERRIDING_POLYMORPHISM_CONFUSION` | Polymorphism | Not understanding the connection between method overriding and polymorphism |
| `LIST_VARIABLE_CONFUSION` | Lists | Treating a list as just another variable |
| `FUNCTION_CALL_CONFUSION` | Functions | Mixing up function definition and function call |
| `CLASS_OBJECT_CONFUSION` | OOP in Python | Not distinguishing class (blueprint) from object (instance) |
| `EXCEPTION_SYNTAX_CONFUSION` | Exceptions | Syntactic confusion about try/except structure |

The AI engine can detect and name any misconception from this list. The local fallback only explicitly handles `PK_FK_CONFUSION`; all others fall through to the general heuristic.

---

## 24. Known Limitations & Roadmap

### Current Limitations

| Area | Limitation |
|---|---|
| **Storage** | SQLite is local only; Vercel deployment loses data on cold starts |
| **Auth** | No email verification, no password reset, no rate limiting, scrypt salt is static |
| **AI** | Structured output JSON schema relies on model following strict format; fallback is crude keyword matching |
| **Concepts** | Only 3 subjects, 11 concepts total — very limited coverage |
| **Classroom** | Classroom view uses one user's data to simulate a class, not real multi-user aggregation |
| **Learning model** | Mastery signal is a flat ±N score update, not a proper IRT or BKT knowledge-tracing model |
| **Voice** | Browser-only, English-centric (en-IN), no server-side transcription |
| **Peer data** | Static pre-written examples, not real anonymous peer responses |
| **Retention/Transfer** | The Learning Intelligence metrics are prototype approximations, not validated |

### Roadmap

| Feature | Description |
|---|---|
| **Supabase/PostgreSQL** | Replace SQLite with cloud DB for persistent multi-user data |
| **Android / Kotlin** | Native mobile app with Jetpack Compose |
| **Offline intelligence** | On-device model for diagnosis without internet |
| **Validated learning model** | BKT or DKT knowledge tracing with labeled student-answer datasets |
| **Broader coverage** | More subjects, more concept graphs |
| **Real peer data** | Anonymized cross-user comparison (privacy-safe aggregation) |
| **Teacher workflows** | Real multi-student classroom data aggregation and assignment tools |
| **LMS integration** | Canvas / Moodle / Google Classroom integration |

---

*Documentation generated September 2026 — covers LearnBack v13.0.0*
