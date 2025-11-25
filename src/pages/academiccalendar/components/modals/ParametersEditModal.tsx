// src/components/modals/ParametersEditModal.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Step = "periodos" | "vagas" | "mensalidades";

interface ParametersEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anoLetivo?: string;
  onSuccess?: () => void;
}

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: "periodos", title: "Períodos Letivos", icon: <Calendar className="h-5 w-5" /> },
  { id: "vagas", title: "Vagas Disponíveis", icon: <Users className="h-5 w-5" /> },
  { id: "mensalidades", title: "Mensalidades", icon: <CreditCard className="h-5 w-5" /> },
];

export function ParametersEditModal({
  open,
  onOpenChange,
  anoLetivo,
  onSuccess,
}: ParametersEditModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("periodos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [periodosForm, setPeriodosForm] = useState({
    designacao: "",
    dataInicioPrimeiroSemestre: "",
    dataFimPrimeiroSemestre: "",
    dataInicioSegundoSemestre: "",
    dataFimSegundoSemestre: "",
  });

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  // Gera designação automaticamente
  useEffect(() => {
    const inicio1 = periodosForm.dataInicioPrimeiroSemestre;
    const fim2 = periodosForm.dataFimSegundoSemestre;

    if (inicio1 && fim2) {
      const anoInicio = new Date(inicio1).getFullYear();
      const anoFim = new Date(fim2).getFullYear();
      const anoFinal = anoFim >= anoInicio ? anoFim : anoInicio + 1;

      setPeriodosForm((prev) => ({
        ...prev,
        designacao: `${anoInicio}/${anoFinal}`,
      }));
    } else {
      setPeriodosForm((prev) => ({ ...prev, designacao: "" }));
    }
  }, [
    periodosForm.dataInicioPrimeiroSemestre,
    periodosForm.dataFimSegundoSemestre,
  ]);

  // Função para limpar o formulário
  const resetForm = () => {
    setPeriodosForm({
      designacao: "",
      dataInicioPrimeiroSemestre: "",
      dataFimPrimeiroSemestre: "",
      dataInicioSegundoSemestre: "",
      dataFimSegundoSemestre: "",
    });
  };

  const handleNext = async () => {
    if (currentStep === "periodos") {
      const required = [
        periodosForm.dataInicioPrimeiroSemestre,
        periodosForm.dataFimPrimeiroSemestre,
        periodosForm.dataInicioSegundoSemestre,
        periodosForm.dataFimSegundoSemestre,
      ];
      if (required.some((field) => !field)) {
         toast({ title: "Preencha todas as datas dos semestres!", variant: "destructive" });
     

        return;
      }
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    } else {
      // Último passo → salvar
      setIsSubmitting(true);
      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Sucesso!
        onSuccess?.();
        resetForm();        // LIMPA OS INPUTS
        setCurrentStep("periodos"); // volta ao primeiro passo (opcional)
        onOpenChange(false); // fecha o modal
      } catch (error) {
        alert("Erro ao salvar os parâmetros acadêmicos");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex].id);
  };

  // Quando o modal for fechado manualmente (X ou Cancelar), limpa também
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
      setCurrentStep("periodos");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Configurar Parâmetros Acadêmicos</DialogTitle>
          <DialogDescription>
            {anoLetivo ? `Ano Letivo: ${anoLetivo}` : "Definir períodos letivos"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress + Steps */}
        <div className="mt-6">
          <Progress value={((currentIndex + 1) / steps.length) * 100} className="h-2 mb-6" />
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2 flex-1 relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${index <= currentIndex ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                >
                  {index < currentIndex ? <CheckCircle className="h-6 w-6" /> : step.icon}
                </div>
                <span className={`text-xs font-medium text-center ${index <= currentIndex ? "text-primary" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-12 right-0 h-1 -z-10 ${index < currentIndex ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="min-h-96">
          {currentStep === "periodos" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" /> Períodos Letivos
              </h3>

              <div className="space-y-2">
                <Label>Designação (gerada automaticamente)</Label>
                <Input
                  value={periodosForm.designacao}
                  placeholder="Ex: 2025/2026"
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="inicio1">Início 1º Semestre *</Label>
                  <Input
                    id="inicio1"
                    type="date"
                    value={periodosForm.dataInicioPrimeiroSemestre}
                    onChange={(e) =>
                      setPeriodosForm({ ...periodosForm, dataInicioPrimeiroSemestre: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fim1">Fim 1º Semestre *</Label>
                  <Input
                    id="fim1"
                    type="date"
                    value={periodosForm.dataFimPrimeiroSemestre}
                    onChange={(e) =>
                      setPeriodosForm({ ...periodosForm, dataFimPrimeiroSemestre: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inicio2">Início 2º Semestre *</Label>
                  <Input
                    id="inicio2"
                    type="date"
                    value={periodosForm.dataInicioSegundoSemestre}
                    onChange={(e) =>
                      setPeriodosForm({ ...periodosForm, dataInicioSegundoSemestre: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fim2">Fim 2º Semestre *</Label>
                  <Input
                    id="fim2"
                    type="date"
                    value={periodosForm.dataFimSegundoSemestre}
                    onChange={(e) =>
                      setPeriodosForm({ ...periodosForm, dataFimSegundoSemestre: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === "vagas" && (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              Formulário de Vagas (em desenvolvimento)
            </div>
          )}

          {currentStep === "mensalidades" && (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              Formulário de Mensalidades (em desenvolvimento)
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
            Anterior
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancelar
            </Button>
            <Button onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : currentIndex === steps.length - 1 ? (
                "Concluir"
              ) : (
                "Próximo"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}