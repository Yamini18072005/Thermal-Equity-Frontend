from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class RiskLevel(StrEnum):
    low = "low"
    medium = "medium"
    high = "high"
    extreme = "extreme"


class AlertSeverity(StrEnum):
    info = "info"
    warning = "warning"
    critical = "critical"


class AlertStatus(StrEnum):
    active = "active"
    acknowledged = "acknowledged"
    resolved = "resolved"


class LocationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    area: str = Field(min_length=1, max_length=150)


class LocationUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    area: str | None = Field(default=None, min_length=1, max_length=150)


class LocationRead(LocationCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class ThermalDataCreate(BaseModel):
    location_id: int = Field(gt=0)
    temperature: float = Field(ge=-100, le=100)
    humidity: float = Field(ge=0, le=100)
    recorded_at: datetime
    heat_index: float | None = Field(default=None, ge=-100, le=150)


class ThermalDataUpdate(BaseModel):
    temperature: float | None = Field(default=None, ge=-100, le=100)
    humidity: float | None = Field(default=None, ge=0, le=100)
    recorded_at: datetime | None = None
    heat_index: float | None = Field(default=None, ge=-100, le=150)


class ThermalDataRead(ThermalDataCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class RiskAssessmentCreate(BaseModel):
    location_id: int = Field(gt=0)
    risk_level: RiskLevel
    risk_score: float = Field(ge=0, le=100)
    assessment_date: datetime
    explanation: str = Field(min_length=1, max_length=2000)


class RiskAssessmentRead(RiskAssessmentCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class AlertCreate(BaseModel):
    location_id: int = Field(gt=0)
    alert_type: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=1, max_length=2000)
    severity: AlertSeverity
    status: AlertStatus = AlertStatus.active


class AlertUpdate(BaseModel):
    status: AlertStatus


class AlertRead(AlertCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ============================================================
# AI & ML Prediction Schemas
# ============================================================

class PredictionRequest(BaseModel):
    latitude: float = Field(default=13.0827, ge=-90, le=90, description="Station Latitude")
    longitude: float = Field(default=80.2707, ge=-180, le=180, description="Station Longitude")
    lst_celsius: float = Field(default=42.0, ge=-50, le=80, description="Land Surface Temperature (°C)")
    ndvi: float = Field(default=0.15, ge=-1.0, le=1.0, description="Normalized Difference Vegetation Index")
    built_up_pct: float = Field(default=75.0, ge=0, le=100, description="Built-up surface percentage")
    green_cover_pct: float = Field(default=8.0, ge=0, le=100, description="Tree canopy / green cover percentage")
    population_density: float = Field(default=18000.0, ge=0, description="Population per km²")
    vulnerable_pct: float = Field(default=45.0, ge=0, le=100, description="Vulnerable demographic percentage")
    water_access_pct: float = Field(default=60.0, ge=0, le=100, description="Public drinking water access percentage")
    cooling_access_pct: float = Field(default=35.0, ge=0, le=100, description="Public cooling shelter access percentage")


class PredictionResponse(BaseModel):
    risk_category: str
    confidence: float
    risk_score: float
    contributing_factors: dict[str, float]
    explanation: str
    recommended_action: str


class AIInsightItem(BaseModel):
    icon: str
    title: str
    text: str
    category: str = "thermal_exposure"


class MitigationRecommendationItem(BaseModel):
    id: str
    icon: str
    title: str
    area: str
    priority: str
    impact: str
    confidence: str
    actionDetails: str