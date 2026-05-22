# Enterprise AI, Agents & Applied ML

This is a practical tutorial book for enterprise AI delivery, backend platform
engineering, agent protocols, applied machine learning, deep learning, LLM
fine‑tuning, and alignment. The chapters are organized as a progressive path:
start with the mental model, move through small examples, then scale toward
production patterns.

📖 **Read it online:** <https://dineshg.github.io/tutorials/>

> **Or open `index.html` in a browser** to read it locally. Every chapter
> shares a fixed header, a left sidebar, breadcrumbs, and prev/next pagers.

## Hosting (GitHub Pages)

This repository is published as a static book using **GitHub Pages**. The
workflow at `.github/workflows/pages.yml` deploys the entire repo (the
HTML book) to Pages on every push to `main`. A `.nojekyll` file is
included so Pages serves all asset paths verbatim (no Jekyll processing).

## Structure

| Part | Folder | Theme |
| --- | --- | --- |
| I  | `part1-enterprise-ai-delivery/`        | Business pain → AI lead → HLD/LLD → ship |
| II | `part2-backend-platform-security/`     | FastAPI, Pydantic data contracts, concurrency, auth, identity, GitHub governance |
| III| `part3-agent-protocols/`               | MCP (incl. 2025 update), A2A, JS/TS, LangChain/LangGraph/Flowise |
| IV | `part4-ml-foundations/`                | Geometry of ML, regression, classification, ensembles |
| V  | `part5-deep-learning-and-llms/`        | FFN, CNN, RNN, Transformers, fine‑tuning, alignment |
| VI | `part6-appendices/`                    | Interview talk track, LaTeX print edition |

## How a new learner should read this book

The parts are presented in the order an enterprise team usually meets them
(delivery first), but a new learner should read them in a different order.
The home page (`index.html`) lists explicit reading paths for:

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

## Local viewing

```bash
cd /Users/dineshgamage/Developer/tutorial_refined
python3 -m http.server 8080
# then open http://localhost:8080/
```

The sidebar navigation (`assets/js/nav.js`) is injected at runtime, so
opening `index.html` directly via `file://` also works in modern browsers.
The Appendix A wrapper uses `fetch()` to load its markdown source, which
requires HTTP — use the local server above if `file://` blocks the fetch.

## License / authorship

All content remains the property of its author.
