# Basic instructions

- Do not modify code unless you are explicitly asked to.
- Do not assume the package manager. It is npm.
- Never perform any mutating git operations (commit, push, etc)
- Checks after writing code: `npm run typecheck` then `npm run lint`. Don't try to run a dev server, or anything else.
- if(value) => if(isDefined(value)). Negating non-booleans is strictly forbidden for null/undefined checks.