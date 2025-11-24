import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dispatch, SetStateAction } from "react";
import { AnoAcademico } from "@/services/fetch-anos-academico";
interface FormActivity {
  descricao: string;
  data_inicio: string;
  data_termino: string;
  ano_lectivo: string;
  tipo_calendario: string;
}
interface ActivityModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: FormActivity;
  setForm: Dispatch<SetStateAction<FormActivity>>;
  handleSubmitNew: () => void;
  loadingAnosLetivos: boolean;
  anosLetivos: AnoAcademico[];
}

export function ActivityModal({
  open,
  setOpen,
  form,
  setForm,
  handleSubmitNew,
  loadingAnosLetivos,
  anosLetivos,
}: ActivityModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Atividade Letiva</DialogTitle>
          <DialogDescription>
            Adicione uma nova atividade ao calendário acadêmico.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Input
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Ano Letivo *</Label>
            <Select
              value={form.ano_lectivo}
              onValueChange={(v) => setForm({ ...form, ano_lectivo: v })}
              disabled={loadingAnosLetivos}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingAnosLetivos ? "Carregando..." : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((ano) => (
                  <SelectItem key={ano.codigo} value={ano.designacao}>
                    {ano.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Início *</Label>
            <Input
              type="date"
              value={form.data_inicio}
              onChange={(e) =>
                setForm({ ...form, data_inicio: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Data Fim *</Label>
            <Input
              type="date"
              value={form.data_termino}
              onChange={(e) =>
                setForm({ ...form, data_termino: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Tipo de Calendário *</Label>
            <Textarea
              value={form.tipo_calendario}
              onChange={(e) =>
                setForm({ ...form, tipo_calendario: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitNew}>Criar Atividade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
