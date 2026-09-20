# LearnBack AI v12.2

**LearnBack is an AI-powered adaptive learning companion that tries to understand what a student actually knows — not just whether they got a quiz question right.**

The prototype demonstrates a complete learning loop:

> **Answer → Diagnose → Adapt → Re-test → Measure improvement**



## 1. What LearnBack does

Traditional learning apps usually record marks or correct/incorrect answers. LearnBack treats every answer as a **learning signal**.

For each response, the system can track:

- Which concept the student is working on
- Whether the answer is correct
- What misconception may be present
- How confident the student felt
- Current concept-level mastery
- What question or learning activity should come next

This lets the app adapt instead of simply moving through a fixed quiz.

### Example

A DBMS student is asked:

> **What is the purpose of a primary key?**

Student answer:

> "It connects two tables."

LearnBack can interpret this as confusion between a **primary key** and a **foreign key**. If the student also says they are very confident, the system records a high-confidence misconception and can target that misunderstanding with a simpler explanation and a focused follow-up question.

---

# 2. Main features

## 🔐 Login & Sign Up

LearnBack starts with an authentication screen instead of immediately opening a shared dashboard.

Students can:

- Create an account with name, email and password
- Log in to an existing account
- Maintain their own learning profile
- Log out

For this prototype, authentication is implemented locally using the Node backend and SQLite. It is suitable for a demo, not production identity management.

---

## 🧠 Adaptive Learning Engine

The **Learn** experience is the heart of LearnBack.

Instead of presenting a fixed sequence of questions, the system uses learning signals such as:

- Previous answers
- Concept mastery
- Misconceptions
- Confidence
- Recent attempts
- Prerequisite relationships

The next question can therefore be targeted toward the student's current weakness.

### Learning loop

1. Student receives a concept question
2. Student answers in their own words
3. Student reports confidence
4. LearnBack analyzes the response
5. The concept state is updated
6. A targeted next question is selected
7. The student re-tests the concept
8. Progress appears in the student's profile

---

## 🎯 Misconception Detection

LearnBack is not only interested in whether an answer is wrong.

It tries to determine **why** the answer is wrong.

For example:

- Primary key vs foreign key confusion
- Confusing encapsulation with inheritance
- Missing understanding of a prerequisite concept
- Incorrect but partially understood explanations

The detected misconception becomes a signal that can influence the next learning step.

---

## 📊 Confidence vs Correctness

The student can indicate how confident they are in an answer.

This creates useful combinations such as:

| Answer | Confidence | Possible interpretation |
|---|---|---|
| Correct | High | Concept appears well understood |
| Correct | Low | Student may need confidence-building practice |
| Wrong | Low | Possible uncertainty or knowledge gap |
| Wrong | High | Possible high-confidence misconception |

The important idea is that **confidence is treated as a learning signal, not just a quiz decoration**.

---

## 🗺️ Personal Knowledge Map

The Knowledge Map shows learning at the **concept level** rather than only showing an overall score.

It can represent concepts such as:

### DBMS
- Primary Key
- Foreign Key
- Candidate Key
- Normalization

### Java OOP
- Encapsulation
- Inheritance
- Polymorphism

### Python
- Lists
- Functions
- Exceptions

The student's mastery values are stored separately for their account.

---

## 📚 Subject Library

The current prototype includes three learning areas:

### Database Systems
Keys, relationships, normalization and common misconceptions.

### Java OOP
Object-oriented fundamentals including encapsulation, inheritance and polymorphism.

### Python Foundations
Core Python concepts including lists, functions and exceptions.

Each subject can start an adaptive learning path.

---

## 📝 3-Question Adaptive Sessions

LearnBack can run a short learning session rather than making the student complete an endless quiz.

A session collects multiple learning signals and ends with a session summary.

The session can show:

- Questions attempted
- Correctness
- Confidence
- Misconceptions detected
- Concepts targeted
- Changes in mastery

This makes the learning loop easy to demonstrate during a hackathon presentation.

---

## 🎙️ Voice Answers

The Learn screen supports browser-based speech recognition where the browser provides the required Speech Recognition API.

A student can answer verbally instead of typing.

The current implementation uses the browser's speech recognition capability, so support depends on the browser/device. It is intentionally lightweight and does not require a paid speech API.

---

## ⚡ 60-Second Demo Mode

The dashboard includes a quick demo flow for presentations.

The demo is designed to show the core idea quickly:

**Student answer → AI diagnosis → misconception → adaptive next step**

There is also a sample misconception input so the hackathon presenter can reproduce the intended scenario without manually typing the same answer every time.

---

## 🗓️ Personal Learning Plan

LearnBack provides a lightweight learning plan based on the student's current learning state.

The idea is not to give everyone the same timetable. The plan can prioritize concepts that need attention and guide the student toward the next useful activity.

---

## 📖 Learning History

The History view records analyzed learning signals so the system can build a longer-term understanding of the student.

It can show information such as:

- Concept analyzed
- Answer correctness
- Confidence
- Misconception status
- Learning summary
- Recent learning signals

### Important navigation behavior

The **Start first session →** button inside History starts the actual adaptive Learn session and closes the History popup. It does not reopen the same History window.

---

# 3. AI Classroom Copilot

LearnBack v12.2 extends the student experience with a lightweight **AI Classroom Copilot**.

The student side answers:

> **"What should I learn next?"**

The teacher side answers:

> **"What should I do next for my students?"**

The teacher dashboard uses aggregated learning signals to surface classroom-level actions.

### Classroom overview

Teachers can see signals such as:

- Overall class understanding
- Concept bottlenecks
- Students needing additional support
- High-confidence errors
- Students who may be ready to advance

### Misconception-based groups

The system can organize students around learning needs rather than only marks, for example:

- Needs Foundation
- Misconception Recovery
- Developing
- Advanced

### AI intervention suggestions

The prototype can suggest actions such as:

- Create a short intervention
- Generate a learning activity
- Re-teach a concept
- Assign targeted practice
- Work with a small group

The teacher remains in control. **AI recommends; the teacher decides.**

### Intervention outcome

The intended loop is:

**Detect problem → Intervene → Re-check → Compare before/after understanding**

This connects LearnBack to classroom operations without turning it into a generic school administration system.

---

# 4. Popup / Modal Navigation

LearnBack uses a modern popup interaction for secondary areas of the application.

The sidebar can open:

- Overview
- Knowledge Map
- Classroom Copilot
- Subjects
- Learning Plan
- History
- My Profile

These sections appear in a modal-style window instead of constantly replacing the main learning screen.

The actual **Learn** flow remains a dedicated learning view because it contains the interactive question/session experience.

The modal can be closed with the close button or **Escape** where supported.

---

# 5. Student Profile

Each account has a personal profile containing information such as:

- Name
- Grade/year
- Learning goal
- Preferred input mode
- Learning history
- Concept mastery
- Attempts / learning signals

This allows LearnBack to move from a generic demo toward a personalized learning companion.

---

# 6. Local Database

The Node backend uses **SQLite** for the prototype.

The database stores information needed for the personalized experience, including:

- Users
- Authentication/session data
- Profiles
- Learning attempts
- Concept mastery
- Learning history
- Misconception signals

This means two different accounts can have different learning states instead of sharing one demo profile.

---

# 7. AI / Demo Mode

LearnBack is designed so the prototype can run **without a paid AI API**.

If `OPENAI_API_KEY` is not configured, the application uses its local/demo learning engine for the supported scenarios.

If an OpenAI API key is configured, the backend can use the configured model for response analysis.

> **Note:** API model names and availability depend on the API account/environment. Do not assume the example model name in `.env.example` is available for every account.

---

# 8. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | TypeScript + Vite |
| Styling | CSS |
| Backend | Node.js |
| Database | Built-in SQLite via node:sqlite |
| Authentication | Node crypto + session tokens |
| AI integration | OpenAI API optional |
| Voice input | Browser Speech Recognition API |
| Development | VS Code / local browser |

---

# 9. Project Structure

```text
LearnBack_AI_v12_2/
│
├── index.html
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
│
├── src/
│   ├── main.ts
│   └── style.css
│
└── server/
    └── server.mjs
```

### `src/main.ts`

Contains the main frontend application logic, including:

- Authentication UI
- Dashboard
- Learning sessions
- Adaptive question flow
- Knowledge map
- History
- Learning plan
- Profile
- Subject library
- Classroom Copilot
- Modal navigation
- Voice input
- Demo mode

### `src/style.css`

Contains the visual system, responsive layout, cards, buttons, modals, animations and mobile behavior.

### `server/server.mjs`

Provides the local API and database layer for:

- Sign up
- Login
- Logout
- Profile data
- Learning attempts
- Mastery
- History
- Question selection
- Answer analysis
- Reset/demo data

# 12. Optional AI Configuration

Copy `.env.example` to `.env` and configure an API key if you want to connect an available OpenAI model.

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=your_available_model
PORT=8787
```

For the hackathon demo, **you can leave the API key empty** and use the local/demo learning engine.

---

# 13. Suggested Hackathon Demo Flow

A short presentation can follow this sequence:

### 1. Sign up
Create a student account.

### 2. Start adaptive learning
Choose DBMS / Database Systems.

### 3. Give a misconception answer
Answer the primary-key question with something like:

> "It connects two tables."

### 4. Select high confidence
Choose **Very confident**.

### 5. Show the diagnosis
Explain that LearnBack can distinguish a normal wrong answer from a high-confidence misconception.

### 6. Show the next question
The system targets the suspected concept instead of simply giving another random quiz question.

### 7. Show the Knowledge Map
Demonstrate concept-level mastery and learning signals.

### 8. Show Classroom Copilot
Switch to the teacher view and demonstrate how individual learning signals can become classroom intervention suggestions.

### 9. Close with the core idea

> **LearnBack doesn't just ask whether a student is right. It learns what the student understands and decides what they should learn next.**

---

# 14. What makes the prototype different

LearnBack is intentionally focused on the **adaptive learning loop** rather than trying to become another all-purpose AI chatbot.

Its main product ideas are:

1. **Concept-level understanding** instead of only total marks
2. **Misconception detection** instead of only right/wrong grading
3. **Confidence-aware diagnosis**
4. **Adaptive follow-up questions**
5. **Personal learning history**
6. **Learning recovery through targeted re-testing**
7. **Teacher actions based on aggregated learning signals**

---

# 15. Current Prototype Limitations

This is a hackathon prototype, not a production education platform.

Current limitations include:

- Local SQLite database
- Prototype authentication rather than production identity/security infrastructure
- Limited subject/concept library
- Local/demo diagnosis for supported scenarios when no API key is configured
- Browser-dependent voice recognition
- Classroom data is prototype-level rather than a full school/LMS integration
- No production deployment configuration
- No formal clinical/educational efficacy validation

These limitations are intentional so the core adaptive-learning concept can be demonstrated clearly and quickly.

---

# 16. Future Roadmap

Possible next steps include:

- More subjects and larger concept graphs
- Better misconception taxonomies
- Formal knowledge tracing such as Bayesian Knowledge Tracing / Deep Knowledge Tracing
- Better confidence calibration analytics
- Multimodal answers using handwriting/camera input
- More advanced voice interaction
- Teacher assignment workflows
- Real classroom/LMS integrations
- Supabase/PostgreSQL for production-scale data
- Android/iQOO implementation using Kotlin and Jetpack Compose
- Offline/on-device learning intelligence where practical
- Evaluation using labeled student-answer datasets and measurable learning outcomes

---

## LearnBack

**Understand. Adapt. Improve.**

> From answering questions to understanding the learner.
