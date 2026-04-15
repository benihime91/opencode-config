---
name: agentation
description: Add Agentation visual feedback toolbar to a Next.js project
---

# Agentation Setup

Set up the Agentation annotation toolbar in this project.

## Steps

1. **Check if already installed**
   - Look for `agentation` in package.json dependencies
   - If not found, run `npm install agentation` (or pnpm/yarn based on lockfile)

2. **Check if already configured**
   - Search for `<Agentation` or `import { Agentation }` in src/ or app/
   - If found, report that Agentation is already set up and exit

3. **Detect framework**
   - Next.js App Router: has `app/layout.tsx` or `app/layout.js`
   - Next.js Pages Router: has `pages/_app.tsx` or `pages/_app.js`

4. **Add the component**

   For Next.js App Router, add to the root layout:
   ```tsx
   import { Agentation } from "agentation";

   // Add inside the body, after children:
   {process.env.NODE_ENV === "development" && <Agentation />}
   ```

   For Next.js Pages Router, add to _app:
   ```tsx
   import { Agentation } from "agentation";

   // Add after Component:
   {process.env.NODE_ENV === "development" && <Agentation />}
   ```

5. **Confirm component setup**
   - Tell the user the Agentation toolbar component is configured

6. **Recommend the runtime skills**
   - Explain that installation is separate from runtime usage.
   - For annotation lifecycle work, tell the user to load `annotation-sync`.
   - For autonomous visual critique, tell the user to load `agentation-self-driving`.
   - Explain that this repo uses a CLI + skills workflow rather than exposing MCP setup as the normal user-facing path.

## Notes

- The `NODE_ENV` check ensures Agentation only loads in development
- Agentation requires React 18
- The Agentation MCP server is configured in `opencode.json` and tools are available directly.
- Run `agentation-mcp doctor` to verify the underlying server after installing
