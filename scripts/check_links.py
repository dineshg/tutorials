#!/usr/bin/env python3
"""Conservative internal link checker for documentation files."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
DOC_EXTENSIONS = {".html", ".md", ".qmd"}
IGNORED_DIRS = {".git", ".quarto", ".venv", "_book", "env", "node_modules", "__pycache__", "venv"}


def iter_docs() -> list[Path]:
    files = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in DOC_EXTENSIONS:
            continue
        if any(part in IGNORED_DIRS for part in path.relative_to(ROOT).parts):
            continue
        files.append(path)
    return sorted(files)


def strip_fenced_code(text: str) -> str:
    fence = re.compile(r"(^|\n)(`{3,}|~{3,})[^\n]*\n.*?\n\2", re.DOTALL)
    return fence.sub(lambda match: "\n" * match.group(0).count("\n"), text)


def extract_links(text: str) -> list[tuple[int, str]]:
    clean = strip_fenced_code(text)
    links: list[tuple[int, str]] = []
    patterns = [
        re.compile(r"(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)"),
        re.compile(r"<a\b[^>]*?\bhref=[\"']([^\"']+)[\"']", re.IGNORECASE | re.DOTALL),
        re.compile(r"<link\b[^>]*?\bhref=[\"']([^\"']+)[\"']", re.IGNORECASE | re.DOTALL),
        re.compile(r"<script\b[^>]*?\bsrc=[\"']([^\"']+)[\"']", re.IGNORECASE | re.DOTALL),
    ]
    for pattern in patterns:
        for match in pattern.finditer(clean):
            links.append((clean.count("\n", 0, match.start()) + 1, match.group(1).strip()))
    return links


def is_external(target: str) -> bool:
    return urlparse(target).scheme in {"http", "https", "mailto"}


def is_ignored(target: str) -> bool:
    return not target or target.startswith("#") or target.startswith(("javascript:", "data:"))


def target_exists(source: Path, target: str) -> bool:
    parsed = urlparse(target)
    path = unquote(parsed.path)
    if not path:
        return True
    candidate = Path(path)
    if candidate.is_absolute():
        resolved = ROOT / candidate.relative_to("/")
    else:
        resolved = source.parent / candidate
    return resolved.exists()


def main() -> int:
    parser = argparse.ArgumentParser(description="Check internal documentation links.")
    parser.add_argument("--include-external", action="store_true", help="Report external links but do not fetch them.")
    args = parser.parse_args()

    errors: list[str] = []
    external_count = 0
    checked = 0
    for doc in iter_docs():
        text = doc.read_text(encoding="utf-8")
        for line, target in extract_links(text):
            if is_ignored(target):
                continue
            if is_external(target):
                external_count += 1
                continue
            checked += 1
            if not target_exists(doc, target):
                errors.append(f"{doc.relative_to(ROOT)}:{line} broken link: {target}")

    print("Link check")
    print("==========")
    print(f"Internal links checked: {checked}")
    print(f"External links seen: {external_count}")
    if args.include_external:
        print("External links are not fetched by this lightweight checker.")

    if errors:
        print("\nBroken internal links:")
        for error in errors:
            print(f"  ERROR {error}")
        return 1

    print("\nPASS: no broken internal file links detected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
