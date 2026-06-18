import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { Loader2, Search } from "lucide-react";

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
import { Disciplina } from "@/services/access_exam/tipos-disciplinas.service";
import { AnoAcademico } from "@/services/fetch-anos-academico";
import { plainTextFromHtml } from "@/util/prova-text-format";
import { parseFilter } from "@/util/parse-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { usePerguntas } from "@/hooks/access_exam/use-exames-de-acesso.hooks";
import { useCursos } from "@/hooks/use-cursos";
import { DisciplinaCommandSelect } from "./Disciplinacommandselect";
import { SelectionList } from "./SelectionList";
import { LatexText } from "@/util/LatexText";

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
  disciplinas: Disciplina[];
  isLoadingDisciplinas: boolean;
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
  disciplinas,
  isLoadingDisciplinas,
  isSaving,
  onClose,
  onSave,
}: ProvaFormDialogProps) {
  // ── filtros locais de cursos ──────────────────────────────────────────────
  const [searchCurso, setSearchCurso] = useState("");

  const { data: todosOsCursos = [], isLoading: isLoadingCursos } = useCursos();

  const cursosFiltrados = useMemo(() => {
    const termo = searchCurso.trim().toLowerCase();
    if (!termo) return todosOsCursos;
    return todosOsCursos.filter((c) =>
      c.designacao.toLowerCase().includes(termo)
    );
  }, [todosOsCursos, searchCurso]);

  // ── filtros locais de perguntas ───────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todos");
  const [page, setPage] = useState(1);
  const search = useDebounce(searchInput, 400);

  const { data: perguntasResponse, isLoading: isLoadingPerguntas } = usePerguntas({
    descricao: search || undefined,
    disciplinaId: parseFilter(filtroDisciplina),
    page,
    limit: 10,
  });

  const perguntas = perguntasResponse?.data ?? [];
  const pagination = perguntasResponse?.pagination;

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-5xl! max-h-[90vh]! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Prova" : "Nova Prova"}</DialogTitle>
          <DialogDescription>
            Preencha os campos para criar uma nova prova
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

          {/* ── Cursos — com search local ── */}
          <div className="space-y-2">
            <Label>Cursos</Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar curso..."
                value={searchCurso}
                onChange={(e) => setSearchCurso(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <SelectionList
              value={form.cursos}
              items={cursosFiltrados}
              isLoading={isLoadingCursos}
              emptyMessage="Nenhum curso encontrado."
              getId={(curso) => curso.codigo}
              getLabel={(curso) => curso.designacao}
              onChange={(value) =>
                setForm((current) => ({ ...current, cursos: value }))
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
                setForm((current) => ({ ...current, disciplinas: value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              {parseIdValues(form.disciplinas).length} disciplina(s) selecionada(s)
            </p>
          </div>

          {/* ── Perguntas — com filtros e paginação ── */}
          <div className="space-y-2 md:col-span-2">
            <Label>Perguntas</Label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar enunciado..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 h-9"
                />
              </div>
              <div className="sm:w-[220px]">
                <DisciplinaCommandSelect
                  value={filtroDisciplina}
                  onChangeValue={(v) => {
                    setFiltroDisciplina(v);
                    setPage(1);
                  }}
                  label="Disciplina"
                  labelMode="inside"
                  enableDefaultSelectItem
                />
              </div>
            </div>

            <SelectionList
              value={form.perguntas}
              items={perguntas}
              isLoading={isLoadingPerguntas}
              emptyMessage="Nenhuma pergunta encontrada."
              getId={(pergunta) => pergunta.id}
              getLabel={(pergunta) =>
                `${pergunta.descricao} - ${pergunta.disciplina}`
              }
              onChange={(value) =>
                setForm((current) => ({ ...current, perguntas: value }))
              }
            />

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                <span>
                  Página {pagination.page} de {pagination.totalPages} —{" "}
                  {pagination.total} resultados
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {parseIdValues(form.perguntas).length} pergunta(s) selecionada(s)
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