import React from "react";
import { CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StepConfig } from "../types";

interface StepProgressProps {
    steps: StepConfig[];
    currentIndex: number;
}

export function StepProgress({ steps, currentIndex }: StepProgressProps) {
    return (
        <div className="mt-6">
            <Progress
                value={((currentIndex + 1) / steps.length) * 100}
                className="h-2 mb-6"
            />
            <div className="flex justify-between items-center mb-8">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className="flex flex-col items-center gap-2 flex-1 relative"
                    >
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${index <= currentIndex
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {index < currentIndex ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : (
                                step.icon
                            )}
                        </div>
                        <span
                            className={`text-xs font-medium text-center ${index <= currentIndex ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            {step.title}
                        </span>
                        {index < steps.length - 1 && (
                            <div
                                className={`absolute top-6 left-12 right-0 h-1 -z-10 ${index < currentIndex ? "bg-primary" : "bg-muted"
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}