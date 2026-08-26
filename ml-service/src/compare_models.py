import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

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


# --------------------------------------------------
# 4. Train/Test split
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.3,
    random_state=42,
    stratify=y_encoded
)


# --------------------------------------------------
# 5. Random Forest
# --------------------------------------------------

rf_model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight="balanced"
)

rf_model.fit(X_train, y_train)

rf_pred = rf_model.predict(X_test)


# --------------------------------------------------
# 6. XGBoost
# --------------------------------------------------

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

xgb_model.fit(X_train, y_train)

xgb_pred = xgb_model.predict(X_test)


# --------------------------------------------------
# 7. Calculate metrics
# --------------------------------------------------

rf_accuracy = accuracy_score(y_test, rf_pred)
rf_precision = precision_score(
    y_test, rf_pred, average="weighted", zero_division=0
)
rf_recall = recall_score(
    y_test, rf_pred, average="weighted", zero_division=0
)
rf_f1 = f1_score(
    y_test, rf_pred, average="weighted", zero_division=0
)


xgb_accuracy = accuracy_score(y_test, xgb_pred)
xgb_precision = precision_score(
    y_test, xgb_pred, average="weighted", zero_division=0
)
xgb_recall = recall_score(
    y_test, xgb_pred, average="weighted", zero_division=0
)
xgb_f1 = f1_score(
    y_test, xgb_pred, average="weighted", zero_division=0
)


# --------------------------------------------------
# 8. Display comparison
# --------------------------------------------------

comparison = pd.DataFrame({
    "Metric": [
        "Accuracy",
        "Precision",
        "Recall",
        "F1-Score"
    ],
    "Random Forest": [
        rf_accuracy,
        rf_precision,
        rf_recall,
        rf_f1
    ],
    "XGBoost": [
        xgb_accuracy,
        xgb_precision,
        xgb_recall,
        xgb_f1
    ]
})

comparison["Random Forest"] = (
    comparison["Random Forest"] * 100
).round(2)

comparison["XGBoost"] = (
    comparison["XGBoost"] * 100
).round(2)


print("\n======================================")
print(" RANDOM FOREST vs XGBOOST COMPARISON")
print("======================================")

print(comparison.to_string(index=False))


# --------------------------------------------------
# 9. Select better model
# --------------------------------------------------

if rf_f1 >= xgb_f1:
    print("\nRecommended model: Random Forest")
else:
    print("\nRecommended model: XGBoost")


print("\nComparison completed successfully!")