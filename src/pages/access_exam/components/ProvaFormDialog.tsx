import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import {
  Loader2,
  Search,
  FileText,
  CalendarDays,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Clock,
  MapPin,
  Lock,
  AlignLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";

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
// import { LatexText } from "@/util/LatexText";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useAvailableRooms } from "@/hooks/salas/use-rooms-avaliable";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { LatexText } from "@/components/common/latex-text";

export type ProvaForm = {
  descricao: string;
  senhaProva: string;
  anoLetivoId: string;
  data: string;
  inicio: string;
  duracao: string;
  texto: string;
  perguntas: string;
  disciplinas: string;
  cursos: string;
  local: string;
  periodo_id: string;
};

function parseIdValues(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isInteger(id) && id > 0)
    .filter((id, index, ids) => ids.indexOf(id) === index);
}

type TabKey = "geral" | "conteudo" | "perguntas";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "geral", label: "Dados gerais", icon: FileText },
  { key: "conteudo", label: "Cursos e Disciplinas", icon: GraduationCap },
  { key: "perguntas", label: "Perguntas", icon: HelpCircle },
];

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

/* ── componente auxiliar: card de secção ─────────────────────────────────── */
function SectionCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border/60 bg-card/50 p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-foreground tracking-tight">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

/* ── componente auxiliar: contador de seleção ───────────────────────────── */
function SelectionCounter({
  value,
  singular,
  plural,
}: {
  value: string;
  singular: string;
  plural: string;
}) {
  const count = parseIdValues(value).length;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        count > 0
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <Check className="h-3 w-3" />
      {count} {count === 1 ? singular : plural}
    </span>
  );
}

/* ── componente auxiliar: paginação compacta ────────────────────────────── */
function CompactPagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        {total} resultado{total !== 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={page <= 1}
          onClick={onPrev}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs tabular-nums text-muted-foreground min-w-[4rem] text-center">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={page >= totalPages}
          onClick={onNext}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<TabKey>("geral");

  /* ── filtros locais de cursos ─────────────────────────────────────────── */
  const [searchCurso, setSearchCurso] = useState("");
  const { data: todosOsCursos = [], isLoading: isLoadingCursos } = useCursos();

  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
  const cursosFiltrados = useMemo(() => {
    const termo = searchCurso.trim().toLowerCase();
    if (!termo) return todosOsCursos;
    return todosOsCursos.filter((c) =>
      c.designacao.toLowerCase().includes(termo),
    );
  }, [todosOsCursos, searchCurso]);

  /* ── filtros locais de perguntas ────────────────────────────────────── */
  const [searchInput, setSearchInput] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todos");
  const [page, setPage] = useState(1);
  const search = useDebounce(searchInput, 400);

  const { data: perguntasResponse, isLoading: isLoadingPerguntas } =
    usePerguntas({
      descricao: search || undefined,
      disciplinaId: parseFilter(filtroDisciplina),
      page,
      limit: 10,
    });

  const perguntas = perguntasResponse?.data ?? [];
  const pagination = perguntasResponse?.pagination;

  const { data: salas, isLoading: isLoadingSala } = useAvailableRooms({
    anoLectivo: Number(23),
    tipoAula: Number(7),
    periodo: Number(5),
  });

  /* ── resumo para o header ───────────────────────────────────────────── */
  const resumoCursos = parseIdValues(form.cursos).length;
  const resumoDisciplinas = parseIdValues(form.disciplinas).length;
  const resumoPerguntas = parseIdValues(form.perguntas).length;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
          setActiveTab("geral");
        }
      }}
    >
      <DialogContent className="max-w-6xl! max-h-[92vh] overflow-hidden p-0 gap-0">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {isEditing ? "Editar Prova" : "Nova Prova"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {isEditing
                  ? "Atualize os dados da prova selecionada"
                  : "Preencha os campos para criar uma nova prova"}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {resumoCursos > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <GraduationCap className="h-3 w-3" />
                  {resumoCursos} curso{resumoCursos !== 1 ? "s" : ""}
                </span>
              )}
              {resumoDisciplinas > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  {resumoDisciplinas} disciplina
                  {resumoDisciplinas !== 1 ? "s" : ""}
                </span>
              )}
              {resumoPerguntas > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <HelpCircle className="h-3 w-3" />
                  {resumoPerguntas} pergunta
                  {resumoPerguntas !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* ── Tabs de navegação ────────────────────────────────────────── */}
        <div className="px-6 pt-4 border-b border-border/60">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.key === "conteudo" &&
                    (resumoCursos > 0 || resumoDisciplinas > 0) && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                        {resumoCursos + resumoDisciplinas}
                      </span>
                    )}
                  {tab.key === "perguntas" && resumoPerguntas > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {resumoPerguntas}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Corpo scrollável ───────────────────────────────────────────── */}
        <div
          className="overflow-y-auto px-6 py-6"
          style={{ maxHeight: "calc(92vh - 220px)" }}
        >
          {/* ════════════════════════════════════════════════════════════════
              ABA 1 — DADOS GERAIS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "geral" && (
            <div className="space-y-6">
              {/* Secção: Informações Básicas */}
              <SectionCard title="Informações básicas" icon={FileText}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Descrição
                    </Label>
                    <Input
                      value={form.descricao}
                      placeholder="Ex: Prova de Matemática - 1º Semestre"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          descricao: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Senha de acesso
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={form.senhaProva}
                        placeholder={
                          isEditing ? "Deixe em branco para manter" : "••••••"
                        }
                        className="pl-9"
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            senhaProva: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isEditing
                        ? "Deixe em branco para manter a senha atual"
                        : "Os alunos precisarão desta senha para iniciar a prova"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ano letivo
                    </Label>
                    <Select
                      value={form.anoLetivoId}
                      onValueChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          anoLetivoId: value,
                        }))
                      }
                      disabled={isLoadingAcademicYears}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecionar ano letivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map((ano) => (
                          <SelectItem
                            key={ano.codigo}
                            value={String(ano.codigo)}
                          >
                            {ano.designacao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SectionCard>

              {/* Secção: Agendamento */}
              <SectionCard title="Agendamento" icon={CalendarDays}>
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Data da prova
                    </Label>
                    <Input
                      type="date"
                      value={form.data}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          data: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Hora de início
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={form.inicio}
                        className="pl-9"
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            inicio: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Duração (minutos)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="60"
                      value={form.duracao}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          duracao: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* <div className="mt-5">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Local / Sala
                  </Label>
                  <div className="mt-2">
                    <FormCommandSelect
                      label=""
                      width="full"
                      value={form.local}
                      isLoading={isLoadingSala}
                      placeholder={
                        isLoadingSala
                          ? "Carregando salas..."
                          : "Selecione a sala"
                      }
                      options={salas ?? []}
                      map={(sala) => ({
                        key: sala.salaid,
                        value: sala.salaid.toString(),
                        label: sala.sala,
                      })}
                      onChange={(v) =>
                        setForm((current) => ({
                          ...current,
                          local: v,
                        }))
                      }
                    />
                  </div>
                </div> */}
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Local / Sala
                    </Label>
                    <div className="mt-2">
                      <FormCommandSelect
                        label=""
                        width="full"
                        value={form.local}
                        isLoading={isLoadingSala}
                        placeholder={
                          isLoadingSala
                            ? "Carregando salas..."
                            : "Selecione a sala"
                        }
                        options={salas ?? []}
                        map={(sala) => ({
                          key: sala.salaid,
                          value: sala.salaid.toString(),
                          label: sala.sala,
                        })}
                        onChange={(v) =>
                          setForm((current) => ({
                            ...current,
                            local: v,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Periodo
                    </Label>

                    <div className="mt-2">
                      <FormSelect
                        disabled={isLoadingPeriodos}
                        loading={isLoadingPeriodos}
                        value={form.periodo_id.toString()}
                        onChange={(v) =>
                          setForm((current) => ({
                            ...current,
                            periodo_id: v,
                          }))
                        }
                        options={periodos}
                        map={(p) => ({
                          key: p.codigo,
                          label: p.designacao,
                          value: p.codigo,
                        })}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Secção: Instruções */}
              <SectionCard title="Texto e instruções" icon={AlignLeft}>
                <Textarea
                  value={form.texto}
                  placeholder="Escreva aqui as instruções que os alunos verão antes de iniciar a prova..."
                  rows={5}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      texto: event.target.value,
                    }))
                  }
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Este texto será apresentado aos alunos no início da prova.
                </p>
              </SectionCard>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              ABA 2 — CURSOS E DISCIPLINAS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "conteudo" && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Cursos */}
              <SectionCard
                title="Cursos associados"
                icon={GraduationCap}
                className="h-fit"
              >
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar curso..."
                    value={searchCurso}
                    onChange={(e) => setSearchCurso(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="rounded-lg border border-border/60 bg-background">
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
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <SelectionCounter
                    value={form.cursos}
                    singular="curso selecionado"
                    plural="cursos selecionados"
                  />
                  {form.cursos && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setForm((current) => ({ ...current, cursos: "" }))
                      }
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>
              </SectionCard>

              {/* Disciplinas */}
              <SectionCard
                title="Disciplinas da prova"
                icon={BookOpen}
                className="h-fit"
              >
                <div className="rounded-lg border border-border/60 bg-background">
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
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <SelectionCounter
                    value={form.disciplinas}
                    singular="disciplina selecionada"
                    plural="disciplinas selecionadas"
                  />
                  {form.disciplinas && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setForm((current) => ({ ...current, disciplinas: "" }))
                      }
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              ABA 3 — PERGUNTAS
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === "perguntas" && (
            <div className="space-y-5">
              {/* Barra de ferramentas de filtros */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar enunciado..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setPage(1);
                    }}
                    className="pl-9"
                  />
                </div>
                <div className="w-full sm:w-[240px]">
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

              {/* Lista de perguntas */}
              <div className="rounded-xl border border-border/60 bg-background">
                <SelectionList
                  value={form.perguntas}
                  items={perguntas}
                  isLoading={isLoadingPerguntas}
                  emptyMessage="Nenhuma pergunta encontrada para os filtros aplicados."
                  getId={(pergunta) => pergunta.id}
                  getLabel={(pergunta) => (
                    <div className="min-w-0 flex-1">
                      <div className="break-words whitespace-normal leading-5">
                        <LatexText text={pergunta.descricao} />
                      </div>

                      <span className="text-muted-foreground text-xs">
                        {pergunta.disciplina}
                      </span>
                    </div>
                  )}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, perguntas: value }))
                  }
                />
              </div>

              {/* Paginação + contador */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <SelectionCounter
                  value={form.perguntas}
                  singular="pergunta selecionada"
                  plural="perguntas selecionadas"
                />

                {pagination && pagination.totalPages > 1 && (
                  <CompactPagination
                    page={page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    onPrev={() => setPage((p) => p - 1)}
                    onNext={() => setPage((p) => p + 1)}
                  />
                )}
              </div>

              {form.perguntas && (
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setForm((current) => ({ ...current, perguntas: "" }))
                    }
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpar seleção de perguntas
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer fixo ────────────────────────────────────────────────── */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 gap-2">
          <div className="flex items-center gap-3 mr-auto">
            {resumoCursos > 0 && (
              <span className="text-xs text-muted-foreground">
                {resumoCursos} curso{resumoCursos !== 1 ? "s" : ""}
              </span>
            )}
            {resumoDisciplinas > 0 && (
              <span className="text-xs text-muted-foreground">
                {resumoDisciplinas} disciplina
                {resumoDisciplinas !== 1 ? "s" : ""}
              </span>
            )}
            {resumoPerguntas > 0 && (
              <span className="text-xs text-muted-foreground">
                {resumoPerguntas} pergunta
                {resumoPerguntas !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="min-w-[140px]"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Guardar alterações" : "Criar prova"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
