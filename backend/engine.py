"""Deterministic demonstration deterioration model.

Mirrors src/engine/deterioration.ts. Not scientifically validated.
Replace this module with a calibrated or physics-based model later.
"""

from __future__ import annotations

TIME_FACTOR = {5: 1.0, 10: 1.85, 20: 3.4}
MAINTENANCE_FACTOR = {"none": 1.0, "routine": 0.62, "conservation": 0.38}
LOSS_SCALE = 6.2

CLIMATE = {
    "current": {"rain": 1, "heat": 1, "flood": 1, "wind": 1, "humidity": 1},
    "increased_rainfall": {"rain": 1.45, "heat": 1, "flood": 1.35, "wind": 1.05, "humidity": 1.25},
    "higher_temperatures": {"rain": 0.95, "heat": 1.5, "flood": 0.9, "wind": 1.1, "humidity": 0.85},
    "increased_flood": {"rain": 1.2, "heat": 1, "flood": 1.8, "wind": 1, "humidity": 1.4},
}

WIND = {"low": 0.4, "moderate": 0.7, "high": 1.0}
FLOOD = {"low": 0.35, "moderate": 0.7, "high": 1.0}


def project_condition(
    baseline: float,
    materials: list[dict],
    horizon: int,
    climate_id: str,
    maintenance_id: str,
    exposure: dict,
) -> dict:
    climate = CLIMATE[climate_id]
    time = TIME_FACTOR[horizon]
    maint = MAINTENANCE_FACTOR[maintenance_id]
    exp = {
        "rain": exposure["rainfallMmAnnual"] / 900,
        "heat": exposure["heatExtremeDays"] / 60,
        "flood": FLOOD[exposure["floodDrainageRisk"]],
        "wind": WIND[exposure["windExposure"]],
        "humidity": exposure["humidityPct"] / 100,
    }
    weighted_loss = 0.0
    weight_sum = 0.0
    drivers = {k: 0.0 for k in exp}
    for mat in materials:
        mat_loss = 0.0
        for key in exp:
            contribution = (
                exp[key]
                * mat["vulnerabilities"][key]
                * climate[key]
                * time
                * maint
                * LOSS_SCALE
            )
            mat_loss += contribution
            drivers[key] += contribution * mat["inventoryWeight"]
        weighted_loss += mat_loss * mat["inventoryWeight"]
        weight_sum += mat["inventoryWeight"]
    loss = 0 if weight_sum == 0 else weighted_loss / weight_sum
    projected = max(0.0, min(100.0, baseline - loss))
    return {
        "projectedCondition": round(projected, 1),
        "conditionDelta": round(projected - baseline, 1),
        "drivers": {k: round(v, 2) for k, v in drivers.items()},
        "modelId": "demo-linear-exposure-v1",
        "scientificallyValidated": False,
    }
