from forecasting_service.forecast import naive_forecast, retraining_needed


def test_naive_forecast() -> None:
    assert naive_forecast([10, 12, 14], 3) == [14, 14, 14]


def test_retraining_trigger() -> None:
    assert retraining_needed(recent_mae=13, baseline_mae=10)
