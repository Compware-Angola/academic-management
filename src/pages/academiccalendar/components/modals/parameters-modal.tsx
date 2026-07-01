import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Users, CreditCard } from "lucide-react";
import { PeriodoStep } from "./periodos-step";
import { MensalidadesStep } from "./mensalidades-step";
import { VagasStep } from "./vagas.step";


import { ParametersEditModalProps, StepConfig } from "../../types";
import { useAcademicCalendarForm } from "../../hooks/use-academic-calendar-form";
import { StepProgress } from "../step-progress";
import { Spinner } from "../spinner";


const STEPS: StepConfig[] = [
    { id: "periodos", title: "Períodos Letivos", icon: <Calendar className="h-5 w-5" /> },
    { id: "vagas", title: "Vagas Disponíveis", icon: <Users className="h-5 w-5" /> },
    { id: "mensalidades", title: "Mensalidades", icon: <CreditCard className="h-5 w-5" /> },
];

export function ParametersModal({
    open,
    onOpenChange,
    onSuccess,
}: ParametersEditModalProps) {
    const {
        currentStep,
        currentIndex,
        periodosForm,
        setPeriodosForm,
        isPeriodoValid,
        vagasOriginais,
        loadingVagas,
        vagasEditadas,
        setVagasEditadas,
        handleVagaChange,
        mensalidadesEditadas,
        setMensalidadesEditadas,
        loadingMeses,
        errorMeses,
        handleNext,
        handlePrev,
        handleClose,
        isSubmitting,
    } = useAcademicCalendarForm({
        onSuccess,
        onClose: () => onOpenChange(false),
    });

    const isLastStep = currentIndex === STEPS.length - 1;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl! w-full max-h-[90vh]! overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Configurar Parâmetros Acadêmicos
                    </DialogTitle>
                    <DialogDescription>
                        Configure períodos e vagas. Tudo será salvo ao final.
                    </DialogDescription>
                </DialogHeader>
                <StepProgress steps={STEPS} currentIndex={currentIndex} />
                <div className="min-h-96">
                    {currentStep === "periodos" && (
                        <PeriodoStep periodosForm={periodosForm} setPeriodosForm={setPeriodosForm} />
                    )}
                    {currentStep === "mensalidades" && (
                        <MensalidadesStep
                            loadingMeses={loadingMeses}
                            errorMeses={errorMeses}
                            mensalidadesEditadas={mensalidadesEditadas}
                            setMensalidadesEditadas={setMensalidadesEditadas}
                        />
                    )}
                </div>
                <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
                        Anterior
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => handleClose(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isSubmitting || (currentStep === "periodos" && !isPeriodoValid())}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner />
                                    Salvando tudo...
                                </>
                            ) : isLastStep ? (
                                "Concluir e Salvar"
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