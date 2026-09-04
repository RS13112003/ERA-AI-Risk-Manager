# Track 02: AI Risk Manager — Full Build Guide (A to Z)

**Project: Fraud-Spike Detector**
**Timeline: 1 weekend (~14-16 focused hours)**

---

## Phase 0 — Setup (30 min)

1. **Create the repo first, not last.**
   ```bash
   mkdir fraud-risk-detector && cd fraud-risk-detector
   git init
   python -m venv venv
   source venv/bin/activate   # or venv\Scripts\activate on Windows
   pip install pandas numpy scikit-learn xgboost imbalanced-learn shap matplotlib seaborn jupyter streamlit
   pip freeze > requirements.txt
   ```
   Push an empty commit with a `README.md` stub and `.gitignore` (ignore `venv/`, `*.csv` if large, `__pycache__/`). Make the repo **public** now — you need the URL for the form anyway.

2. **Folder structure:**
   ```
   fraud-risk-detector/
   ├── data/                  # raw + processed data (gitignore the raw CSV if >50MB)
   ├── notebooks/
   │   └── 01_eda.ipynb
   │   └── 02_modeling.ipynb
   ├── src/
   │   ├── preprocess.py
   │   ├── train.py
   │   └── evaluate.py
   ├── app/
   │   └── streamlit_app.py
   ├── models/
   │   └── model.pkl
   ├── README.md
   └── requirements.txt
   ```

---

## Phase 1 — Data (30-45 min)

1. Download the **Kaggle Credit Card Fraud Detection dataset** (search "Kaggle credit card fraud detection ULB"). 284,807 transactions, 492 fraud (0.17%) — realistic imbalance, PCA-anonymized features (V1-V28) + `Time`, `Amount`, `Class`.
2. Put it in `data/`. Load it, check shape, check class balance:
   ```python
   import pandas as pd
   df = pd.read_csv("data/creditcard.csv")
   print(df.shape)
   print(df["Class"].value_counts(normalize=True))
   ```
3. **Do this even if it feels obvious** — screenshot the class imbalance. You'll use it later to justify why accuracy is the wrong metric (this is a favorite thing for technical judges to probe).

---

## Phase 2 — EDA (1 hour)

In `notebooks/01_eda.ipynb`:
- Distribution of `Amount` and `Time` split by fraud vs. non-fraud
- Correlation heatmap of V1-V28 with `Class`
- Check for duplicates, nulls (there usually aren't many, but say you checked)

Keep this short — EDA isn't the differentiator here, don't over-invest.

---

## Phase 3 — Preprocessing (1 hour)

`src/preprocess.py`:
1. **Train/test split FIRST, before any resampling** — resampling before splitting leaks information into your test set and inflates your metrics. This is the #1 mistake judges will check for.
   ```python
   from sklearn.model_selection import train_test_split
   X = df.drop("Class", axis=1)
   y = df["Class"]
   X_train, X_test, y_train, y_test = train_test_split(
       X, y, test_size=0.2, stratify=y, random_state=42
   )
   ```
2. Scale `Amount` and `Time` (V1-V28 are already PCA-scaled):
   ```python
   from sklearn.preprocessing import StandardScaler
   scaler = StandardScaler()
   X_train[["Amount","Time"]] = scaler.fit_transform(X_train[["Amount","Time"]])
   X_test[["Amount","Time"]] = scaler.transform(X_test[["Amount","Time"]])
   ```
3. Handle imbalance **on the training set only**, using SMOTE or class weighting:
   ```python
   from imblearn.over_sampling import SMOTE
   sm = SMOTE(random_state=42)
   X_train_res, y_train_res = sm.fit_resample(X_train, y_train)
   ```
   Alternative (often better for this dataset): skip SMOTE, just use `class_weight="balanced"` or XGBoost's `scale_pos_weight`. Try both, report which won — that comparison itself is a good talking point.

---

## Phase 4 — Modeling (2-3 hours)

Train **at least 2 models** so you have a comparison to show:

1. **Baseline: Logistic Regression** (fast, interpretable, sets a floor)
   ```python
   from sklearn.linear_model import LogisticRegression
   lr = LogisticRegression(class_weight="balanced", max_iter=1000)
   lr.fit(X_train, y_train)
   ```
2. **Main model: XGBoost or Random Forest**
   ```python
   from xgboost import XGBClassifier
   xgb = XGBClassifier(scale_pos_weight=len(y_train[y_train==0])/len(y_train[y_train==1]))
   xgb.fit(X_train, y_train)
   ```
3. Save the winning model: `pickle.dump(xgb, open("models/model.pkl","wb"))`

---

## Phase 5 — Evaluation (2 hours) — this is where you win or lose

This phase is the actual bar the track sets ("honest metrics including false-positive cost"). Don't rush it.

1. **Use Precision-Recall curve, not ROC.** With 0.17% fraud rate, ROC-AUC looks great even for a mediocre model — it's misleading on imbalanced data. PR-AUC is the honest metric here. Plot both, but lead with PR.
   ```python
   from sklearn.metrics import precision_recall_curve, average_precision_score
   ```
2. **Report standard metrics on the held-out test set** (never on training data): precision, recall, F1, confusion matrix, PR-AUC.
3. **Cost-weighted evaluation — your differentiator.** Assign real costs:
   - False positive (legit transaction flagged): cost of manual review + customer friction, e.g. ₹50-200
   - False negative (fraud missed): average fraud loss, e.g. ₹5,000+
   
   Compute total cost at different classification thresholds, not just the default 0.5, and pick the threshold that minimizes total cost. Plot cost vs. threshold. This single chart demonstrates the "honest metrics" bar better than any accuracy number — most weekend submissions won't do this.
4. **Explainability.** Use SHAP to show top features driving a flagged transaction:
   ```python
   import shap
   explainer = shap.TreeExplainer(xgb)
   shap_values = explainer.shap_values(X_test.iloc[:5])
   shap.summary_plot(shap_values, X_test.iloc[:5])
   ```
   You don't need deep interpretation of V1-V28 (they're anonymized) — just show the mechanism works. If you switch to a synthetic dataset with named features later, this becomes much more compelling.

---

## Phase 6 — Wrap it as something that runs (2 hours)

A notebook alone reads as incomplete. Build a minimal `app/streamlit_app.py`:
- Upload a CSV of transactions (or use a sample)
- Output: flagged transactions with fraud probability + top 3 contributing features
- One toggle: adjust the threshold, watch precision/recall trade off live — this turns your cost analysis into something interactive and instantly graspable in a 5-min video

```python
import streamlit as st
import pandas as pd, pickle
model = pickle.load(open("models/model.pkl","rb"))
st.title("Fraud Risk Detector")
threshold = st.slider("Flagging threshold", 0.0, 1.0, 0.5)
uploaded = st.file_uploader("Upload transactions CSV")
if uploaded:
    df = pd.read_csv(uploaded)
    probs = model.predict_proba(df)[:,1]
    df["fraud_probability"] = probs
    df["flagged"] = probs > threshold
    st.dataframe(df[df["flagged"]].sort_values("fraud_probability", ascending=False))
```
Run locally with `streamlit run app/streamlit_app.py`, confirm it works end to end before recording your video.

---

## Phase 7 — The "one failure handled gracefully" story

Every track explicitly wants this. Pick one real example from your own testing:
- A borderline transaction your model got wrong (false positive or false negative) — show it, explain why (e.g. "unusually large but legitimate purchase, flagged because Amount was the dominant feature")
- What you'd change: add a customer history feature, adjust threshold for that segment, add a manual-review queue instead of auto-block
- This shows judgment, not just a working pipeline — it's the difference between "ran a notebook" and "understands the problem"

---

## Phase 8 — README (30 min)

Structure:
1. **What it does** (2-3 sentences)
2. **Why this approach** (imbalance handling, model choice, threshold selection)
3. **Results table**: precision, recall, F1, PR-AUC, cost-optimal threshold, total cost saved vs. default threshold
4. **How to run it** (exact commands)
5. **The failure case** (from Phase 7)
6. **What's next / limitations** (be honest — e.g. "trained on anonymized card data, would need real merchant transaction schema to generalize")

Honesty about limitations reads as more credible than overclaiming, given the track explicitly says "honest metrics."

---

## Phase 9 — 5-minute pitch video

Structure (roughly):
- 0:00-0:30 — the problem in one sentence, why it matters
- 0:30-2:00 — live demo of the Streamlit app: upload data, show flagged transactions, move the threshold slider
- 2:00-3:30 — the metrics: PR curve, cost-weighted chart, why you chose these over accuracy/ROC
- 3:30-4:30 — the failure case and what you learned
- 4:30-5:00 — what you'd build next with more time

Record with OBS or even your phone screen-recording + Loom. Unlisted YouTube link is fine per the form.

---

## Phase 10 — Application form (15 min)

Have ready before you open the form:
- GitHub repo URL (public, pushed, README done)
- Pitch video link
- One clear paragraph: "what it solves"
- One clear paragraph: "what broke, and how you got out" (use your Phase 7 story)

---

## Quick sanity checklist before you submit

- [ ] Split before resampling (no data leakage)
- [ ] Metrics reported on test set only
- [ ] PR curve shown, not just ROC
- [ ] Cost-weighted analysis included
- [ ] At least one explainability element (SHAP or feature importance)
- [ ] App/interface runs end-to-end, not just a notebook
- [ ] One honest failure case documented
- [ ] Repo is public and README is complete
- [ ] "Strictly defense-only" — nothing in your repo could double as an offense/evasion tool
