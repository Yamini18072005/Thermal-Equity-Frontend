try:
    from backend.models.models import Alert, Location, RiskAssessment, ThermalData
except ImportError:
    from models.models import Alert, Location, RiskAssessment, ThermalData

__all__ = ["Alert", "Location", "RiskAssessment", "ThermalData"]