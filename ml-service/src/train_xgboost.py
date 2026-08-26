import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier


# --------------------------------------------------
# 1. Load processed dataset
# --------------------------------------------------

DATA_FILE = "data/processed/thermal_processed.csv"
MODEL_FILE = "models/thermal_xgboost_model.pkl"

df = pd.read_csv(DATA_FILE)

print("Processed dataset loaded successfully!")
print("Rows:", len(df))
print("Columns:", len(df.columns))


# --------------------------------------------------
# 2. Select features
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

# Target
y = df["risk_category"]


# --------------------------------------------------
# 3. Encode target labels
# --------------------------------------------------

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

print("\nRisk classes:")
for number, label in enumerate(label_encoder.classes_):
    print(number, "=", label)


# --------------------------------------------------
# 4. Split dataset
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.3,
    random_state=42,
    stratify=y_encoded
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# 5. Create XGBoost model
# --------------------------------------------------

model = XGBClassifier(
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
# 6. Train model
# --------------------------------------------------

print("\nTraining XGBoost model...")

model.fit(X_train, y_train)

print("XGBoost training completed!")


# --------------------------------------------------
# 7. Predict
# --------------------------------------------------

y_pred = model.predict(X_test)


# --------------------------------------------------
# 8. Convert predictions back to labels
# --------------------------------------------------

y_pred_labels = label_encoder.inverse_transform(y_pred.astype(int))
y_test_labels = label_encoder.inverse_transform(y_test.astype(int))


# --------------------------------------------------
# 9. Evaluation
# --------------------------------------------------

accuracy = accuracy_score(y_test_labels, y_pred_labels)

print("\nXGBoost Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(
    classification_report(
        y_test_labels,
        y_pred_labels,
        zero_division=0
    )
)

print("\nConfusion Matrix:")
print(
    confusion_matrix(
        y_test_labels,
        y_pred_labels
    )
)


# --------------------------------------------------
# 10. Feature importance
# --------------------------------------------------

importance = pd.DataFrame({
    "feature": features,
    "importance": model.feature_importances_
})

importance = importance.sort_values(
    by="importance",
    ascending=False
)

print("\nFeature Importance:")
print(importance)


# --------------------------------------------------
# 11. Save model + label encoder
# --------------------------------------------------

joblib.dump(
    {
        "model": model,
        "label_encoder": label_encoder,
        "features": features
    },
    MODEL_FILE
)

print("\nXGBoost model saved successfully!")
print("Model file:", MODEL_FILE)