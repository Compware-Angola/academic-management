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
import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";

// Tipos esperados pela API
interface AnoAcademico {
  codigo: number;
  designacao: string;
  estado: string;
}

interface TipoCandidatura {
  codigo: number;
  designacao: string;
}

interface TipoCalendario {
  codigo: number;
  designacao: string;
}

interface FormActivity {
  designacao: string;
  codigo_ano_lectivo: number | string;
  codigo_tipo_candidatura: number | string;
  codigo_tipo_calendario: number | string;
  codigo_utilizador?: number; // opcional se vier do contexto/auth
  data_inicio: string;
  data_fim: string;
}

interface ActivityModalProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  form: FormActivity;
  setForm: Dispatch<SetStateAction<FormActivity>>;
  handleSubmitNew: () => void;
  editId?: number;
  // Dados para os selects
  loadingAnosLetivos: boolean;
  anosLetivos: AnoAcademico[];
  isSubmitting: boolean;
  loadingTiposCandidatura: boolean;
  tiposCandidatura: TipoCandidatura[];

  loadingTiposCalendario: boolean;
  tiposCalendario: TipoCalendario[];
}

export function ActivityModal({
  open,
  setOpen,
  form,
  setForm,
  handleSubmitNew,
  loadingAnosLetivos,
  anosLetivos,
  loadingTiposCandidatura,
  tiposCandidatura,
  isSubmitting,
  loadingTiposCalendario,
  tiposCalendario,
  editId,
}: ActivityModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Nova Atividade Letiva</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar uma nova atividade no calendário
            acadêmico.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Descrição / Nome da Atividade */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="descricao">Descrição da Atividade *</Label>
            <Input
              id="designacao"
              value={form.designacao}
              onChange={(e) => setForm({ ...form, designacao: e.target.value })}
              placeholder="Ex: Início do 1º Semestre, Férias de Natal, Exames..."
            />
          </div>

          <div className="space-y-2">
             <FormSelect
                       
          
                          label="Ano Letivo"
                          value={form.codigo_ano_lectivo?.toString() || ""}
                          onChange={(v) => setForm({ ...form, codigo_ano_lectivo: v })}
                          options={anosLetivos?.filter(
                            (ay) => ay.estado.toLowerCase() === "activo",
                          )}
                          map={(a) => ({
                            key: a.codigo,
                            label: a.designacao,
                            value: a.codigo,
                          })}
                        />
          </div>

          {/* Tipo de Candidatura */}

          <div className="space-y-2">
            <Label>Tipo de Candidatura *</Label>
            <Select
              value={form.codigo_tipo_candidatura?.toString() || ""}
              onValueChange={(v) =>
                setForm({ ...form, codigo_tipo_candidatura: Number(v) })
              }
              disabled={loadingTiposCandidatura || !!editId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingTiposCandidatura ? "Carregando..." : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tiposCandidatura?.map((tipo) => (
                  <SelectItem key={tipo.codigo} value={tipo.codigo.toString()}>
                    {tipo.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Calendário */}

          <div className="space-y-2 col-span-2">
            <Label>Tipo de Calendário *</Label>
            <Select
              value={form.codigo_tipo_calendario?.toString() || ""}
              onValueChange={(v) =>
                setForm({ ...form, codigo_tipo_calendario: Number(v) })
              }
              disabled={loadingTiposCalendario || !!editId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingTiposCalendario ? "Carregando..." : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tiposCalendario?.map((tipo) => (
                  <SelectItem key={tipo.codigo} value={tipo.codigo.toString()}>
                    {tipo.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Início */}
          <div className="space-y-2">
            <Label>Data de Início *</Label>
            <Input
              type="date"
              value={form.data_inicio}
              onChange={(e) =>
                setForm({ ...form, data_inicio: e.target.value })
              }
            />
          </div>
          {/* Data Fim */}
          <div className="space-y-2">
            <Label>Data de Fim *</Label>
            <Input
              type="date"
              value={form.data_fim}
              onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitNew}
            disabled={isSubmitting}
            className="min-w-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                {editId ? "Editando" : "Criando..."}
              </>
            ) : (
              <>{editId ? "Editando" : "Criar Atividade"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
