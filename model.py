"""
LISA – AI Legal Intelligence Model (Kaggle-Based Simulation)
-----------------------------------------------------------
This module demonstrates training and evaluation of a legal
domain classification model using publicly available legal
datasets (Kaggle-style CSV format).

Domain: Indian Legal System
Purpose: Academic / Demo / Final-Year Project
"""

# ===============================
# IMPORTS
# ===============================

import pandas as pd
import numpy as np
import json

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# ===============================
# LOAD DATASET (KAGGLE STYLE)
# ===============================

"""
Expected CSV structure:
--------------------------------
| text | label |
--------------------------------
"""

DATASET_PATH = "legal_dataset_kaggle.csv"

try:
    data = pd.read_csv(DATASET_PATH)
    print("✅ Dataset loaded successfully")
except FileNotFoundError:
    print("⚠ Dataset file not found. Using fallback demo data.")
    data = pd.DataFrame({
        "text": [
            "Company not paying salary",
            "Instagram account hacked",
            "Online fraud through UPI",
            "Domestic violence case",
            "Defective product no refund",
            "Divorce and child custody issue"
        ],
        "label": [
            "workplace",
            "cyber",
            "cyber",
            "criminal",
            "consumer",
            "family"
        ]
    })

# ===============================
# PREPROCESSING
# ===============================

data.dropna(inplace=True)

X = data["text"].astype(str)
y = data["label"].astype(str)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ===============================
# TEXT VECTORIZATION
# ===============================

vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    stop_words="english",
    max_features=3000
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# ===============================
# MODEL TRAINING
# ===============================

model = LogisticRegression(
    solver="lbfgs",
    max_iter=2000,
    n_jobs=-1
)

model.fit(X_train_vec, y_train)

print("✅ Legal domain model trained")

# ===============================
# MODEL EVALUATION
# ===============================

y_pred = model.predict(X_test_vec)

print("\n📊 Evaluation Report")
print("-------------------")
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# ===============================
# INDIAN LAW MAPPING
# ===============================

INDIAN_LAW_MAP = {
    "criminal": [
        "Bharatiya Nyaya Sanhita (BNS)",
        "Criminal Procedure Code (CrPC)"
    ],
    "workplace": [
        "POSH Act 2013",
        "Payment of Wages Act",
        "Industrial Disputes Act"
    ],
    "cyber": [
        "Information Technology Act 2000",
        "Digital Personal Data Protection Act 2023"
    ],
    "consumer": [
        "Consumer Protection Act 2019"
    ],
    "family": [
        "Hindu Marriage Act",
        "Special Marriage Act",
        "Succession Act"
    ]
}

# ===============================
# PREDICTION FUNCTION
# ===============================

def analyze_legal_issue(user_input: str) -> dict:
    """
    Predicts legal domain and maps to Indian laws
    """
    vector = vectorizer.transform([user_input])
    domain = model.predict(vector)[0]

    return {
        "query": user_input,
        "predicted_domain": domain,
        "applicable_indian_laws": INDIAN_LAW_MAP.get(domain, []),
        "confidence_note": "Prediction based on trained legal text classifier",
        "disclaimer": "Legal Awareness Only — Not Legal Advice"
    }

# ===============================
# TEST CASES (DEMO)
# ===============================

if __name__ == "__main__":
    print("\n🧪 Running Test Queries\n")

    test_queries = [
        "My company is not paying my salary",
        "My phone got hacked and money stolen",
        "Someone is threatening my life",
        "Amazon product defective no refund",
        "I want divorce and child custody"
    ]

    for q in test_queries:
        result = analyze_legal_issue(q)
        print(json.dumps(result, indent=2))
        print("-" * 60)
