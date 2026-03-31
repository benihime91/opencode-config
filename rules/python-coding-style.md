# Python Coding Style — General-Purpose Policy

This rule applies to **all Python code**, not just scientific or notebook-heavy projects.

The goal is simple:

- write Python that is easy to read in one pass
- keep modules small and purpose-driven
- make types explicit and enforced
- prefer clarity, composability, and mechanical sympathy over cleverness

This is a practical style guide for application code, libraries, automation, services, tooling, and research code.

---

## Core Principles

1. **Clarity over cleverness**  
   Code should be understandable without decoding tricks or hidden context.

2. **Brevity with readability**  
   Shorter code is good only when it remains obvious.

3. **One screen, one idea**  
   A reader should be able to understand the main purpose of a function or module without excessive scrolling.

4. **Explicit types, explicit boundaries**  
   Public interfaces should be typed, validated, and easy to reason about.

5. **Small composable units**  
   Prefer focused functions and modules over large multifunction files.

6. **Runtime safety matters**  
   Type hints alone are not enough when the project standard requires enforcement.

---

## 1) Typing Rules

Typing is mandatory for Python code.

- Fully annotate public functions, methods, and class attributes where practical
- Add return types explicitly
- Prefer precise types over broad ones
- Avoid `Any` unless there is a strong reason
- Prefer structured types over untyped dictionaries when the shape matters

### `beartype` Requirement

Runtime type enforcement is required.

- Use `beartype` on public functions
- Use `beartype` on public methods and constructors
- Preserve `beartype` when modifying existing typed code
- Do not treat static annotations alone as sufficient

### Preferred Patterns

- Use `TypedDict`, dataclasses, or schema models when data has structure
- Use enums for constrained choices
- Use protocols or ABCs when behavior matters more than inheritance

### Avoid

- untyped public APIs
- loosely shaped `dict[str, Any]` passed everywhere
- ambiguous `Optional` usage without clear `None` semantics
- hidden type coercion inside core logic

---

## 2) Module and File Design

Each file should have one clear purpose.

- A reader should be able to describe the file in one short phrase
- If a file mixes unrelated responsibilities, split it
- Separate pure logic from I/O and side effects
- Separate schema/type definitions from orchestration when that improves clarity

### Package Rules

- Keep `__init__.py` files empty
- Do not use `__init__.py` as an export hub
- Do not place constants, helpers, configuration, or business logic in `__init__.py`

### File Naming

Name files after what they do.

Prefer:

- `retry.py`
- `date_formatter.py`
- `model_registry.py`
- `session_store.py`

Avoid catch-all names such as:

- `utils.py`
- `helpers.py`
- `common.py`
- `service.py`

If you are about to create a catch-all file, stop and split by responsibility instead.

---

## 3) Function Design

Functions should do one thing well.

- Keep functions focused
- Keep argument lists intentional
- Prefer dependency injection over hidden global state
- Prefer pure functions when side effects are unnecessary
- Return predictable shapes

### Good Signals

- name matches one behavior
- input and output types are obvious
- function can be explained in one sentence

### Refactor Signals

- function mixes validation, I/O, transformation, and logging
- function mutates too much shared state
- function has many boolean flags
- function requires heavy comments to explain control flow
- function body is long enough that the reader loses the narrative

---

## 4) Class Design

Classes should represent stable concepts, not just containers for unrelated methods.

- Use a class when state and behavior belong together
- Keep instance state intentional and minimal
- Prefer composition over deep inheritance
- Avoid god objects
- Keep constructors simple

Use dataclasses for structured data containers when appropriate.

Avoid classes that are only namespaces for unrelated static methods.

---

## 5) Naming

Follow standard Python naming conventions.

- `PascalCase` for classes
- `snake_case` for functions, methods, variables, and modules
- `UPPER_SNAKE_CASE` for true constants

### Naming Guidelines

- prefer short, clear names over long ceremonial names
- use domain terms when they are standard and well understood
- abbreviate only when the abbreviation is common in the domain
- prefer `user_id` over `identifier_for_the_user`
- prefer `payload` over `obj2`

### Avoid

- vague names like `data`, `thing`, `misc`, `handle_stuff`
- single-letter names outside tight local scopes
- misleading names that hide side effects

Short names are acceptable for short-lived local variables when the role is obvious, such as:

- `i` for a loop index
- `k`, `v` for dictionary iteration
- `x`, `y` in mathematical or vectorized code

### Abbreviation Guide

Use abbreviations deliberately, not lazily.

The rule is:

- the more common the concept, the shorter the acceptable name
- the shorter the variable lifetime, the shorter the acceptable name
- the longer-lived the symbol, the less abbreviated it should be

This means:

- **aggressive abbreviations** are acceptable in comprehensions, lambdas, and very local helper logic
- **common abbreviations** are acceptable for arguments, locals, and well-known domain terms
- **light or no abbreviations** should be used for modules, classes, public functions, and long-lived symbols

### Good abbreviation patterns

These are generally acceptable when they match the surrounding domain and remain obvious:

| Concept                       | Preferred abbreviation |
| ----------------------------- | ---------------------- |
| function                      | `fn`                   |
| config                        | `cfg`                  |
| source                        | `src`                  |
| destination                   | `dst`                  |
| directory                     | `dir`                  |
| filename                      | `fname`                |
| index                         | `idx`                  |
| identifier                    | `id`                   |
| count                         | `cnt`                  |
| number of items               | `n_...`                |
| convert to                    | `to_...`               |
| key/value                     | `k`, `v`               |
| object in a tight local scope | `o`                    |
| sequence                      | `seq`                  |
| string in a tight local scope | `s`                    |
| dataframe                     | `df`                   |
| dataset                       | `ds`                   |
| dataloader                    | `dl`                   |
| batch size                    | `bs`                   |
| prediction                    | `pred`                 |
| output                        | `out`                  |
| image                         | `img`                  |

### Examples

- Prefer `user_id` over `identifier_for_the_user`
- Prefer `cfg` over `configuration_object` when the concept is already obvious
- Prefer `src_path` and `dst_path` over `source_path` and `destination_path` when these names are common in the codebase
- Prefer `idx` over `index_value` in local logic

### Avoid abbreviation abuse

- Do not abbreviate public names so heavily that readers need a glossary to understand them
- Do not invent project-specific abbreviations without repetition and clear value
- Do not shorten long-lived symbols just to save keystrokes
- Do not use cryptic names like `xm`, `dtz`, or `prc2` unless they are established domain language

---

## 6) Layout and Formatting

Format for readability, not density contests.

- Keep lines readable without horizontal scrolling
- Group related statements together
- Keep related assignments visually easy to scan

### Layout Guide

- Code should generally fit within a standard small modern screen without horizontal scrolling; as a practical ceiling, aim for roughly **180 characters or fewer** per line
- One line of code should implement one complete idea, where possible
- A short `if` with a single obvious action may stay on one line
- A simple ternary like `x = y if cond else z` is fine when it improves readability
- A truly simple one-line function may stay on one line when it is immediately obvious
- A short group of similar one-line helper functions may be kept together without blank lines between them

Example:

```python
def det_lighting(brightness, contrast): return lambda image: lighting(image, brightness, contrast)
def det_rotate(degrees): return lambda image: rotate_cv(image, degrees)
def det_zoom(zoom): return lambda image: zoom_cv(image, zoom)
```

- Align conceptually similar statement parts when the alignment materially improves scanability
- Group class member initialization together when it genuinely improves readability
- Use spacing around operators to reflect the notation of the domain
- Avoid trailing whitespace

Example:

```python
if self.store.stretch_dir == 0: image = stretch_cv(image, self.store.stretch, 0)
else:                           image = stretch_cv(image, 0, self.store.stretch)
```

Example:

```python
self.size,self.denorm,self.norm,self.target_size = size,denorm,normalizer,target_size
```

### General Guidance

- One line should usually express one idea
- Use multi-line layouts when they improve readability
- Use compact one-line expressions only when they remain obvious
- Avoid visual noise

### Practical Defaults

- Prefer readable wrapping over overly long lines
- Prefer one import per line in most code, but allow compact grouped imports when they are genuinely clearer and remain easy to scan
- Avoid alignment games that are fragile during edits unless the alignment clearly improves local readability
- Keep blank lines purposeful
- Use less vertical space when the compact form is still easy to read

Import example where compactness may be acceptable:

```python
import collections, math, os, threading
```

---

## 7) Imports

Imports should be explicit and boring.

- Group imports by standard library, third-party, then local
- Keep imports deterministic and easy to scan
- Import modules or named symbols intentionally
- Remove unused imports

### Avoid

- wildcard imports
- import-time side effects
- deeply hidden local imports unless needed to break cycles or reduce heavy startup cost

If a local import is required inside a function, the reason should be clear.

---

## 8) Data and State

Be deliberate with mutability.

- Prefer immutable data flow where practical
- Keep state transitions explicit
- Avoid passing partially valid objects around
- Normalize data at boundaries
- Validate early when inputs come from the outside world

Prefer structured models over ad hoc nested dictionaries for business-critical flows.

---

## 9) Error Handling

Errors should be explicit, intentional, and useful.

- Raise specific exceptions
- Catch exceptions at the right boundary
- Preserve useful context in error messages
- Fail fast on invalid states

### Avoid

- bare `except:`
- swallowing exceptions silently
- defensive code that hides real failures
- returning inconsistent error shapes

If recovery is possible, make that recovery obvious in code.

---

## 10) Comments and Docstrings

Code should mostly explain itself through naming and structure.

- Use comments to explain **why**, not **what**
- Add docstrings where they improve API usability
- Keep docstrings factual and compact
- Update comments when behavior changes

### Good Uses

- explaining a non-obvious constraint
- linking an external spec or protocol
- documenting a performance tradeoff
- clarifying why an unusual implementation exists

### Avoid

- comments that restate the code
- stale comments
- essay-length commentary inside implementation files

---

## 11) Control Flow

Control flow should read top-to-bottom without surprises.

- Prefer guard clauses over deep nesting
- Prefer straightforward branching over dense clever expressions
- Keep loops simple
- Extract complex branches into named helpers

### Prefer

- early returns
- clear match/case or if/elif chains
- explicit state transitions

### Avoid

- deeply nested conditionals
- hidden side effects inside comprehensions
- dense chained expressions that obscure intent

---

## 12) Comprehensions and Expressions

Python supports concise expression-oriented code, but readability is the limit.

- Use comprehensions when they are clearer than loops
- Use generator expressions for streaming where appropriate
- Use ternaries only for simple cases

### Avoid

- nested comprehensions that require mental unpacking
- side effects inside comprehensions
- lambda-heavy code when `def` would be clearer

If a comprehension needs line-by-line explanation, rewrite it.

---

## 13) Performance and Scaling

Write clear code first, then optimize where it matters.

- Measure before optimizing
- Use the right data structures
- Avoid unnecessary copies
- Be mindful of algorithmic complexity
- Stream large inputs when possible

Performance-sensitive code should still remain readable.

Avoid micro-optimizations that make ordinary code harder to maintain.

---

## 14) Project-Wide Consistency

Local consistency beats personal preference.

- Match surrounding conventions unless they are clearly harmful
- Prefer one obvious pattern per codebase for the same kind of problem
- When introducing a new pattern, keep it deliberate and repeatable

Do not reformat or restyle unrelated code while making targeted changes.

---

## 15) Practical Do / Don't Summary

### Do

- annotate public APIs
- enforce runtime types with `beartype`
- keep `__init__.py` empty
- split code by responsibility
- choose purpose-driven file names
- keep control flow shallow
- validate external inputs at boundaries
- use comments sparingly and intentionally

### Don't

- create `utils.py` dumping grounds
- rely on wildcard imports
- hide important behavior in side effects
- write untyped public APIs
- put exports or logic in `__init__.py`
- use clever compactness that hurts readability
- swallow exceptions without purpose

---

## 16) Default Decision Rule

When two implementations are both valid, prefer the one that is:

1. easier to read aloud
2. easier to type-check and enforce with `beartype`
3. easier to split into focused modules
4. easier to modify safely later

If the code feels convenient now but harder to understand in three months, it is the wrong choice.
