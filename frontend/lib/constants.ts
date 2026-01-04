import { AIModel } from "@/types";

export const AVAILABLE_MODELS: AIModel[] = [
    {
        id: "llama-3-8b",
        name: "Llama 3 (8B)",
        description: "Meta's latest open LLM. Good balance of speed and reasoning.",
        provider: "Meta",
        parameters: "8B",
        recommended_gpu: "16GB VRAM",
    },
    {
        id: "mistral-7b-v0.3",
        name: "Mistral 7B v0.3",
        description: "Highly efficient 7B model, great for general purpose chat.",
        provider: "Mistral AI",
        parameters: "7B",
        recommended_gpu: "12GB VRAM",
    },
    {
        id: "gemma-2b",
        name: "Gemma 2B",
        description: "Google's lightweight model. Fast and runs on consumer hardware.",
        provider: "Google",
        parameters: "2B",
        recommended_gpu: "8GB VRAM",
    },
    {
        id: "phi-3-mini",
        name: "Phi-3 Mini",
        description: "Microsoft's small but mighty model. Excellent for reasoning.",
        provider: "Microsoft",
        parameters: "3.8B",
        recommended_gpu: "8GB VRAM",
    },
];
