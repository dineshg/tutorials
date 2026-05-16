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
