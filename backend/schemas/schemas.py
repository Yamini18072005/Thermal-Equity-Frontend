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