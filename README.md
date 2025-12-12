## Prompt Library

A centralized, versioned collection of reusable prompts for AI-assisted software development.

This repository is designed to act as a **single source of truth** for prompts used across multiple projects and repositories, with a primary focus on **JS/TS environments** and **Playwright-based test automation**, but without hard coupling to any specific tooling.

---

## Goals

- Provide **reusable, composable prompts** (personas, rules, workflows)
    
- Enable **consistent AI behavior** across projects
    
- Keep prompts **tool-agnostic and IDE-friendly** (plain files)
    
- Allow easy reuse via Git, raw imports, or packaging later
    

---

## Repository Structure

```
prompts/
├── meta/        # Personas, global rules, style guides
├── utilities/   # Small, focused helpers (e.g. comment analysis, structure validation)
└── workflows/   # Task-oriented prompts (e.g. test generation, reviews)

```

### Prompt Types

- **Meta prompts**  
    Define _who_ the agent is and _how_ it should behave.
    
- **Workflow prompts**  
    Describe _what_ the agent should do step-by-step.
    
- **Utility prompts**  
    Narrow, reusable instructions for specific transformations or checks.
    
    
---

## How to Use

### 1. Consume from another repository (Git subtree)

Add this repository as a subtree so prompts exist as real files in your project:

`git subtree add --prefix=prompts \   git@github.com:<your-org-or-user>/prompt-library.git main --squash`

To update later:

`git subtree pull --prefix=prompts \   git@github.com:<your-org-or-user>/prompt-library.git main --squash`


---

### 2. Raw GitHub import (no Git integration)

You can reference individual prompts via raw URLs:

`https://raw.githubusercontent.com/<your-org-or-user>/prompt-library/main/prompts/meta/persona-qa-engineer.md`

This works well for quick experiments or external tools.


---

## Authoring Guidelines

- Prompts should be:
    
    - explicit
        
    - concise
        
    - deterministic where possible
        
- Avoid project-specific details unless clearly documented.
    
- Prefer **composition** over monolithic prompts.
    
- Prompts should be usable both:
    
    - standalone
        
    - and as building blocks combined with others

- Run `prompts/utilities/structure-analyzer.md` on new or modified prompts to validate structural compliance.

---

## Versioning

This repository is versioned via Git.

Breaking changes to prompt behavior should:

- be intentional,
    
- and documented in commit messages or release notes (when introduced).
    
Formal npm / GitHub Package distribution may be added later.
