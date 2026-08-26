def calculate_risk(temperature, humidity, apparent_temperature):
    if apparent_temperature >= 40:
        risk_level = "high"
        risk_score = 90
    elif apparent_temperature >= 35:
        risk_level = "medium"
        risk_score = 60
    else:
        risk_level = "low"
        risk_score = 30

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "explanation": (
            f"Temperature: {temperature}°C, "
            f"Humidity: {humidity}%, "
            f"Apparent temperature: {apparent_temperature}°C"
        )
    }
