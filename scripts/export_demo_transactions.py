from pathlib import Path
import json

import pandas as pd


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATA_PATH = PROJECT_ROOT / "data" / "creditcard.csv"
OUTPUT_PATH = (
    PROJECT_ROOT
    / "frontend"
    / "public"
    / "demo-transactions.json"
)


# ============================================================
# LOAD DATASET
# ============================================================

print("=" * 60)
print("AI RISK MANAGER — EXPORT DEMO TRANSACTIONS")
print("=" * 60)

print()
print("Loading dataset...")

if not DATA_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found:\n{DATA_PATH}"
    )

df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded: {df.shape}")


# ============================================================
# SELECT REAL TRANSACTIONS
# ============================================================

legitimate = (
    df[df["Class"] == 0]
    .drop(columns=["Class"])
    .iloc[0]
)

fraudulent = (
    df[df["Class"] == 1]
    .drop(columns=["Class"])
    .iloc[0]
)


# ============================================================
# CONVERT TO JSON-SAFE DICTIONARIES
# ============================================================

legitimate_payload = {
    column: float(legitimate[column])
    for column in legitimate.index
}

fraudulent_payload = {
    column: float(fraudulent[column])
    for column in fraudulent.index
}


# ============================================================
# CREATE DEMO DATA
# ============================================================

demo_transactions = {
    "legitimate": legitimate_payload,
    "fraudulent": fraudulent_payload,
}


# ============================================================
# SAVE JSON
# ============================================================

OUTPUT_PATH.parent.mkdir(
    parents=True,
    exist_ok=True
)

with open(
    OUTPUT_PATH,
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        demo_transactions,
        file,
        indent=2
    )


# ============================================================
# COMPLETE
# ============================================================

print()
print(f"Demo transactions saved to:")
print(OUTPUT_PATH)

print()
print("Available demo transactions:")
print("- legitimate")
print("- fraudulent")

print()
print("=" * 60)
print("EXPORT COMPLETED")
print("=" * 60)