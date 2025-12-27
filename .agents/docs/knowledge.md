# Knowledge Base

> Accumulated learnings and project-specific information. Future sessions read this first.

---

## Project Overview
- **Name**: Subic.Life
- **Type**: Next.js 16.0.10 application with React 19.2.0
- **Framework**: Next.js App Router
- **Description**: Luxury travel membership platform for Subic, Philippines. Full-featured travel app with AI-powered concierge, booking system, payment methods, user profiles, and membership offers.

---

## Agent System

### Available Agents
| Agent | Model | Purpose |
|-------|-------|---------|
| Orchestrator | opus | Coordinates tasks, makes decisions |
| Worker | sonnet | Executes research, code, complex tasks |
| Documentation | haiku | Logs progress, maintains persistence |

### File Structure
```
.agents/
├── docs/
│   ├── session-log.md   # Activity history
│   ├── state.json       # Current state
│   ├── knowledge.md     # This file
│   └── errors.md        # Error database
├── logs/                # Raw agent outputs
├── context/             # Shared context files
└── README.md            # Usage instructions
```

---

## Technical Knowledge

### Commands
- Dev: `npm run dev` — Start development server on http://localhost:3000
- Build: `npm run build` — Create optimized production build
- Start: `npm start` — Run production build
- Lint: `eslint .` — Run ESLint code quality checks

### Core Dependencies
- **Framework**: Next.js 16.0.10, React 19.2.0, TypeScript
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS v4.1.9
- **State Management**: Zustand
- **AI**: Vercel AI SDK
- **Deployment**: Vercel

### Project Structure
```
/app              — Next.js App Router pages
/components       — Feature-organized React components
/lib              — Core utilities, types, context
/hooks            — Custom React hooks
/styles           — Global styles
```

---

## Gotchas & Solutions

| Problem | Solution |
|---------|----------|
| (none yet) | — |

---
