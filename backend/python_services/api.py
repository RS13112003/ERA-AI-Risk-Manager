# ============================================================
# AI RISK MANAGER — FASTAPI BACKEND
# ============================================================
#
# This file provides:
#   1. API health checks
#   2. Demo legitimate transaction
#   3. Demo fraudulent transaction
#   4. Single transaction risk assessment
#   5. Batch transaction / CSV risk assessment
#
# IMPORTANT:
# - The trained XGBoost model is NOT retrained here.
# - The frozen risk threshold remains whatever is loaded
#   from risk_engine.py (currently 0.03).
# - The existing single-transaction risk engine is reused.
# ============================================================

import pandas as pd

from fastapi import FastAPI, HTTPException  # pyright: ignore[reportMissingImports]
from fastapi.middleware.cors import CORSMiddleware  # pyright: ignore[reportMissingImports]
from pydantic import BaseModel
from typing import Dict, List

from .risk_engine import (
    FEATURE_COLUMNS,
    FINAL_THRESHOLD,
    PROJECT_ROOT,
    score_transaction,
    xgb_model,
)


# ============================================================
# 1. CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI Risk Manager",
    description="Fraud detection and risk assessment API",
    version="1.0.0",
)


# ============================================================
# 2. CORS CONFIGURATION
# ============================================================
#
# The React/Vite frontend normally runs on port 5173.
# These origins allow the browser to call the FastAPI backend.
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 3. DEMO DATA
# ============================================================

_DEMO_DATA_PATH = PROJECT_ROOT / "data" / "tranning" /"creditcard.csv"
# In my local machine there is creditcard.csv under tranning subfolder, its not possible to upload the csv file due to size limit 

try:
    _demo_df = pd.read_csv(_DEMO_DATA_PATH)
except Exception as error:
    raise RuntimeError(
        f"Unable to load demo dataset:\n"
        f"{_DEMO_DATA_PATH}\n\n"
        f"Original error: {error}"
    ) from error


# ============================================================
# 4. REQUEST SCHEMAS
# ============================================================

class TransactionRequest(BaseModel):
    """
    One transaction containing exactly the 30 model features.

    The model feature schema is:

        Time
        V1 ... V28
        Amount
    """

    Time: float

    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float

    Amount: float


class BatchTransactionRequest(BaseModel):
    """
    Multiple transactions for batch assessment.

    Each dictionary must contain the exact 30 model features.

    An optional 'Class' field is allowed when the uploaded
    dataset contains ground-truth labels. 'Class' is NEVER
    sent to the XGBoost model.
    """

    transactions: List[Dict[str, float]]


# ============================================================
# 5. HELPER — CONVERT REQUEST TO DATAFRAME
# ============================================================

def transaction_request_to_dataframe(
    transaction: TransactionRequest,
) -> pd.DataFrame:
    """
    Convert the Pydantic transaction request into a one-row
    DataFrame using the exact model feature order.
    """

    transaction_data = transaction.model_dump()

    return pd.DataFrame(
        [transaction_data],
        columns=FEATURE_COLUMNS,
    )


# ============================================================
# 6. ROOT / HEALTH ENDPOINTS
# ============================================================

@app.get("/")
def root():
    """
    Basic service information.
    """

    return {
        "service": "AI Risk Manager",
        "status": "running",
        "purpose": "Fraud risk detection",
        "model": "XGBoost",
        "threshold": FINAL_THRESHOLD,
    }


@app.get("/health")
def health():
    """
    Backend health check.
    """

    return {
        "status": "healthy",
        "model": "XGBoost",
        "risk_engine": "ready",
        "threshold": FINAL_THRESHOLD,
    }


# ============================================================
# 7. DEMO TRANSACTION — LEGITIMATE
# ============================================================

@app.get("/api/demo/legitimate")
def demo_legitimate():
    """
    Load the first legitimate transaction from creditcard.csv
    and run it through the existing risk engine.
    """

    try:
        legitimate_rows = _demo_df[
            _demo_df["Class"] == 0
        ]

        if legitimate_rows.empty:
            raise HTTPException(
                status_code=404,
                detail="No legitimate transaction found in dataset.",
            )

        row = (
            legitimate_rows
            .drop(columns=["Class"])
            .iloc[[0]]
        )

        result = score_transaction(row)

        return {
            "success": True,
            "result": result,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load legitimate demo transaction: {error}",
        )


# ============================================================
# 8. DEMO TRANSACTION — FRAUDULENT
# ============================================================

@app.get("/api/demo/fraudulent")
def demo_fraudulent():
    """
    Load the first fraudulent transaction from creditcard.csv
    and run it through the existing risk engine.
    """

    try:
        fraudulent_rows = _demo_df[
            _demo_df["Class"] == 1
        ]

        if fraudulent_rows.empty:
            raise HTTPException(
                status_code=404,
                detail="No fraudulent transaction found in dataset.",
            )

        row = (
            fraudulent_rows
            .drop(columns=["Class"])
            .iloc[[0]]
        )

        result = score_transaction(row)

        return {
            "success": True,
            "result": result,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load fraudulent demo transaction: {error}",
        )


# ============================================================
# 9. SINGLE TRANSACTION RISK ASSESSMENT
# ============================================================

@app.post("/api/assess-risk")
def assess_risk(
    transaction: TransactionRequest,
):
    """
    Assess exactly one transaction.

    Flow:

        React
          ↓
        POST /api/assess-risk
          ↓
        DataFrame
          ↓
        score_transaction()
          ↓
        XGBoost + SHAP
          ↓
        JSON result
    """

    try:
        transaction_df = transaction_request_to_dataframe(
            transaction
        )

        result = score_transaction(
            transaction_df
        )

        return {
            "success": True,
            "result": result,
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


# ============================================================
# 10. BATCH RISK ASSESSMENT
# ============================================================
#
# This endpoint is intended for the CSV upload feature.
#
# IMPORTANT:
# We intentionally do NOT calculate SHAP for every row here.
#
# Batch prediction should be fast. If the user wants an
# explanation for a particular high-risk transaction, the
# frontend can send that selected transaction to the existing
# /api/assess-risk endpoint, which already produces SHAP.
# ============================================================

@app.post("/api/assess-batch")
def assess_batch(
    request: BatchTransactionRequest,
):
    """
    Assess multiple transactions in one API request.

    Required:
        Time, V1...V28, Amount

    Optional:
        Class

    'Class' is treated as ground truth only and is never
    passed into the model.
    """

    try:

        # ----------------------------------------------------
        # BASIC VALIDATION
        # ----------------------------------------------------

        transactions = request.transactions

        if not transactions:
            raise HTTPException(
                status_code=400,
                detail="No transactions were provided.",
            )


        # ----------------------------------------------------
        # SAFETY LIMIT
        # ----------------------------------------------------
        #
        # 500 rows is enough for the current buildathon demo.
        # We can later optimize large-file processing separately.
        # ----------------------------------------------------

        MAX_BATCH_SIZE = 500

        if len(transactions) > MAX_BATCH_SIZE:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Maximum {MAX_BATCH_SIZE} transactions "
                    "can be assessed at once."
                ),
            )


        # ----------------------------------------------------
        # CONVERT JSON TO DATAFRAME
        # ----------------------------------------------------

        df = pd.DataFrame(
            transactions
        )

        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="The transaction data is empty.",
            )


        # ----------------------------------------------------
        # CHECK REQUIRED MODEL FEATURES
        # ----------------------------------------------------

        missing_columns = [
            column
            for column in FEATURE_COLUMNS
            if column not in df.columns
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Missing required model features.",
                    "missing_columns": missing_columns,
                },
            )


        # ----------------------------------------------------
        # CHECK UNEXPECTED COLUMNS
        # ----------------------------------------------------
        #
        # 'Class' is the only extra column we allow.
        # ----------------------------------------------------

        allowed_columns = set(
            FEATURE_COLUMNS + ["Class"]
        )

        unexpected_columns = [
            column
            for column in df.columns
            if column not in allowed_columns
        ]

        if unexpected_columns:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Unexpected columns detected.",
                    "unexpected_columns": unexpected_columns,
                },
            )


        # ----------------------------------------------------
        # KEEP EXACT MODEL FEATURE ORDER
        # ----------------------------------------------------

        model_df = df[
            FEATURE_COLUMNS
        ].copy()


        # ----------------------------------------------------
        # CONVERT MODEL FEATURES TO NUMERIC
        # ----------------------------------------------------

        for column in FEATURE_COLUMNS:
            model_df[column] = pd.to_numeric(
                model_df[column],
                errors="coerce",
            )


        # ----------------------------------------------------
        # CHECK MISSING / INVALID VALUES
        # ----------------------------------------------------

        if model_df.isnull().any().any():

            invalid_columns = [
                column
                for column in FEATURE_COLUMNS
                if model_df[column].isnull().any()
            ]

            raise HTTPException(
                status_code=400,
                detail={
                    "message": (
                        "CSV contains missing or non-numeric "
                        "feature values."
                    ),
                    "invalid_columns": invalid_columns,
                },
            )


        # ====================================================
        # OPTIONAL CLASS VALIDATION
        # ====================================================

        actual_values = None

        if "Class" in df.columns:

            actual = pd.to_numeric(
                df["Class"],
                errors="coerce",
            )

            if actual.isnull().any():
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Class column must contain numeric "
                        "0/1 values."
                    ),
                )

            # Reject fractional labels such as 0.5.
            if not (
                actual.astype(float)
                .eq(actual.astype(int))
                .all()
            ):
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Class column must contain only "
                        "integer 0/1 values."
                    ),
                )

            actual_values = (
                actual.astype(int).values
            )

            unique_labels = set(
                actual_values.tolist()
            )

            if not unique_labels.issubset({0, 1}):
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Class column must contain only "
                        "0 and 1."
                    ),
                )


        # ====================================================
        # MODEL PREDICTION
        # ====================================================

        probabilities = (
            xgb_model
            .predict_proba(model_df)[:, 1]
        )


        # ====================================================
        # APPLY FROZEN RISK THRESHOLD
        # ====================================================

        fraud_flags = (
            probabilities >= FINAL_THRESHOLD
        )

        predicted_values = (
            fraud_flags.astype(int)
        )


        # ====================================================
        # BUILD ROW-LEVEL RESULTS
        # ====================================================

        results = []

        for index, probability in enumerate(
            probabilities
        ):

            fraud_flag = bool(
                fraud_flags[index]
            )

            risk_level = (
                "HIGH"
                if fraud_flag
                else "LOW"
            )

            recommended_action = (
                "REVIEW"
                if fraud_flag
                else "ALLOW"
            )

            result = {
                "row_number": index + 1,

                "fraud_probability": float(
                    probability
                ),

                "fraud_percentage": float(
                    probability * 100
                ),

                "threshold": float(
                    FINAL_THRESHOLD
                ),

                "fraud_flag": fraud_flag,

                "risk_level": risk_level,

                "recommended_action":
                    recommended_action,

                "amount": float(
                    model_df.iloc[index]["Amount"]
                ),
            }

            if actual_values is not None:
                result["actual_class"] = int(
                    actual_values[index]
                )

            results.append(result)


        # ====================================================
        # SUMMARY
        # ====================================================

        total_transactions = len(
            results
        )

        high_risk_count = int(
            fraud_flags.sum()
        )

        low_risk_count = (
            total_transactions
            - high_risk_count
        )

        summary = {
            "total_transactions":
                total_transactions,

            "high_risk":
                high_risk_count,

            "low_risk":
                low_risk_count,

            "review_required":
                high_risk_count,

            "allow":
                low_risk_count,
        }


        # ====================================================
        # EVALUATION METRICS
        # ====================================================
        #
        # These are calculated only when the CSV contains
        # the ground-truth Class column.
        # ====================================================

        evaluation = None

        if actual_values is not None:

            true_positive = int(
                (
                    (predicted_values == 1)
                    & (actual_values == 1)
                ).sum()
            )

            true_negative = int(
                (
                    (predicted_values == 0)
                    & (actual_values == 0)
                ).sum()
            )

            false_positive = int(
                (
                    (predicted_values == 1)
                    & (actual_values == 0)
                ).sum()
            )

            false_negative = int(
                (
                    (predicted_values == 0)
                    & (actual_values == 1)
                ).sum()
            )


            # ------------------------------------------------
            # PRECISION
            # ------------------------------------------------

            precision_denominator = (
                true_positive
                + false_positive
            )

            precision = (
                true_positive
                / precision_denominator
                if precision_denominator > 0
                else 0.0
            )


            # ------------------------------------------------
            # RECALL
            # ------------------------------------------------

            recall_denominator = (
                true_positive
                + false_negative
            )

            recall = (
                true_positive
                / recall_denominator
                if recall_denominator > 0
                else 0.0
            )


            # ------------------------------------------------
            # ACCURACY
            # ------------------------------------------------

            accuracy = (
                (
                    true_positive
                    + true_negative
                )
                / total_transactions
                if total_transactions > 0
                else 0.0
            )


            evaluation = {
                "precision":
                    float(precision),

                "recall":
                    float(recall),

                "accuracy":
                    float(accuracy),

                "true_positive":
                    true_positive,

                "true_negative":
                    true_negative,

                "false_positive":
                    false_positive,

                "false_negative":
                    false_negative,
            }


        # ====================================================
        # FINAL BATCH RESPONSE
        # ====================================================

        return {
            "success": True,

            "result": {
                "summary": summary,

                "evaluation":
                    evaluation,

                "results":
                    results,
            },
        }


    except HTTPException:
        raise


    except Exception as error:

        print(
            "Batch assessment error:",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to assess the uploaded "
                f"transactions: {error}"
            ),
        )


# ============================================================
# END OF API
# ============================================================
