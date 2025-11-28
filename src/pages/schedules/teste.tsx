import React, { useState } from "react";
import { X, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TempoDisponivelItem } from "@/services/tempos/tempos-disponiveis";

export default function ScheduleGrid({
  scheduleData,
}: {
  scheduleData: TempoDisponivelItem[];
}) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotData, setSlotData] = useState({});
  const [formData, setFormData] = useState({
    disciplina: "",
    professor: "",
    sala: "",
    observacoes: "",
  });

  const handleSlotClick = (dia, tempo) => {
    const key = `${dia.pkDiaDaSemana}-${tempo.ordem}`;
    setSelectedSlot({ dia, tempo, key });

    if (slotData[key]) {
      setFormData(slotData[key]);
    } else {
      setFormData({
        disciplina: "",
        professor: "",
        sala: "",
        observacoes: "",
      });
    }
  };

  const handleSave = () => {
    if (!selectedSlot) return;

    const { key } = selectedSlot;
    const newData = { ...slotData };
    newData[key] = { ...formData };
    setSlotData(newData);
    setSelectedSlot(null);
  };

  const handleRemove = (key) => {
    const newData = { ...slotData };
    delete newData[key];
    setSlotData(newData);
    setSelectedSlot(null);
  };

  const hasData = (diaId, ordem) => {
    const key = `${diaId}-${ordem}`;
    return slotData[key] && Object.values(slotData[key]).some((v) => v);
  };

  const days = scheduleData.filter((item) => item.diaSemana);

  return (
    <>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {days.map((item) => (
          <Card key={item.diaSemana.pkDiaDaSemana}>
            <CardHeader className="bg-linear-to-r from-primary to-primary text-white">
              <CardTitle className="text-center">
                {item.diaSemana.designacao}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {item.tempos.map((tempo) => {
                const key = `${item.diaSemana.pkDiaDaSemana}-${tempo.ordem}`;
                const filled = hasData(
                  item.diaSemana.pkDiaDaSemana,
                  tempo.ordem
                );

                return (
                  <Button
                    key={tempo.ordem}
                    onClick={() => handleSlotClick(item.diaSemana, tempo)}
                    variant={filled ? "default" : "outline"}
                    className={`w-full justify-start h-auto py-3 ${
                      filled
                        ? "bg-green-50 text-green-900 border-green-500 hover:bg-green-100"
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
            <div className="space-y-2">
              <Label htmlFor="disciplina">Disciplina</Label>
              <Input
                id="disciplina"
                value={formData.disciplina}
                onChange={(e) =>
                  setFormData({ ...formData, disciplina: e.target.value })
                }
                placeholder="Ex: Matemática"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professor">Professor</Label>
              <Input
                id="professor"
                value={formData.professor}
                onChange={(e) =>
                  setFormData({ ...formData, professor: e.target.value })
                }
                placeholder="Nome do professor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sala">Sala</Label>
              <Input
                id="sala"
                value={formData.sala}
                onChange={(e) =>
                  setFormData({ ...formData, sala: e.target.value })
                }
                placeholder="Ex: Sala 101"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Reservar
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
