# Churn Prediction API

A small FastAPI example that uses deterministic synthetic features and a simple logistic scoring function.

```bash
python -m pip install -e ".[test]"
uvicorn churn_api.main:app --reload
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"monthly_spend": 42, "support_tickets": 3, "tenure_months": 8, "contract_type": "monthly"}'
pytest
```
