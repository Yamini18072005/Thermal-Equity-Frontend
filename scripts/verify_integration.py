import requests

print("--- 1. BACKEND HEALTH & CORS VERIFICATION ---")
res = requests.get('http://127.0.0.1:8000/api/dashboard/summary', headers={'Origin': 'http://127.0.0.1:5173'})
print("Status Code:", res.status_code)
print("Access-Control-Allow-Origin:", res.headers.get("access-control-allow-origin"))
print("Access-Control-Allow-Credentials:", res.headers.get("access-control-allow-credentials"))
data = res.json()
print("Total Monitored Locations:", data.get("total_monitored_locations"))
print("Active Alerts:", data.get("active_alerts"))
print("Recent Measurements:", data.get("recent_measurements"))
print("Latest Readings Count:", len(data.get("latest_thermal_readings", [])))
if data.get("latest_thermal_readings"):
    r0 = data["latest_thermal_readings"][0]
    print(f"Latest Reading: {r0.get('location_name')} ({r0.get('location_area')}) -> Temp: {r0.get('temperature')}°C, Humidity: {r0.get('humidity')}%, Heat Index: {r0.get('heat_index')}°C")

print("\n--- 2. FRONTEND SERVER VERIFICATION ---")
fe = requests.get("http://127.0.0.1:5173")
print("Vite Server Status:", fe.status_code)
print("Contains root div:", '<div id="root">' in fe.text)
print("Contains main.jsx module:", '/src/main.jsx' in fe.text)
