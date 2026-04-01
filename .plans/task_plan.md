# Task Plan: Spa Day — Rules & Skills Consolidation + Zeus Loop Fix

## Goal

Consolidate rules, remove contradictions, fix the Zeus planning-loop bug, and run a full rules-distill pass.

## Current Phase

All phases complete

## Phases

### Phase 1: Fix Zeus planning loop
- [x] Remove planning persistence mandates from `agents/zeus.md` and `agents/hermes.md`
- [x] Make plugin hook smarter: skip reminders after planning-file writes, only for write/edit + task tools
- [x] Remove triple mandate from `messages.ts` and `constants.ts`
- [x] Add PreToolUse tool matcher (Write|Edit|Bash|Read|Glob|Grep) matching original skill
- [x] Use 50-line plan head for system prompt (UserPromptSubmit), 30-line for PreToolUse
- **Status:** complete

### Phase 2: Deduplicate rules
- [x] Remove beartype (Rule 5) and Python module overlap from `modular-code-enforcement.md`
- [x] Ensure `python-coding-style.md` is the single authority for Python-specific enforcement
- **Status:** complete

### Phase 3: Rules distill
- [x] Run Phase 1 inventory (scan skills + scan rules): 24 skills, 5 rules files
- [x] Run Phase 2 cross-read analysis (3 parallel batches, 9 candidates extracted)
- [x] Run Phase 3 user review (all 9 approved) and apply to rules files
- **Status:** complete
