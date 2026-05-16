# From Data Scientist to Production AI Lead

Building ML, LLM, and Agentic Systems for Real Enterprise Delivery.

This book teaches industry data scientists how to move beyond notebooks and build real AI systems.

You will learn how to:

- understand core machine learning and deep learning methods
- evaluate models properly
- build APIs around models
- design Retrieval-Augmented Generation (RAG) and Large Language Model (LLM) applications
- secure AI systems with enterprise identity
- understand agents, tools, and Model Context Protocol (MCP)
- deploy, monitor, and govern AI systems
- lead an enterprise AI project from business pain to production rollout

The running example throughout the book is an enterprise document Q&A assistant. We start with the business problem, build the ML/LLM foundations, design the backend, add security and governance, and finally turn it into a production-ready enterprise AI system.

## Current Repository Status

This repository is currently a static HTML tutorial site published with GitHub Pages. The current site is still readable from `index.html`, but the planned direction is to migrate the source authoring format to a Quarto book while preserving useful existing content.

Current framework:

- Static HTML pages
- Shared CSS in `assets/css/book.css`
- Shared navigation injected by `assets/js/nav.js`
- GitHub Pages deployment through `.github/workflows/pages.yml`
- No Quarto, MkDocs, Jupyter Book, package manager, or local build system yet

Current local viewing command:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## How to Read This Book

Path A - Data scientist becoming production-ready:

```text
Part 0 -> Part I -> Part II -> Part III -> Part IV -> Projects
```

Path B - AI lead / senior data scientist:

```text
Part 0 -> Part III -> Part V -> Part VI -> Part VII
```

Path C - Backend/ML engineer:

```text
Part 0 -> Part IV -> Part V -> Part III -> Part VI
```

Path D - Interview preparation:

```text
ML Foundations -> Deep Learning -> LLM Applications -> Backend Basics -> Appendices
```

## Planned Book Structure

The target book structure is documented in [BOOK_RESTRUCTURE_PLAN.md](BOOK_RESTRUCTURE_PLAN.md). The short version:

- Part 0: Orientation
- Part I: ML Foundations for Industry Data Scientists
- Part II: Deep Learning Foundations
- Part III: Modern LLM Application Development
- Part IV: Backend Engineering for Data Scientists
- Part V: Security, Identity, and Governance
- Part VI: Agentic Systems and Protocols
- Part VII: Enterprise AI Delivery Lifecycle
- Part VIII: End-to-End Projects
- Appendices: glossary, templates, checklists, further reading, changelog

## Asset Reliability

Broken images and remote instructional media are tracked in [ASSET_MANIFEST.md](ASSET_MANIFEST.md).

Run the asset checker:

```bash
python3 scripts/check_assets.py
```

Current audit result:

- 176 documentation files scanned
- 126 image/media references found
- 0 broken local image references
- 0 remote media references
- 13 unused generated media candidates under root `assets/` because the Quarto book now uses self-contained copies under `book/assets/`

The checker exits non-zero if broken local image references are introduced. That is intentional: missing local instructional assets should block publication.

## Contributor Guides

- [STYLE_GUIDE.md](STYLE_GUIDE.md) defines the book voice, chapter template, file naming rules, and asset policy.
- [CONTRIBUTING.md](CONTRIBUTING.md) explains local setup, editing workflow, asset checks, and review checklists.

## Existing Static Site

The current static site contains useful material that should be preserved and reorganised rather than deleted:

- `part1-enterprise-ai-delivery/`
- `part2-backend-platform-security/`
- `part3-agent-protocols/`
- `part4-ml-foundations/`
- `part5-deep-learning-and-llms/`
- `part6-appendices/`

The migration plan maps these chapters into the new book journey and identifies duplicate or overlapping content.

## New Quarto Source

The maintainable book source now lives under `book/`.

When Quarto is installed:

```bash
quarto render book --to html
```

The GitHub Pages workflow now renders and publishes `book/_book`. The legacy static site remains in the repository for reference while the Quarto book matures.

## License

No new license file was introduced in this audit pass. Before wider publication or reuse of third-party assets, add a repository license and confirm that all retained media has compatible licensing.
