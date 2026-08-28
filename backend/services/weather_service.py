import requests


def get_weather(latitude: float, longitude: float):
    url = "https://api.open-meteo.com/v1/forecast"

    params = {
    "latitude": latitude,
    "longitude": longitude,
    "current": "temperature_2m,relative_humidity_2m,apparent_temperature",
    "forecast_days": 1,
    "timezone": "Asia/Kolkata",
}
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()

    return response.json()


def get_weather_data():
    return get_weather(13.110721, 80.2459)
