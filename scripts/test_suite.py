import sys
import json
import requests

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

API_BASE = "http://127.0.0.1:8000"
FE_BASE = "http://127.0.0.1:5173"

errors = []

print("=" * 70)
print("THERMAL EQUITY AI - COMPREHENSIVE END-TO-END TEST SUITE")
print("=" * 70)


def run_test(test_id, name, fn):
    try:
        fn()
        print(f"✅ [{test_id}] {name} -> PASSED")
    except Exception as e:
        errors.append(f"[{test_id}] {name}: {e}")
        print(f"❌ [{test_id}] {name} -> FAILED: {e}")


# 1. Health Endpoint
def test_health():
    r = requests.get(f"{API_BASE}/api/health", headers={"Origin": FE_BASE}, timeout=10)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    data = r.json()
    assert data.get("status") == "ok", "Expected status 'ok'"
    assert data.get("database") == "connected", "Expected database connected"
    assert "monitored_locations" in data, "Expected monitored_locations count"

run_test("1/10", "System & Health API (/api/health)", test_health)


# 2. Locations CRUD
def test_locations_crud():
    # Read
    r = requests.get(f"{API_BASE}/api/locations", timeout=10)
    assert r.status_code == 200
    locs = r.json()
    assert len(locs) >= 8, f"Expected at least 8 seeded locations, got {len(locs)}"

    # Create
    new_loc = {"name": "Test Corridor", "latitude": 13.0500, "longitude": 80.2500, "area": "Central Chennai"}
    r_create = requests.post(f"{API_BASE}/api/locations", json=new_loc, timeout=10)
    assert r_create.status_code == 201
    created_id = r_create.json()["id"]

    # Read Single
    r_get = requests.get(f"{API_BASE}/api/locations/{created_id}", timeout=10)
    assert r_get.status_code == 200
    assert r_get.json()["name"] == "Test Corridor"

    # Update
    r_put = requests.put(f"{API_BASE}/api/locations/{created_id}", json={"name": "Updated Test Corridor"}, timeout=10)
    assert r_put.status_code == 200
    assert r_put.json()["name"] == "Updated Test Corridor"

    # Delete
    r_del = requests.delete(f"{API_BASE}/api/locations/{created_id}", timeout=10)
    assert r_del.status_code == 204

run_test("2/10", "Locations Full CRUD (/api/locations)", test_locations_crud)


# 3. Thermal Data CRUD
def test_thermal_data_crud():
    # List
    r = requests.get(f"{API_BASE}/api/thermal-data", timeout=10)
    assert r.status_code == 200
    readings = r.json()
    assert len(readings) > 0, "Expected thermal readings"

    # Create
    new_td = {
        "location_id": readings[0]["location_id"],
        "temperature": 42.5,
        "humidity": 65.0,
        "heat_index": 46.8,
        "recorded_at": "2026-08-28T12:00:00"
    }
    r_create = requests.post(f"{API_BASE}/api/thermal-data", json=new_td, timeout=10)
    assert r_create.status_code == 201
    td_id = r_create.json()["id"]

    # Read single
    r_get = requests.get(f"{API_BASE}/api/thermal-data/{td_id}", timeout=10)
    assert r_get.status_code == 200
    assert r_get.json()["temperature"] == 42.5

    # Update
    r_put = requests.put(f"{API_BASE}/api/thermal-data/{td_id}", json={"temperature": 43.0}, timeout=10)
    assert r_put.status_code == 200
    assert r_put.json()["temperature"] == 43.0

    # Delete
    r_del = requests.delete(f"{API_BASE}/api/thermal-data/{td_id}", timeout=10)
    assert r_del.status_code == 204

run_test("3/10", "Thermal Data Full CRUD (/api/thermal-data)", test_thermal_data_crud)


# 4. Risk Assessments CRUD & Auto Calculation
def test_risk_assessments():
    # List
    r = requests.get(f"{API_BASE}/api/risk-assessments", timeout=10)
    assert r.status_code == 200
    assessments = r.json()
    assert len(assessments) > 0

    # Auto calculation for location 1
    r_auto = requests.post(f"{API_BASE}/api/risk-assessments/auto/1", timeout=10)
    assert r_auto.status_code == 201
    auto_data = r_auto.json()
    assert "risk_score" in auto_data
    assert "risk_level" in auto_data

run_test("4/10", "Risk Assessments & Auto Calculation (/api/risk-assessments)", test_risk_assessments)


# 5. Alerts CRUD
def test_alerts_crud():
    # List
    r = requests.get(f"{API_BASE}/api/alerts", timeout=10)
    assert r.status_code == 200
    alerts = r.json()
    assert len(alerts) > 0

    # Create
    new_alert = {
        "location_id": 1,
        "alert_type": "heat_wave",
        "message": "Extreme heat wave alert for test zone",
        "severity": "critical",
        "status": "active"
    }
    r_create = requests.post(f"{API_BASE}/api/alerts", json=new_alert, timeout=10)
    assert r_create.status_code == 201
    alert_id = r_create.json()["id"]

    # Patch status
    r_patch = requests.patch(f"{API_BASE}/api/alerts/{alert_id}", json={"status": "acknowledged"}, timeout=10)
    assert r_patch.status_code == 200
    assert r_patch.json()["status"] == "acknowledged"

    # Delete
    r_del = requests.delete(f"{API_BASE}/api/alerts/{alert_id}", timeout=10)
    assert r_del.status_code == 204

run_test("5/10", "Alerts Full CRUD & Status Transitions (/api/alerts)", test_alerts_crud)


# 6. Live Open-Meteo Weather Integration
def test_weather():
    r = requests.get(f"{API_BASE}/api/weather?latitude=13.0827&longitude=80.2707", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "current" in data
    assert "temperature_2m" in data["current"]
    assert "relative_humidity_2m" in data["current"]

run_test("6/10", "Open-Meteo Live Weather API (/api/weather)", test_weather)


# 7. AI & Predictive Intelligence
def test_ai_predict():
    payload = {
        "latitude": 13.1107,
        "longitude": 80.2459,
        "lst_celsius": 44.6,
        "ndvi": 0.08,
        "built_up_pct": 85.0,
        "green_cover_pct": 4.2,
        "population_density": 24500.0,
        "vulnerable_pct": 65.0,
        "water_access_pct": 40.0,
        "cooling_access_pct": 20.0
    }
    r = requests.post(f"{API_BASE}/api/ai/predict", json=payload, timeout=10)
    assert r.status_code == 200
    data = r.json()
    assert data["risk_category"] in ["Critical", "High", "Medium", "Low"]
    assert 0 <= data["risk_score"] <= 100
    assert data["confidence"] > 0
    assert "contributing_factors" in data
    assert "recommended_action" in data

    # Test Insights & Recommendations
    r_ins = requests.get(f"{API_BASE}/api/ai/insights", timeout=10)
    assert r_ins.status_code == 200
    assert len(r_ins.json()) >= 4

    r_rec = requests.get(f"{API_BASE}/api/ai/recommendations", timeout=10)
    assert r_rec.status_code == 200
    assert len(r_rec.json()) >= 4

run_test("7/10", "AI Thermal Equity Prediction & Insights (/api/ai/*)", test_ai_predict)


# 8. Dashboard Summary & CORS Validation
def test_dashboard_summary():
    r = requests.get(f"{API_BASE}/api/dashboard/summary", headers={"Origin": FE_BASE}, timeout=10)
    assert r.status_code == 200
    assert r.headers.get("access-control-allow-origin") == FE_BASE
    assert r.headers.get("access-control-allow-credentials") == "true"

    data = r.json()
    assert data["total_monitored_locations"] >= 8
    assert len(data["latest_thermal_readings"]) > 0
    assert "active_alerts" in data
    assert "recent_measurements" in data

run_test("8/10", "Dashboard Summary & CORS Header Check (/api/dashboard/summary)", test_dashboard_summary)


# 9. FastAPI Interactive Docs & OpenAPI Schema
def test_docs():
    r_docs = requests.get(f"{API_BASE}/docs", timeout=10)
    assert r_docs.status_code == 200
    r_openapi = requests.get(f"{API_BASE}/openapi.json", timeout=10)
    assert r_openapi.status_code == 200
    schema = r_openapi.json()
    assert "paths" in schema
    assert "/api/dashboard/summary" in schema["paths"]

run_test("9/10", "Swagger Docs & OpenAPI Spec (/docs, /openapi.json)", test_docs)


# 10. Frontend Build Assets Check
def test_frontend():
    # Root check
    r_fe = requests.get(FE_BASE, timeout=10)
    assert r_fe.status_code == 200
    assert '<div id="root">' in r_fe.text

run_test("10/10", "Frontend Dev Server Integrity (http://127.0.0.1:5173)", test_frontend)


print("=" * 70)
if errors:
    print(f"❌ TEST SUITE FAILED WITH {len(errors)} ERROR(S):")
    for err in errors:
        print(f"   - {err}")
    sys.exit(1)
else:
    print("🎉 ALL 10 TEST SUITES PASSED FLAWLESSLY (100% END-TO-END VERIFIED)!")
    print("Frontend URL: http://127.0.0.1:5173")
    print("Backend URL:  http://127.0.0.1:8000")
    print("Swagger Docs: http://127.0.0.1:8000/docs")
print("=" * 70)
