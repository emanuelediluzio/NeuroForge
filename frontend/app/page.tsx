"use client";

import { useState, useEffect } from "react";
import { ModelSelector } from "@/components/model-selector";
import { AIModel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startTraining, getTrainingStatus, TrainingStatus } from "@/lib/api";

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [datasetPath, setDatasetPath] = useState("");

  // Training State
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  // Polling Logic
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const status = await getTrainingStatus(jobId);
        setTrainingStatus(status);
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId]);

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
  };

  const handleStartTraining = async () => {
    if (!selectedModel) return;
    setIsTraining(true);
    try {
      const { job_id } = await startTraining(selectedModel.id, datasetPath);
      setJobId(job_id);
    } catch (error) {
      console.error("Failed to start", error);
      setIsTraining(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  return (
    <main className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NeuroForge</h1>
            <p className="text-muted-foreground mt-2">
              Fine-tune LLMs on your own infrastructure with a unified control plane.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Backend Online
            </div>
          </div>
        </header>

        {/* Wizard Steps */}
        <div className="space-y-8">
          {/* Step 1: Model Selection */}
          <div className={`transition-opacity duration-300 ${step === 1 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">1</span>
              Select Base Model
            </h2>
            <ModelSelector onSelect={handleModelSelect} />
            {step === 1 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={nextStep} disabled={!selectedModel}>
                  Next: Configure Dataset
                </Button>
              </div>
            )}
          </div>

          {/* Step 2: Dataset Configuration */}
          <div className={`transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">2</span>
              Configure Dataset
            </h2>
            {step >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Source</CardTitle>
                  <CardDescription>Enter the Hugging Face dataset ID or local path on your server.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataset">Dataset Path / ID</Label>
                    <Input
                      id="dataset"
                      placeholder="e.g., iman/custom-dataset or /home/user/data/train.jsonl"
                      value={datasetPath}
                      onChange={(e) => setDatasetPath(e.target.value)}
                    />
                  </div>
                </CardContent>
                {step === 2 && (
                  <div className="p-6 pt-0 flex justify-between">
                    <Button variant="ghost" onClick={prevStep}>Back</Button>
                    <Button onClick={nextStep} disabled={!datasetPath}>Next: Review & Train</Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Step 3: Review and Training */}
          <div className={`transition-opacity duration-300 ${step === 3 ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">3</span>
              Review & Start
            </h2>
            {step >= 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Training Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isTraining ? (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
                      <div>
                        <dt className="text-muted-foreground">Base Model</dt>
                        <dd className="font-medium">{selectedModel?.name} ({selectedModel?.parameters})</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Dataset</dt>
                        <dd className="font-medium">{datasetPath}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Backend</dt>
                        <dd className="font-medium">Local (GPU)</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Estimated VRAM</dt>
                        <dd className="font-medium">{selectedModel?.recommended_gpu}</dd>
                      </div>
                    </dl>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Training Progress</span>
                          <span className="font-mono">{trainingStatus?.progress || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500 ease-in-out"
                            style={{ width: `${trainingStatus?.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-lg h-64 overflow-y-auto border border-green-900 shadow-inner">
                        {trainingStatus?.logs?.map((log, i) => (
                          <div key={i}>&gt; {log}</div>
                        )) || <div className="animate-pulse">Initializing connection...</div>}
                      </div>
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-0 flex justify-between">
                  {!isTraining ? (
                    <>
                      <Button variant="ghost" onClick={prevStep}>Back</Button>
                      <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleStartTraining}>
                        Start Training Loop
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full" disabled variant="outline">
                      {trainingStatus?.status === 'completed' ? 'Training Complete' : 'Training in Progress...'}
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
