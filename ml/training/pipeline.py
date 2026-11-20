"""
Model Training and 5-Fold Cross-Validation Pipeline (ML Subsystem)
Builds and compares 4 algorithms with Stratified K-Fold CV:
1. Logistic Regression (L2 Regularized)
2. Decision Tree (CART, max_depth=5)
3. Random Forest (100 Trees Ensemble)
4. Support Vector Machine (RBF Kernel)
"""

import os
from typing import Dict, Any, List
import joblib
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    brier_score_loss,
    confusion_matrix,
)

from ml.data.loader import load_and_preprocess_dataset, FEATURE_NAMES


ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "artifacts")


def get_model_definitions() -> Dict[str, Pipeline]:
    """Returns standardized scikit-learn pipelines with standard scalers."""
    return {
        "logreg-baseline": Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", LogisticRegression(penalty="l2", C=1.0, solver="liblinear", random_state=42)),
        ]),
        "decision-tree": Pipeline([
            ("classifier", DecisionTreeClassifier(max_depth=5, min_samples_split=4, random_state=42)),
        ]),
        "random-forest": Pipeline([
            ("classifier", RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)),
        ]),
        "svm-rbf": Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", SVC(kernel="rbf", C=5.0, probability=True, random_state=42)),
        ]),
    }


def evaluate_cross_validation(
    models: Dict[str, Pipeline],
    X: pd.DataFrame,
    y: pd.Series,
    n_splits: int = 5,
    random_state: int = 42,
) -> Dict[str, Dict[str, Any]]:
    """
    Evaluates 5-fold stratified cross-validation on the training set.
    Computes mean and std of clinical performance metrics.
    """
    skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
    results: Dict[str, Dict[str, Any]] = {}

    for model_id, pipeline in models.items():
        acc_list, prec_list, rec_list, f1_list, auc_list, brier_list = [], [], [], [], [], []

        for train_idx, val_idx in skf.split(X, y):
            X_tr, X_val = X.iloc[train_idx], X.iloc[val_idx]
            y_tr, y_val = y.iloc[train_idx], y.iloc[val_idx]

            pipeline.fit(X_tr, y_tr)
            y_pred = pipeline.predict(X_val)
            y_prob = pipeline.predict_proba(X_val)[:, 1]

            acc_list.append(accuracy_score(y_val, y_pred))
            prec_list.append(precision_score(y_val, y_pred, zero_division=0))
            rec_list.append(recall_score(y_val, y_pred, zero_division=0))
            f1_list.append(f1_score(y_val, y_pred, zero_division=0))
            auc_list.append(roc_auc_score(y_val, y_prob))
            brier_list.append(brier_score_loss(y_val, y_prob))

        results[model_id] = {
            "model_id": model_id,
            "accuracy": float(np.mean(acc_list)),
            "accuracy_std": float(np.std(acc_list)),
            "precision": float(np.mean(prec_list)),
            "precision_std": float(np.std(prec_list)),
            "recall": float(np.mean(rec_list)),
            "recall_std": float(np.std(rec_list)),
            "f1_score": float(np.mean(f1_list)),
            "f1_score_std": float(np.std(f1_list)),
            "roc_auc": float(np.mean(auc_list)),
            "roc_auc_std": float(np.std(auc_list)),
            "brier_score": float(np.mean(brier_list)),
            "brier_score_std": float(np.std(brier_list)),
            "cv_strategy": f"Stratified {n_splits}-Fold Cross-Validation (Seed: {random_state})",
        }

    return results


def train_and_serialize_models() -> Dict[str, Any]:
    """
    Executes full pipeline:
    1. Loads dataset
    2. Runs 5-fold CV evaluation
    3. Fits final models on full train split
    4. Evaluates holdout test split
    5. Serializes model binaries and metrics to ml/artifacts/
    """
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    X_train, X_test, y_train, y_test = load_and_preprocess_dataset(random_state=42)

    models = get_model_definitions()
    cv_metrics = evaluate_cross_validation(models, X_train, y_train, n_splits=5, random_state=42)

    # Train final models and evaluate on holdout test set
    test_results: Dict[str, Any] = {}
    for model_id, pipeline in models.items():
        pipeline.fit(X_train, y_train)
        y_test_pred = pipeline.predict(X_test)
        y_test_prob = pipeline.predict_proba(X_test)[:, 1]

        cm = confusion_matrix(y_test, y_test_pred).tolist()
        test_results[model_id] = {
            "test_accuracy": float(accuracy_score(y_test, y_test_pred)),
            "test_precision": float(precision_score(y_test, y_test_pred)),
            "test_recall": float(recall_score(y_test, y_test_pred)),
            "test_f1": float(f1_score(y_test, y_test_pred)),
            "test_roc_auc": float(roc_auc_score(y_test, y_test_prob)),
            "test_brier": float(brier_score_loss(y_test, y_test_prob)),
            "confusion_matrix": cm,
        }

        # Save model pipeline
        model_path = os.path.join(ARTIFACTS_DIR, f"{model_id}.joblib")
        joblib.dump(pipeline, model_path)

    summary_manifest = {
        "dataset_name": "Sylhet Diabetes Hospital Early Stage Risk Dataset",
        "uci_id": 529,
        "citation": "Islam et al. Computer Methods and Programs in Biomedicine 2020",
        "sample_size": len(X_train) + len(X_test),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "feature_names": FEATURE_NAMES,
        "cross_validation_metrics": cv_metrics,
        "holdout_test_metrics": test_results,
    }

    manifest_path = os.path.join(ARTIFACTS_DIR, "benchmark_manifest.joblib")
    joblib.dump(summary_manifest, manifest_path)
    return summary_manifest
