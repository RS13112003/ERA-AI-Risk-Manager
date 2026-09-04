# ============================================================
# AI RISK MANAGER — API END-TO-END TEST
# ============================================================

from pathlib import Path
import json

import pandas as pd
import requests


# ============================================================
# 1. PROJECT PATH
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATA_PATH = PROJECT_ROOT / "data" / "creditcard.csv"

API_URL = "http://127.0.0.1:8000/api/assess-risk"


# ============================================================
# 2. LOAD DATASET
# ============================================================

print("=" * 60)
print("AI RISK MANAGER — API TEST")
print("=" * 60)

print()
print("Loading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded: {df.shape}")


# ============================================================
# 3. GET ONE LEGITIMATE TRANSACTION
# ============================================================

legitimate = (
    df[df["Class"] == 0]
    .drop(columns=["Class"])
    .iloc[0]
)


# ============================================================
# 4. GET ONE FRAUDULENT TRANSACTION
# ============================================================

fraudulent = (
    df[df["Class"] == 1]
    .drop(columns=["Class"])
    .iloc[0]
)


# ============================================================
# 5. CONVERT TO JSON-SAFE DICTIONARIES
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
# 6. FUNCTION TO TEST ONE TRANSACTION
# ============================================================

def test_transaction(name, payload):

    print()
    print("=" * 60)
    print(name)
    print("=" * 60)

    response = requests.post(
        API_URL,
        json=payload,
        timeout=60,
    )

    print(f"HTTP Status: {response.status_code}")

    if response.status_code != 200:

        print("API ERROR:")
        print(response.text)
        return

    result = response.json()

    print()
    print(json.dumps(
        result,
        indent=2
    ))


# ============================================================
# 7. TEST LEGITIMATE TRANSACTION
# ============================================================

test_transaction(
    "TEST 1 — LEGITIMATE TRANSACTION",
    legitimate_payload,
)


# ============================================================
# 8. TEST FRAUDULENT TRANSACTION
# ============================================================

test_transaction(
    "TEST 2 — FRAUDULENT TRANSACTION",
    fraudulent_payload,
)


# ============================================================
# 9. COMPLETE
# ============================================================

print()
print("=" * 60)
print("API END-TO-END TEST COMPLETED")
print("=" * 60)