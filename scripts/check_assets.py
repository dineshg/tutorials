#!/usr/bin/env python3
"""Check book asset references.

The checker is intentionally conservative: missing local image/media files fail
the run, while remote media URLs are reported as warnings so the migration can
replace them with local/generated assets over time.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
DOC_EXTENSIONS = {
    ".css",
    ".html",
    ".ipynb",
    ".js",
    ".md",
    ".qmd",
    ".rst",
    ".yaml",
    ".yml",
}
MEDIA_EXTENSIONS = {
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".mp3",
    ".mp4",
    ".ogg",
    ".png",
    ".svg",
    ".webm",
    ".webp",
    ".wav",
}
IGNORED_DIRS = {
    ".git",
    ".quarto",
    ".venv",
    "__pycache__",
    "_book",
    "env",
    "node_modules",
    ".pytest_cache",
    "venv",
}


@dataclass(frozen=True)
class AssetReference:
    source: Path
    line: int
    kind: str
    target: str
    alt_text: str | None = None

    @property
    def source_display(self) -> str:
        return str(self.source.relative_to(ROOT))


def iter_doc_files(root: Path) -> Iterable[Path]:
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in DOC_EXTENSIONS:
            continue
        if any(part in IGNORED_DIRS for part in path.relative_to(root).parts):
            continue
        yield path


def line_number(text: str, start_index: int) -> int:
    return text.count("\n", 0, start_index) + 1


def strip_fenced_code(text: str) -> str:
    """Replace fenced code block content with blank lines before regex scans."""
    fence = re.compile(r"(^|\n)(`{3,}|~{3,})[^\n]*\n.*?\n\2", re.DOTALL)

    def blank(match: re.Match[str]) -> str:
        return "\n" * match.group(0).count("\n")

    return fence.sub(blank, text)


def extract_from_text(path: Path, text: str) -> list[AssetReference]:
    refs: list[AssetReference] = []

    if path.suffix.lower() in {".md", ".qmd", ".rst", ".ipynb"}:
        markdown_text = strip_fenced_code(text)
        markdown_image = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
        for match in markdown_image.finditer(markdown_text):
            refs.append(
                AssetReference(
                    source=path,
                    line=line_number(markdown_text, match.start()),
                    kind="markdown-image",
                    target=match.group(2).strip(),
                    alt_text=match.group(1).strip(),
                )
            )

    if path.suffix.lower() in {".html", ".md", ".qmd", ".rst", ".ipynb"}:
        html_media = re.compile(
            r"<(?P<tag>img|video|audio|source)\b[^>]*?\bsrc=[\"'](?P<src>[^\"']+)[\"'][^>]*?>",
            re.IGNORECASE | re.DOTALL,
        )
        alt_attr = re.compile(r"\balt=[\"']([^\"']*)[\"']", re.IGNORECASE)
        for match in html_media.finditer(text):
            tag = match.group("tag").lower()
            alt_match = alt_attr.search(match.group(0))
            refs.append(
                AssetReference(
                    source=path,
                    line=line_number(text, match.start()),
                    kind=f"html-{tag}",
                    target=match.group("src").strip(),
                    alt_text=alt_match.group(1).strip() if alt_match else None,
                )
            )

    if path.suffix.lower() == ".css":
        css_url = re.compile(r"url\(\s*[\"']?([^\"')]+)[\"']?\s*\)", re.IGNORECASE)
        for match in css_url.finditer(text):
            target = match.group(1).strip()
            if target.startswith("#"):
                continue
            refs.append(
                AssetReference(
                    source=path,
                    line=line_number(text, match.start()),
                    kind="css-url",
                    target=target,
                )
            )

    quarto_include = re.compile(r"include_graphics\(\s*[\"']([^\"']+)[\"']\s*\)")
    for match in quarto_include.finditer(text):
        refs.append(
            AssetReference(
                source=path,
                line=line_number(text, match.start()),
                kind="quarto-include-graphics",
                target=match.group(1).strip(),
            )
        )

    return refs


def extract_from_notebook(path: Path) -> list[AssetReference]:
    try:
        notebook = json.loads(path.read_text(encoding="utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        print(f"WARN cannot parse notebook {path.relative_to(ROOT)}: {exc}")
        return []

    refs: list[AssetReference] = []
    for cell_number, cell in enumerate(notebook.get("cells", []), start=1):
        if cell.get("cell_type") != "markdown":
            continue
        source = cell.get("source", "")
        text = "".join(source) if isinstance(source, list) else str(source)
        for ref in extract_from_text(path, text):
            refs.append(
                AssetReference(
                    source=ref.source,
                    line=cell_number,
                    kind=f"notebook-{ref.kind}",
                    target=ref.target,
                    alt_text=ref.alt_text,
                )
            )
    return refs


def extract_references(path: Path) -> list[AssetReference]:
    if path.suffix.lower() == ".ipynb":
        return extract_from_notebook(path)
    try:
        return extract_from_text(path, path.read_text(encoding="utf-8"))
    except UnicodeDecodeError as exc:
        print(f"WARN cannot read {path.relative_to(ROOT)}: {exc}")
        return []


def is_remote(target: str) -> bool:
    return urlparse(target).scheme in {"http", "https"}


def is_ignored_target(target: str) -> bool:
    lower = target.lower()
    return (
        not target
        or target.startswith("#")
        or lower.startswith(("data:", "mailto:", "javascript:"))
    )


def strip_fragment_and_query(target: str) -> str:
    parsed = urlparse(target)
    if parsed.scheme in {"http", "https"}:
        return target
    if parsed.query or parsed.fragment:
        return parsed.path
    return target


def local_path_for(ref: AssetReference) -> Path:
    target = unquote(strip_fragment_and_query(ref.target))
    target_path = Path(target)
    if target_path.is_absolute():
        candidate = ROOT / target_path.relative_to("/")
    else:
        candidate = ref.source.parent / target_path
    return candidate.resolve()


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def looks_like_media(target: str) -> bool:
    path = urlparse(target).path
    return Path(path).suffix.lower() in MEDIA_EXTENSIONS


def classify(ref: AssetReference) -> tuple[str, Path | None]:
    if is_ignored_target(ref.target):
        return "IGNORED", None
    if is_remote(ref.target):
        return "REMOTE_MEDIA" if looks_like_media(ref.target) else "REMOTE_REFERENCE", None
    local = local_path_for(ref)
    if local.exists():
        return "OK_LOCAL", local
    return "BROKEN_LOCAL", local


def find_unused_assets(referenced_paths: set[Path]) -> list[Path]:
    asset_roots = [ROOT / "assets"]
    unused: list[Path] = []
    for asset_root in asset_roots:
        if not asset_root.exists():
            continue
        for path in sorted(asset_root.rglob("*")):
            if not path.is_file() or path.suffix.lower() not in MEDIA_EXTENSIONS:
                continue
            if path.resolve() not in referenced_paths:
                unused.append(path)
    return unused


def main() -> int:
    parser = argparse.ArgumentParser(description="Check local and remote book asset references.")
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Print only the final summary unless errors are found.",
    )
    args = parser.parse_args()

    refs: list[AssetReference] = []
    for doc_file in iter_doc_files(ROOT):
        refs.extend(extract_references(doc_file))

    missing: list[tuple[AssetReference, Path]] = []
    remote_media: list[AssetReference] = []
    remote_references: list[AssetReference] = []
    ok_local: list[tuple[AssetReference, Path]] = []
    local_paths: set[Path] = set()
    missing_alt: list[AssetReference] = []

    for ref in refs:
        status, local = classify(ref)
        if status == "OK_LOCAL" and local is not None:
            ok_local.append((ref, local))
            local_paths.add(local)
        elif status == "BROKEN_LOCAL" and local is not None:
            missing.append((ref, local))
        elif status == "REMOTE_MEDIA":
            remote_media.append(ref)
        elif status == "REMOTE_REFERENCE":
            remote_references.append(ref)

        if ref.kind in {"markdown-image", "html-img"} and not ref.alt_text:
            missing_alt.append(ref)

    unused_assets = find_unused_assets(local_paths)

    if not args.quiet:
        print("Asset check")
        print("===========")
        print(f"Documentation files scanned: {sum(1 for _ in iter_doc_files(ROOT))}")
        print(f"Asset/media references found: {len(refs)}")
        print(f"Local assets OK: {len(ok_local)}")
        print(f"Missing local assets: {len(missing)}")
        print(f"Remote media URLs: {len(remote_media)}")
        print(f"Other remote references encountered: {len(remote_references)}")
        print(f"Image references missing alt text: {len(missing_alt)}")
        print(f"Unused local media assets under assets/: {len(unused_assets)}")

        if remote_media:
            print("\nRemote media warnings:")
            for ref in remote_media:
                print(f"  WARN {ref.source_display}:{ref.line} {ref.target}")

        if missing_alt:
            print("\nAlt text warnings:")
            for ref in missing_alt[:50]:
                print(f"  WARN {ref.source_display}:{ref.line} {ref.kind} missing alt text")
            if len(missing_alt) > 50:
                print(f"  ... {len(missing_alt) - 50} more")

        if unused_assets:
            print("\nUnused local media candidates:")
            for path in unused_assets:
                print(f"  WARN {path.relative_to(ROOT)}")

    if missing:
        print("\nMissing local asset errors:")
        for ref, local in missing:
            print(f"  ERROR {ref.source_display}:{ref.line} {ref.target} -> {display_path(local)}")
        return 1

    print("\nPASS: no missing local image/media references.")
    if remote_media:
        print("WARN: remote media references should be replaced with local or generated assets.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
