import requests
import sqlite3
from datetime import datetime, timezone

LATITUDE = 13.110721
LONGITUDE = 80.2459
DATE = "2026-08-19"

url = (
    f"https://archive-api.open-meteo.com/v1/archive?"
    f"latitude={LATITUDE}&longitude={LONGITUDE}"
    f"&start_date={DATE}&end_date={DATE}"
    f"&hourly=temperature_2m,relative_humidity_2m,apparent_temperature"
    f"&timezone=Asia/Kolkata"
)

response = requests.get(url, timeout=30)
response.raise_for_status()
data = response.json()

conn = sqlite3.connect("thermal_equity.db")
cursor = conn.cursor()

for i in range(len(data["hourly"]["time"])):
    cursor.execute(
        """
        INSERT INTO thermal_data
        (location_id, temperature, humidity, recorded_at, heat_index, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            1,
            data["hourly"]["temperature_2m"][i],
            data["hourly"]["relative_humidity_2m"][i],
            data["hourly"]["time"][i],
            data["hourly"]["apparent_temperature"][i],
            datetime.now(timezone.utc).replace(tzinfo=None),
        ),
    )

conn.commit()
conn.close()

print("24 real-world thermal readings inserted successfully!")