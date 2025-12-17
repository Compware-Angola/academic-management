import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DiaSemana,
  Tempo,
  TempoDisponivelItem,
} from "@/services/tempos/tempos-disponiveis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryTipoDeSalas } from "@/hooks/salas/use-query-tipo-de-sala";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";
import { useToast } from "@/hooks/use-toast";
import { useVerifyCollision } from "@/hooks/horario/use-verify-collision";
import { AulaPayload } from "@/services/horario/save-horario.service";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTeacherByUC } from "@/hooks/teacher/use-query-teacher-uc";
import { useAvailableRooms } from "@/hooks/salas/use-rooms-avaliable";
type SlotKey = string;

type ScheduleGridProps = {
  scheduleData: TempoDisponivelItem[];
  onChange: (aulas: AulaPayload[]) => void;
  anoLetivo: string;
  semestre: string;
  periodo: string;
  unidadeCurricular: string;
};
export default function ScheduleGrid(props: ScheduleGridProps) {
  const { scheduleData, onChange, unidadeCurricular, anoLetivo } = props;

  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<null | {
    dia: DiaSemana;
    tempo: Tempo;
    key: string;
  }>(null);
  const [slotData, setSlotData] = useState<Record<SlotKey, AulaPayload>>({});
  const [formData, setFormData] = useState({
    sala: "",
    tipoAula: "",
    docente: undefined,
  });
  const { data: tipoDeSalas = [] } = useQueryTipoDeSalas();
  const { data: salas, isLoading: isLoadingSala } = useAvailableRooms({
    diaSemana: selectedSlot?.dia.pkDiaDaSemana,
    anoLectivo: Number(anoLetivo),
    horaFim: selectedSlot?.tempo?.horaFim,
    horaInicio: selectedSlot?.tempo?.horaInicio,
    tipoAula: Number(formData?.tipoAula),
  });

  const { data: teachers = [], isLoading: isLoadingTeacher } =
    useQueryTeacherByUC(unidadeCurricular);
  useEffect(() => {
    if (!formData.tipoAula || isLoadingSala) return;

    toast({
      title: "Salas atualizadas",
      description: `Foram encontradas ${salas?.length ?? 0} salas.`,
      duration: 3000,
    });
  }, [formData.tipoAula, salas, isLoadingSala]);

  const handleSlotClick = (dia: DiaSemana, tempo: Tempo) => {
    const key = `${dia.pkDiaDaSemana}-${tempo.ordem}`;

    setSelectedSlot({ dia, tempo, key });

    if (slotData[key]) {
      setFormData({
        sala: String(slotData[key].sala),
        tipoAula: String(slotData[key].tipoAula),
        docente: String(slotData[key].docente),
      });
    } else {
      setFormData({
        sala: "",
        tipoAula: "",
        docente: undefined,
      });
    }
  };

  const handleConfirm = async () => {
    if (!selectedSlot) return;

    const { dia, tempo, key } = selectedSlot;

    if (!formData.tipoAula || !formData.sala || !formData.docente) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Selecione docente, tipo de aula e sala.",
      });
      return;
    }

    const novaAula: AulaPayload = {
      docente: Number(formData.docente),
      diaSemana: dia.pkDiaDaSemana,
      ordemTempo: tempo.ordem,
      sala: Number(formData.sala),
      tipoAula: Number(formData.tipoAula),
      hora_inicio: tempo.horaInicio,
      hora_fim: tempo.horaFim,
      obs: "",
    };

    const updatedSlots = {
      ...slotData,
      [key]: novaAula,
    };

    setSlotData(updatedSlots);
    onChange(Object.values(updatedSlots));

    toast({
      title: "Aula adicionada",
      description: "Aula criada com sucesso.",
    });

    setSelectedSlot(null);
  };

  const handleRemove = (key: string) => {
    const updated = { ...slotData };
    delete updated[key];
    setSlotData(updated);
    onChange(Object.values(updated));
    setSelectedSlot(null);
  };

  const hasData = (diaId: number, ordem: number) => {
    return Boolean(slotData[`${diaId}-${ordem}`]);
  };
  const days = scheduleData.filter((item) => item.diaSemana);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {days.map((item) => (
          <Card
            className="rounded-none border-0"
            key={item.diaSemana.pkDiaDaSemana}
          >
            <CardHeader className="bg-linear-to-r from-primary to-primary text-white">
              <CardTitle className="text-center text-sm">
                {item.diaSemana.designacao}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {item.tempos.map((tempo) => {
                const filled = hasData(
                  item.diaSemana.pkDiaDaSemana,
                  tempo.ordem
                );

                return (
                  <Button
                    type="button"
                    key={tempo.ordem}
                    onClick={() => handleSlotClick(item.diaSemana, tempo)}
                    variant={filled ? "default" : "outline"}
                    className={`w-full justify-start h-auto py-3 ${
                      filled
                        ? "bg-green-50 text-green-900  hover:bg-green-100"
                        : ""
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={16}
                            className={
                              filled
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }
                          />
                          <span className="text-sm font-semibold">
                            {tempo.horaInicio} - {tempo.horaFim}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <div className="text-xl">{selectedSlot?.dia.designacao}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {selectedSlot?.tempo.horaInicio} -{" "}
                  {selectedSlot?.tempo.horaFim}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormSelect
              label="Docente"
              value={formData.docente}
              disabled={isLoadingTeacher}
              onChange={(v) => setFormData({ ...formData, docente: v })}
              options={teachers}
              map={(t) => ({
                key: t.pk,
                label: t.nomeCompleto,
                value: t.pk,
              })}
              loading={isLoadingTeacher}
            />

            {/* TIPO DE AULA */}
            <div>
              <Label>Tipo de Aula</Label>
              <Select
                value={formData.tipoAula}
                onValueChange={(v) => setFormData({ ...formData, tipoAula: v })}
              >
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Escolha o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tipoDeSalas.map((tipo) => (
                    <SelectItem
                      key={tipo.pkTipoAula}
                      value={tipo.pkTipoAula.toString()}
                    >
                      {tipo.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SALA */}
            <div>
              <Label>Sala</Label>
              <Select
                value={formData.sala}
                onValueChange={(v) => setFormData({ ...formData, sala: v })}
              >
                <SelectTrigger
                  disabled={
                    Boolean(formData.tipoAula) === false || isLoadingSala
                  }
                  className="w-full "
                >
                  <SelectValue
                    placeholder={
                      <>
                        {" "}
                        {isLoadingSala ? (
                          <span className="flex gap-2 items-center">
                            Carregando <Loader2 className="animate-spin" />
                          </span>
                        ) : (
                          "Selecione Salas"
                        )}
                      </>
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {salas?.map((sala) => (
                    <SelectItem key={sala.salaid} value={sala.salaid}>
                      {sala.sala}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                className="flex-1 cursor-pointer"
                onClick={handleConfirm}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>

              {selectedSlot &&
                hasData(
                  selectedSlot.dia.pkDiaDaSemana,
                  selectedSlot.tempo.ordem
                ) && (
                  <Button
                    onClick={() => handleRemove(selectedSlot.key)}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
