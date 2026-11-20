"""
Exhaustive Tests for ML Research Subsystem (Phase 6)
Verifies data loading, 5-fold cross-validation, serialization, explainability,
and experimental inference with safety disclaimers.
"""

import os
import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from ml.data.loader import load_and_preprocess_dataset, generate_sylhet_cohort_data
from ml.training.pipeline import train_and_serialize_models, ARTIFACTS_DIR
from ml.explainability.explainer import (
    compute_global_feature_importances,
    compute_local_instance_attribution,
)


@pytest.fixture
def anyio_backend():
    return "asyncio"


def test_data_loader_stratified_split():
    X_train, X_test, y_train, y_test = load_and_preprocess_dataset(random_state=42)
    assert len(X_train) == 416
    assert len(X_test) == 104
    assert X_train.shape[1] == 16
    # Target distribution preserved (stratification)
    pos_rate_tr = y_train.mean()
    pos_rate_te = y_test.mean()
    assert abs(pos_rate_tr - pos_rate_te) < 0.05


def test_model_training_and_artifacts_serialization():
    manifest = train_and_serialize_models()
    assert manifest["sample_size"] == 520
    assert "cross_validation_metrics" in manifest
    cv = manifest["cross_validation_metrics"]
    assert "random-forest" in cv
    assert "logreg-baseline" in cv
    assert "decision-tree" in cv
    assert "svm-rbf" in cv

    # Assert rigorous clinical performance
    for model_id, m in cv.items():
        assert m["accuracy"] >= 0.85
        assert m["roc_auc"] >= 0.90
        assert m["brier_score"] <= 0.15

    # Check files exist on disk
    assert os.path.exists(os.path.join(ARTIFACTS_DIR, "random-forest.joblib"))
    assert os.path.exists(os.path.join(ARTIFACTS_DIR, "logreg-baseline.joblib"))


def test_global_feature_importances_ranking():
    imp_data = compute_global_feature_importances()
    assert imp_data["total_features"] == 16
    rankings = imp_data["rankings"]
    top_feature_names = [r["feature"] for r in rankings[:3]]
    # Clinically, Polyuria or Polydipsia must dominate early symptom risk
    assert "Polyuria" in top_feature_names or "Polydipsia" in top_feature_names


def test_local_instance_attribution():
    instance = {
        "Age": 55,
        "Gender": "Female",
        "Polyuria": "Yes",
        "Polydipsia": "Yes",
        "sudden_weight_loss": "Yes",
    }
    attrib = compute_local_instance_attribution(instance)
    assert 0.0 <= attrib["predicted_probability"] <= 1.0
    assert len(attrib["feature_attributions"]) == 16
    assert len(attrib["top_contributing_factors"]) == 5


@pytest.mark.anyio
async def test_research_api_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Overview
        res_ov = await client.get("/api/v1/research/overview")
        assert res_ov.status_code == 200
        data_ov = res_ov.json()
        assert len(data_ov["models"]) == 4
        assert "Islam et al." in data_ov["citation"]

        # Feature Importance
        res_fi = await client.get("/api/v1/research/feature-importance")
        assert res_fi.status_code == 200
        assert len(res_fi.json()["rankings"]) == 16

        # Predict
        res_pred = await client.post(
            "/api/v1/research/predict",
            json={
                "Age": 52,
                "Gender": "Male",
                "Polyuria": "Yes",
                "Polydipsia": "Yes",
                "sudden_weight_loss": "Yes",
            },
        )
        assert res_pred.status_code == 200
        data_pred = res_pred.json()
        assert 0.0 <= data_pred["predicted_probability"] <= 1.0
        assert "EXPERIMENTAL RESEARCH PREDICTION" in data_pred["experimental_disclaimer"]

        # Model Card
        res_card = await client.get("/api/v1/research/model-card")
        assert res_card.status_code == 200
        assert "Mitchell et al." in res_card.json()["standard"]
