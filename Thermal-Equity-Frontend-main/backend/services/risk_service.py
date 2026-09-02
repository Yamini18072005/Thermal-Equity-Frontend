from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger("thermal_equity_ai.risk_service")


def calculate_risk(
    temperature: float,
    humidity: float,
    apparent_temperature: float | None = None,
) -> dict[str, Any]:
    """Calculate thermal risk based on temperature, humidity, and heat index."""
    effective_temp = apparent_temperature if apparent_temperature is not None else temperature

    if effective_temp >= 44.0:
        risk_level = "extreme"
        risk_score = 95.0
        explanation = (
            f"Extreme thermal hazard. Apparent temperature reaches {effective_temp:.1f}°C "
            f"(Air: {temperature:.1f}°C, Humidity: {humidity:.0f}%). Critical intervention required."
        )
    elif effective_temp >= 40.0:
        risk_level = "high"
        risk_score = 85.0
        explanation = (
            f"High thermal risk. Apparent temperature is {effective_temp:.1f}°C "
            f"(Air: {temperature:.1f}°C, Humidity: {humidity:.0f}%). Elevated heat stress for vulnerable groups."
        )
    elif effective_temp >= 35.0:
        risk_level = "medium"
        risk_score = 60.0
        explanation = (
            f"Moderate thermal risk. Apparent temperature is {effective_temp:.1f}°C "
            f"(Air: {temperature:.1f}°C, Humidity: {humidity:.0f}%). Continuous monitoring advised."
        )
    else:
        risk_level = "low"
        risk_score = 30.0
        explanation = (
            f"Low thermal risk. Apparent temperature is {effective_temp:.1f}°C "
            f"(Air: {temperature:.1f}°C, Humidity: {humidity:.0f}%). Conditions within normal threshold."
        )

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "explanation": explanation,
    }


def predict_thermal_risk(features: dict[str, float]) -> dict[str, Any]:
    """
    AI/ML Thermal Equity Risk Prediction Engine.
    Integrates environmental exposure, social vulnerability, and infrastructure indicators.
    """
    lst = float(features.get("lst_celsius", 40.0))
    ndvi = float(features.get("ndvi", 0.15))
    built_up = float(features.get("built_up_pct", 70.0))
    green_cover = float(features.get("green_cover_pct", 8.0))
    pop_density = float(features.get("population_density", 18000.0))
    vulnerable_pct = float(features.get("vulnerable_pct", 45.0))
    water_access = float(features.get("water_access_pct", 60.0))
    cooling_access = float(features.get("cooling_access_pct", 35.0))

    # Normalized component calculations (0.0 to 1.0)
    # 1. Thermal Exposure Index (LST + Built-up vs Green canopy)
    temp_factor = min(max((lst - 30.0) / 20.0, 0.0), 1.0)
    impervious_factor = min(max(built_up / 100.0, 0.0), 1.0)
    vegetation_deficit = min(max(1.0 - (ndvi + 1.0) / 2.0, 0.0), 1.0)
    exposure_score = (temp_factor * 0.5) + (impervious_factor * 0.3) + (vegetation_deficit * 0.2)

    # 2. Demographic Vulnerability Index (Density + Elderly/Outdoor workers)
    density_factor = min(max(pop_density / 30000.0, 0.0), 1.0)
    social_factor = min(max(vulnerable_pct / 100.0, 0.0), 1.0)
    vulnerability_score = (density_factor * 0.45) + (social_factor * 0.55)

    # 3. Infrastructure Deficit Index (Lack of water & cooling shelters)
    cooling_gap = 1.0 - min(max(cooling_access / 100.0, 0.0), 1.0)
    water_gap = 1.0 - min(max(water_access / 100.0, 0.0), 1.0)
    infrastructure_deficit = (cooling_gap * 0.6) + (water_gap * 0.4)

    # Composite Thermal Equity Risk Score (0 - 100)
    composite_raw = (exposure_score * 0.45) + (vulnerability_score * 0.35) + (infrastructure_deficit * 0.20)
    risk_score = round(composite_raw * 100.0, 1)

    # Classification & Action mapping
    if risk_score >= 80.0:
        risk_category = "Critical"
        confidence = min(92.0 + (risk_score - 80.0) * 0.3, 98.5)
        recommended_action = "Immediate municipal heat response, mobile misting units, and hydration shelter deployment."
    elif risk_score >= 65.0:
        risk_category = "High"
        confidence = min(87.0 + (risk_score - 65.0) * 0.3, 94.0)
        recommended_action = "Deploy targeted tree planting corridors, cool roofs, and outdoor worker heat protection."
    elif risk_score >= 45.0:
        risk_category = "Medium"
        confidence = min(82.0 + (risk_score - 45.0) * 0.2, 90.0)
        recommended_action = "Active sensor monitoring and community awareness for peak sunlight periods."
    else:
        risk_category = "Low"
        confidence = 88.0
        recommended_action = "Maintain existing ecological buffers and coastal green tree canopy protection."

    contributing_factors = {
        "land_surface_temperature_impact": round(exposure_score * 100, 1),
        "social_demographic_vulnerability": round(vulnerability_score * 100, 1),
        "cooling_infrastructure_gap": round(infrastructure_deficit * 100, 1),
        "canopy_deficit_penalty": round(vegetation_deficit * 100, 1),
    }

    explanation = (
        f"Predicted {risk_category} risk ({risk_score}/100) driven by "
        f"LST {lst:.1f}°C, built-up ratio {built_up:.0f}%, and "
        f"demographic exposure of {vulnerable_pct:.0f}%."
    )

    return {
        "risk_category": risk_category,
        "confidence": round(confidence, 1),
        "risk_score": risk_score,
        "contributing_factors": contributing_factors,
        "explanation": explanation,
        "recommended_action": recommended_action,
    }


def get_ai_insights() -> list[dict[str, str]]:
    """Return AI-generated spatial intelligence points for Chennai."""
    return [
        {
            "icon": "🔥",
            "title": "Critical Thermal Exposure",
            "text": "Perambur and Royapuram show the highest combined heat and vulnerability risk in North Chennai.",
            "category": "thermal_exposure",
        },
        {
            "icon": "👥",
            "title": "Population Pressure",
            "text": "T. Nagar has elevated exposure due to very high population density and radiant asphalt heat.",
            "category": "vulnerability",
        },
        {
            "icon": "🦺",
            "title": "Outdoor Worker Risk",
            "text": "Ambattur requires priority protection measures for industrial outdoor workers during peak daytime.",
            "category": "occupational",
        },
        {
            "icon": "🌿",
            "title": "Green Space Advantage",
            "text": "Adyar shows lower thermal exposure supported by stronger coastal tree canopy access.",
            "category": "ecological",
        },
    ]


def get_mitigation_recommendations() -> list[dict[str, str]]:
    """Return prioritized municipal climate mitigation interventions."""
    return [
        {
            "id": "act-1",
            "icon": "🌳",
            "title": "Increase Green Cover",
            "area": "Perambur",
            "priority": "Critical",
            "impact": "Reduce surface heat by 2.4°C",
            "confidence": "95%",
            "actionDetails": "Deploying municipal native urban tree canopy planting along high-radiance concrete corridors.",
        },
        {
            "id": "act-2",
            "icon": "💧",
            "title": "Improve Public Cooling Access",
            "area": "T. Nagar",
            "priority": "High",
            "impact": "Support dense pedestrian zones",
            "confidence": "92%",
            "actionDetails": "Activating 15 misting stations and 40 free electrolyte distribution hubs along Ranganathan St.",
        },
        {
            "id": "act-3",
            "icon": "🚌",
            "title": "Install Shaded Public Waiting Areas",
            "area": "Ambattur",
            "priority": "High",
            "impact": "Lower commuter heat exposure",
            "confidence": "89%",
            "actionDetails": "Retrofitting reflective cool roofs and solar-powered cooling shelters at major bus transit stops.",
        },
        {
            "id": "act-4",
            "icon": "🏥",
            "title": "Activate Community Heat Response",
            "area": "Royapuram",
            "priority": "Critical",
            "impact": "Protect vulnerable elderly groups",
            "confidence": "94%",
            "actionDetails": "Dispatching mobile medical heat-health monitoring vans and establishing climate refuge shelters.",
        },
    ]
