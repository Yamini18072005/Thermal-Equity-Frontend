import pandas as pd
import joblib
import shap
import matplotlib.pyplot as plt
import numpy as np


# --------------------------------------------------
# 1. Load trained Random Forest model
# --------------------------------------------------

MODEL_FILE = "models/thermal_risk_model.pkl"
DATA_FILE = "data/processed/thermal_processed.csv"

model = joblib.load(MODEL_FILE)
df = pd.read_csv(DATA_FILE)

print("Model loaded successfully!")
print("Dataset loaded successfully!")


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


# --------------------------------------------------
# 3. Create SHAP explainer
# --------------------------------------------------

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)


# --------------------------------------------------
# 4. Handle different SHAP output formats
# --------------------------------------------------

if isinstance(shap_values, list):

    # Older SHAP format:
    # list of arrays → one array per class

    importance = np.mean(
        np.abs(np.stack(shap_values)),
        axis=(0, 1)
    )

else:

    shap_array = np.asarray(shap_values)

    print("\nSHAP array shape:", shap_array.shape)

    if shap_array.ndim == 3:

        # Newer SHAP format:
        # samples × features × classes

        importance = np.mean(
            np.abs(shap_array),
            axis=(0, 2)
        )

    elif shap_array.ndim == 2:

        # samples × features

        importance = np.mean(
            np.abs(shap_array),
            axis=0
        )

    else:

        raise ValueError(
            f"Unexpected SHAP shape: {shap_array.shape}"
        )


# --------------------------------------------------
# 5. Create feature importance table
# --------------------------------------------------

importance_df = pd.DataFrame({
    "feature": features,
    "importance": importance
})

importance_df = importance_df.sort_values(
    by="importance",
    ascending=False
)

print("\nFeature importance:")
print(importance_df.to_string(index=False))


# --------------------------------------------------
# 6. Create SHAP summary plot
# --------------------------------------------------

try:

    shap.summary_plot(
        shap_values,
        X,
        show=False
    )

    plt.tight_layout()

    plt.savefig(
        "data/processed/shap_summary.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.close()

    print("\nSHAP summary plot saved successfully!")
    print(
        "File: data/processed/shap_summary.png"
    )

except Exception as e:

    print("\nSHAP plot could not be created:")
    print(e)