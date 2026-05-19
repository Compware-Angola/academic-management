import { type Dispatch, type SetStateAction } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pergunta } from "@/services/access_exam/questions.service";
import { Disciplina } from "@/services/access_exam/tipos-disciplinas.service";
import { AnoAcademico } from "@/services/fetch-anos-academico";
import { Curso } from "@/services/fetch-course";
import { plainTextFromHtml } from "@/util/prova-text-format";
import { SelectionList } from "./SelectionList";

export type ProvaForm = {
  descricao: string;
  senhaProva: string;
  anoLetivoId: string;
  duracao: string;
  texto: string;
  perguntas: string;
  disciplinas: string;
  cursos: string;
};

function parseIdValues(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isInteger(id) && id > 0)
    .filter((id, index, ids) => ids.indexOf(id) === index);
}

type ProvaFormDialogProps = {
  open: boolean;
  isEditing: boolean;
  form: ProvaForm;
  setForm: Dispatch<SetStateAction<ProvaForm>>;
  academicYears: AnoAcademico[];
  isLoadingAcademicYears: boolean;
  cursos: Curso[];
  isLoadingCursos: boolean;
  disciplinas: Disciplina[];
  isLoadingDisciplinas: boolean;
  perguntas: Pergunta[];
  isLoadingPerguntas: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
};

export function ProvaFormDialog({
  open,
  isEditing,
  form,
  setForm,
  academicYears,
  isLoadingAcademicYears,
  cursos,
  isLoadingCursos,
  disciplinas,
  isLoadingDisciplinas,
  perguntas,
  isLoadingPerguntas,
  isSaving,
  onClose,
  onSave,
}: ProvaFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Prova" : "Nova Prova"}</DialogTitle>
          <DialogDescription>
            Preencha os campos conforme o contrato do backend.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Descrição *</Label>
            <Input
              value={form.descricao}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  descricao: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Senha {isEditing ? "" : "*"}</Label>
            <Input
              value={form.senhaProva}
              placeholder={isEditing ? "Manter senha atual" : ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  senhaProva: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Ano Letivo *</Label>
            <Select
              value={form.anoLetivoId}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, anoLetivoId: value }))
              }
              disabled={isLoadingAcademicYears}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar ano letivo" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((ano) => (
                  <SelectItem key={ano.codigo} value={String(ano.codigo)}>
                    {ano.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duração em minutos *</Label>
            <Input
              type="number"
              min={1}
              value={form.duracao}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  duracao: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Cursos</Label>
            <SelectionList
              value={form.cursos}
              items={cursos}
              isLoading={isLoadingCursos}
              emptyMessage="Nenhum curso encontrado."
              getId={(curso) => curso.codigo}
              getLabel={(curso) => curso.designacao}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  cursos: value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              {parseIdValues(form.cursos).length} curso(s) selecionado(s)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Disciplinas</Label>
            <SelectionList
              value={form.disciplinas}
              items={disciplinas}
              isLoading={isLoadingDisciplinas}
              emptyMessage="Nenhuma disciplina encontrada."
              getId={(disciplina) => disciplina.id}
              getLabel={(disciplina) => disciplina.designacao}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  disciplinas: value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              {parseIdValues(form.disciplinas).length} disciplina(s)
              selecionada(s)
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Perguntas</Label>
            <SelectionList
              value={form.perguntas}
              items={perguntas}
              isLoading={isLoadingPerguntas}
              emptyMessage="Nenhuma pergunta encontrada."
              getId={(pergunta) => pergunta.id}
              getLabel={(pergunta) =>
                `${plainTextFromHtml(pergunta.descricao)} - ${pergunta.disciplina}`
              }
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  perguntas: value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              {parseIdValues(form.perguntas).length} pergunta(s)
              selecionada(s)
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Texto/Instruções</Label>
            <Textarea
              value={form.texto}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  texto: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar alterações" : "Criar prova"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
