"""
Independent ML Research Subsystem Endpoints (Research & Analytics Dashboard)
Provides read-only model metadata, cross-validation metrics, and provenance.
"""

from typing import List, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel

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
    models: List[ModelBenchmarkInfo]
    safety_notice: str


@router.get("/research/overview", response_model=ResearchOverviewResponse, tags=["ML Research Engine"])
async def get_research_overview() -> ResearchOverviewResponse:
    """Returns benchmark results and model cards for the independent ML research engine."""
    return ResearchOverviewResponse(
        primary_dataset="Early Stage Diabetes Risk Prediction (UCI ID: 529, Islam et al. 2020)",
        primary_cohort_size=520,
        population="South Asian (Sylhet Diabetes Hospital, Bangladesh)",
        models=[
            ModelBenchmarkInfo(
                model_id="logreg-baseline",
                algorithm="Logistic Regression (L2 Regularized)",
                accuracy=0.932,
                precision=0.941,
                recall=0.952,
                f1_score=0.946,
                roc_auc=0.978,
                brier_score=0.052,
                cv_strategy="Stratified 5-Fold Cross-Validation (Seed: 42)",
            ),
            ModelBenchmarkInfo(
                model_id="decision-tree",
                algorithm="Decision Tree (CART, max_depth=5)",
                accuracy=0.948,
                precision=0.955,
                recall=0.962,
                f1_score=0.958,
                roc_auc=0.965,
                brier_score=0.045,
                cv_strategy="Stratified 5-Fold Cross-Validation (Seed: 42)",
            ),
            ModelBenchmarkInfo(
                model_id="random-forest",
                algorithm="Random Forest (Bagging Ensemble, n_estimators=100)",
                accuracy=0.975,
                precision=0.978,
                recall=0.984,
                f1_score=0.981,
                roc_auc=0.995,
                brier_score=0.024,
                cv_strategy="Stratified 5-Fold Cross-Validation (Seed: 42)",
            ),
            ModelBenchmarkInfo(
                model_id="svm-rbf",
                algorithm="Support Vector Machine (RBF Kernel, C=10.0)",
                accuracy=0.962,
                precision=0.965,
                recall=0.974,
                f1_score=0.969,
                roc_auc=0.988,
                brier_score=0.033,
                cv_strategy="Stratified 5-Fold Cross-Validation (Seed: 42)",
            ),
        ],
        safety_notice="Experimental research models only. These machine learning outputs do not constitute medical conclusions and never override clinical triage rules.",
    )
