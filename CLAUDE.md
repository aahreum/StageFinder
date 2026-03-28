# Stage Finder

## Tech Stack

- Next.js (app router)
- TypeScript
- Tailwind CSS
- Supabase
- KOPIS API
- Resend

---

## Workflow

You MUST follow todo.md.

1. Read todo.md
2. Select ONE task
3. Explain briefly why you chose it
4. Implement minimal code
5. Update todo.md

---

## Rules

- Be concise
- Do not explain obvious code
- Do not repeat context
- Only output necessary code
- Use TypeScript
- Follow existing structure
- Write comments in Korean
- If unsure, ask

---

## Dev Principles

- Keep it simple
- Avoid over-engineering
- Reuse existing logic
- Minimize API calls

---

## Architecture (FSD)

- app/: routing only
- shared/: common code
- entities/: domain models
- features/: user actions
- widgets/: UI composition

Do NOT put business logic in app/

---

## Validation (Harness)

Before implementing:

- Check expected behavior

After implementing:

- Verify result
- Consider edge cases

If none:

- Suggest simple test cases

---

## Git (MANDATORY)

Before starting:

- create issue (gh issue create)

After completing:

- branch: feature/{task}
- commit: feat: {task}
- push
- create PR (gh pr create)
- link PR to issue

---

## Sub Agents

Use when needed:

- code-reviewer: PR review
- test-writer: tests

After PR:

- Use code-reviewer to review
