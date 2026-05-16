from rag_document_qa.retrieval import Document, answer


def test_acl_filtering() -> None:
    docs = [
        Document("public-policy", "remote work policy applies globally", {"all"}),
        Document("exec-plan", "acquisition plan confidential", {"executives"}),
    ]
    result = answer("acquisition policy", docs, {"all"})
    assert "exec-plan" not in result["citations"]
