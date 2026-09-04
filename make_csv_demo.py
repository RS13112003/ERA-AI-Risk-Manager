from pathlib import Path
import pandas as pd


# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent

DATA_PATH = PROJECT_ROOT / "data" / "creditcard.csv"

OUTPUT_PATH = (
    PROJECT_ROOT
    / "data"
    / "csv_evaluation_demo.csv"
)


# ============================================================
# LOAD ORIGINAL DATASET
# ============================================================

print("=" * 60)
print("CREATING CSV EVALUATION DEMO")
print("=" * 60)

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")


# ============================================================
# CHECK REQUIRED COLUMNS
# ============================================================

required_columns = [
    "Time",
    *[f"V{i}" for i in range(1, 29)],
    "Amount",
    "Class",
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing required columns: {missing_columns}"
    )


# ============================================================
# SPLIT BY GROUND TRUTH
# ============================================================

legitimate = df[
    df["Class"] == 0
]

fraudulent = df[
    df["Class"] == 1
]


print(f"Legitimate available: {len(legitimate)}")
print(f"Fraudulent available: {len(fraudulent)}")


# ============================================================
# SAMPLE TRANSACTIONS
# ============================================================

legit_sample = legitimate.sample(
    n=10,
    random_state=42,
)

fraud_sample = fraudulent.sample(
    n=10,
    random_state=42,
)


# ============================================================
# COMBINE + SHUFFLE
# ============================================================

demo_df = pd.concat(
    [
        legit_sample,
        fraud_sample,
    ],
    ignore_index=True,
)


demo_df = demo_df.sample(
    frac=1,
    random_state=42,
).reset_index(drop=True)


# ============================================================
# KEEP EXACT DATASET COLUMN ORDER
# ============================================================

demo_df = demo_df[
    required_columns
]


# ============================================================
# SAVE
# ============================================================

demo_df.to_csv(
    OUTPUT_PATH,
    index=False,
)


# ============================================================
# SUMMARY
# ============================================================

print("\nCreated:")
print(OUTPUT_PATH)

print("\nShape:")
print(demo_df.shape)

print("\nClass distribution:")
print(demo_df["Class"].value_counts())

print("\nExpected:")
print("10 legitimate (Class 0)")
print("10 fraudulent (Class 1)")

print("\nCSV creation completed.")