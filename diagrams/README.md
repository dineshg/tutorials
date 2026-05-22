# Diagram Rendering System

This folder is the source of truth for book-quality diagrams.

## Workflow

```
source specification
  -> D2 / Graphviz / TikZ renderer
  -> SVG, PDF, and PNG preview exports
  -> optional manual polish in Inkscape, Affinity Designer, or Illustrator
  -> final book asset
```

Use vector outputs (`.svg` or `.pdf`) in the book. PNG exports are previews only.

## Tools

- D2 + ELK: default for conceptual flow, arrow, layered system, and node-link diagrams.
- Graphviz: formal DAGs, trees, state machines, dependency graphs, and proof-like transition systems.
- TikZ: final academic or mathematical figures that need precise notation.

Game engines are only appropriate for 3D or cinematic backgrounds. Arrows, labels, and typography should remain vector-first.

## Commands

Render every diagram:

```sh
./scripts/render-diagrams.sh
```

Render only one source file:

```sh
./scripts/render-diagrams.sh diagrams/source/rnn-gru-flow.d2
```

Outputs are written to `diagrams/exports/` with matching names:

- `diagram-name.svg` for the web/book
- `diagram-name.pdf` for print layout
- `diagram-name.png` for preview

## Quality Rules

- Keep labels large enough to read at book width.
- Prefer several readable panels over one dense diagram.
- Use consistent fills, strokes, arrowheads, spacing, and typography.
- Keep source files under version control; do not edit generated SVG/PDF directly unless the polished output is intentionally frozen.
