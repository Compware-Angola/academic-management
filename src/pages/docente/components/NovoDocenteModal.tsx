import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WizardStepper } from "./novo-docente-wizard/WizardStepper";
import { StepPessoa } from "./novo-docente-wizard/StepPessoa";
import { StepResumo } from "./novo-docente-wizard/StepResumo";

import { useMutationCreateDocente } from "@/hooks/docentes/use-mutation-create-docente";
import {
  DocenteWizardState,
  WIZARD_INITIAL_STATE,
} from "@/services/docentes/types/gestao-docente/docente-wizard.types";
import { StepCandidatura } from "./novo-docente-wizard/Stepcandidatura";
import { StepDocente } from "./novo-docente-wizard/StepDocente";

interface NovoDocenteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOTAL_STEPS = 4;

export function NovoDocenteModal({ isOpen, onClose }: NovoDocenteModalProps) {
  const [step, setStep] = useState(0);
  const [wizardData, setWizardData] =
    useState<DocenteWizardState>(WIZARD_INITIAL_STATE);

  const { mutate, isPending } = useMutationCreateDocente();

  const handleClose = () => {
    setStep(0);
    setWizardData(WIZARD_INITIAL_STATE);
    onClose();
  };

  const isStepValid = () => {
    if (step === 0) {
      const { nomeCompleto, numDocIdentificacao, email } = wizardData.pessoa;
      return !!nomeCompleto && !!numDocIdentificacao && !!email;
    }
    return true;
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    mutate(wizardData, {
      onSuccess: handleClose,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Novo docente</DialogTitle>
        </DialogHeader>

        <WizardStepper currentStep={step} />

        {step === 0 && (
          <StepPessoa
            data={wizardData.pessoa}
            onChange={(data) =>
              setWizardData((prev) => ({
                ...prev,
                pessoa: { ...prev.pessoa, ...data },
              }))
            }
          />
        )}

        {step === 1 && (
          <StepCandidatura
            data={wizardData.candidatura}
            onChange={(data) =>
              setWizardData((prev) => ({
                ...prev,
                candidatura: { ...prev.candidatura, ...data },
              }))
            }
          />
        )}

        {step === 2 && (
          <StepDocente
            data={wizardData.docente}
            onChange={(data) =>
              setWizardData((prev) => ({
                ...prev,
                docente: { ...prev.docente, ...data },
              }))
            }
          />
        )}

        {step === 3 && <StepResumo data={wizardData} />}

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>

          <div className="flex gap-2">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
              >
                Voltar
              </Button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? "A criar..." : "Confirmar e criar docente"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
