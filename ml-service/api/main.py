from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Thermal Equity AI API",
    description="AI-based Thermal Equity Risk Prediction API",
    version="1.0.0"
)


# --------------------------------------------------
# Load trained Random Forest model
# --------------------------------------------------

MODEL_FILE = "models/thermal_risk_model.pkl"

model = joblib.load(MODEL_FILE)


# --------------------------------------------------
# Input data structure
# --------------------------------------------------

class ThermalData(BaseModel):
    latitude: float
    longitude: float
    lst_celsius: float
    ndvi: float
    built_up_pct: float
    green_cover_pct: float
    population_density: float
    vulnerable_pct: float
    water_access_pct: float
    cooling_access_pct: float


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Thermal Equity AI API is running successfully!"
    }


# --------------------------------------------------
# Health endpoint
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------

@app.post("/predict")
def predict(data: ThermalData):

    input_data = pd.DataFrame([{
        "latitude": data.latitude,
        "longitude": data.longitude,
        "lst_celsius": data.lst_celsius,
        "ndvi": data.ndvi,
        "built_up_pct": data.built_up_pct,
        "green_cover_pct": data.green_cover_pct,
        "population_density": data.population_density,
        "vulnerable_pct": data.vulnerable_pct,
        "water_access_pct": data.water_access_pct,
        "cooling_access_pct": data.cooling_access_pct
    }])

    # Predict risk category
    prediction = model.predict(input_data)[0]

    # Prediction probability
    probabilities = model.predict_proba(input_data)[0]

    confidence = float(max(probabilities) * 100)

    return {
        "risk_category": prediction,
        "confidence": round(confidence, 2)
    }