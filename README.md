# LearnBack

LearnBack is a prototype adaptive learning app that tries to understand what a learner knows, not just whether an answer is right or wrong.

The app combines:

- concept-level mastery tracking
- misconception detection
- confidence-aware diagnosis
- adaptive follow-up questions
- subject-based learning paths
- a local demo mode that works without paid AI APIs

The core loop is:

Answer → Diagnose → Adapt → Re-test → Measure progress

## Why this project exists

Most education tools treat quiz results as a binary outcome: correct or incorrect. LearnBack instead treats every response as a learning signal.

For each answer, the app can estimate:

- the concept being tested
- whether the answer is correct
- whether the student has a misconception
- how confident the student feels
- what concept should be revisited next

This makes the learning flow more personalized than a fixed multiple-choice quiz.

## Demo example

A user is asked:

> What is the purpose of a primary key?

The student responds:

> It connects two tables.

LearnBack can interpret this as a likely foreign-key / primary-key confusion. If the student is also highly confident, the app can flag a high-confidence misconception and select a targeted follow-up question instead of giving a random new question.

## Features

### User authentication

The app includes a local sign-up and login flow.

Users can:

- create an account
- log in with email and password
- keep separate learning history and mastery data
- log out

This is a prototype implementation and is not meant to replace a production identity system.

### Adaptive learning sessions

The Learn view gives a question chosen from the learner's current concept state, not a static quiz.

It uses:

- current concept mastery
- recent misconceptions
- confidence level
- prerequisite relationships

The next question is chosen to repair misunderstanding or reinforce a weak concept.

### Misconception detection

The app aims to detect why a response is wrong, not just that it is wrong.

Examples include:

- primary key vs foreign key confusion
- encapsulation vs inheritance confusion
- function misuse
- concept misunderstanding from low confidence or high confidence

This helps the system choose more accurate next steps.

### Knowledge map and mastery tracking

LearnBack tracks mastery at the concept level rather than using only a total score.

Topics included in the prototype:

- Database Systems
  - Primary Key
  - Foreign Key
  - Candidate Key
  - Normalization
- Java OOP
  - Encapsulation
  - Inheritance
  - Polymorphism
- Python
  - Lists
  - Functions
  - OOP in Python
  - Exceptions

### Personal learning history and profile

Each user has:

- profile details
- concept mastery estimates
- a learning plan
- recent answer history
- session summaries

### Classroom copilot (prototype)

The app includes a classroom-oriented view that aggregates learner signals into teacher-facing summaries such as:

- concept bottlenecks
- students needing support
- high-confidence misconceptions
- intervention suggestions

This is a lightweight prototype for classroom insight, not a full LMS.

### Voice input

The app supports browser-based speech recognition when available in the browser.

### Demo mode

The project includes a 60-second demo flow intended for a presentation or hackathon.

This makes it possible to show the app without requiring a full external AI setup.

## Tech stack

- Frontend: TypeScript + Vite
- Styling: CSS
- Backend: Node.js
- Database: SQLite via node:sqlite
- Authentication: session tokens + password hashing
- AI integration: OpenAI API (optional)
- Voice input: browser Speech Recognition API

## Project structure

```text
LearnBack/
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── vercel.json
├── learnback.db
├── src/
│   ├── main.ts
│   └── style.css
├── server/
│   └── server.mjs
└── dist/
```

### `src/main.ts`

Contains the frontend app logic, including:

- auth flow
- dashboard
- learn session screen
- knowledge map
- subject navigation
- profile and history views
- classroom copilot UI
- adaptive question logic
- demo behavior

### `src/style.css`

Contains the app styling, cards, modal layout, charts, session UI, and responsive behavior.

### `server/server.mjs`

Contains the local backend API that provides:

- sign up / login / logout
- session management
- profile updates
- learning attempts storage
- concept mastery updates
- adaptive question selection
- answer analysis
- demo fallback logic

## Prerequisites

- Node.js 18+
- npm

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Environment configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Then set your values if needed.

Example:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=your_available_model
PORT=8787
```

If `OPENAI_API_KEY` is not set, the app falls back to demo/local diagnosis behavior.

## Running the app

Start both the backend and frontend together:

```bash
npm run dev:all
```

This runs:

- the Vite frontend on the default Vite port
- the Node backend on port 8787

You can also run them separately:

```bash
npm run server
npm run dev
```

## Demo flow

A typical quick demo is:

1. Sign up for an account
2. Choose a subject such as Database Systems
3. Answer a concept question in natural language
4. Select a confidence level
5. View the diagnosis and adaptive next step
6. See the knowledge map update
7. Open the classroom view to show aggregated insight

## AI mode vs demo mode

The app supports two modes:

- Demo mode: uses the built-in local engine when no OpenAI API key is configured
- AI mode: uses the configured OpenAI model for diagnosis when an API key is available

The local engine includes a concept taxonomy and misconception heuristics for the supported demo subjects.

## Limitations

This is a prototype and not a production learning platform.

Current limitations include:

- local SQLite storage only
- prototype authentication rather than enterprise-grade identity/security
- limited subject and concept coverage
- browser-dependent voice input
- demo-level classroom analytics
- no real production deployment configuration
- no formal education validation or experimentation

## Roadmap ideas

Possible future work includes:

- broader subject coverage
- deeper knowledge tracing models
- more robust misconception taxonomies
- improved confidence calibration
- multimodal learning input
- teacher assignment workflows
- LMS and classroom integration


## License

This project does not currently declare a license in the repository. Check with the project owner before reuse or redistribution.

## Summary

LearnBack is a focused prototype for adaptive learning. It demonstrates a practical idea: instead of treating a wrong answer as a simple fail, the system tries to infer what the learner may actually understand and uses that insight to decide what to teach next.
now- Supabase/PostgreSQL for production-scale data
- Android/iQOO implementation using Kotlin and Jetpack Compose
- Offline/on-device learning intelligence where practical
- Evaluation using labeled student-answer datasets and measurable learning outcomes

---

## LearnBack

**Understand. Adapt. Improve.**

> From answering questions to understanding the learner.
