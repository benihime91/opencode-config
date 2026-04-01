# Findings & Decisions

<!--
  WHAT: Your knowledge base for the task. Stores everything you discover and decide.
  WHY: Context windows are limited. This file is your "external memory" - persistent and unlimited.
  WHEN: Update after ANY discovery, especially after 2 view/browser/search operations (2-Action Rule).
-->

## Requirements

<!--
  WHAT: What the user asked for, broken down into specific requirements.
  WHY: Keeps requirements visible so you don't forget what you're building.
  WHEN: Fill this in during Phase 1 (Requirements & Discovery).
  EXAMPLE:
    - Command-line interface
    - Add tasks
    - List all tasks
    - Delete tasks
    - Python implementation
-->

## <!-- Captured from user request -->

## Research Findings

<!--
  WHAT: Key discoveries from web searches, documentation reading, repo exploration, or runtime checks.
  WHY: Findings are more useful when you can trace where they came from, how trustworthy they are, and what decisions they affect.
       Multimodal content (images, browser results) doesn't persist. Write it down immediately.
  WHEN: After EVERY 2 view/browser/search operations, update this section (2-Action Rule).
  EXAMPLE:
    - Finding: Python's argparse module supports subcommands for clean CLI design
      Source: Python docs
      Confidence: High
      Relevance: Shapes the CLI interface choice
      Decision impact: Supports using subcommands instead of positional-only parsing
 -->

## <!-- Key discoveries during exploration. For high-signal findings, note source, confidence, relevance, and decision impact in whatever light format fits the task. -->

## Technical Decisions

<!--
  WHAT: Architecture and implementation choices you've made, with reasoning.
  WHY: You'll forget why you chose a technology or approach. Include which findings mattered so the decision is easy to audit later.
  WHEN: Update whenever you make a significant technical choice.
  EXAMPLE:
    | Use JSON for storage | Simple, human-readable, built-in Python support | Python docs, local prototype | High |
    | argparse with subcommands | Clean CLI: python todo.py add "task" | Python docs | High |
 -->
<!-- Decisions made with rationale -->

| Decision | Rationale | Supporting evidence | Confidence |
| -------- | --------- | ------------------- | ---------- |
|          |           |                     |            |

## Issues Encountered

<!--
  WHAT: Problems you ran into and how you solved them.
  WHY: Similar to errors in task_plan.md, but focused on broader issues (not just code errors).
  WHEN: Document when you encounter blockers or unexpected challenges.
  EXAMPLE:
    | Empty file causes JSONDecodeError | Added explicit empty file check before json.load() |
-->
<!-- Errors and how they were resolved -->

| Issue | Resolution |
| ----- | ---------- |
|       |            |

## Resources

<!--
  WHAT: URLs, file paths, API references, documentation links you've found useful.
  WHY: Easy reference for later. Don't lose important links in context. Prefer resources that help a later reader verify or reuse a decision.
  WHEN: Add as you discover useful resources.
  EXAMPLE:
    - Python argparse docs: https://docs.python.org/3/library/argparse.html
    - Project structure: src/main.py, src/utils.py
 -->

## <!-- URLs, file paths, API references -->

## Decision-Relevant Findings

<!--
  WHAT: Optional short list for the highest-value findings that directly change scope, design, prioritization, or risk.
  WHY: Not every note matters equally. This helps future readers quickly separate interesting facts from decision-shaping evidence.
  WHEN: Use when a finding materially affects what you build, what you defer, or how confident you should be.
  EXAMPLE:
    - Source: README.md + install.sh
      Finding: Installer already provisions mcporter but misses one runtime symlink
      Confidence: High
      Relevance: Affects bootstrap design only
      Decision impact: Update installer manifest rather than redesign bootstrap flow
-->

## <!-- Highest-value evidence and why it mattered -->

## Visual/Browser Findings

<!--
  WHAT: Information you learned from viewing images, PDFs, or browser results.
  WHY: CRITICAL - Visual/multimodal content doesn't persist in context. Must be captured as text.
  WHEN: IMMEDIATELY after viewing images or browser results. Don't wait! Include source/context, confidence, relevance, and decision impact when they matter.
  EXAMPLE:
    - Screenshot shows login form has email and password fields
    - Browser shows API returns JSON with "status" and "data" keys
 -->
<!-- CRITICAL: Update after every 2 view/browser operations -->

## <!-- Multimodal content must be captured as text immediately -->

---

<!--
  REMINDER: The 2-Action Rule
  After every 2 view/browser/search operations, you MUST update this file.
  This prevents visual information from being lost when context resets.
-->

_Update this file after every 2 view/browser/search operations_
_This prevents visual information from being lost_
