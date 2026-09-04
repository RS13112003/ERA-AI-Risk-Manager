# ============================================================
# AI RISK MANAGER — PYTHON RISK ENGINE
# ============================================================
#
# Purpose:
#   Load the finalized XGBoost model and risk configuration
#   and score a single transaction.
#
# This file does NOT:
#   - train a model
#   - tune a threshold
#   - evaluate the test set
#
# It is the runtime prediction/explainability layer.
# ============================================================

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap


# ============================================================
# 1. PROJECT PATHS
# ============================================================

# risk_engine.py
#     ↓
# python_services/
#     ↓ 
# backend/
#     ↓
# Fraud Risk Detect/   ← project root

PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_DIR = PROJECT_ROOT / "models"

MODEL_PATH = MODEL_DIR / "final_xgb_model.pkl"
CONFIG_PATH = MODEL_DIR / "final_risk_config.pkl"


# ============================================================
# 2. FEATURE SCHEMA
# ============================================================
#
# These are the exact 30 features used by the finalized model.
# They match Step 4 / Step 7.
# ============================================================

FEATURE_COLUMNS = [
    "Time",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
    "V18",
    "V19",
    "V20",
    "V21",
    "V22",
    "V23",
    "V24",
    "V25",
    "V26",
    "V27",
    "V28",
    "Amount",
]


# ============================================================
# 3. LOAD FINAL MODEL
# ============================================================

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Final model not found:\n{MODEL_PATH}\n\n"
        "Make sure Step 6 created:\n"
        "models/final_xgb_model.pkl"
    )

if not CONFIG_PATH.exists():
    raise FileNotFoundError(
        f"Final risk configuration not found:\n{CONFIG_PATH}\n\n"
        "Make sure Step 6 created:\n"
        "models/final_risk_config.pkl"
    )


xgb_model = joblib.load(MODEL_PATH)
final_config = joblib.load(CONFIG_PATH)


# ============================================================
# 4. LOAD FINAL RISK CONFIGURATION
# ============================================================

FINAL_THRESHOLD = float(final_config["threshold"])

COST_FALSE_POSITIVE = float(
    final_config["false_positive_cost"]
)

COST_FALSE_NEGATIVE = float(
    final_config["false_negative_cost"]
)


# ============================================================
# 5. MODEL COMPATIBILITY CHECK
# ============================================================

if hasattr(xgb_model, "n_features_in_"):

    if xgb_model.n_features_in_ != len(FEATURE_COLUMNS):

        raise ValueError(
            "Feature mismatch:\n"
            f"Model expects {xgb_model.n_features_in_} features, "
            f"but risk engine provides {len(FEATURE_COLUMNS)}."
        )


# ============================================================
# 6. CREATE SHAP EXPLAINER
# ============================================================

explainer = shap.TreeExplainer(xgb_model)


# ============================================================
# 7. SHAP OUTPUT NORMALIZATION
# ============================================================

def get_shap_row(transaction: pd.DataFrame) -> np.ndarray:
    """
    Calculate SHAP values for one transaction and return
    a 1-D vector containing one SHAP value per feature.

    Handles different SHAP output shapes across versions.
    """

    shap_output = explainer.shap_values(transaction)

    # Older SHAP versions may return a list.
    if isinstance(shap_output, list):

        shap_row = np.asarray(
            shap_output[0]
        ).reshape(-1)

    else:

        shap_array = np.asarray(shap_output)

        # Possible shape:
        # [samples, features, outputs]
        if shap_array.ndim == 3:

            shap_row = shap_array[0, :, -1]

        # Normal binary-output shape:
        # [samples, features]
        elif shap_array.ndim == 2:

            shap_row = shap_array[0]

        else:

            shap_row = shap_array.reshape(-1)

    return shap_row


# ============================================================
# 8. VALIDATE TRANSACTION
# ============================================================

def validate_transaction(
    transaction: pd.DataFrame
) -> pd.DataFrame:
    """
    Validate and normalize a single transaction.

    Returns:
        DataFrame containing exactly the model feature columns.
    """

    if not isinstance(transaction, pd.DataFrame):

        raise TypeError(
            "Transaction must be a pandas DataFrame."
        )

    if transaction.shape[0] != 1:

        raise ValueError(
            "Transaction DataFrame must contain exactly one row."
        )

    # Check for required columns.
    missing_columns = [
        column
        for column in FEATURE_COLUMNS
        if column not in transaction.columns
    ]

    if missing_columns:

        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    # Keep only the model's exact feature order.
    transaction = transaction[
        FEATURE_COLUMNS
    ].copy()

    # Check missing values.
    if transaction.isnull().any().any():

        raise ValueError(
            "Transaction contains missing values."
        )

    # Check numeric data.
    for column in FEATURE_COLUMNS:

        if not pd.api.types.is_numeric_dtype(
            transaction[column]
        ):

            raise TypeError(
                f"Feature '{column}' must be numeric."
            )

    return transaction


# ============================================================
# 9. SCORE ONE TRANSACTION
# ============================================================

def score_transaction(
    transaction: pd.DataFrame
) -> dict:
    """
    Score one transaction using the finalized XGBoost model.

    Returns:
        Dictionary containing:

        - fraud_probability
        - fraud_percentage
        - threshold
        - fraud_flag
        - risk_level
        - top_features
    """

    transaction = validate_transaction(transaction)

    # --------------------------------------------------------
    # Model probability
    # --------------------------------------------------------

    fraud_probability = float(
        xgb_model.predict_proba(transaction)[0, 1]
    )

    # --------------------------------------------------------
    # Risk decision
    # --------------------------------------------------------

    fraud_flag = (
        fraud_probability >= FINAL_THRESHOLD
    )

    risk_level = (
        "HIGH"
        if fraud_flag
        else "LOW"
    )

    # --------------------------------------------------------
    # Business action
    # --------------------------------------------------------
    #
    # The ML model determines whether the transaction crosses
    # the fraud-risk threshold.
    #
    # The Risk Manager then converts that risk decision into
    # an operational recommendation.
    #
    # We intentionally use REVIEW rather than automatically
    # blocking every high-risk transaction.
    # --------------------------------------------------------

    recommended_action = (
        "REVIEW"
        if fraud_flag
        else "ALLOW"
    )

    # --------------------------------------------------------
    # SHAP explanation
    # --------------------------------------------------------

    shap_row = get_shap_row(transaction)

    if len(shap_row) != len(FEATURE_COLUMNS):

        raise ValueError(
            "SHAP feature mismatch: "
            f"received {len(shap_row)} values for "
            f"{len(FEATURE_COLUMNS)} features."
        )

    shap_table = pd.DataFrame(
        {
            "feature": FEATURE_COLUMNS,
            "feature_value": transaction.iloc[0].values,
            "shap_value": shap_row,
        }
    )

    shap_table["abs_shap"] = (
        shap_table["shap_value"].abs()
    )

    # Sort strongest contributors first.
    shap_table = (
        shap_table
        .sort_values(
            "abs_shap",
            ascending=False
        )
        .reset_index(drop=True)
    )

    # --------------------------------------------------------
    # Top 5 factors
    # --------------------------------------------------------

    top_features = shap_table.head(5).copy()

    # Add human-readable direction.
    top_features["direction"] = np.where(
        top_features["shap_value"] > 0,
        "toward fraud",
        "away from fraud"
    )

    # --------------------------------------------------------
    # Return JSON-friendly result
    # --------------------------------------------------------

    top_feature_records = []

    for _, row in top_features.iterrows():

        top_feature_records.append(
            {
                "feature": str(row["feature"]),
                "feature_value": float(
                    row["feature_value"]
                ),
                "shap_value": float(
                    row["shap_value"]
                ),
                "direction": str(
                    row["direction"]
                ),
            }
        )

    return {
        "fraud_probability": fraud_probability,
        "fraud_percentage": fraud_probability * 100,
        "threshold": FINAL_THRESHOLD,
        "fraud_flag": bool(fraud_flag),
        "risk_level": risk_level,
        "recommended_action": recommended_action,
        "top_features": top_feature_records,
    }


# ============================================================
# 10. DISPLAY FUNCTION
# ============================================================

def display_risk_result(result: dict) -> None:
    """
    Print a readable risk assessment.
    """

    print("=" * 60)
    print("AI RISK MANAGER — FRAUD RISK ASSESSMENT")
    print("=" * 60)

    print(
        f"Fraud Probability : "
        f"{result['fraud_percentage']:.2f}%"
    )

    print(
        f"Decision Threshold: "
        f"{result['threshold']:.2f}"
    )

    print(
        f"Risk Level        : "
        f"{result['risk_level']}"
    )

    print(
        f"Fraud Flag        : "
        f"{result['fraud_flag']}"
    )
    print(
        f"Recommended Action: "
        f"{result['recommended_action']}"
    )

    print()
    print("Top Contributing Features:")

    for item in result["top_features"]:

        print(
            f"- {item['feature']}: "
            f"{item['direction']} "
            f"(SHAP={item['shap_value']:.4f})"
        )


# ============================================================
# 11. STARTUP INFORMATION
# ============================================================

print("=" * 60)
print("AI RISK MANAGER — RISK ENGINE")
print("=" * 60)

print("Model loaded successfully.")
print(f"Model path       : {MODEL_PATH}")

print("Risk config loaded successfully.")
print(f"Config path      : {CONFIG_PATH}")

print(f"Model             : {final_config['model']}")
print(f"Threshold         : {FINAL_THRESHOLD:.2f}")
print(
    f"False positive cost: ₹{COST_FALSE_POSITIVE:.0f}"
)
print(
    f"False negative cost: ₹{COST_FALSE_NEGATIVE:.0f}"
)

print("SHAP explainer created successfully.")
print("=" * 60)


# ============================================================
# 12. LOCAL TEST
# ============================================================
#
# This section runs ONLY when:
#
#     python risk_engine.py
#
# It is NOT executed when another application imports
# score_transaction().
# ============================================================

if __name__ == "__main__":

    print()
    print("=" * 60)
    print("RUNNING LOCAL RISK ENGINE TEST")
    print("=" * 60)

    # --------------------------------------------------------
    # Load dataset ONLY for testing.
    # The runtime risk engine itself does not require
    # the training dataset.
    # --------------------------------------------------------

    DATA_PATH = PROJECT_ROOT / "data" / "creditcard.csv"

    if not DATA_PATH.exists():

        raise FileNotFoundError(
            f"Dataset not found for local test:\n{DATA_PATH}"
        )

    df = pd.read_csv(DATA_PATH)

    # --------------------------------------------------------
    # Test 1 — legitimate transaction
    # --------------------------------------------------------

    legitimate_transaction = (
        df[df["Class"] == 0]
        .drop(columns=["Class"])
        .iloc[[0]]
    )

    legitimate_result = score_transaction(
        legitimate_transaction
    )

    print()
    print("TEST 1 — LEGITIMATE TRANSACTION")
    display_risk_result(
        legitimate_result
    )

    # --------------------------------------------------------
    # Test 2 — fraudulent transaction
    # --------------------------------------------------------

    fraudulent_transaction = (
        df[df["Class"] == 1]
        .drop(columns=["Class"])
        .iloc[[0]]
    )

    fraudulent_result = score_transaction(
        fraudulent_transaction
    )

    print()
    print("TEST 2 — FRAUDULENT TRANSACTION")
    display_risk_result(
        fraudulent_result
    )

    # --------------------------------------------------------
    # Final success message
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("RISK ENGINE TEST COMPLETED")
    print("=" * 60)