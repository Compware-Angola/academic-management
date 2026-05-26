import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { BolsaEstudante } from "@/services/financas/bolsa/fetch-bolsa-estudante.service";
import { useMutationUpdateBolsaEstudante } from "@/hooks/financas/bolsa/use-mutation-atribuir-bolsa";
import { Loader2 } from "lucide-react";

type EditAttributionModalProps = {
  open: boolean;
  onClose: () => void;
  initialValues: BolsaEstudante | null;
};

export function EditAttributionModal({
  open,
  onClose,
  initialValues,
}: EditAttributionModalProps) {
  const [payload, setPayload] = useState({
    codigoMatricula: "",
    codigoAnoLectivo: "",
    semestre: "",
    codigoBolsa: "",
  });
  const { mutateAsync: updateBolsaEstudante, isPending: isUpdatingBolsa } =
    useMutationUpdateBolsaEstudante();
  useEffect(() => {
    if (open && initialValues) {
      setPayload({
        codigoMatricula: initialValues.codigo_matricula.toString(),
        codigoAnoLectivo: initialValues.codigo_anolectivo.toString(),
        semestre: initialValues.semestre.toString(),
        codigoBolsa: initialValues.codigo_bolsa?.toString() ?? "",
      });
    }
  }, [open, initialValues]);
  const handleSave = async () => {
    if (initialValues) {
      await updateBolsaEstudante({
        codigoAnoLectivo: Number(payload.codigoAnoLectivo),
        codigoBolsa: Number(payload.codigoBolsa),
        codigoCreditoEducacional: Number(initialValues.codigo),
        codigoMatricula: Number(payload.codigoMatricula),
        semestre: Number(payload.semestre),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Atribuição de Crédito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <AcademicYearSelect
            value={payload.codigoAnoLectivo}
            onChangeValue={(v) =>
              setPayload((p) => ({ ...p, codigoAnoLectivo: v }))
            }
          />
          <SemestreSelect
            yearly
            value={payload.semestre}
            onChangeValue={(v) => setPayload((p) => ({ ...p, semestre: v }))}
          />
          <BolsaSelect
            value={payload.codigoBolsa}
            onChangeValue={(v) => setPayload((p) => ({ ...p, codigoBolsa: v }))}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdatingBolsa}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isUpdatingBolsa}>
            {isUpdatingBolsa ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
