from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uvicorn
import asyncio
import uuid
import random
from typing import Dict

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NeuroForge Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job store
jobs: Dict[str, Dict] = {}

class TrainingRequest(BaseModel):
    model_id: str
    dataset_path: str

class TrainingStatus(BaseModel):
    job_id: str
    status: str
    progress: int
    logs: list[str]

async def mock_training_loop(job_id: str):
    """Simulates a long-running training process."""
    jobs[job_id]["status"] = "training"
    for i in range(0, 101, 10):
        jobs[job_id]["progress"] = i
        jobs[job_id]["logs"].append(f"Step {i*10}: Loss {random.uniform(0.1, 2.0):.4f}")
        await asyncio.sleep(2)  # Simulate work
    
    jobs[job_id]["status"] = "completed"
    jobs[job_id]["logs"].append("Training finished successfully. Model saved.")

@app.get("/")
def read_root():
    return {"status": "online", "service": "Local AI Training Backend"}

@app.post("/train")
async def start_training(req: TrainingRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "id": job_id,
        "model_id": req.model_id,
        "dataset": req.dataset_path,
        "status": "pending",
        "progress": 0,
        "logs": ["Job created. Initializing environment..."]
    }
    background_tasks.add_task(mock_training_loop, job_id)
    return {"job_id": job_id, "status": "started"}

@app.get("/status/{job_id}")
def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
