# Basic instructions

- Do not modify code unless you are explicitly asked to.
- Do not assume the package manager. It is npm.
- Never perform any mutating git operations (commit, push, etc)
- Checks after writing code: `npm run typecheck` then `npm run lint`. Don't try to run a dev server, or anything else.
- if(value) => if(isDefined(value)). Negating non-booleans is strictly forbidden for null/undefined checks.
- Until the user explicitly asks you to, it's strictly forbidden to modify any files. Under no circumstances start writing code while the user is still asking questions about a design solution, or you don't have an explicit "go" instruction at the end of a message from the user. Coding is only permitted when the user explicitly exclaims something like "do it", or when the user choses the "Implement plan" option after a presenting a plan.
