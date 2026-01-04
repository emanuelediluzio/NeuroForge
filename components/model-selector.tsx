"use client";

import { useState } from "react";
import { AIModel } from "@/types";
import { AVAILABLE_MODELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "lucide-react"; // Wait, lucide is icons, badge is shadcn. I didn't install badge. I'll use simple spans for now or install badge. I'll just use Tailwind.

interface ModelSelectorProps {
    onSelect: (model: AIModel) => void;
}

export function ModelSelector({ onSelect }: ModelSelectorProps) {
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

    const handleSelect = (model: AIModel) => {
        setSelectedModelId(model.id);
        onSelect(model);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_MODELS.map((model) => (
                <Card
                    key={model.id}
                    className={`cursor-pointer transition-all border-2 ${selectedModelId === model.id ? 'border-primary shadow-lg bg-primary/5' : 'border-transparent hover:border-border'}`}
                    onClick={() => handleSelect(model)}
                >
                    <CardHeader>
                        <CardTitle>{model.name}</CardTitle>
                        <div className="text-sm text-muted-foreground font-mono">{model.provider}</div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 h-12">{model.description}</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                {model.parameters} Logic
                            </span>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                {model.recommended_gpu}
                            </span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant={selectedModelId === model.id ? "default" : "secondary"}>
                            {selectedModelId === model.id ? "Selected" : "Select Model"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
