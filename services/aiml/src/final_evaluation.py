import pandas as pd
import joblib

from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.metrics import make_scorer, precision_score, recall_score, f1_score

from xgboost import XGBClassifier


# --------------------------------------------------
# 1. Load processed dataset
# --------------------------------------------------

DATA_FILE = "data/processed/thermal_processed.csv"

df = pd.read_csv(DATA_FILE)

print("Dataset loaded successfully!")
print("Rows:", len(df))


# --------------------------------------------------
# 2. Features
# --------------------------------------------------

features = [
    "latitude",
    "longitude",
    "lst_celsius",
    "ndvi",
    "built_up_pct",
    "green_cover_pct",
    "population_density",
    "vulnerable_pct",
    "water_access_pct",
    "cooling_access_pct"
]

X = df[features]
y = df["risk_category"]


# --------------------------------------------------
# 3. Encode target
# --------------------------------------------------

encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

print("\nRisk classes:")

for index, class_name in enumerate(encoder.classes_):
    print(index, "=", class_name)


# --------------------------------------------------
# 4. Cross-validation setup
# --------------------------------------------------

cv = StratifiedKFold(
    n_splits=3,
    shuffle=True,
    random_state=42
)


# --------------------------------------------------
# 5. Define models
# --------------------------------------------------

rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight="balanced"
)


xgb_model = XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softprob",
    eval_metric="mlogloss",
    random_state=42
)


# --------------------------------------------------
# 6. Evaluation metrics
# --------------------------------------------------

scoring = {
    "accuracy": "accuracy",

    "precision": make_scorer(
        precision_score,
        average="weighted",
        zero_division=0
    ),

    "recall": make_scorer(
        recall_score,
        average="weighted",
        zero_division=0
    ),

    "f1": make_scorer(
        f1_score,
        average="weighted",
        zero_division=0
    )
}


# --------------------------------------------------
# 7. Evaluate Random Forest
# --------------------------------------------------

print("\n======================================")
print(" RANDOM FOREST CROSS-VALIDATION")
print("======================================")

rf_results = cross_validate(
    rf_model,
    X,
    y_encoded,
    cv=cv,
    scoring=scoring
)

rf_accuracy = rf_results["test_accuracy"].mean()
rf_precision = rf_results["test_precision"].mean()
rf_recall = rf_results["test_recall"].mean()
rf_f1 = rf_results["test_f1"].mean()


print("Accuracy :", round(rf_accuracy * 100, 2), "%")
print("Precision:", round(rf_precision * 100, 2), "%")
print("Recall   :", round(rf_recall * 100, 2), "%")
print("F1-Score :", round(rf_f1 * 100, 2), "%")


# --------------------------------------------------
# 8. Evaluate XGBoost
# --------------------------------------------------

print("\n======================================")
print(" XGBOOST CROSS-VALIDATION")
print("======================================")

xgb_results = cross_validate(
    xgb_model,
    X,
    y_encoded,
    cv=cv,
    scoring=scoring
)

xgb_accuracy = xgb_results["test_accuracy"].mean()
xgb_precision = xgb_results["test_precision"].mean()
xgb_recall = xgb_results["test_recall"].mean()
xgb_f1 = xgb_results["test_f1"].mean()


print("Accuracy :", round(xgb_accuracy * 100, 2), "%")
print("Precision:", round(xgb_precision * 100, 2), "%")
print("Recall   :", round(xgb_recall * 100, 2), "%")
print("F1-Score :", round(xgb_f1 * 100, 2), "%")


# --------------------------------------------------
# 9. Model comparison
# --------------------------------------------------

comparison = pd.DataFrame({
    "Metric": [
        "Accuracy",
        "Precision",
        "Recall",
        "F1-Score"
    ],

    "Random Forest": [
        rf_accuracy * 100,
        rf_precision * 100,
        rf_recall * 100,
        rf_f1 * 100
    ],

    "XGBoost": [
        xgb_accuracy * 100,
        xgb_precision * 100,
        xgb_recall * 100,
        xgb_f1 * 100
    ]
})

comparison["Random Forest"] = comparison["Random Forest"].round(2)
comparison["XGBoost"] = comparison["XGBoost"].round(2)


print("\n======================================")
print(" FINAL MODEL COMPARISON")
print("======================================")

print(comparison.to_string(index=False))


# --------------------------------------------------
# 10. Select final model
# --------------------------------------------------

if rf_f1 >= xgb_f1:

    final_model = rf_model
    model_name = "Random Forest"

else:

    final_model = xgb_model
    model_name = "XGBoost"


print("\n======================================")
print(" FINAL MODEL SELECTION")
print("======================================")

print("Recommended model:", model_name)
print("Selection metric: Weighted F1-Score")


# --------------------------------------------------
# 11. Train final model using full dataset
# --------------------------------------------------

print("\nTraining final model using full dataset...")

final_model.fit(X, y_encoded)


# --------------------------------------------------
# 12. Save final model
# --------------------------------------------------

MODEL_FILE = "models/final_thermal_risk_model.pkl"
ENCODER_FILE = "models/risk_label_encoder.pkl"

joblib.dump(final_model, MODEL_FILE)
joblib.dump(encoder, ENCODER_FILE)


print("\nFinal model saved successfully!")
print("Model file:", MODEL_FILE)
print("Encoder file:", ENCODER_FILE)

print("\n======================================")
print(" FINAL EVALUATION COMPLETED")
print("======================================")