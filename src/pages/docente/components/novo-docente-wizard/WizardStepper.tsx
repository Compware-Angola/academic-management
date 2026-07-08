// components/novo-docente-wizard/WizardStepper.tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Pessoa", "Candidatura", "Docente", "Resumo"];

interface WizardStepperProps {
  currentStep: number; // 0-based
}

export function WizardStepper({ currentStep }: WizardStepperProps) {
  return (
    <div className="mb-6 flex items-center">
      {STEPS.map((label, index) => (
        <div key={label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                index < currentStep &&
                  "border-primary bg-primary text-primary-foreground",
                index === currentStep && "border-primary text-primary",
                index > currentStep && "border-muted text-muted-foreground",
              )}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>

          {index < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-2 h-px flex-1",
                index < currentStep ? "bg-primary" : "bg-muted",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
