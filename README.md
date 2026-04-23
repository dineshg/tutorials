# Tutorial Refined

A unified, GitHub‑style tutorial book that consolidates the original
`pytorch/` and `Full_Stack/` materials into a single navigable structure.

> **Open `index.html` in a browser** to read the book. Every chapter shares a
> fixed header, a left sidebar, breadcrumbs, and prev/next pagers. The
> existing tutorial content was preserved verbatim — nothing was truncated.

## Structure

| Part | Folder | Theme |
| --- | --- | --- |
| I  | `part1-enterprise-ai-delivery/`        | Business pain → AI lead → HLD/LLD → ship |
| II | `part2-backend-platform-security/`     | FastAPI, concurrency, auth, identity, GitHub governance |
| III| `part3-agent-protocols/`               | MCP, A2A, JS/TS, LangChain/LangGraph/Flowise |
| IV | `part4-ml-foundations/`                | Geometry of ML, regression, classification, ensembles |
| V  | `part5-deep-learning-and-llms/`        | FFN, CNN, RNN, Transformers, fine‑tuning, alignment |
| VI | `part6-appendices/`                    | Interview talk track, LaTeX print edition |

## What was added vs. the originals

The original tutorials were preserved as-is. The following new chapters were
added to fill gaps and cover the latest methods:

- `part2-backend-platform-security/15-modern-auth-additions.html`
  Passkeys / WebAuthn, DPoP sender‑constrained tokens, mTLS, token‑exchange (RFC 8693).
- `part3-agent-protocols/07-mcp-2025-update.html`
  The MCP 2025‑03‑26 / 2025‑06‑18 changes: Streamable HTTP transport,
  OAuth 2.1 with Protected Resource Metadata, elicitation, structured
  tool output, resource links.
- `part5-deep-learning-and-llms/11-transformers-and-attention.html`
  Self‑attention, multi‑head attention, encoder/decoder, KV cache,
  rotary positional embeddings, FlashAttention.
- `part5-deep-learning-and-llms/13-modern-llm-alignment-orpo-grpo.html`
  ORPO (odds‑ratio preference), GRPO (group‑relative policy optimization
  used by DeepSeek R1), KTO, RLAIF — the post‑PPO/DPO landscape.

Original folders such as `Lanchain_langraph_flowise/` (typo for
"Langchain") and `7_Forecasting_RNN/` were normalized into clean,
sequentially‑numbered chapter slots.

## Local viewing

```bash
cd /Users/dineshgamage/Developer/tutorial_refined
python3 -m http.server 8080
# then open http://localhost:8080/
```

The sidebar navigation (`assets/js/nav.js`) is injected at runtime, so
opening `index.html` directly via `file://` also works in modern browsers.

## File mapping (original → refined)

A complete mapping from each original file path to its new location is
preserved in the chapter file names: original ordering numbers and topics
were maintained wherever possible (e.g. `5_1_*` → `01-ffn-concepts.html`,
`5_2_*` → `02-ffn-training-debugging.html`, `5_*` → `03-ffn-canonical-merged.html`).

## License / authorship

All original content remains the property of its author. The refined book
chrome (CSS, navigation injector, index/part landing pages, and the four
new chapters listed above) is provided as a structural overlay.
