import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserCheck, Calendar } from "lucide-react";

import { FormCommandSelect } from "@/components/common/FormCommandSelect";

import { useQueryScheduleDetails } from "@/hooks/horario/use-query-schedule-details";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { toast } from "@/components/ui/sonner";

type DocenteSubstitutoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  horarioId?: number | null;
  mutation: any; // useMutationCriarDocenteSubstituto
};

export default function DocenteSubstitutoModal({
  isOpen,
  onClose,
  horarioId,
  mutation,
}: DocenteSubstitutoModalProps) {
  const [form, setForm] = useState({
    fkDocenteOriginal: "",
    fkDocenteSubstituto: "",
    fkHorario: "",
    dataInicio: "",
    dataTermino: "",
    obs: "",
  });

  // === Carregar docentes ===
  const {
    data: docentes = [],

    refetch,
    error,
  } = useQueryTeacther();

  // === Carregar detalhes do horário (se vier da tabela) ===
  const {
    data: horarioDetails,
    isLoading: loadingHorario,
  } = useQueryScheduleDetails(horarioId, {
    enabled: isOpen && !!horarioId,
  });

  // Preencher fkHorario e limpar formulário
  useEffect(() => {
    if (isOpen) {
      setForm({
       fkDocenteOriginal: horarioDetails?.aulas[0]?.docenteId?.toString() ,
        fkDocenteSubstituto: "",
        fkHorario: horarioId ? horarioId.toString() : "",
        dataInicio: "",
        dataTermino: "",
        obs: "",
      });
    }
  }, [isOpen, horarioId, horarioDetails]);
  const handleSubmit = () => {
    if ( !form.fkDocenteSubstituto || !form.fkHorario || !form.dataInicio) {
        toast.error("Por favor preencha todos os campos obrigatórios.");
    
      return;
    }

    const payload = {
      fkDocenteOriginal: Number(form.fkDocenteOriginal),
      fkDocenteSubstituto: Number(form.fkDocenteSubstituto),
      fkHorario: Number(form.fkHorario),
      dataInicio: form.dataInicio,
      dataTermino: form.dataTermino || undefined,
      obs: form.obs.trim() || undefined,
    };

    mutation.mutate(payload, {
      onSuccess: () => onClose(),
    });
  };

  const isPending = mutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full! max-w-[1100px]! max-h-[95vh]! flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserCheck className="h-5 w-5" />
            Nova Substituição de Docente
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da substituição. Os detalhes do horário são mostrados abaixo para confirmação.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* === Formulário da Substituição === */}
          <div className="space-y-5">
           <div className="space-y-2">
  <Label>Docente Original <span className="text-grey-500">*</span></Label>
  
  {loadingHorario ? (
    <div className="h-10 bg-muted animate-pulse rounded-md flex items-center px-3 text-sm text-muted-foreground">
      Carregando docente...
    </div>
  ) : horarioDetails?.aulas[0]?.docenteId || horarioDetails?.aulas[0]?.docenteId  ? (
    <div className="flex flex-col">
      <Input
        value={horarioDetails.aulas[0]?.docenteNome || "Docente não encontrado"}
        disabled
        className="bg-muted/50 cursor-not-allowed font-medium"
      />
      <p className="text-xs text-muted-foreground mt-1">
        ID: { horarioDetails.aulas[0]?.docenteId || "—"}
      </p>
    </div>
  ) : (
    <Input
      value="Nenhum docente associado a este horário"
      disabled
      className="bg-muted/50 cursor-not-allowed text-muted-foreground"
    />
  )}
</div>

            <div className="space-y-2">
              <Label>Docente Substituto <span className="text-red-500">*</span></Label>
              <FormCommandSelect
                value={form.fkDocenteSubstituto}
                placeholder="Selecione o docente substituto"
                options={docentes}
                map={(d: any) => ({
                  key: d.codigo?.toString(),
                  value: d.codigo?.toString(),
                  label: d.nome,
                })}
                onChange={(v) => setForm((p) => ({ ...p, fkDocenteSubstituto: v }))}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label>ID do Horário <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={form.fkHorario}
                onChange={(e) => setForm((p) => ({ ...p, fkHorario: e.target.value }))}
                disabled={!!horarioId || isPending}
              />
              {horarioId && (
                <p className="text-xs text-muted-foreground">Horário selecionado da lista</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={form.dataInicio}
                  onChange={(e) => setForm((p) => ({ ...p, dataInicio: e.target.value }))}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Término</Label>
                <Input
                  type="date"
                  value={form.dataTermino}
                  onChange={(e) => setForm((p) => ({ ...p, dataTermino: e.target.value }))}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações / Motivo</Label>
              <Textarea
                placeholder="Ex: Substituição por licença médica, viagem, etc."
                value={form.obs}
                onChange={(e) => setForm((p) => ({ ...p, obs: e.target.value }))}
                rows={4}
                disabled={isPending}
              />
            </div>
          </div>

          {/* === Detalhes do Horário (Preview) === */}
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Detalhes do Horário Selecionado</h3>
            </div>

            {loadingHorario ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground mt-2">Carregando horário...</p>
              </div>
            ) : horarioDetails ? (
              <div>
                <div className="mb-4 p-3 bg-muted rounded-md">
                  <p className="font-medium">{horarioDetails.unidadeCurricular}</p>
                  <p className="text-sm text-muted-foreground">
                    Turma: {horarioDetails.designacao} • {horarioDetails.curso}
                  </p>
                </div>

                {/* Mini visualização dos dias (resumida) */}
                <div className="text-sm space-y-3 max-h-[400px] overflow-y-auto">
                  {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((day) => {
                    const dayItems = (horarioDetails.aulas || []).filter(
                      (a: any) => a.diaSemana.replace("-Feira", "") === day
                    );

                    if (dayItems.length === 0) return null;

                    return (
                      <div key={day} className="border-l-2 border-primary pl-3">
                        <p className="font-medium text-primary mb-1">{day}</p>
                        {dayItems.map((aula: any, idx: number) => (
                          <div key={idx} className="text-xs text-muted-foreground mb-1">
                            {aula.horaInicio}–{aula.horaTermino} • {aula.tipoAula} •{" "}
                            {aula.docenteNome || "—"}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Selecione um horário na tabela para ver os detalhes aqui.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A criar substituição...
              </>
            ) : (
              "Confirmar Substituição"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}