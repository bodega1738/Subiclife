# Agent Orchestration System

This directory contains the state and documentation for a multi-agent workflow system.

## Quick Start

### Starting a New Session
At the start of any conversation, tell Claude:
```
Read .agents/docs/state.json and .agents/docs/knowledge.md to restore context.
```

### Requesting Work
Simply describe what you want done:
```
Research how to implement dark mode in Next.js and update the documentation.
```

Claude will:
1. Spawn a Worker Agent (sonnet) to do the research
2. Spawn a Documentation Agent (haiku) to log the findings
3. Return a summary to you

### Checking Status
Ask:
```
What's the current state? Read .agents/docs/state.json
```

### Reviewing History
Ask:
```
Show me what we did last session. Read .agents/docs/session-log.md
```

---

## Directory Structure

```
.agents/
├── docs/
│   ├── session-log.md   # Chronological activity log
│   ├── state.json       # Machine-readable current state
│   ├── knowledge.md     # Accumulated learnings
│   └── errors.md        # Error database with solutions
├── logs/                # Raw agent output dumps (optional)
├── context/             # Shared context files for complex tasks
└── README.md            # This file
```

---

## Agents

### Orchestrator (You talk to this one)
- **Model**: opus
- **Role**: Receives your requests, delegates to other agents, synthesizes results
- **This is Claude in the main conversation**

### Worker Agent
- **Model**: sonnet
- **Role**: Executes complex tasks — research, coding, analysis
- **Spawned by**: Orchestrator via Task tool
- **Returns**: Task results and findings

### Documentation Agent
- **Model**: haiku
- **Role**: Writes to documentation files for persistence
- **Spawned by**: Orchestrator after Worker completes
- **Updates**: session-log.md, state.json, knowledge.md, errors.md

---

## Prompts Reference

### Worker Agent Prompt Template
```
You are a Worker Agent. Execute the following task and return results.

TASK: [description]

CONTEXT:
[relevant context from knowledge.md or previous work]

RULES:
1. Focus only on the task
2. Return structured findings
3. Note any errors or blockers
4. Suggest next steps if applicable
```

### Documentation Agent Prompt Template
```
You are a Documentation Agent. Update the project documentation.

WHAT HAPPENED:
[summary from Worker Agent]

UPDATE THESE FILES:
1. .agents/docs/session-log.md — Append activity entry
2. .agents/docs/state.json — Update current state
3. .agents/docs/knowledge.md — Add any new learnings
4. .agents/docs/errors.md — Log any errors encountered

RULES:
1. Be concise, no prose
2. Use exact formats from existing files
3. Include timestamp, status, outcome
```

---

## Tips

1. **Always restore context first** — Start sessions by reading state.json
2. **Let agents write to files** — That's how persistence works
3. **Review session-log.md** — It's your history
4. **Trust the errors.md** — Past solutions prevent repeated mistakes

---

## Recovery

If things go wrong:
1. Read `.agents/docs/state.json` to see current state
2. Read `.agents/docs/errors.md` to see if this error happened before
3. Ask Claude to diagnose and update documentation with the solution
