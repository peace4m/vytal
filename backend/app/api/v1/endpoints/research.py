"""
Independent ML Research Subsystem Endpoints (Research & Analytics Dashboard)
Provides benchmark results, explainability rankings, experimental inference,
and Mitchell et al. Model Card provenance.
"""

import os
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ml.explainability.explainer import (
    compute_global_feature_importances,
    compute_local_instance_attribution,
)
from ml.training.pipeline import train_and_serialize_models, ARTIFACTS_DIR
import joblib

router = APIRouter()


class ModelBenchmarkInfo(BaseModel):
    model_id: str
    algorithm: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    brier_score: float
    cv_strategy: str


class ResearchOverviewResponse(BaseModel):
    primary_dataset: str
    primary_cohort_size: int
    population: str
    citation: str
    models: List[ModelBenchmarkInfo]
    safety_notice: str


class PredictRequest(BaseModel):
    Age: int = Field(default=45, ge=16, le=100)
    Gender: str = Field(default="Male", description="Male or Female")
    Polyuria: str = Field(default="No", description="Yes or No")
    Polydipsia: str = Field(default="No", description="Yes or No")
    sudden_weight_loss: str = Field(default="No", description="Yes or No")
    weakness: str = Field(default="No", description="Yes or No")
    Polyphagia: str = Field(default="No", description="Yes or No")
    Genital_thrush: str = Field(default="No", description="Yes or No")
    visual_blurring: str = Field(default="No", description="Yes or No")
    Itching: str = Field(default="No", description="Yes or No")
    Irritability: str = Field(default="No", description="Yes or No")
    delayed_healing: str = Field(default="No", description="Yes or No")
    partial_paresis: str = Field(default="No", description="Yes or No")
    muscle_stiffness: str = Field(default="No", description="Yes or No")
    Alopecia: str = Field(default="No", description="Yes or No")
    Obesity: str = Field(default="No", description="Yes or No")


class FeatureAttributionItem(BaseModel):
    feature: str
    raw_value: float
    contribution_score: float
    effect_direction: str


class PredictResponse(BaseModel):
    model_used: str
    predicted_probability: float
    predicted_risk_tier: str  # LOW, MODERATE, HIGH
    top_contributing_factors: List[FeatureAttributionItem]
    experimental_disclaimer: str = (
        "EXPERIMENTAL RESEARCH PREDICTION ONLY. This machine learning prediction is an educational "
        "research prototype and NOT a clinical diagnosis. It does not establish the presence or absence "
        "of diabetes and NEVER overrides deterministic clinical triage or medical professional advice."
    )


@router.get("/research/overview", response_model=ResearchOverviewResponse, tags=["ML Research Engine"])
async def get_research_overview() -> ResearchOverviewResponse:
    """Returns benchmark results and model cards for the independent ML research engine."""
    manifest_path = os.path.join(ARTIFACTS_DIR, "benchmark_manifest.joblib")
    if not os.path.exists(manifest_path):
        manifest = train_and_serialize_models()
    else:
        manifest = joblib.load(manifest_path)

    cv = manifest.get("cross_validation_metrics", {})
    algorithm_labels = {
        "logreg-baseline": "Logistic Regression (L2 Regularized)",
        "decision-tree": "Decision Tree (CART, max_depth=5)",
        "random-forest": "Random Forest (100 Trees Ensemble)",
        "svm-rbf": "Support Vector Machine (RBF Kernel, C=5.0)",
    }

    models_list = []
    for model_id, m in cv.items():
        models_list.append(
            ModelBenchmarkInfo(
                model_id=model_id,
                algorithm=algorithm_labels.get(model_id, model_id),
                accuracy=round(m["accuracy"], 3),
                precision=round(m["precision"], 3),
                recall=round(m["recall"], 3),
                f1_score=round(m["f1_score"], 3),
                roc_auc=round(m["roc_auc"], 3),
                brier_score=round(m["brier_score"], 3),
                cv_strategy=m["cv_strategy"],
            )
        )

    return ResearchOverviewResponse(
        primary_dataset="Early Stage Diabetes Risk Prediction (UCI ID: 529, Islam et al. 2020)",
        primary_cohort_size=manifest.get("sample_size", 520),
        population="South Asian (Sylhet Diabetes Hospital, Bangladesh)",
        citation=manifest.get("citation", "Islam et al. Computer Methods and Programs in Biomedicine 2020"),
        models=models_list,
        safety_notice=(
            "Experimental research models only. These machine learning outputs do not constitute medical "
            "conclusions and never override clinical triage rules."
        ),
    )


@router.get("/research/feature-importance", tags=["ML Research Engine"])
async def get_feature_importances() -> Dict[str, Any]:
    """Returns global Gini impurity and odds ratio feature rankings for model explainability."""
    return compute_global_feature_importances()


@router.post("/research/predict", response_model=PredictResponse, tags=["ML Research Engine"])
async def predict_research_instance(request: PredictRequest) -> PredictResponse:
    """
    Executes an experimental research prediction with local feature attribution (XAI).
    Strictly segregated from clinical decision modules with mandatory non-diagnostic disclaimers.
    """
    data_dict = request.model_dump()
    attribution_data = compute_local_instance_attribution(data_dict)
    prob = attribution_data["predicted_probability"]

    risk_tier = "HIGH" if prob >= 0.70 else "MODERATE" if prob >= 0.40 else "LOW"

    return PredictResponse(
        model_used="Logistic Regression (L2 Regularized Baseline)",
        predicted_probability=round(prob, 3),
        predicted_risk_tier=risk_tier,
        top_contributing_factors=[
            FeatureAttributionItem(
                feature=item["feature"],
                raw_value=item["raw_value"],
                contribution_score=round(item["contribution_score"], 3),
                effect_direction=item["effect_direction"],
            )
            for item in attribution_data["top_contributing_factors"]
        ],
    )


@router.get("/research/model-card", tags=["ML Research Engine"])
async def get_model_card_metadata() -> Dict[str, Any]:
    """Returns formal Mitchell et al. Model Card provenance metadata."""
    card_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
        "ml",
        "model_cards",
        "MODEL_CARD_DIABETES_RISK.md",
    )
    content = ""
    if os.path.exists(card_path):
        with open(card_path, "r", encoding="utf-8") as f:
            content = f.read()

    return {
        "model_id": "vytal-ml-diabetes-risk-v1",
        "version": "1.0.0",
        "standard": "Mitchell et al. (2019) FAT* Model Cards",
        "model_card_markdown": content,
    }
