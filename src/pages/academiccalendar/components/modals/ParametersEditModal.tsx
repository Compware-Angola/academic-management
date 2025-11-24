// src/components/modals/ParametersEditModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, CreditCard, CheckCircle } from "lucide-react";

type Step = "periodos" | "vagas" | "mensalidades";

interface ParametersEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anoLetivo: string;
}

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: "periodos", title: "Períodos Letivos", icon: <Calendar className="h-5 w-5" /> },
  { id: "vagas", title: "Vagas Disponíveis", icon: <Users className="h-5 w-5" /> },
  { id: "mensalidades", title: "Calendário de Mensalidades", icon: <CreditCard className="h-5 w-5" /> },
];

export function ParametersEditModal({ open, onOpenChange, anoLetivo }: ParametersEditModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("periodos");
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  const next = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    } else {
      onOpenChange(false);
      // Aqui podes disparar toast de sucesso
    }
  };

  const prev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex].id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Novo Parâmetros Académicos</DialogTitle>
          <DialogDescription>
            Ano Letivo: <strong>{anoLetivo}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar + Steps */}
        <div className="mt-6">
          <Progress value={((currentIndex + 1) / steps.length) * 100} className="h-2 mb-6" />
          
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    index <= currentIndex
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentIndex ? <CheckCircle className="h-6 w-6" /> : step.icon}
                </div>
                <span className={`text-xs font-medium ${index <= currentIndex ? "text-primary" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mt-6 ${index < currentIndex ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo do Step Atual */}
        <div className="min-h-96">
          {currentStep === "periodos" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Períodos Letivos
              </h3>
              <p className="text-muted-foreground">
                Configure as datas de início e fim dos semestres letivos.
              </p>
              {/* Aqui podes colocar o formulário real depois */}
              <div className="bg-muted/50 border-2 border-dashed rounded-xl h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Formulário de Períodos (em desenvolvimento)</p>
              </div>
            </div>
          )}

          {currentStep === "vagas" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" /> Vagas por Curso
              </h3>
              <p className="text-muted-foreground">
                Defina o número de vagas por curso e período.
              </p>
              <div className="bg-muted/50 border-2 border-dashed rounded-xl h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Formulário de Vagas (em desenvolvimento)</p>
              </div>
            </div>
          )}

          {currentStep === "mensalidades" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Calendário de Mensalidades
              </h3>
              <p className="text-muted-foreground">
                Configure os prazos de pagamento das propinas mensais.
              </p>
              <div className="bg-muted/50 border-2 border-dashed rounded-xl h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Formulário de Mensalidades (em manutenção)</p>
              </div>
            </div>
          )}
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button variant="outline" onClick={prev} disabled={currentIndex === 0}>
            Anterior
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={next}>
              {currentIndex === steps.length - 1 ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}