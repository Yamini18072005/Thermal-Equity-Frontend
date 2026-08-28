import pandas as pd
import numpy as np

# Input and output paths
INPUT_FILE = "data/raw/thermal_data.csv"
OUTPUT_FILE = "data/processed/thermal_processed.csv"


# 1. Load dataset
df = pd.read_csv(INPUT_FILE)

print("Original dataset shape:", df.shape)


# 2. Check missing values
print("\nMissing values:")
print(df.isnull().sum())


# 3. Remove duplicate records
df = df.drop_duplicates()

print("\nAfter removing duplicates:", df.shape)


# 4. Convert required columns to numeric
numeric_columns = [
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

for column in numeric_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")


# 5. Fill missing numeric values using median
for column in numeric_columns:
    df[column] = df[column].fillna(df[column].median())


# 6. Create normalized risk components

# Heat risk: higher LST = higher risk
df["heat_risk"] = (
    (df["lst_celsius"] - df["lst_celsius"].min()) /
    (df["lst_celsius"].max() - df["lst_celsius"].min())
)

# Vegetation risk: lower NDVI = higher risk
df["vegetation_risk"] = 1 - (
    (df["ndvi"] - df["ndvi"].min()) /
    (df["ndvi"].max() - df["ndvi"].min())
)

# Built-up risk: higher built-up = higher risk
df["builtup_risk"] = (
    (df["built_up_pct"] - df["built_up_pct"].min()) /
    (df["built_up_pct"].max() - df["built_up_pct"].min())
)

# Social vulnerability risk
df["vulnerability_risk"] = (
    (df["vulnerable_pct"] - df["vulnerable_pct"].min()) /
    (df["vulnerable_pct"].max() - df["vulnerable_pct"].min())
)

# Water access risk: lower access = higher risk
df["water_risk"] = 1 - (
    (df["water_access_pct"] - df["water_access_pct"].min()) /
    (df["water_access_pct"].max() - df["water_access_pct"].min())
)

# Cooling access risk: lower access = higher risk
df["cooling_risk"] = 1 - (
    (df["cooling_access_pct"] - df["cooling_access_pct"].min()) /
    (df["cooling_access_pct"].max() - df["cooling_access_pct"].min())
)


# 7. Calculate Thermal Equity Risk Score
df["thermal_equity_risk_score"] = (
    0.30 * df["heat_risk"] +
    0.15 * df["vegetation_risk"] +
    0.15 * df["builtup_risk"] +
    0.20 * df["vulnerability_risk"] +
    0.10 * df["water_risk"] +
    0.10 * df["cooling_risk"]
) * 100


# 8. Create risk category
def classify_risk(score):
    if score < 33:
        return "Low"
    elif score < 66:
        return "Moderate"
    else:
        return "High"


df["risk_category"] = df["thermal_equity_risk_score"].apply(classify_risk)


# 9. Save processed dataset
df.to_csv(OUTPUT_FILE, index=False)

print("\nPreprocessing completed successfully!")
print("Processed dataset shape:", df.shape)

print("\nRisk scores:")
print(
    df[
        [
            "area_id",
            "thermal_equity_risk_score",
            "risk_category"
        ]
    ]
)

print(f"\nSaved processed dataset to: {OUTPUT_FILE}")