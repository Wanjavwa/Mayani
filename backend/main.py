from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine import project_condition

app = FastAPI(
    title="Heritage Preservation Intelligence — forecast service",
    description="Optional Python mirror of the demonstration deterioration engine. Not scientifically validated.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class MaterialIn(BaseModel):
    vulnerabilities: dict[str, float]
    inventoryWeight: float


class ForecastRequest(BaseModel):
    baseline: float
    horizon: int
    climateId: str
    maintenanceId: str
    exposure: dict
    materials: list[MaterialIn]


@app.get("/health")
def health():
    return {"ok": True, "model": "demo-linear-exposure-v1", "validated": False}


@app.post("/forecast")
def forecast(body: ForecastRequest):
    if body.horizon not in (5, 10, 20):
        raise HTTPException(status_code=400, detail="Unsupported horizon")
    payload = project_condition(
        baseline=body.baseline,
        materials=[m.model_dump() for m in body.materials],
        horizon=body.horizon,
        climate_id=body.climateId,
        maintenance_id=body.maintenanceId,
        exposure=body.exposure,
    )
    return {"status": "computed", "disclaimer": "Simulated demonstration forecast", **payload}
