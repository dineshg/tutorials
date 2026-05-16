# Book Restructure Plan

## Internal Working Summary

Current book framework:

- Static HTML tutorial site
- Shared stylesheet: `assets/css/book.css`
- Shared navigation injector: `assets/js/nav.js`
- GitHub Pages deployment uploads the repository root
- No Quarto, MkDocs, Jupyter Book, package manifest, notebooks, or example project structure

Current build command:

- No build command
- Local viewing works with:

```bash
python3 -m http.server 8080
```

Current asset directories:

- `assets/images/`
- `assets/images/ch4/`
- `assets/css/`
- `assets/js/`

Asset problems found and fixed in the implementation pass:

- 11 broken local image references in `part4-ml-foundations/` were fixed by correcting legacy relative paths.
- 46 remote media URLs, mostly Wikimedia images in deep learning chapters, were replaced with generated local SVG references.
- Existing local media assets are now referenced correctly; the remaining unused warnings are generated candidates reserved for future chapters.
- External JavaScript/CSS dependencies are used for syntax highlighting, Markdown rendering, MathJax, and KaTeX

Proposed restructuring approach:

- Keep the current static HTML site during the first migration phase.
- Add a Quarto book source tree under `book/` in the implementation phase.
- Move or convert useful existing chapters into `.qmd` files gradually.
- Preserve the old static HTML until the Quarto book renders and navigation is verified.
- Consolidate duplicate feed-forward neural network material into one canonical deep learning chapter.
- Add missing LLM application, evaluation, security, governance, project, and appendix content as meaningful starter chapters.

Asset repair approach:

- Fixed broken local paths first.
- Replaced remote instructional media with local generated assets.
- Prefer Mermaid for architecture and workflow diagrams.
- Prefer Python-generated PNG/SVG for ML/DL plots.
- Added a consolidated `scripts/generate_assets.py`.
- Kept `scripts/check_assets.py` strict for missing local assets and warning-only for remote media during migration.

Files that should be preserved:

- All existing `part*/` chapter files until migrated
- `assets/css/book.css`
- `assets/js/nav.js`
- Existing local assets under `assets/images/`
- `.github/workflows/pages.yml` until Quarto publishing replaces or extends it

Files that should be moved or converted later:

- Existing static HTML chapters should be converted into Quarto `.qmd` chapters under `book/`
- Reusable diagrams should move into `assets/generated/` or `assets/images/`
- Appendix source files should become Quarto appendix chapters

Files generated in this first audit pass:

- `BOOK_RESTRUCTURE_PLAN.md`
- `ASSET_MANIFEST.md`
- `STYLE_GUIDE.md`
- `CONTRIBUTING.md`
- `scripts/check_assets.py`

Risks or uncertainties:

- The existing site has inline HTML, custom SVG, script dependencies, and manually styled content; automated conversion to Quarto will need review.
- Some remote Wikimedia images may be permissively licensed, but local replacement with generated assets is safer and more maintainable.
- Quarto is not installed in the current local environment, so Quarto rendering cannot be verified yet.
- There is no test suite for examples because examples do not exist yet.

## Current Repository Structure

```text
.
├── .github/workflows/pages.yml
├── .nojekyll
├── README.md
├── assets/
│   ├── css/book.css
│   ├── images/
│   └── js/nav.js
├── index.html
├── part1-enterprise-ai-delivery/
├── part2-backend-platform-security/
├── part3-agent-protocols/
├── part4-ml-foundations/
├── part5-deep-learning-and-llms/
└── part6-appendices/
```

## Existing Chapters

### Part 1 - Enterprise AI Delivery

- From Pain Point -> Lead AI Engineer
- Enterprise Intake Package: What Arrives on the Lead AI Engineer's Desk
- AI Lead Response Doc
- Pilot Kickoff Meeting (AI Lead)
- AI Lead Playbook: 7 Days After Kickoff
- Architecture Reference Design
- HLD Service Selection (GCP): Exec Document Q&A Pilot
- After HLD: What You Do Next
- Architecture Review Tutorial
- Convert HLD into LLD Tasks + Sprint-Ready Plan
- Provisioning Tickets + Concrete Service Choices + Scale

### Part 2 - Backend, Platform, and Security

- FastAPI & Uvicorn Basics
- HTTP Methods
- FastAPI HTTP Function Mapping
- FastAPI Concurrency & User Isolation
- Background Tasks & Retries in FastAPI
- SSO, OAuth2, and OIDC Explained
- OIDC + OAuth2 + PKCE -> Bearer Token -> FastAPI Identity
- Registering a New User
- Authentication Tutorial
- Tenant Identity vs IAM vs Workload Identity
- GCP Project Setup and Workload Identity Tutorial
- Tenant Isolation vs IAM vs AD Groups
- Connecting an External Service
- GitHub Admin Tutorial
- Modern Auth Additions

### Part 3 - Agent Protocols

- MCP Tutorial with a Simple Database Example
- MCP Servers: Components, Remote Access, OpenAI Analogy, and Authentication
- FastAPI -> MCP Server -> Salesforce
- MCP 2025 Update
- A2A Protocol
- JavaScript & TypeScript Tutorial
- LangChain -> LangGraph -> Flowise

### Part 4 - ML Foundations

- Introduction
- Machine Learning as Geometry
- Linear Regression and Training in PyTorch
- Linear Classification in PyTorch
- Bagging & Boosting with Decision Tree Splits & Impurities

### Part 5 - Deep Learning and LLMs

- Feed-Forward Neural Networks
- ANN FFN Training, Evaluation, Debugging, Synthetic Regression
- Artificial Neural Networks canonical merged chapter
- CNNs: Convolution
- CNNs: Architecture
- PyTorch CNN Coding Prep
- CNN Coding in PyTorch
- Forecasting & Sequence Data
- Autoregressive Linear Model in PyTorch
- Recurrent Neural Networks
- Transformers & Attention
- LLM Fine-Tuning & Optimization
- Modern LLM Alignment

### Part 6 - Appendices

- Lead DS Interview Talk Track
- Classification LaTeX Print Edition

## Duplicate or Overlapping Content

The most obvious duplication is in the feed-forward neural network material:

- `part5-deep-learning-and-llms/01-ffn-concepts.html`
- `part5-deep-learning-and-llms/02-ffn-training-debugging.html`
- `part5-deep-learning-and-llms/03-ffn-canonical-merged.html`

Recommended consolidation:

- Convert chapters 1 and 2 into canonical Quarto chapters:
  - `09-neural-networks-foundations.qmd`
  - `10-pytorch-training.qmd`
  - `11-debugging-training.qmd`
- Preserve useful advanced or duplicate material from `03-ffn-canonical-merged.html` as appendix or optional reference.

Other overlapping areas:

- Authentication appears in several backend/security chapters and should be split into identity basics, OAuth/OIDC, FastAPI OIDC, and workload identity.
- MCP appears in several chapters and should be normalised into MCP fundamentals and MCP enterprise chapters with version notes.
- Enterprise document Q&A appears across delivery chapters and should become the explicit running case study.

## Missing Sections

Important missing or underdeveloped areas:

- Orientation chapters
- Strong model evaluation chapter
- Data leakage, baselines, and error analysis
- Feature engineering in production
- Data contracts and data quality
- LLM applications before fine-tuning
- RAG chapter
- LLM evaluation chapter
- Cost, latency, and model selection
- Model inference API chapter
- Docker and deployment basics
- Observability for ML and AI APIs
- LLM security and threat modelling
- AI risk management and governance
- Agent evaluation and observability
- End-to-end project chapters
- Glossary, acronym list, and reusable templates/checklists

## Target Quarto Structure

```text
book/
  _quarto.yml
  index.qmd
  00-orientation/
  01-ml-foundations/
  02-deep-learning/
  03-llm-applications/
  04-backend-engineering/
  05-security-governance/
  06-agentic-systems/
  07-enterprise-delivery/
  08-projects/
  appendices/
examples/
notebooks/
assets/
  images/
  diagrams/
  generated/
  screenshots/
  plots/
  videos/
  sources/
scripts/
  check_assets.py
  check_links.py
  generate_assets.py
```

## Target Table of Contents

### Part 0 - Orientation: From Notebook to Enterprise AI System

- 00. Who This Book Is For
- 01. The Industry AI Delivery Map
- 02. The Running Case Study: Enterprise Document Q&A Assistant
- 03. How to Use This Book

### Part I - ML Foundations for Industry Data Scientists

- 01. What Machine Learning Is Really Doing
- 02. Linear Regression: The First Useful Model
- 03. Logistic Regression and Classification
- 04. Trees, Random Forests, Bagging, Boosting, and XGBoost
- 05. Model Evaluation and Experiment Design
- 06. Data Leakage, Baselines, and Error Analysis
- 07. Feature Engineering in Production
- 08. Data Contracts and Data Quality

### Part II - Deep Learning Foundations

- 09. From Logistic Regression to Neural Networks
- 10. Training Neural Networks in PyTorch
- 11. Debugging Neural Network Training
- 12. CNNs for Image and Spatial Data
- 13. Sequence Models and Forecasting
- 14. Transformers and Attention
- 15. Embeddings and Representation Learning

### Part III - Modern LLM Application Development

- 16. How LLM Applications Differ from Traditional ML
- 17. Prompting for Production Systems
- 18. Structured Outputs and Tool Calling
- 19. Retrieval-Augmented Generation
- 20. LLM Evaluation
- 21. Fine-Tuning LLMs
- 22. Alignment Methods: SFT, DPO, ORPO, KTO, GRPO, and RLAIF
- 23. Cost, Latency, and Model Selection

### Part IV - Backend Engineering for Data Scientists

- 24. Why Data Scientists Need Backend Basics
- 25. HTTP, APIs, and FastAPI
- 26. Building a Model Inference API
- 27. Background Jobs and Async Workflows
- 28. Concurrency, Isolation, and Scale
- 29. Docker and Deployment Basics
- 30. Observability for ML and AI APIs

### Part V - Security, Identity, and Governance

- 31. Enterprise Identity Basics
- 32. OAuth2, OIDC, PKCE, JWTs, and SSO
- 33. Securing a FastAPI App with OIDC
- 34. End-User Identity vs Workload Identity
- 35. Multi-Tenant Data Access
- 36. LLM Security and Threat Modelling
- 37. AI Risk Management and Governance
- 38. GitHub Governance and Secure Development

### Part VI - Agentic Systems and Protocols

- 39. What Agents Are and Are Not
- 40. Tool Calling and Tool Safety
- 41. MCP Fundamentals
- 42. MCP in the Enterprise
- 43. Agent-to-Agent Protocols
- 44. LangChain, LangGraph, Flowise, and When to Avoid Frameworks
- 45. Agent Evaluation and Observability

### Part VII - Enterprise AI Delivery Lifecycle

- 46. From Business Pain to AI Opportunity
- 47. AI Intake Package
- 48. AI Lead Response Document
- 49. Kickoff Meeting
- 50. The First Seven Days After Kickoff
- 51. Architecture Reference Design
- 52. HLD Service Selection
- 53. HLD to LLD and Sprint Plan
- 54. Architecture Review
- 55. Provisioning, Scaling, Rollout, and Support

### Part VIII - End-to-End Projects

- 56. Project 1: Churn Prediction API
- 57. Project 2: Enterprise Document Q&A Assistant
- 58. Project 3: Agentic Support Ticket Triage
- 59. Project 4: Forecasting Service with Monitoring

### Appendices

- A. Glossary
- B. Acronyms
- C. Architecture Decision Record Template
- D. AI Intake Template
- E. AI Lead Response Template
- F. HLD Template
- G. LLD Template
- H. Sprint Planning Template
- I. Security Review Checklist
- J. Model Evaluation Checklist
- K. RAG Evaluation Checklist
- L. LLM Application Launch Checklist
- M. Data Contract Template
- N. Risk Register Template
- O. Post-Launch Review Template
- P. Interview Preparation Notes
- Q. Further Reading
- R. Change Log

## Recommended Implementation Sequence

1. Continue converting legacy HTML into richer hand-edited Quarto chapters.
2. Expand generated diagrams where deeper visual explanations are useful.
3. Add more complete runnable notebooks for ML, PyTorch, RAG evaluation, and forecasting.
4. Review each converted chapter with a subject-matter expert.
5. Run `quarto render book --to html` once Quarto is installed locally.
6. Keep the static site available until the Quarto site renders cleanly.
