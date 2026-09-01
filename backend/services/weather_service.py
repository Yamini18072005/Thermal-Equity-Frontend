import requests
from typing import Any

HEADERS = {
    "User-Agent": "ThermalEquityAI/1.0 (Chennai Urban Heat Assessment Platform)",
    "Accept": "application/json",
}

def get_weather(latitude: float, longitude: float) -> dict[str, Any]:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m",
        "forecast_days": 1,
        "timezone": "Asia/Kolkata",
    }
    response = requests.get(url, params=params, headers=HEADERS, timeout=12)
    response.raise_for_status()
    return response.json()

def get_batch_weather(coordinates: list[tuple[float, float]]) -> list[dict[str, Any]]:
    """Fetch real-time synoptic weather for multiple coordinates in a single batch request."""
    if not coordinates:
        return []
    
    url = "https://api.open-meteo.com/v1/forecast"
    lats = ",".join(f"{lat:.4f}" for lat, _ in coordinates)
    lons = ",".join(f"{lon:.4f}" for _, lon in coordinates)
    
    params = {
        "latitude": lats,
        "longitude": lons,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m",
        "forecast_days": 1,
        "timezone": "Asia/Kolkata",
    }
    
    response = requests.get(url, params=params, headers=HEADERS, timeout=15)
    response.raise_for_status()
    data = response.json()
    
    if isinstance(data, list):
        return data
    return [data]

def get_weather_data():
    return get_weather(13.110721, 80.2459)
