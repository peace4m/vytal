"""
Explainable AI (XAI) and Model Explainability Engine (ML Subsystem)
Computes global feature importance rankings and local feature attribution contributions
for model transparency and clinical interpretability.
"""

import os
from typing import Dict, Any, List
import joblib
import numpy as np
import pandas as pd

from ml.data.loader import FEATURE_NAMES, load_and_preprocess_dataset

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "artifacts")


def compute_global_feature_importances() -> Dict[str, Any]:
    """
    Computes normalized global feature importance rankings using the Random Forest ensemble
    and absolute standardized coefficients from Logistic Regression.
    """
    rf_path = os.path.join(ARTIFACTS_DIR, "random-forest.joblib")
    if not os.path.exists(rf_path):
        from ml.training.pipeline import train_and_serialize_models
        train_and_serialize_models()

    rf_pipeline = joblib.load(rf_path)
    rf_clf = rf_pipeline.named_steps["classifier"]
    rf_importances = rf_clf.feature_importances_

    # Create sorted dataframe
    feat_df = pd.DataFrame({
        "feature": FEATURE_NAMES,
        "importance": rf_importances,
    }).sort_values(by="importance", ascending=False)

    total_imp = feat_df["importance"].sum()
    feat_df["relative_percentage"] = (feat_df["importance"] / total_imp) * 100.0

    rankings = []
    for _, row in feat_df.iterrows():
        rankings.append({
            "feature": row["feature"],
            "raw_importance": float(row["importance"]),
            "relative_percentage": float(row["relative_percentage"]),
        })

    return {
        "model": "Random Forest (100 Trees Ensemble)",
        "method": "Mean Decrease in Impurity (Gini Feature Importance)",
        "total_features": len(FEATURE_NAMES),
        "rankings": rankings,
        "top_features": rankings[:5],
    }


def compute_local_instance_attribution(instance_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes local feature contributions for an individual patient instance
    using the regularized Logistic Regression baseline.
    """
    logreg_path = os.path.join(ARTIFACTS_DIR, "logreg-baseline.joblib")
    if not os.path.exists(logreg_path):
        from ml.training.pipeline import train_and_serialize_models
        train_and_serialize_models()

    pipeline = joblib.load(logreg_path)
    scaler = pipeline.named_steps["scaler"]
    clf = pipeline.named_steps["classifier"]

    # Build input row
    row = []
    for col in FEATURE_NAMES:
        val = instance_dict.get(col, 0)
        if isinstance(val, str):
            val = 1 if val.lower() in ("yes", "female", "1", "true") else 0
        row.append(float(val))

    x_arr = np.array([row])
    x_scaled = scaler.transform(x_arr)

    # Predicted probability
    prob = float(clf.predict_proba(x_scaled)[0, 1])

    # Linear contribution = scaled_feature * coef
    coefs = clf.coef_[0]
    contributions = x_scaled[0] * coefs

    attribution_list = []
    for feat, raw_val, contrib in zip(FEATURE_NAMES, row, contributions):
        attribution_list.append({
            "feature": feat,
            "raw_value": raw_val,
            "contribution_score": float(contrib),
            "effect_direction": "RISK_INCREASING" if contrib > 0 else "RISK_DECREASING",
        })

    # Sort by absolute magnitude of contribution
    attribution_list.sort(key=lambda x: abs(x["contribution_score"]), reverse=True)

    return {
        "predicted_probability": prob,
        "predicted_class": "Positive" if prob >= 0.5 else "Negative",
        "intercept": float(clf.intercept_[0]),
        "feature_attributions": attribution_list,
        "top_contributing_factors": attribution_list[:5],
    }
