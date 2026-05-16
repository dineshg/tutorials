from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Document:
    doc_id: str
    text: str
    allowed_groups: set[str]


def retrieve(query: str, documents: list[Document], user_groups: set[str], limit: int = 3) -> list[Document]:
    terms = set(query.lower().split())
    visible = [doc for doc in documents if doc.allowed_groups & user_groups]
    scored = sorted(
        visible,
        key=lambda doc: len(terms & set(doc.text.lower().split())),
        reverse=True,
    )
    return scored[:limit]


def answer(query: str, documents: list[Document], user_groups: set[str]) -> dict[str, object]:
    hits = retrieve(query, documents, user_groups)
    if not hits:
        return {"answer": "I do not have enough permitted evidence to answer.", "citations": []}
    return {
        "answer": f"Based on {hits[0].doc_id}: {hits[0].text}",
        "citations": [doc.doc_id for doc in hits],
    }
