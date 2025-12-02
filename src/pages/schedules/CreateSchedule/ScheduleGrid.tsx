import React, { useEffect, useState } from "react";
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
export type AulaPayload = {
  diaSemana: number;
  ordemTempo: number;
  sala: number;
  tipoAula: number;
};
type ScheduleGridProps = {
  scheduleData: TempoDisponivelItem[];
  onChange: (aulas: AulaPayload[]) => void;

  anoLetivo: string;
  semestre: string;
  periodo: string;
  unidadeCurricular: string;
  docente: string;
};
export default function ScheduleGrid(props: ScheduleGridProps) {
  const {
    scheduleData,
    onChange,
    unidadeCurricular,
    semestre,
    anoLetivo,
    periodo,
    docente,
  } = props;
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<null | {
    dia: DiaSemana;
    tempo: Tempo;
    key: string;
  }>(null);
  const [slotData, setSlotData] = useState({});
  const [formData, setFormData] = useState({
    sala: "",
    tipoAula: "",
  });
  const { data: tipoDeSalas = [] } = useQueryTipoDeSalas();
  const { data: salas, isLoading: isLoadingSala } = useQuerySalas({
    tipoSala: formData.tipoAula,
  });
  const verifyCollision = useVerifyCollision();

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
      });
    } else {
      setFormData({
        sala: "",
        tipoAula: "",
      });
    }
  };

  const handleSave = async () => {
    if (!selectedSlot) return;

    const { dia, tempo, key } = selectedSlot;

    if (!formData.tipoAula || !formData.sala) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Selecione o tipo de aula e a sala.",
      });
      return;
    }

    try {
      const result = await verifyCollision.mutateAsync({
        ano_lectivo: Number(anoLetivo),
        semestre: Number(semestre),
        periodo: Number(periodo),
        unidade_curricular: Number(unidadeCurricular),
        docente: Number(docente),
        sala: Number(formData.sala),
        dia_semana: dia.pkDiaDaSemana,
        ordem_tempo: tempo.ordem,
        horario_id: null,
      });

      // ✅ SE EXISTIR COLISÃO
      if (result.temColisao === 1) {
        toast({
          variant: "destructive",
          title: "Colisão detectada",
          description: result.mensagem,
        });

        return;
      }

      const newItem: AulaPayload = {
        diaSemana: dia.pkDiaDaSemana,
        ordemTempo: tempo.ordem,
        sala: Number(formData.sala),
        tipoAula: Number(formData.tipoAula),
      };

      const updated = {
        ...slotData,
        [key]: newItem,
      };

      setSlotData(updated);
      onChange(Object.values(updated));

      toast({
        title: "Horário adicionado",
        description: "Sala atribuída com sucesso.",
      });

      setSelectedSlot(null); // fecha o dialog
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao verificar colisão.",
      });
    }
  };

  const handleRemove = (key: string) => {
    const updated = { ...slotData };
    delete updated[key];

    setSlotData(updated);

    // 🔹 atualiza o pai também
    onChange(Object.values(updated));

    setSelectedSlot(null);
  };

  const hasData = (diaId: number, ordem: number) => {
    const key = `${diaId}-${ordem}`;
    return slotData[key] && Object.values(slotData[key]).some((v) => v);
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
                    <SelectItem key={sala.pk} value={sala.pk.toString()}>
                      {sala.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3 pt-4">
              <Button
                disabled={verifyCollision.isPending}
                onClick={handleSave}
                className="flex-1"
              >
                {verifyCollision.isPending ? (
                  <>
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando Colisões
                    </>
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </>
                )}
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
