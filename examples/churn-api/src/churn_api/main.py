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
