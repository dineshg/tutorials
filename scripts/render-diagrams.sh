#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT/diagrams/source"
EXPORT_DIR="$ROOT/diagrams/exports"

mkdir -p "$EXPORT_DIR"

render_d2() {
  local file="$1"
  local name
  name="$(basename "$file" .d2)"

  d2 validate "$file" >/dev/null
  d2 --layout elk --theme 0 --pad 48 "$file" "$EXPORT_DIR/$name.svg"
  d2 --layout elk --theme 0 --pad 48 "$file" "$EXPORT_DIR/$name.pdf"
  d2 --layout elk --theme 0 --pad 48 "$file" "$EXPORT_DIR/$name.png"
}

render_dot() {
  local file="$1"
  local name
  name="$(basename "$file" .dot)"

  dot -Tsvg "$file" -o "$EXPORT_DIR/$name.svg"
  dot -Tpdf "$file" -o "$EXPORT_DIR/$name.pdf"
  dot -Tpng "$file" -o "$EXPORT_DIR/$name.png"
}

render_tex() {
  local file="$1"
  local name tmpdir
  name="$(basename "$file" .tex)"
  tmpdir="$(mktemp -d)"

  pdflatex -interaction=nonstopmode -halt-on-error -output-directory "$tmpdir" "$file" >/dev/null
  cp "$tmpdir/$name.pdf" "$EXPORT_DIR/$name.pdf"
  pdftocairo -svg "$EXPORT_DIR/$name.pdf" "$EXPORT_DIR/$name.svg"
  pdftocairo -png -r 600 "$EXPORT_DIR/$name.pdf" "$EXPORT_DIR/$name"
  mv "$EXPORT_DIR/$name-1.png" "$EXPORT_DIR/$name.png"
  rm -rf "$tmpdir"
}

if [[ "$#" -gt 0 ]]; then
  files=("$@")
else
  files=()
  while IFS= read -r file; do
    files+=("$file")
  done < <(find "$SOURCE_DIR" -maxdepth 1 -type f \( -name '*.d2' -o -name '*.dot' -o -name '*.tex' \) | sort)
fi

for file in "${files[@]}"; do
  case "$file" in
    *.d2) render_d2 "$file" ;;
    *.dot) render_dot "$file" ;;
    *.tex) render_tex "$file" ;;
    *) echo "Skipping unsupported diagram source: $file" >&2 ;;
  esac
done
