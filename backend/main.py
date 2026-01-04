from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import random

# Import Configuration
try:
    from config import ORCHESTRATOR_MODEL_PATH
except ImportError:
    ORCHESTRATOR_MODEL_PATH = "MOCK_MODE"

app = FastAPI(title="NeuroForge Backend")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Types
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str

# Mock Orchestrator Logic
def generate_mock_response(message: str):
    message = message.lower()
    if "train" in message or "finetune" in message:
        return "I can help you with that. Please specify the dataset path and the base model you'd like to use."
    elif "dataset" in message:
        return "Got it. I've located the dataset. Shall I start the training process with default parameters (LoRA, r=16)?"
    elif "yes" in message or "start" in message:
        return "Initiating training run #482... [System: executed `trainer.py --model llama3 --data /tmp/data.json`]\n\nTraining started successfully."
    else:
        return f"I am running in Orchestrator Mode (Model Path: {ORCHESTRATOR_MODEL_PATH}).\n\nI am ready to manage your training infrastructure. What would you like to do?"

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    # In a real implementation, this would call the LLM loaded from ORCHESTRATOR_MODEL_PATH
    
    # Simulate inference delay of a local LLM
    time.sleep(1.5) 
    
    response_text = generate_mock_response(req.message)
    return {"response": response_text}

@app.get("/")
def read_root():
    return {"status": "online", "model_path": ORCHESTRATOR_MODEL_PATH}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
