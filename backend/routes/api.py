from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database.db import get_db
from models import Alert, Location, RiskAssessment, ThermalData
from services.risk_service import calculate_risk
from services.weather_service import get_weather
from schemas.schemas import (
    AlertCreate,
    AlertRead,
    AlertUpdate,
    LocationCreate,
    LocationRead,
    RiskAssessmentCreate,
    RiskAssessmentRead,
    ThermalDataCreate,
    ThermalDataRead,
)

router = APIRouter(prefix="/api")


# ============================================================
# Helper Functions
# ============================================================

def get_or_404(database: Session, model: type, record_id: int):
    record = database.get(model, record_id)

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Record not found",
        )

    return record


def ensure_location(database: Session, location_id: int) -> None:
    if database.get(Location, location_id) is None:
        raise HTTPException(
            status_code=404,
            detail="Location not found",
        )


# ============================================================
# Health
# ============================================================

@router.get(
    "/health",
    tags=["Health"],
    description="Confirm that the API is running.",
)
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "message": "Thermal Equity AI backend is running",
    }


# ============================================================
# Weather
# ============================================================

@router.get(
    "/weather",
    tags=["Weather"],
    description="Get current and forecast weather data.",
)
def weather(
    latitude: float = Query(..., description="Latitude"),
    longitude: float = Query(..., description="Longitude"),
):
    try:
        return get_weather(latitude, longitude)

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Weather service failed: {str(exc)}",
        ) from exc


# ============================================================
# Locations
# ============================================================

@router.get(
    "/locations",
    response_model=list[LocationRead],
    tags=["Locations"],
)
def list_locations(
    database: Session = Depends(get_db),
):
    return database.scalars(
        select(Location).order_by(Location.name)
    ).all()


@router.post(
    "/locations",
    response_model=LocationRead,
    status_code=status.HTTP_201_CREATED,
    tags=["Locations"],
)
def create_location(
    payload: LocationCreate,
    database: Session = Depends(get_db),
):
    record = Location(**payload.model_dump())

    database.add(record)
    database.commit()
    database.refresh(record)

    return record


@router.get(
    "/locations/{location_id}",
    response_model=LocationRead,
    tags=["Locations"],
)
def get_location(
    location_id: int,
    database: Session = Depends(get_db),
):
    return get_or_404(
        database,
        Location,
        location_id,
    )
@router.post(
    "/weather/sync/{location_id}",
    tags=["Weather"],
)
def sync_weather_to_thermal_data(
    location_id: int,
    database: Session = Depends(get_db),
):
    location = get_or_404(
        database,
        Location,
        location_id,
    )

    weather_data = get_weather(
        location.latitude,
        location.longitude,
    )

    current = weather_data.get("current")

    if not current:
        raise HTTPException(
            status_code=502,
            detail="Current weather data not available",
        )

    temperature = current.get("temperature_2m")
    humidity = current.get("relative_humidity_2m")
    apparent_temperature = current.get(
        "apparent_temperature"
    )

    if (
        temperature is None
        or humidity is None
        or apparent_temperature is None
    ):
        raise HTTPException(
            status_code=502,
            detail="Incomplete weather data received",
        )

    record = ThermalData(
        location_id=location.id,
        temperature=temperature,
        humidity=humidity,
        heat_index=apparent_temperature,
        recorded_at=datetime.now(),
    )

    database.add(record)
    database.commit()
    database.refresh(record)

    return {
        "message": "Real weather data saved successfully",
        "location_id": location.id,
        "location": location.name,
        "thermal_data": ThermalDataRead.model_validate(record),
    }

# ============================================================
# Thermal Data
# ============================================================

@router.get(
    "/thermal-data",
    response_model=list[ThermalDataRead],
    tags=["Thermal Data"],
)
def list_thermal_data(
    location_id: int | None = Query(
        default=None,
        gt=0,
    ),
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    database: Session = Depends(get_db),
):
    query = select(ThermalData).order_by(
        ThermalData.recorded_at.desc()
    )

    if location_id is not None:
        query = query.where(
            ThermalData.location_id == location_id
        )

    if start_date is not None:
        query = query.where(
            ThermalData.recorded_at >= start_date
        )

    if end_date is not None:
        query = query.where(
            ThermalData.recorded_at <= end_date
        )

    return database.scalars(query).all()


@router.post(
    "/thermal-data",
    response_model=ThermalDataRead,
    status_code=status.HTTP_201_CREATED,
    tags=["Thermal Data"],
)
def create_thermal_data(
    payload: ThermalDataCreate,
    database: Session = Depends(get_db),
):
    ensure_location(
        database,
        payload.location_id,
    )

    record = ThermalData(
        **payload.model_dump()
    )

    database.add(record)
    database.commit()
    database.refresh(record)

    return record


@router.get(
    "/thermal-data/{thermal_data_id}",
    response_model=ThermalDataRead,
    tags=["Thermal Data"],
)
def get_thermal_data(
    thermal_data_id: int,
    database: Session = Depends(get_db),
):
    return get_or_404(
        database,
        ThermalData,
        thermal_data_id,
    )


# ============================================================
# Risk Assessments
# ============================================================

@router.get(
    "/risk-assessments",
    response_model=list[RiskAssessmentRead],
    tags=["Risk Assessments"],
)
def list_risk_assessments(
    location_id: int | None = Query(
        default=None,
        gt=0,
    ),
    database: Session = Depends(get_db),
):
    query = select(RiskAssessment).order_by(
        RiskAssessment.assessment_date.desc()
    )

    if location_id is not None:
        query = query.where(
            RiskAssessment.location_id == location_id
        )

    return database.scalars(query).all()


@router.post(
    "/risk-assessments",
    response_model=RiskAssessmentRead,
    status_code=status.HTTP_201_CREATED,
    tags=["Risk Assessments"],
)
def create_risk_assessment(
    payload: RiskAssessmentCreate,
    database: Session = Depends(get_db),
):
    ensure_location(
        database,
        payload.location_id,
    )

    record = RiskAssessment(
        **payload.model_dump()
    )

    database.add(record)
    database.commit()
    database.refresh(record)

    return record


@router.post(
    "/risk-assessments/auto/{location_id}",
    response_model=RiskAssessmentRead,
    status_code=status.HTTP_201_CREATED,
    tags=["Risk Assessments"],
)
def create_automatic_risk_assessment(
    location_id: int,
    database: Session = Depends(get_db),
):
    ensure_location(
        database,
        location_id,
    )

    latest_thermal_data = database.scalars(
        select(ThermalData)
        .where(
            ThermalData.location_id == location_id
        )
        .order_by(
            ThermalData.recorded_at.desc()
        )
    ).first()

    if latest_thermal_data is None:
        raise HTTPException(
            status_code=404,
            detail="No thermal data found for this location",
        )

    risk = calculate_risk(
        latest_thermal_data.temperature,
        latest_thermal_data.humidity,
        latest_thermal_data.heat_index,
    )

    record = RiskAssessment(
        location_id=location_id,
        risk_level=risk["risk_level"],
        risk_score=risk["risk_score"],
        assessment_date=latest_thermal_data.recorded_at,
        explanation=risk["explanation"],
    )

    database.add(record)
    database.commit()

    # Create alert automatically for high/extreme risk
    if risk["risk_level"] in ["high", "extreme"]:

        alert = Alert(
            location_id=location_id,
            alert_type="thermal_risk",
            message=(
                "High thermal risk detected. "
                f"Risk score: {risk['risk_score']}"
            ),
            severity="critical",
            status="active",
        )

        database.add(alert)
        database.commit()

    database.refresh(record)

    return record


@router.get(
    "/risk-assessments/{assessment_id}",
    response_model=RiskAssessmentRead,
    tags=["Risk Assessments"],
)
def get_risk_assessment(
    assessment_id: int,
    database: Session = Depends(get_db),
):
    return get_or_404(
        database,
        RiskAssessment,
        assessment_id,
    )


# ============================================================
# Alerts
# ============================================================

@router.get(
    "/alerts",
    response_model=list[AlertRead],
    tags=["Alerts"],
)
def list_alerts(
    location_id: int | None = Query(
        default=None,
        gt=0,
    ),
    database: Session = Depends(get_db),
):
    query = select(Alert).order_by(
        Alert.created_at.desc()
    )

    if location_id is not None:
        query = query.where(
            Alert.location_id == location_id
        )

    return database.scalars(query).all()


@router.post(
    "/alerts",
    response_model=AlertRead,
    status_code=status.HTTP_201_CREATED,
    tags=["Alerts"],
)
def create_alert(
    payload: AlertCreate,
    database: Session = Depends(get_db),
):
    ensure_location(
        database,
        payload.location_id,
    )

    record = Alert(
        **payload.model_dump()
    )

    database.add(record)
    database.commit()
    database.refresh(record)

    return record


@router.patch(
    "/alerts/{alert_id}",
    response_model=AlertRead,
    tags=["Alerts"],
)
def update_alert(
    alert_id: int,
    payload: AlertUpdate,
    database: Session = Depends(get_db),
):
    record = get_or_404(
        database,
        Alert,
        alert_id,
    )

    record.status = payload.status

    database.commit()
    database.refresh(record)

    return record


# ============================================================
# Dashboard
# ============================================================

@router.get(
    "/dashboard/summary",
    tags=["Dashboard"],
)
def dashboard_summary(
    database: Session = Depends(get_db),
):
    latest_readings = database.scalars(
        select(ThermalData)
        .order_by(
            ThermalData.recorded_at.desc()
        )
        .limit(10)
    ).all()

    high_risk = database.scalars(
        select(RiskAssessment)
        .where(
            RiskAssessment.risk_level.in_(
                ["high", "extreme"]
            )
        )
        .order_by(
            RiskAssessment.assessment_date.desc()
        )
    ).all()

    return {
        "total_monitored_locations": (
            database.scalar(
                select(func.count(Location.id))
            ) or 0
        ),

        "latest_thermal_readings": [
            ThermalDataRead.model_validate(item)
            for item in latest_readings
        ],

        "high_risk_locations": [
            RiskAssessmentRead.model_validate(item)
            for item in high_risk
        ],

        "active_alerts": (
            database.scalar(
                select(func.count(Alert.id))
                .where(Alert.status == "active")
            ) or 0
        ),

        "recent_measurements": (
            database.scalar(
                select(func.count(ThermalData.id))
            ) or 0
        ),
    }