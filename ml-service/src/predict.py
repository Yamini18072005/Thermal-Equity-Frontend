import pandas as pd
import joblib

# --------------------------------------------------
# 1. Load trained model
# --------------------------------------------------

MODEL_FILE = "models/thermal_risk_model.pkl"

model = joblib.load(MODEL_FILE)

print("Trained model loaded successfully!")


# --------------------------------------------------
# 2. Load processed dataset
# --------------------------------------------------

DATA_FILE = "data/processed/thermal_processed.csv"

df = pd.read_csv(DATA_FILE)


# --------------------------------------------------
# 3. Define features
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


# --------------------------------------------------
# 4. Prepare input data
# --------------------------------------------------

X = df[features]


# --------------------------------------------------
# 5. Predict risk category
# --------------------------------------------------

predicted_risk = model.predict(X)

df["predicted_risk_category"] = predicted_risk


# --------------------------------------------------
# 6. Get prediction probability
# --------------------------------------------------

probabilities = model.predict_proba(X)

df["prediction_confidence"] = probabilities.max(axis=1) * 100


# --------------------------------------------------
# 7. Display predictions
# --------------------------------------------------

print("\nThermal Equity Risk Predictions:")

print(
    df[
        [
            "area_id",
            "predicted_risk_category",
            "prediction_confidence"
        ]
    ]
)


# --------------------------------------------------
# 8. Save predictions
# --------------------------------------------------

OUTPUT_FILE = "data/processed/thermal_predictions.csv"

df.to_csv(OUTPUT_FILE, index=False)

print("\nPredictions saved successfully!")
print("Output file:", OUTPUT_FILE)