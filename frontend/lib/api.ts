export interface TrainingResponse {
    job_id: string;
    status: string;
}

export interface TrainingStatus {
    job_id: string;
    status: string;
    progress: number;
    logs: string[];
}

const API_URL = "http://localhost:8000"; // In production, this would be the tunnel URL

export async function startTraining(modelId: string, datasetPath: string): Promise<TrainingResponse> {
    const res = await fetch(`${API_URL}/train`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model_id: modelId, dataset_path: datasetPath }),
    });

    if (!res.ok) {
        throw new Error("Failed to start training");
    }

    return res.json();
}

export async function getTrainingStatus(jobId: string): Promise<TrainingStatus> {
    const res = await fetch(`${API_URL}/status/${jobId}`);

    if (!res.ok) {
        throw new Error("Failed to get status");
    }

    return res.json();
}
