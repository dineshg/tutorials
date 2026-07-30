# Enterprise AI, Agents & Applied ML

This repository contains a Docusaurus-based technical book covering enterprise
AI delivery, backend platform engineering, agent protocols, applied machine
learning, deep learning, LLM fine-tuning, and alignment. Chapters build from
mental models and small examples toward production designs.

📖 **Read it online:** <https://dineshg.github.io/tutorials/>

## Local development

Node.js 20 or later is required.

```bash
npm install
npm start
```

The development site is served at
<http://localhost:3000/tutorials/>. Create a production build with:

```bash
npm run build
npm run serve
```

The generated static site is written to `build/`.

## Content model

The original semantic HTML chapters remain the canonical source. Running
`npm run generate:book` converts them into Docusaurus MDX wrappers, builds the
local search index, copies chapter media, and creates redirects for legacy
URLs. This generation step also runs automatically before development and
production builds.

- Edit chapter content in the existing `part*/` HTML files.
- Edit navigation metadata in `book-structure.mjs`.
- Edit the global theme in `src/css/custom.css`.
- Edit the chapter renderer in `src/components/BookArticle/`.
- Do not edit generated files under `docs/` or `src/generated/` by hand.

## GitHub Pages

The workflow at `.github/workflows/pages.yml` installs dependencies with
`npm ci`, builds the Docusaurus site, and publishes `build/` to GitHub Pages
after every push to `main`.

## Structure

| Part | Folder | Theme |
| --- | --- | --- |
| I  | `part1-enterprise-ai-delivery/`        | Business pain → AI lead → HLD/LLD → ship |
| II | `part2-backend-platform-security/`     | FastAPI, Pydantic data contracts, concurrency, auth, identity, GitHub governance |
| III| `part3-agent-protocols/`               | MCP (incl. 2025 update), A2A, JS/TS, LangChain/LangGraph/Flowise |
| IV | `part4-ml-foundations/`                | Geometry of ML, regression, classification, ensembles |
| V  | `part5-deep-learning-and-llms/`        | FFN, CNN, RNN, Transformers, fine‑tuning, alignment |
| VI | `part6-appendices/`                    | Interview talk track, LaTeX print edition |

## Recommended reading paths

The parts are presented in the order an enterprise team usually meets them
(delivery first), while the home page provides role-specific paths:

- New ML learners (Part IV → V → III → II → I)
- Backend / platform engineers learning AI (Part II → III → select V → I)
- Lead / Principal AI engineers (Part I → II → III → select V → Appendix A)
- Lead DS interview prep (Appendix A first, then drill‑downs)

## Major topics covered

- `part2-backend-platform-security/15-modern-auth-additions.html`
  Passkeys / WebAuthn, DPoP sender‑constrained tokens, mTLS, token‑exchange (RFC 8693).
- `part2-backend-platform-security/04-pydantic-data-models.html`
  Full Pydantic section starting from Python classes and dataclasses, then
  moving through BaseModel, validation, strict/lax coercion, aliases,
  serialization, settings management, FastAPI contracts, queue/webhook
  validation, and structured LLM outputs.
- `part3-agent-protocols/04-mcp-2025-update.html`
  The MCP 2025‑03‑26 / 2025‑06‑18 changes: Streamable HTTP transport,
  OAuth 2.1 with Protected Resource Metadata, elicitation, structured
  tool output, and resource links.
- `part5-deep-learning-and-llms/11-transformers-and-attention.html`
  Self‑attention, multi‑head attention, encoder/decoder, KV cache,
  rotary positional embeddings, FlashAttention.
- `part5-deep-learning-and-llms/13-modern-llm-alignment-orpo-grpo.html`
  ORPO (odds‑ratio preference), GRPO (group‑relative policy optimization
  used by DeepSeek R1), KTO, RLAIF — the post‑PPO/DPO landscape.

## Learner flow

- **Part III** keeps the four MCP chapters contiguous (1 → 4),
  followed by A2A, JS/TS primer, and LangChain.
- **Part V Chapter 3** is an optional single-chapter FFN reference. Read
  Chapters 1 and 2 for the teaching path, or Chapter 3 when you want the same
  FFN material in one article.
- **Appendices** (`Appendix A`, `Appendix B`) provide interview and print/PDF
  reference material.
- **Each Part landing page** includes a **Prerequisites** callout so a new
  reader knows what they should already know before starting.

## License / authorship

All content remains the property of its author.
