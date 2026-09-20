export type TopicKey = "dbms" | "java";

export interface Diagnosis {
  isCorrect: boolean;
  concept: string;
  conceptLabel: string;
  misconception: boolean;
  summary: string;
  explanation: string;
  recovery: string;
}

interface Question {
  type: string;
  question: string;
  hint: string;
  focus: string;
}

const questions: Record<TopicKey, Question[]> = {
  dbms: [
    {
      type: "CONCEPT CHECK",
      question: "What is the main purpose of a primary key in a database table?",
      hint: "Explain it in your own words. Don't worry about using textbook language.",
      focus: "Primary key fundamentals"
    },
    {
      type: "TARGETED RETEST",
      question: "Which column could uniquely identify every student in a Students table, and why?",
      hint: "Think about uniqueness and whether the value can repeat.",
      focus: "Unique identification"
    },
    {
      type: "TRANSFER",
      question: "Can a student's phone number always be used as a primary key? Explain one problem that could occur.",
      hint: "Think about whether the value is guaranteed to stay unique and stable.",
      focus: "Applying primary-key rules"
    },
    {
      type: "CHALLENGE",
      question: "A table has StudentID and DepartmentID. Which one is more likely to be a foreign key, and what would it reference?",
      hint: "Think about relationships between tables.",
      focus: "Primary vs foreign key"
    }
  ],
  java: [
    {
      type: "CONCEPT CHECK",
      question: "What does encapsulation mean in object-oriented programming?",
      hint: "Describe what happens to data and the code that works with it.",
      focus: "Encapsulation"
    },
    {
      type: "TARGETED RETEST",
      question: "Why might a Java class keep a field private and expose a public getter?",
      hint: "Think about controlling access to internal state.",
      focus: "Access control"
    },
    {
      type: "TRANSFER",
      question: "Give one real-world example where inheritance could reduce repeated code.",
      hint: "Start with a general type and then a more specific type.",
      focus: "Inheritance"
    },
    {
      type: "CHALLENGE",
      question: "How is method overriding related to polymorphism?",
      hint: "Think about one interface and different implementations.",
      focus: "Polymorphism"
    }
  ]
};

export function getNextQuestion(topic: TopicKey, index: number, recovered: boolean): Question {
  const list = questions[topic];
  return list[Math.min(index, list.length - 1)];
}

export function analyzeAnswer(topic: TopicKey, answer: string, confidence: string, index: number): Diagnosis {
  const a = answer.toLowerCase();

  if (topic === "dbms") {
    const confusedWithForeignKey =
      a.includes("connect") || a.includes("relationship") || a.includes("another table") ||
      a.includes("other table") || a.includes("links two") || a.includes("link two");

    const mentionsUnique =
      a.includes("unique") || a.includes("uniquely") || a.includes("identify each") ||
      a.includes("identify every") || a.includes("identifier");

    if (index === 0 && confusedWithForeignKey && !mentionsUnique) {
      return {
        isCorrect: false,
        concept: "primary_key",
        conceptLabel: "Primary Key",
        misconception: true,
        summary: "You described the role of a foreign key rather than the core job of a primary key.",
        explanation: "A primary key identifies one row uniquely inside its own table. Connecting tables is usually the role of a foreign key. This distinction matters because LearnBack wants to know whether you understand the concept, not just whether you remember a definition.",
        recovery: "Think of a Students table: StudentID can be the primary key because each student should have one unique identifier. A DepartmentID inside that table could point to another table — that is a foreign-key relationship."
      };
    }

    if (mentionsUnique || (index > 0 && (a.includes("student") || a.includes("id")))) {
      return {
        isCorrect: true,
        concept: index >= 2 ? "candidate_key" : "primary_key",
        conceptLabel: index >= 2 ? "Candidate Key" : "Primary Key",
        misconception: false,
        summary: "Your answer contains the key idea: a primary key provides unique identification.",
        explanation: "You connected the concept to uniqueness and row identification. That's stronger evidence of understanding than simply repeating a memorized phrase.",
        recovery: "Now apply the idea to a slightly harder case and explain why your chosen identifier should remain unique and stable."
      };
    }
  }

  if (topic === "java") {
    const encapsulationCorrect = a.includes("private") || a.includes("hide") || a.includes("control access") || a.includes("data") && a.includes("method");
    if (index === 0 && encapsulationCorrect) {
      return {
        isCorrect: true,
        concept: "encapsulation",
        conceptLabel: "Encapsulation",
        misconception: false,
        summary: "You identified the core idea of controlling access to an object's internal state.",
        explanation: "Encapsulation groups data with the operations that manage it and restricts direct access when appropriate. Using private fields with controlled methods is a common Java implementation.",
        recovery: "Next, explain why a getter can be safer than making a field public."
      };
    }
  }

  return {
    isCorrect: false,
    concept: topic === "dbms" ? "primary_key" : "encapsulation",
    conceptLabel: topic === "dbms" ? "Primary Key" : "Encapsulation",
    misconception: false,
    summary: "There isn't enough evidence yet to confirm the concept. LearnBack will use a targeted follow-up rather than simply marking this wrong.",
    explanation: "Your response gives partial evidence, but the system needs another signal to distinguish a knowledge gap from an unclear explanation.",
    recovery: topic === "dbms"
      ? "Remember: a primary key uniquely identifies a row in its own table. Connecting tables is a different job."
      : "Think about the difference between exposing an object's internal data directly and controlling how other code accesses it."
  };
}
