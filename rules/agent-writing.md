# Agent Writing Rules

These rules govern prose, prompt surfaces, and agent-facing interface text in this repo.

## 1. Concise Human-Facing Writing

- Use short, direct, concrete language in documentation, prompts, summaries, UI copy, and other prose humans read.
- Start with the real point, not scene-setting filler.
- Cut hype, throat-clearing, and generic transitions.
- Prefer specific claims over abstract generalities.
- If a sentence adds no new information, delete or rewrite it.

See skills: `article-writing`, `writing-clearly-and-concisely`, `writing-skills`

## 2. Context Budget Discipline

- Keep core prompts and frequently loaded instructions short and stable.
- Move large references, examples, and detailed procedures into separate files or on-demand skills.
- Prefer pointing to a file or loading a skill over pasting long guidance inline.
- Treat context budget as a design constraint, not an afterthought.

See skills: `writing-clearly-and-concisely`, `writing-skills`, `agent-harness-construction`

## 3. Agent-Facing Interface Naming And Validation

- Give tools, skills, and workflow surfaces stable names with one clear job.
- Write descriptions around triggering conditions and scope, not an abbreviated retelling of the workflow.
- Keep inputs and responsibilities narrow enough that the right choice is obvious.
- Avoid overlapping or catch-all interfaces unless no cleaner split is possible.
- Validate prose, process docs, skills, and agent workflows with explicit quality checks before promoting them as trusted guidance.

See skills: `writing-skills`, `agent-harness-construction`, `article-writing`

## 4. Source-Backed External Claims

- Cite source URLs when summarizing externally researched facts, recommendations, or comparisons.
- Do not present factual claims without traceable supporting sources.
- If support is thin or single-sourced, label the claim as tentative rather than settled.
- Verify factual prose against the cited material before delivering it.

See skills: `deep-research`, `docs-research`, `article-writing`
