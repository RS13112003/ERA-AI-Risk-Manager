# AI Risk Manager — Intelligent Transaction Fraud Detection

An AI-powered fraud detection and risk analysis system that evaluates financial transactions, assigns a fraud probability, classifies transaction risk, and provides explainable insights into why a transaction was flagged.

The project combines **machine learning, risk scoring, threshold-based decision making, SHAP explainability, and a web-based dashboard** into a single end-to-end workflow.

---

##  Project Overview

Fraud detection is not only about predicting whether a transaction is fraudulent.

A practical risk management system should also answer:

* How risky is this transaction?
* Why was it flagged?
* How confident is the model?
* What factors contributed to the decision?
* How should the transaction be prioritized for investigation?

**AI Risk Manager** is designed around this complete workflow.

The system takes transaction data as input, processes it through a trained machine-learning model, calculates a fraud probability, applies a decision threshold, and presents the result through an interactive web interface.

---

##  Key Features are :-

###  Fraud Detection

Predicts the probability that a transaction is fraudulent using a trained machine-learning model.

### Risk Classification

Transactions are categorized into different risk levels based on the predicted fraud probability.

###  Threshold-Based Decision Making

A configurable decision threshold is used to determine whether a transaction should be considered high risk.

###  Explainable AI

SHAP-based explanations help identify the features that contributed most to an individual transaction's prediction.

### CSV Analysis

Supports batch analysis of transaction datasets through CSV upload.

### Transaction Investigation

Provides transaction-level information to help investigate suspicious activity.

### Interactive Dashboard

A web interface presents model predictions, risk information, and explanations in an easy-to-understand format.

###  End-to-End ML Workflow

The project connects data processing, machine learning inference, risk scoring, explainability, and visualization into one workflow.

---

##  System Architecture

The application follows an end-to-end architecture:
<p align="center">
  <img src="Architecture.png" alt="AI Risk Manager System Architecture" width="900">
</p>

---

##  Machine Learning Approach

The model is trained using transaction-level financial data containing numerical features associated with transaction behavior.

The project focuses on the complete fraud-detection lifecycle:

```text
Raw Transaction Data -> Data Preprocessing -> Feature Preparation -> Model Training ->  Evaluation -> Threshold Selection -> Model Deployment -> Risk Prediction -> Explainable Decision
```

Because fraud detection is a highly imbalanced classification problem, model evaluation should not rely only on accuracy.

The project considers metrics such as:

* Precision
* Recall
* F1-score
* PR-AUC
* ROC-AUC
* Confusion Matrix

The decision threshold is also treated as an important risk-management parameter rather than simply relying on the default classification threshold.

---

## Explainability with SHAP

A fraud prediction becomes significantly more useful when the system can explain the prediction.

The application uses **SHAP (SHapley Additive exPlanations)** to identify the contribution of individual features to a transaction's prediction.

For an investigated transaction, the system can show:

```text
Transaction
     │
Model Prediction
     │
Fraud Probability
     │
SHAP Explanation
     │
     ├── Feature A -> increased risk
     ├── Feature B -> decreased risk
     ├── Feature C -> increased risk
     └── Feature D -> increased risk
```

This makes the system more suitable for a risk-management workflow where users need both a prediction and a reason behind that prediction.

---

## Project Structure

The repository is organized to separate the application, machine-learning assets, data, and supporting files.

```text
AI-Risk-Manager/
│
data/
├── demo/
│   └── [sample/demo CSV files]
├── validation/
│   └── [validation CSV files]
├── README.md
└── training_dataset
|
│
├── models/
│   └── final_xgb_model.pkl
|   └── final_risk_config.pkl
|
│
├── backend/
│   └── <backend-files>
│
├── frontend/
│   └── <frontend-files>
│
├── notebooks/
│   └── <training-and-analysis-notebooks>
│
├── requirements.txt
├── .gitignore
├── README.md
└── <other-project-files>
```

> The exact folder structure may vary depending on the final implementation of the project.

---

##  Tech Stack

### Machine Learning

* Python
* Scikit-learn
* Pandas
* NumPy
* SHAP

### Data Analysis

* Pandas
* NumPy
* Matplotlib / visualization libraries

### Web Application

* React
* JavaScript
* HTML
* CSS

### Backend / API

* Python-based backend/API framework used by the application

### Development

* Git
* GitHub

---

## Installation

### Create a virtual environment

```bash
python -m venv venv
```

Activate it:

###  Install Python dependencies

```bash
pip install -r requirements.txt
```

###  Install frontend dependencies

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

---

## Running the Application

Start the backend/API according to the backend entry point included in the repository.

Example:

```bash
api.py, risk_engine.py and test_api.py
```

Then start the frontend:

```bash
cd frontend
npm run dev
```

The application will then be available through the local development URL shown by the frontend development server.

> The exact commands should match the final backend and frontend entry files committed to this repository.

---

##  Using the Application

### Single Transaction Analysis

Enter or provide transaction information through the application.

The system processes the transaction and returns:

```text
Fraud Probability  ->  Risk Level   ->   Decision  ->  Explanation
```

### Batch CSV Analysis

Upload a CSV containing transaction records.

The application processes the rows and returns predictions for the uploaded transactions.

A sample CSV is included in the repository so that the application can be tested without requiring the original training dataset.

---

##  Model Evaluation

The model is evaluated using classification metrics appropriate for an imbalanced fraud-detection problem.

Key evaluation concepts include:

**Precision**

Measures how many transactions predicted as fraud were actually fraudulent.

**Recall**

Measures how many actual fraudulent transactions were successfully identified.

**F1-score**

Balances precision and recall.

**ROC-AUC**

Measures the model's ability to distinguish between fraudulent and legitimate transactions across classification thresholds.

**PR-AUC**

Measures performance using the precision-recall relationship and is particularly informative for highly imbalanced classification problems.

---
## Failure Case & Recovery

One of the most important issues I encountered was not a software crash, but a modeling and decision-policy problem: the default classification threshold of **0.50** was not appropriate for the business objective of fraud detection.

### What initially went wrong

The XGBoost classifier produced a fraud probability for every transaction. The first evaluation used the conventional threshold of **0.50**:

```text
Predicted Fraud  ->  probability >= 0.50
Predicted Legit  ->  probability < 0.50
```

Although this is a common starting point for binary classification, it is not necessarily the correct operating point for fraud detection.
Fraud detection is a highly imbalanced classification problem, where legitimate transactions greatly outnumber fraudulent ones. More importantly, the two types of classification errors do not have equal business impact:

* A **false positive (FP)** means a legitimate transaction is sent for unnecessary review or intervention.
* A **false negative (FN)** means a fraudulent transaction is missed.

For this project, I explicitly modeled these costs as:

```text
False Positive Cost = Rs 100
False Negative Cost = Rs 5,000
```

This means missing a fraudulent transaction was treated as significantly more costly than reviewing an additional legitimate transaction.

When the default **0.50 threshold** was evaluated on the held-out test set, the resulting errors produced a total modeled cost of:

```text
Default threshold (0.50): Rs 81,000
```

This showed that the model itself was not the only problem. The more important issue was that the **decision threshold had not been aligned with the actual risk objective**.

### How I handled it

Instead of changing the model repeatedly or optimizing directly on the final test set, I separated the problem into two stages:

1. **Model training and validation**
2. **Final held-out evaluation**

I first performed threshold analysis on the validation data. Multiple candidate thresholds were evaluated using the predefined false-positive and false-negative costs.

The objective was to minimize:

```text
Total Risk Cost = (False Positives × Rs 100) + (False Negatives × Rs 5,000)
```

The validation analysis showed that a much lower operating threshold provided a better cost-sensitive trade-off than the default 0.50 threshold.

The selected threshold was:

```text
Final frozen threshold = 0.03
```

Importantly, I did **not** choose this threshold by looking at the final test-set result and then tuning it against that same test set. The threshold was selected using the validation stage and then **frozen before final evaluation**.

### Final Held-Out Test Evaluation

After freezing the threshold at **0.03**, I evaluated the unchanged decision rule on the previously unseen test set.

The final held-out results were:

| Metric          |     Result |
| --------------- | ---------- |
| Precision       | **62.22%** |
| Recall          | **85.71%** |
| F1 Score        | **72.10%** |
| PR-AUC          | **86.81%** |
| ROC-AUC         | **97.93%** |
| True Negatives  | **56,813** |
| False Positives |     **51** |
| False Negatives |     **14** |
| True Positives  |     **84** |

Using the same predefined error costs:

```text
Default threshold (0.50): Rs 81,000
Final threshold (0.03):   Rs 75,100
Cost reduction: Rs 5,900 (7.28%)
```

This represents:

```text
Absolute cost reduction = Rs 5,900
Relative cost reduction = 7.28%
```

The important point is that the improvement was measured on the **held-out test set only after the threshold had been selected and frozen**.

### What I learned

This failure changed how I approached the system.

The initial assumption was effectively:

```text
Train a good classifier -> use the standard 0.50 threshold
```

The corrected approach became:

```text
Train a useful classifier
 -> evaluate it honestly
 -> define the cost of mistakes
 -> optimize the operating threshold on validation data
 -> freeze the decision policy
 -> evaluate once on unseen test data
```

For a real merchant-risk workflow, the classification threshold is therefore not treated as a universal ML default. It is a **risk-policy decision** that depends on the cost of false positives, false negatives, operational capacity, and the consequences of intervention.

### Why this matters for the Risk Manager

The goal of this project is not simply to maximize a generic ML score. The system is designed to help a merchant manage risk while making the trade-off between missed fraud and unnecessary review explicit.

For this reason, the final system uses the model probability together with a cost-informed threshold and routes higher-risk transactions for **review/investigation** rather than treating the model as an unconditional automatic blocker.

Detailed threshold analysis and the held-out evaluation are available in:

* `notebooks/step6_cost_evaluation.ipynb`
* `results/threshold_cost_comparison.csv`
* `backend/python_services/risk_engine.py`


##  Risk Threshold

The system uses a probability threshold to convert the model's continuous fraud score into a practical decision.

Conceptually:

```text
P(fraud) < threshold  -> Lower-risk decision

P(fraud) >= threshold -> Higher-risk decision
```

The threshold can be selected based on the desired balance between false positives and false negatives.

In a real financial environment, this value would typically be calibrated using business costs, investigation capacity, and fraud-loss considerations.

---


##  Testing

The original Credit Card Fraud Detection dataset used for model training is not included in this repository because of GitHub's file-size limitations. The dataset source, attribution, and download information are documented separately in [`data/README.md`](data/README.md)

The repository includes separate sample CSV datasets under the data/ directory so that the application can be tested without requiring the original training dataset.

A separate sample/test dataset is provided so that users can test the application without modifying the training dataset.

Recommended testing flow:

```text
Clone Repository ->  Install Dependencies -> Start Backend -> Start Frontend -> Upload Sample CSV/Test CSV -> Run Prediction -> Inspect Risk Results -> Inspect SHAP Explanation
```
***Dataset Note***

The original Credit Card Fraud Detection dataset used during model development and training is not included in this GitHub repository because of its large file size. It is not required when using the already-trained model through the web application. The original training dataset is only required for reproducing the training/development workflow. It is not required for normal application inference when using the provided trained model and test CSV files.
For application testing, use the provided sample datasets in:

data/demo/
data/validation/


These files are intended to demonstrate the prediction, batch-risk assessment, investigation workflow, and SHAP-based transaction explanation capabilities of the application.
For details about the original training dataset, including its source and how it was used during model development, see:   [`data/README.md`](data/README.md)

##  Author

**Ranit Sarkhel**

B.Tech — Computer Science & Engineering

This project was developed as an end-to-end exploration of machine learning, explainable AI, and risk-management workflows for financial fraud detection.

---

##  Project Goal

The core objective of **AI Risk Manager** is not simply to predict fraud.

It is to demonstrate how machine learning predictions can be transformed into an understandable **risk-management workflow**:

```text
Prediction  +  Probability  +  Threshold  +  Explanation  =>  Actionable Risk Decision
```

That combination is what turns a machine-learning model into a practical risk-management application.
