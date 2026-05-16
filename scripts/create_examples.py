#!/usr/bin/env python3
"""Create runnable example project skeletons."""

from __future__ import annotations

from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples"


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(dedent(text), encoding="utf-8")


def churn_api() -> None:
    base = EXAMPLES / "churn-api"
    write(
        base / "README.md",
        """\
        # Churn Prediction API

        A small FastAPI example that uses deterministic synthetic features and a simple logistic scoring function.

        ```bash
        python -m pip install -e ".[test]"
        uvicorn churn_api.main:app --reload
        curl -X POST http://127.0.0.1:8000/predict \\
          -H "Content-Type: application/json" \\
          -d '{"monthly_spend": 42, "support_tickets": 3, "tenure_months": 8, "contract_type": "monthly"}'
        pytest
        ```
        """,
    )
    write(
        base / "pyproject.toml",
        """\
        [project]
        name = "churn-api"
        version = "0.1.0"
        requires-python = ">=3.11"
        dependencies = ["fastapi>=0.110", "uvicorn>=0.27", "pydantic>=2"]

        [project.optional-dependencies]
        test = ["pytest>=8", "httpx>=0.27"]

        [tool.pytest.ini_options]
        pythonpath = ["src"]
        """,
    )
    write(
        base / "Dockerfile",
        """\
        FROM python:3.12-slim
        WORKDIR /app
        COPY pyproject.toml .
        COPY src ./src
        RUN pip install --no-cache-dir .
        EXPOSE 8000
        CMD ["uvicorn", "churn_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
        """,
    )
    write(
        base / "src/churn_api/model.py",
        """\
        from __future__ import annotations

        import math
        from dataclasses import dataclass


        @dataclass(frozen=True)
        class CustomerFeatures:
            monthly_spend: float
            support_tickets: int
            tenure_months: int
            contract_type: str


        def churn_probability(features: CustomerFeatures) -> float:
            contract_risk = 0.8 if features.contract_type == "monthly" else -0.4
            logit = (
                -1.8
                + 0.035 * features.support_tickets
                + 0.010 * max(0.0, 80.0 - features.monthly_spend)
                - 0.025 * features.tenure_months
                + contract_risk
            )
            return 1.0 / (1.0 + math.exp(-logit))


        def classify_churn(probability: float, threshold: float = 0.45) -> bool:
            return probability >= threshold
        """,
    )
    write(
        base / "src/churn_api/main.py",
        """\
        from __future__ import annotations

        from fastapi import FastAPI, HTTPException
        from pydantic import BaseModel, Field

        from .model import CustomerFeatures, churn_probability, classify_churn


        app = FastAPI(title="Churn Prediction API")


        class PredictionRequest(BaseModel):
            monthly_spend: float = Field(ge=0)
            support_tickets: int = Field(ge=0)
            tenure_months: int = Field(ge=0)
            contract_type: str = Field(pattern="^(monthly|annual)$")
            threshold: float = Field(default=0.45, ge=0, le=1)


        class PredictionResponse(BaseModel):
            churn_probability: float
            predicted_churn: bool
            model_version: str


        @app.get("/health")
        def health() -> dict[str, str]:
            return {"status": "ok"}


        @app.post("/predict", response_model=PredictionResponse)
        def predict(request: PredictionRequest) -> PredictionResponse:
            if request.threshold <= 0 or request.threshold >= 1:
                raise HTTPException(status_code=400, detail="threshold must be between 0 and 1")
            features = CustomerFeatures(
                monthly_spend=request.monthly_spend,
                support_tickets=request.support_tickets,
                tenure_months=request.tenure_months,
                contract_type=request.contract_type,
            )
            probability = churn_probability(features)
            return PredictionResponse(
                churn_probability=round(probability, 4),
                predicted_churn=classify_churn(probability, request.threshold),
                model_version="synthetic-logistic-v1",
            )
        """,
    )
    write(
        base / "tests/test_api.py",
        """\
        from fastapi.testclient import TestClient

        from churn_api.main import app


        client = TestClient(app)


        def test_health() -> None:
            assert client.get("/health").json() == {"status": "ok"}


        def test_predict() -> None:
            response = client.post(
                "/predict",
                json={
                    "monthly_spend": 42,
                    "support_tickets": 3,
                    "tenure_months": 8,
                    "contract_type": "monthly",
                },
            )
            assert response.status_code == 200
            body = response.json()
            assert 0 <= body["churn_probability"] <= 1
            assert body["model_version"] == "synthetic-logistic-v1"
        """,
    )


def rag_document_qa() -> None:
    base = EXAMPLES / "rag-document-qa"
    write(base / "README.md", "# RAG Document Q&A\n\nLocal, dependency-light retrieval demo with document ACL filtering.\n")
    write(base / "requirements.txt", "pytest>=8\n")
    write(
        base / "src/rag_document_qa/retrieval.py",
        """\
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
        """,
    )
    write(
        base / "tests/test_retrieval.py",
        """\
        from rag_document_qa.retrieval import Document, answer


        def test_acl_filtering() -> None:
            docs = [
                Document("public-policy", "remote work policy applies globally", {"all"}),
                Document("exec-plan", "acquisition plan confidential", {"executives"}),
            ]
            result = answer("acquisition policy", docs, {"all"})
            assert "exec-plan" not in result["citations"]
        """,
    )


def agent_ticket_triage() -> None:
    base = EXAMPLES / "agent-ticket-triage"
    write(base / "README.md", "# Agentic Support Ticket Triage\n\nDeterministic support triage with a human approval gate.\n")
    write(base / "requirements.txt", "pytest>=8\n")
    write(
        base / "src/agent_ticket_triage/triage.py",
        """\
        from __future__ import annotations


        def classify_ticket(text: str) -> str:
            lower = text.lower()
            if "security" in lower or "breach" in lower:
                return "security_escalation"
            if "refund" in lower or "billing" in lower:
                return "billing"
            return "general_support"


        def draft_response(text: str, approved: bool = False) -> dict[str, str | bool]:
            category = classify_ticket(text)
            response = f"Draft response for {category}: thank you, we are reviewing your request."
            return {"category": category, "draft": response, "send_allowed": approved}
        """,
    )
    write(
        base / "tests/test_triage.py",
        """\
        from agent_ticket_triage.triage import draft_response


        def test_security_requires_approval() -> None:
            result = draft_response("Possible security breach in account")
            assert result["category"] == "security_escalation"
            assert result["send_allowed"] is False
        """,
    )


def forecasting_service() -> None:
    base = EXAMPLES / "forecasting-service"
    write(base / "README.md", "# Forecasting Service with Monitoring\n\nNaive baseline forecast and drift trigger example.\n")
    write(base / "requirements.txt", "pytest>=8\n")
    write(
        base / "src/forecasting_service/forecast.py",
        """\
        from __future__ import annotations


        def naive_forecast(history: list[float], horizon: int) -> list[float]:
            if not history:
                raise ValueError("history must not be empty")
            return [history[-1]] * horizon


        def mean_absolute_error(actual: list[float], predicted: list[float]) -> float:
            if len(actual) != len(predicted):
                raise ValueError("actual and predicted lengths must match")
            return sum(abs(a - p) for a, p in zip(actual, predicted)) / len(actual)


        def retraining_needed(recent_mae: float, baseline_mae: float, tolerance: float = 1.25) -> bool:
            return recent_mae > baseline_mae * tolerance
        """,
    )
    write(
        base / "tests/test_forecast.py",
        """\
        from forecasting_service.forecast import naive_forecast, retraining_needed


        def test_naive_forecast() -> None:
            assert naive_forecast([10, 12, 14], 3) == [14, 14, 14]


        def test_retraining_trigger() -> None:
            assert retraining_needed(recent_mae=13, baseline_mae=10)
        """,
    )


if __name__ == "__main__":
    churn_api()
    rag_document_qa()
    agent_ticket_triage()
    forecasting_service()
    print(f"Created examples under {EXAMPLES.relative_to(ROOT)}")
