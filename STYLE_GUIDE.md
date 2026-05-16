# Style Guide

## Book Purpose

The book helps industry data scientists move from notebook-based modelling to production AI delivery. It should feel like a practical bridge:

```text
data scientist -> production AI engineer -> AI lead
```

## Audience

Write for:

- data scientists working in industry
- senior analysts transitioning into ML/AI engineering
- machine learning engineers who need enterprise delivery context
- lead data scientists preparing to design and deliver production AI systems
- practitioners who know Python and basic machine learning but need a path to production AI delivery

## Tone

Use a practical, senior-industry teaching style.

Prefer:

- clear explanations
- concrete examples
- industry trade-offs
- runnable code where useful
- production and enterprise context

Avoid:

- unexplained acronyms
- tool-name dumping
- casual blog-style rambling
- unsupported claims about fast-changing tools
- remote images for core explanations
- empty placeholder chapters

Use this pattern often:

```text
In a notebook, you might do X.
In production, you also need Y.
In an enterprise, you must additionally consider Z.
```

## Standard Chapter Template

Every chapter should follow this structure unless there is a clear reason not to.

```markdown
# Chapter Title

## What you will learn

By the end of this chapter, you will be able to:

- ...
- ...
- ...

## Why this matters in industry

## Mental model

## Core concepts

## Running example: Enterprise Document Q&A Assistant

## Practical example

## Visual explanation

## Common mistakes

## Production considerations

## Checklist

## Key takeaways

## Exercises

## Further reading
```

## Heading Conventions

Use Markdown headings consistently:

```markdown
# Chapter title
## Major section
### Subsection
#### Detail
```

Do not mix decorative heading styles.

## Code Block Conventions

Every code block must specify a language.

Use:

````markdown
```python
def predict(value: float) -> float:
    return value * 0.8
```
````

For shell commands:

````markdown
```bash
python3 -m pytest
```
````

For sample output:

````markdown
```text
accuracy: 0.91
```
````

## Callout Conventions

If the repository is migrated to Quarto, use Quarto callouts:

```markdown
::: {.callout-note}
Note

Use this for neutral context.
:::

::: {.callout-warning}
Warning

Use this for production risks.
:::

::: {.callout-tip}
Industry reality

Use this for practical field advice.
:::

::: {.callout-important}
Common mistake

Use this for issues readers are likely to hit.
:::
```

In the current static HTML phase, use consistent semantic sections and migrate them to callouts during the Quarto conversion.

## Diagram Conventions

Prefer Mermaid for architecture, workflow, sequence, and lifecycle diagrams.

Use local PNG/SVG files for generated plots and visual demonstrations that need axes, examples, or precise layout.

Example Mermaid diagram:

````markdown
```{mermaid}
flowchart LR
  User[User] --> API[FastAPI Backend]
  API --> Retriever[Retriever]
  Retriever --> VectorDB[Vector Database]
  API --> LLM[LLM]
```
````

## Asset and Image Policy

1. Do not use remote images for core instructional content.
2. Store book assets locally under `assets/`.
3. Generated assets must have a script or documented source.
4. Broken images must block publication.
5. Every image must have alt text.
6. Every diagram must be either Mermaid or a local file.
7. Prefer SVG for diagrams and PNG for plots.
8. Do not commit copyrighted third-party images without a compatible license.
9. Prefer original generated educational visuals.
10. Run `python3 scripts/check_assets.py` before submitting changes.

## Generated Plot Requirements

Generated plots should:

- use deterministic random seeds
- have clear titles and axis labels
- avoid clutter
- use descriptive lowercase kebab-case filenames
- live under `assets/generated/` or `assets/plots/`
- have a source script, preferably `scripts/generate_assets.py` in the future

## Alt Text Rules

Every image must include useful alt text. The alt text should describe the instructional purpose, not just the filename.

Good:

```markdown
![Confusion matrix showing false positives and false negatives for a churn model](../assets/generated/ml/confusion-matrix-example.png)
```

Bad:

```markdown
![](../assets/generated/ml/image1.png)
```

## Glossary and Acronym Rules

Define acronyms the first time they appear in each chapter.

Examples:

- Retrieval-Augmented Generation (RAG)
- High-Level Design (HLD)
- Low-Level Design (LLD)
- Architecture Decision Record (ADR)
- OpenID Connect (OIDC)
- Proof Key for Code Exchange (PKCE)
- JSON Web Token (JWT)
- Model Context Protocol (MCP)
- Agent-to-Agent (A2A)

## Citation and Further Reading Rules

Prefer official documentation, standards, and stable references:

- Quarto documentation for Quarto behaviour
- OpenAI documentation for OpenAI APIs
- OWASP GenAI / LLM Top 10 for LLM security
- NIST AI Risk Management Framework and GenAI Profile for AI governance
- OpenID Foundation and IETF references for OAuth2, OIDC, PKCE, and JWT
- Official cloud provider documentation for cloud services

Add version notes for fast-changing topics such as model availability, OpenAI APIs, MCP, LangChain/LangGraph, OAuth/OIDC implementation details, cloud services, and LLM security lists.

## File Naming Rules

Use lowercase kebab-case filenames.

Good:

```text
model-evaluation-experiment-design.qmd
llm-security-threat-modelling.qmd
rag-pipeline.svg
linear-regression-fit.png
```

Bad:

```text
ModelEvaluation.qmd
chapter 5.md
LLM Security New Final.md
image1.png
final-diagram-new-new.png
```

## How to Add a New Chapter

1. Add the chapter in the appropriate book part.
2. Use the standard chapter template.
3. Define acronyms on first use.
4. Connect the topic to the enterprise document Q&A assistant when useful.
5. Add a visual explanation if the concept benefits from a diagram or plot.
6. Store local images under `assets/`.
7. Run `python3 scripts/check_assets.py`.

## How to Add a New Project

Each project should include:

- problem statement
- architecture diagram
- setup instructions
- code walkthrough
- tests
- production hardening section
- exercises

Use synthetic data unless a public dataset is clearly referenced and licensed.

## How to Add a New Image

1. Prefer Mermaid for flow diagrams.
2. Prefer generated SVG/PNG for educational figures.
3. Save files under `assets/generated/`, `assets/plots/`, or `assets/images/`.
4. Use descriptive lowercase kebab-case filenames.
5. Add alt text where referenced.
6. Document the source or generation method.
7. Run `python3 scripts/check_assets.py`.

## How to Regenerate Assets

The repository now has an asset checker but does not yet have a consolidated asset generation script. The migration plan recommends adding:

```text
scripts/generate_assets.py
```

Generated assets should be safe to rebuild repeatedly and should not require private credentials or paid APIs.

## How to Test Examples

Example directories should eventually support:

```bash
python3 -m pytest
```

Tests must not depend on paid APIs, private credentials, or network access unless explicitly skipped when environment variables are absent.
