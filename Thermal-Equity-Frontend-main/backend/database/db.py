from __future__ import annotations

import os
import sys
from collections.abc import Generator
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent
for p in [BACKEND_DIR, PROJECT_ROOT]:
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

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

    try:
        existing_count = session.query(Location).count()
        if existing_count > 0:
            return

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

        assessments_data = [
            (location_objs[0].id, "extreme", 91.0, "High asphalt density with severe microclimate heat trapping in Perambur."),
            (location_objs[1].id, "extreme", 89.0, "High humidity-heat coupling causing critical apparent heat in Royapuram."),
            (location_objs[2].id, "high", 84.0, "Intense commercial traffic and thermal mass in T. Nagar shopping district."),
            (location_objs[3].id, "high", 82.0, "Industrial heat exhaust and metallic roofing in Ambattur estate."),
            (location_objs[4].id, "high", 76.0, "Transit corridor heat accumulation in Guindy commercial junction."),
            (location_objs[5].id, "high", 78.0, "High residential density with limited canopy in Velachery."),
            (location_objs[6].id, "moderate", 48.0, "Residential park coverage providing moderate thermal mitigation in Anna Nagar."),
            (location_objs[7].id, "low", 28.0, "Coastal breezes and dense tree cover maintaining lower temperatures in Adyar."),
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

        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Warning during relational seed: {e}")


def init_db() -> None:
    """Create tables and seed initial data."""
    try:
        try:
            from backend.models.models import Alert, Location, RiskAssessment, ThermalData  # noqa: F401
        except ImportError:
            from models.models import Alert, Location, RiskAssessment, ThermalData  # noqa: F401

        Base.metadata.create_all(bind=engine)

        with SessionLocal() as session:
            seed_initial_data(session)
    except Exception as err:
        print(f"Relational init_db non-critical warning: {err}")
