from pathlib import Path

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split


# ============================================================
# CREATE A HELD-OUT DIAGNOSTIC CSV
# ============================================================
#
# IMPORTANT:
# This recreates the EXACT 60/20/20 split used in the
# project's final model-evaluation notebook:
#
#   20% final held-out test
#   remaining 80% -> 60% train + 20% validation
#
# It then selects examples from all four confusion-matrix
# categories:
#
#   True Negative  (TN)
#   False Positive (FP)
#   False Negative (FN)
#   True Positive  (TP)
#
# This file is for END-TO-END APPLICATION TESTING.
# It must NOT replace the official held-out metrics.
# ============================================================


# ------------------------------------------------------------
# PROJECT PATHS
# ------------------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent

DATA_PATH = PROJECT_ROOT / "data" / "creditcard.csv"

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "final_xgb_model.pkl"
)

OUTPUT_PATH = (
    PROJECT_ROOT
    / "data"
    / "heldout_diagnostic_demo.csv"
)


# ------------------------------------------------------------
# MODEL SETTINGS
# ------------------------------------------------------------

THRESHOLD = 0.03

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


# ------------------------------------------------------------
# CHECK FILES
# ------------------------------------------------------------

if not DATA_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found:\n{DATA_PATH}"
    )

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model not found:\n{MODEL_PATH}\n\n"
        "Expected: models/final_xgb_model.pkl"
    )


# ------------------------------------------------------------
# LOAD DATA + MODEL
# ------------------------------------------------------------

print("=" * 70)
print("CREATING HELD-OUT DIAGNOSTIC CSV")
print("=" * 70)

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")

print("\nLoading final XGBoost model...")

model = joblib.load(MODEL_PATH)


# ------------------------------------------------------------
# PREPARE X / y
# ------------------------------------------------------------

missing_columns = [
    column
    for column in FEATURE_COLUMNS + ["Class"]
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing required dataset columns: {missing_columns}"
    )

X = df[FEATURE_COLUMNS].copy()
y = df["Class"].astype(int)


# ------------------------------------------------------------
# RECREATE THE EXACT PROJECT SPLIT
# ------------------------------------------------------------

# 20% final held-out test
X_dev, X_test, y_dev, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    stratify=y,
    random_state=42,
)

# Remaining 80% -> 60% train + 20% validation
X_train, X_val, y_train, y_val = train_test_split(
    X_dev,
    y_dev,
    test_size=0.25,
    stratify=y_dev,
    random_state=42,
)


print("\nExact project split recreated:")

print(f"Train:      {len(X_train):,}")
print(f"Validation: {len(X_val):,}")
print(f"Test:       {len(X_test):,}")


# ------------------------------------------------------------
# PREDICT ON HELD-OUT TEST ONLY
# ------------------------------------------------------------

probabilities = model.predict_proba(
    X_test
)[:, 1]

predicted = (
    probabilities >= THRESHOLD
).astype(int)


# ------------------------------------------------------------
# IDENTIFY CONFUSION-MATRIX GROUPS
# ------------------------------------------------------------

actual = y_test.to_numpy()

tn_mask = (
    (actual == 0) &
    (predicted == 0)
)

fp_mask = (
    (actual == 0) &
    (predicted == 1)
)

fn_mask = (
    (actual == 1) &
    (predicted == 0)
)

tp_mask = (
    (actual == 1) &
    (predicted == 1)
)


tn = X_test.loc[tn_mask].copy()
fp = X_test.loc[fp_mask].copy()
fn = X_test.loc[fn_mask].copy()
tp = X_test.loc[tp_mask].copy()


print("\nHeld-out confusion groups:")

print(f"TN: {len(tn)}")
print(f"FP: {len(fp)}")
print(f"FN: {len(fn)}")
print(f"TP: {len(tp)}")


# ------------------------------------------------------------
# SELECT DIAGNOSTIC EXAMPLES
# ------------------------------------------------------------
#
# We intentionally include all four categories.
# This file is NOT intended to estimate population metrics.
# It is intended to prove that the application can display:
#
#   ALLOW + correct
#   REVIEW + correct
#   ALLOW + missed fraud
#   REVIEW + false alarm
#
# ------------------------------------------------------------

N_PER_GROUP = 10

selected_parts = []

group_definitions = [
    ("TN", tn),
    ("FP", fp),
    ("FN", fn),
    ("TP", tp),
]

for group_name, group_df in group_definitions:

    if len(group_df) < N_PER_GROUP:
        raise RuntimeError(
            f"Not enough {group_name} examples in the "
            f"held-out test set. Found {len(group_df)}, "
            f"need {N_PER_GROUP}."
        )

    sample = group_df.sample(
        n=N_PER_GROUP,
        random_state=42,
    ).copy()

    sample["_DiagnosticGroup"] = group_name

    selected_parts.append(sample)


diagnostic_df = pd.concat(
    selected_parts,
    ignore_index=True,
)


# ------------------------------------------------------------
# ADD GROUND TRUTH LABEL
# ------------------------------------------------------------

diagnostic_df["Class"] = [
    0 if group in {"TN", "FP"} else 1
    for group in diagnostic_df["_DiagnosticGroup"]
]


# ------------------------------------------------------------
# SHUFFLE ROWS
# ------------------------------------------------------------

diagnostic_df = diagnostic_df.sample(
    frac=1,
    random_state=42,
).reset_index(drop=True)


# ------------------------------------------------------------
# SAVE EXACT INPUT + CLASS
# ------------------------------------------------------------

output_columns = (
    FEATURE_COLUMNS
    + ["Class"]
)

diagnostic_df[
    output_columns
].to_csv(
    OUTPUT_PATH,
    index=False,
)


# ------------------------------------------------------------
# VERIFY
# ------------------------------------------------------------

print("\nCreated:")
print(OUTPUT_PATH)

print("\nShape:")
print(diagnostic_df.shape)

print("\nClass distribution:")
print(
    diagnostic_df["Class"]
    .value_counts()
    .sort_index()
)

print("\nDiagnostic composition:")

# Recalculate expected diagnostic group counts
diag_predictions = model.predict_proba(
    diagnostic_df[FEATURE_COLUMNS]
)[:, 1]

diag_predicted = (
    diag_predictions >= THRESHOLD
).astype(int)

diag_actual = (
    diagnostic_df["Class"]
    .astype(int)
    .to_numpy()
)

diag_tp = int(
    ((diag_predicted == 1) & (diag_actual == 1)).sum()
)

diag_tn = int(
    ((diag_predicted == 0) & (diag_actual == 0)).sum()
)

diag_fp = int(
    ((diag_predicted == 1) & (diag_actual == 0)).sum()
)

diag_fn = int(
    ((diag_predicted == 0) & (diag_actual == 1)).sum()
)

print(f"TN = {diag_tn}")
print(f"FP = {diag_fp}")
print(f"FN = {diag_fn}")
print(f"TP = {diag_tp}")

print("\nNOTE:")
print(
    "This is a diagnostic integration file made from the "
    "exact held-out test split. Do NOT use its metrics as "
    "the official model-performance numbers."
)

print("\nDone.")
