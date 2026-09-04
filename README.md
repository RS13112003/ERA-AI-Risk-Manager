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
     ▼
Model Prediction
     │
     ▼
Fraud Probability
     │
     ▼
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
├── data/
│   ├── creditcard.csv
│   └── sample/
│       └── sample_transactions.csv
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

##  Risk Threshold

The system uses a probability threshold to convert the model's continuous fraud score into a practical decision.

Conceptually:

```text
P(fraud) < threshold  -> Lower-risk decision

P(fraud) ≥ threshold -> Higher-risk decision
```

The threshold can be selected based on the desired balance between false positives and false negatives.

In a real financial environment, this value would typically be calibrated using business costs, investigation capacity, and fraud-loss considerations.

---


##  Testing

A separate sample/test dataset is provided so that users can test the application without modifying the training dataset.

Recommended testing flow:

```text
Clone Repository
      ↓
Install Dependencies
      ↓
Start Backend
      ↓
Start Frontend
      ↓
Upload Sample CSV
      ↓
Run Prediction
      ↓
Inspect Risk Results
      ↓
Inspect SHAP Explanation
```


##  Author

**Ranit Sarkhel**

B.Tech — Computer Science & Engineering

This project was developed as an end-to-end exploration of machine learning, explainable AI, and risk-management workflows for financial fraud detection.

---

##  Project Goal

The core objective of **AI Risk Manager** is not simply to predict fraud.

It is to demonstrate how machine learning predictions can be transformed into an understandable **risk-management workflow**:

```text
Prediction
    +
Probability
    +
Threshold
    +
Explanation
    ↓
Actionable Risk Decision
```

That combination is what turns a machine-learning model into a practical risk-management application.
