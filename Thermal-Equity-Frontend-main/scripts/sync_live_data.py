import requests

locations_to_add = [
    {"name": "Royapuram", "latitude": 13.1118, "longitude": 80.2974, "area": "North Chennai"},
    {"name": "Ambattur", "latitude": 13.1143, "longitude": 80.1548, "area": "West Chennai"},
    {"name": "Guindy", "latitude": 13.0067, "longitude": 80.2025, "area": "South Chennai"},
    {"name": "Velachery", "latitude": 12.9815, "longitude": 80.2180, "area": "South Chennai"},
    {"name": "Anna Nagar", "latitude": 13.0850, "longitude": 80.2101, "area": "Central Chennai"},
    {"name": "Adyar", "latitude": 13.0012, "longitude": 80.2565, "area": "South Chennai"}
]

try:
    existing = requests.get("http://127.0.0.1:8000/api/locations").json()
    existing_names = [loc["name"].lower() for loc in existing]
    print("Existing locations in DB:", [l["name"] for l in existing])

    for loc in locations_to_add:
        if loc["name"].lower() not in existing_names:
            res = requests.post("http://127.0.0.1:8000/api/locations", json=loc)
            print(f"Added {loc['name']}:", res.status_code)

    all_locs = requests.get("http://127.0.0.1:8000/api/locations").json()
    print("Total registered locations in DB:", len(all_locs))

    for l in all_locs:
        try:
            sync_res = requests.post(f"http://127.0.0.1:8000/api/weather/sync/{l['id']}")
            risk_res = requests.post(f"http://127.0.0.1:8000/api/risk-assessments/auto/{l['id']}")
            print(f"Synced {l['name']} (ID {l['id']}): Weather={sync_res.status_code}, Risk={risk_res.status_code}")
        except Exception as e:
            print(f"Error syncing location {l['id']}: {e}")

    summary = requests.get("http://127.0.0.1:8000/api/dashboard/summary").json()
    print("\n--- NEW DASHBOARD SUMMARY ---")
    print(f"Total Monitored Locations: {summary.get('total_monitored_locations')}")
    print(f"Active Alerts: {summary.get('active_alerts')}")
    print(f"Recent Measurements: {summary.get('recent_measurements')}")
    print(f"Latest Thermal Readings Count: {len(summary.get('latest_thermal_readings', []))}")
    print(f"Sample Reading: {summary.get('latest_thermal_readings', [])[0] if summary.get('latest_thermal_readings') else 'None'}")
except Exception as exc:
    print(f"Failed: {exc}")
