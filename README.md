# CS Interview Drill Trainer

A JavaScript-first study companion for practicing CS interview fundamentals. The app is built around short, repeatable drills that help a developer move from "I recognize this" to "I can produce and explain this under pressure."

The current version focuses on curated practice instead of AI-generated questions. It includes runnable coding drills, multiple choice questions, code-reading explanations, trace-table exercises, and blank-file drills.

## What It Does

- Presents random or filtered interview drills by topic and drill type.
- Runs JavaScript answers locally in the browser against deterministic test cases.
- Uses a CodeMirror editor wrapper for coding practice, with line numbers and syntax highlighting.
- Shows progressive hints before revealing the answer.
- Shows explanations and reference solutions when a learner gives up.
- Stores progress locally in the browser, including completed drills, attempts, streak, and accuracy.

The goal is not just to check answers. The trainer should teach why a pattern matters, where the trick is, and what reusable idea the learner should carry forward.

## Study Topics

The curated drill bank currently covers:

- Arrays
- Objects
- Strings
- Sets & Maps
- Recursion Basics
- Big-O
- Async JS
- Mixed Interview

Example drills include filtering arrays, frequency maps, two-sum, duplicate detection, recursion basics, async ordering, binary-number bit positions, and translating code into plain English.

## How It Works

The homepage renders the full trainer UI from `src/features/drills/DrillTrainer.tsx`.

Core pieces:

- `src/features/drills/drill-bank.ts` contains the curated question bank.
- `src/features/drills/types.ts` defines the discriminated drill types.
- `src/features/drills/code-runner.ts` runs submitted JavaScript in a browser Worker.
- `src/features/drills/progress.ts` stores local progress under `cstrainer.progress.v1`.
- `src/features/drills/CodeEditor.tsx` wraps CodeMirror so the editor can be swapped later.

Postgres and Drizzle are scaffolded in the project, but the trainer does not use the database yet. V1 progress is browser-local only. The database layer is available for future account sync, shared question banks, or server-side study history.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:3000
```

To make the app available to other devices on the same LAN:

```bash
npm run dev:lan
```

That binds Vite to all network interfaces on port `3017`. From another device on the same network, open:

```text
http://<your-computer-lan-ip>:3017
```

For example, if your machine is `192.168.1.42`, use:

```text
http://192.168.1.42:3017
```

## Testing And Checks

Run the test suite:

```bash
npm run test
```

Run Biome checks:

```bash
npm run check
```

Format files:

```bash
npm run format
```

Build for production:

```bash
npm run build
```

Note: the Cloudflare/Wrangler build may print a sandbox-related log-file warning in restricted local environments. If the command exits 0 and both client and server bundles are produced, the build completed.

## Tech Stack

- React 19
- TanStack Start and TanStack Router
- TanStack Query
- Tailwind CSS
- CodeMirror 6
- Vitest and Testing Library
- Biome
- Drizzle ORM and PostgreSQL scaffold
- Cloudflare deployment scaffold

## Adding Drills

Add new curated drills in `src/features/drills/drill-bank.ts`.

Each drill includes:

- `id`
- `title`
- `topic`
- `level`
- `type`
- `concept`
- `prompt`
- `hints`
- `explanation`

Runnable code drills also include:

- `signature`
- `starter`
- `tests`
- `referenceSolution`

Keep explanations teaching-oriented. A good explanation should say what the pattern is, why the exercise matters, and any language-specific trick the learner is expected to discover.

## Future Direction

Likely next steps:

- Lazy-load CodeMirror so non-code drills do not pay the editor bundle cost.
- Add accounts and sync progress through Postgres.
- Add richer spaced repetition and daily study plans.
- Add more curated language tracks.
- Build the later codebase-learning companion: paste code or link a PR, then explain code structure and concepts on hover.
