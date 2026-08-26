# Thermal Equity AI

AI-powered Urban Climate Intelligence project for Chennai.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
## AI/ML Module – Thermal Equity Risk Prediction

### Objective
The AI/ML module predicts the thermal risk category of a geographical area
based on environmental, demographic, and accessibility indicators.

### Input Features

The model uses the following 10 features:

1. Latitude
2. Longitude
3. LST (Land Surface Temperature)
4. NDVI
5. Built-up Percentage
6. Green Cover Percentage
7. Population Density
8. Vulnerable Population Percentage
9. Water Access Percentage
10. Cooling Access Percentage

### Machine Learning Models

Two classification algorithms were evaluated:

- Random Forest
- XGBoost

### Model Evaluation

| Metric | Random Forest | XGBoost |
|---|---:|---:|
| Accuracy | 100.00% | 72.22% |
| Precision | 100.00% | 61.11% |
| Recall | 100.00% | 72.22% |
| F1-Score | 100.00% | 65.19% |

Based on the weighted F1-Score, Random Forest was selected as the
final model.

### Explainable AI

SHAP (SHapley Additive exPlanations) was used to analyze feature
contributions and improve model interpretability.

The generated SHAP visualization is stored at:

`data/processed/shap_summary.png`

### Final Model

The selected Random Forest model is saved as:

`models/final_thermal_risk_model.pkl`

The target label encoder is saved as:

`models/risk_label_encoder.pkl`

### API Integration

The trained model is integrated with a FastAPI backend.

API endpoint:

`POST /predict`

The API accepts the 10 environmental and demographic features and
returns:

- Risk Category
- Prediction Confidence

Example response:

```json
{
  "risk_category": "High",
  "confidence": 67
}
