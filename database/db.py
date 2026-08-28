from __future__ import annotations

import os
import sys
from collections.abc import Generator
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv()

DEFAULT_DB_PATH = (PROJECT_ROOT / "thermal_equity.db").resolve()
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH.as_posix()}")

# Normalize postgres URL for SQLAlchemy with psycopg3
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


def seed_initial_data(session: Session) -> None:
    """Seed initial Chennai stations, thermal measurements, and alerts if database is fresh."""
    try:
        from backend.models.models import Alert, Location, RiskAssessment, ThermalData
    except ImportError:
        from models.models import Alert, Location, RiskAssessment, ThermalData

    existing_count = session.query(Location).count()
    if existing_count > 0:
        return

    # 1. Seed Core Chennai Localities
    default_locations = [
        {"name": "Perambur", "latitude": 13.1107, "longitude": 80.2459, "area": "North Chennai"},
        {"name": "Royapuram", "latitude": 13.1118, "longitude": 80.2974, "area": "North Chennai"},
        {"name": "T. Nagar", "latitude": 13.0418, "longitude": 80.2341, "area": "Central Chennai"},
        {"name": "Ambattur", "latitude": 13.1143, "longitude": 80.1548, "area": "West Chennai"},
        {"name": "Guindy", "latitude": 13.0067, "longitude": 80.2025, "area": "South Chennai"},
        {"name": "Velachery", "latitude": 12.9815, "longitude": 80.2180, "area": "South Chennai"},
        {"name": "Anna Nagar", "latitude": 13.0850, "longitude": 80.2101, "area": "Central Chennai"},
        {"name": "Adyar", "latitude": 13.0012, "longitude": 80.2565, "area": "South Chennai"},
    ]

    location_objs = []
    for loc_data in default_locations:
        loc = Location(**loc_data)
        session.add(loc)
        location_objs.append(loc)
    session.flush()

    # 2. Seed Baseline Thermal Telemetry
    thermal_samples = [
        (location_objs[0].id, 41.8, 67.0, 46.2),
        (location_objs[1].id, 41.5, 72.0, 45.4),
        (location_objs[2].id, 40.9, 64.0, 44.7),
        (location_objs[3].id, 40.6, 61.0, 43.9),
        (location_objs[4].id, 39.8, 65.0, 42.5),
        (location_objs[5].id, 37.8, 74.0, 40.3),
        (location_objs[6].id, 36.9, 58.0, 39.1),
        (location_objs[7].id, 34.7, 78.0, 36.8),
    ]

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    for loc_id, temp, hum, hi in thermal_samples:
        td = ThermalData(
            location_id=loc_id,
            temperature=temp,
            humidity=hum,
            heat_index=hi,
            recorded_at=now,
        )
        session.add(td)

    # 3. Seed Baseline Risk Assessments
    assessments_data = [
        (location_objs[0].id, "extreme", 91.0, "High asphalt density with severe microclimate heat trapping in Perambur."),
        (location_objs[1].id, "extreme", 89.0, "High humidity coupled with dense coastal residential structures in Royapuram."),
        (location_objs[2].id, "high", 84.0, "Elevated commercial pedestrian density and concrete heat retention in T. Nagar."),
        (location_objs[3].id, "high", 82.0, "Industrial outdoor workforce thermal exposure in Ambattur."),
        (location_objs[4].id, "high", 76.0, "Transit corridor radiant asphalt heat accumulation in Guindy."),
        (location_objs[5].id, "medium", 62.0, "Moderate thermal exposure in mixed residential sectors of Velachery."),
        (location_objs[6].id, "medium", 54.0, "Moderate canopy cover buffering radiant heat in Anna Nagar."),
        (location_objs[7].id, "low", 29.0, "Coastal tree canopy buffer and maritime breeze cooling in Adyar."),
    ]

    for loc_id, level, score, exp in assessments_data:
        ra = RiskAssessment(
            location_id=loc_id,
            risk_level=level,
            risk_score=score,
            assessment_date=now,
            explanation=exp,
        )
        session.add(ra)

    # 4. Seed Active Heat Alerts
    alerts_data = [
        (location_objs[0].id, "thermal_risk", "Critical heat advisory issued for Perambur. Temperature exceeds 41.8°C.", "critical", "active"),
        (location_objs[1].id, "thermal_risk", "Severe apparent heat index (45.4°C) detected in Royapuram.", "critical", "active"),
        (location_objs[2].id, "thermal_risk", "Pedestrian commercial zone heat advisory active for T. Nagar.", "warning", "active"),
        (location_objs[3].id, "thermal_risk", "Outdoor worker heat stress threshold exceeded in Ambattur.", "warning", "active"),
    ]

    for loc_id, a_type, msg, sev, stat in alerts_data:
        alt = Alert(
            location_id=loc_id,
            alert_type=a_type,
            message=msg,
            severity=sev,
            status=stat,
        )
        session.add(alt)

    session.commit()


def init_db() -> None:
    try:
        from backend.models.models import Alert, Location, RiskAssessment, ThermalData  # noqa: F401
    except ImportError:
        try:
            from models.models import Alert, Location, RiskAssessment, ThermalData  # noqa: F401
        except ImportError:
            pass

    Base.metadata.create_all(bind=engine)

    with SessionLocal() as session:
        seed_initial_data(session)