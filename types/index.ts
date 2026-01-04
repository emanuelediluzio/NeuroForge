export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string; // e.g., "Hugging Face"
  parameters: string; // e.g., "7B"
  recommended_gpu: string; // e.g., "24GB VRAM"
}

export interface TrainingJob {
  id: string;
  model_id: string;
  dataset_name: string;
  status: "pending" | "training" | "completed" | "failed";
  progress: number; // 0-100
  log_history: string[];
}
