import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
} from "lucide-react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building,
  GraduationCap,
  ClipboardList,
  FileText,
  BarChart2,
  ScrollText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";
import { useAuth } from "@/hooks/use-auth";
import { useQueryListSchedules } from "@/hooks/horario/use-query-horarios-by-teacher";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { useAssiduidadeDocente } from "@/hooks/docentes/useAssiduidadeDocente";
import { useQueryDocenteCadeiras } from "@/hooks/docentes/use-docentes-cadeiras";
import { useQueryDocenteCursos } from "@/hooks/docentes/use-docentes-curso";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryStatusAgendamento } from "@/hooks/assiduidade/use-fetch-assiduidade-status-agendamentos";
import { FormSelect } from "@/components/common/FormSelect";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { parseFilter } from "@/util/parse-filter";
import { useUpdatePassword } from "@/hooks/auth/use-query-auth";
import { useUpdatePersonUser } from "@/hooks/acess/useUpdatePersonUser";

// ===================== TYPES =====================

export interface TeacherInfo {
  pessoaid: number;
  name: string;
  numero_documento: string;
  employeeId: string | number;
  email: string;
  phone: string;
  phone2: string;
  department: string;
  category: string;
  office: string;
  hireDate: string;
  birthDate: string;
  address: string;
}

interface PasswordState {
  current: string;
  new: string;
  confirm: string;
}

interface ShowPasswordState {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface AssiduidadeFilters {
  anoCurricular: string;
  unidadeCurricular: string;
  dataInicio: string;
  dataFim: string;
  estado: string;
  anoLectivo: string;
  semestre: string;
  curso: string;
  page: number;
  limit: number;
}

const EMPTY_FILTERS: AssiduidadeFilters = {
  anoLectivo: "",
  semestre: "",
  estado: "",
  dataInicio: "",
  dataFim: "",
  curso: "",
  anoCurricular: "all",
  unidadeCurricular: "",
  page: 1,
  limit: 5,
};

// ===================== CONSTANTS =====================

const ESTADO_BADGE_CONFIG: Record<string, { label: string; className: string }> = {
  Falta: {
    label: "Falta",
    className: "bg-red-100 text-red-700 border border-red-300",
  },
  Realizada: {
    label: "Realizada",
    className: "bg-green-100 text-green-700 border border-green-300",
  },
  Pendente: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
};

// ===================== SMALL COMPONENTS =====================

function EstadoBadge({ estado }: { estado: string }) {
  const config = ESTADO_BADGE_CONFIG[estado] ?? {
    label: estado,
    className: "bg-gray-100 text-gray-700 border border-gray-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function RestrictedAccessAlert({ section }: { section: string }) {
  return (
    <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="font-semibold">Acesso Restrito</AlertTitle>
      <AlertDescription className="mt-1 space-y-1">
        <p>
          Esta secção destina-se exclusivamente a <strong>docentes</strong> e permite consultar{" "}
          {section}.
        </p>
        <p>
          A sua conta não está associada a um perfil de docente, pelo que não tem permissão para
          visualizar estes dados.
        </p>
      </AlertDescription>
    </Alert>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 py-16 text-center">
      <div className="rounded-full bg-muted p-5 mb-4">
        <Icon className="h-14 w-14 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  disabled,
  show,
  onToggleShow,
  onChange,
  placeholder = "••••••••",
}: {
  label: string;
  value: string;
  disabled: boolean;
  show: boolean;
  onToggleShow: () => void;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <div className="relative flex-1">
          <Input
            disabled={disabled}
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-10"
          />
          <button
            type="button"
            onClick={onToggleShow}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== ASSIDUIDADE TAB =====================

function AssiduidadeTab({
  docenteId,
  isDocente,
}: {
  docenteId: string | undefined;
  isDocente: boolean;
}) {
  const [filters, setFilters] = useState<AssiduidadeFilters>(EMPTY_FILTERS);

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: statusAgendamentos, isLoading: isLoadingStatusAgendamento } =
    useQueryStatusAgendamento({ enabled: true });

  const { data: assiduidadeAula, isLoading: isLoadingAssiduidade } = useAssiduidadeDocente({
    docenteId: parseFilter(docenteId),
    gradeId: parseFilter(filters.unidadeCurricular),
    // NOTE: dataFim/dataInicio estavam trocados na versão original — corrigido aqui
    dataInicio: filters.dataInicio || undefined,
    dataFim: filters.dataFim || undefined,
    estadoAgendamento: parseFilter(filters.estado),
    anoLectivo: parseFilter(filters.anoLectivo),
    semestre: parseFilter(filters.semestre),
    page: filters.page,
    limit: filters.limit,
  });

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } = useQueryDocenteCadeiras({
    anoLectivo: parseFilter(filters.anoLectivo),
    classeId: parseFilter(filters.anoCurricular),
    cursoId: parseFilter(filters.curso),
    semestreId: parseFilter(filters.semestre),
    docenteId: parseFilter(docenteId),
  });

  const { data: cursos } = useQueryDocenteCursos({
    anoLectivo: parseFilter(filters.anoLectivo),
    docenteId: parseFilter(docenteId),
  });

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({ curso: filters.curso });

  const totalPages = assiduidadeAula?.total ?? 1;
  const currentPage = assiduidadeAula?.page ?? 1;

  const contagem = useMemo(
    () =>
      assiduidadeAula?.data?.reduce(
        (acc, item) => {
          acc[item.estado] = (acc[item.estado] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [assiduidadeAula?.data],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;
      setFilters((prev) => ({ ...prev, page: newPage }));
    },
    [totalPages],
  );

  const handleClearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const ucPlaceholder = useMemo(() => {
    if (!filters.curso) return "Selecione curso";
    if (!filters.semestre) return "Selecione semestre";
    if (isLoadingUC) return "Carregando UCs...";
    return "Selecionar UC";
  }, [filters.curso, filters.semestre, isLoadingUC]);

  return (
    <div className="space-y-6">
      {!isDocente && (
        <RestrictedAccessAlert section="a sua própria assiduidade nas aulas que leciona" />
      )}

      {/* Filtros */}
      <div className="bg-muted/30 border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Filtros</h4>
          <Button
            variant="destructive"
            size="sm"
            disabled={!isDocente}
            onClick={handleClearFilters}
          >
            Limpar filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label>Ano Letivo</Label>
            <FormSelect
              disabled={isLoadingAcademicYear || !isDocente}
              value={filters.anoLectivo}
              onChange={(v) => setFilters((prev) => ({ ...prev, anoLectivo: v, page: 1 }))}
              options={anosAcademicos ?? []}
              map={(a) => ({ key: a.codigo, label: a.designacao, value: String(a.codigo) })}
              placeholder="Selecione o ano..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Estado</Label>
            <FormSelect
              disabled={isLoadingStatusAgendamento || !isDocente}
              value={filters.estado ?? ""}
              onChange={(v) =>
                setFilters((prev) => ({ ...prev, estado: v === "" ? "" : v, page: 1 }))
              }
              options={[
                { key: "todos", label: "Todos os estados", value: null },
                ...(statusAgendamentos ?? []).map((s) => ({
                  key: s.codigo,
                  label: s.designacao,
                  value: String(s.codigo),
                })),
              ]}
              map={(opt) => opt}
              placeholder="Selecione o estado..."
            />
          </div>

          <SemestreSelect
            onChangeValue={(v) => setFilters((prev) => ({ ...prev, semestre: v, page: 1 }))}
            value={filters.semestre}
            key={filters.semestre}
            disabled={!isDocente}
          />

          <div className="space-y-1.5">
            <Label>Curso</Label>
            <FormCommandSelect
              value={filters.curso}
              options={cursos}
              disabled={!isDocente}
              map={(c) => ({
                key: c.codigo.toString(),
                value: c.codigo.toString(),
                label: c.designacao,
              })}
              onChange={(v) =>
                setFilters((prev) => ({ ...prev, curso: v, unidadeCurricular: "" }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>Ano Curricular</Label>
            <Select
              value={filters.anoCurricular}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, anoCurricular: v, unidadeCurricular: "" }))
              }
              disabled={!filters.curso || !isDocente}
            >
              <SelectTrigger>
                <SelectValue placeholder={filters.curso ? "Todos os anos" : "Selecione curso"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os anos</SelectItem>
                {anosCurriculares.map((ac) => (
                  <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                    {ac.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Unidade Curricular</Label>
            <FormCommandSelect
              value={filters.unidadeCurricular}
              options={unidadesCurriculares}
              disabled={!isDocente}
              map={(u) => ({ key: u.codigo, value: u.codigo, label: u.nome_cadeira })}
              placeholder={ucPlaceholder}
              onChange={(u) => setFilters((prev) => ({ ...prev, unidadeCurricular: u }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data início</Label>
            <Input
              type="date"
              disabled={!isDocente}
              value={filters.dataInicio ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dataInicio: e.target.value, page: 1 }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data fim</Label>
            <Input
              type="date"
              disabled={!isDocente}
              value={filters.dataFim ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dataFim: e.target.value, page: 1 }))
              }
            />
          </div>
        </div>
      </div>

      {isDocente && (
        <>
          {/* Legenda */}
          <div className="flex flex-wrap gap-4">
            {[
              { color: "bg-yellow-300", label: "Marcações Pendentes", key: "Pendente" },
              { color: "bg-green-200", label: "Presenças Marcadas", key: "Realizada" },
              { color: "bg-red-300", label: "Faltas Marcadas", key: "Falta" },
            ].map(({ color, label, key }) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`} />
                <span className="text-sm">
                  {label} ({contagem?.[key] ?? 0})
                </span>
              </div>
            ))}
          </div>

          {/* Tabela */}
          {isLoadingAssiduidade ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !assiduidadeAula?.data?.length ? (
            <EmptyState
              icon={ClipboardList}
              title="Nenhum registo encontrado"
              description="Tente ajustar os filtros"
            />
          ) : (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-20">Código</TableHead>
                        <TableHead className="min-w-[150px]">Docente</TableHead>
                        <TableHead className="min-w-[120px]">Horário</TableHead>
                        <TableHead className="min-w-[200px]">Unidade Curricular</TableHead>
                        <TableHead className="min-w-20">Tempo</TableHead>
                        <TableHead className="min-w-[120px]">Data da Aula</TableHead>
                        <TableHead className="min-w-[100px]">Hora Início</TableHead>
                        <TableHead className="min-w-[100px]">Hora Término</TableHead>
                        <TableHead className="min-w-[120px]">Assiduidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assiduidadeAula.data.map((r) => (
                        <TableRow key={r.codigo} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{r.codigo}</TableCell>
                          <TableCell className="font-medium">{r.docente ?? "N/A"}</TableCell>
                          <TableCell>{r.curso}</TableCell>
                          <TableCell>{r.unidade_curricular}</TableCell>
                          <TableCell>{r.ordem_tempo}</TableCell>
                          <TableCell>{r["data aula"]}</TableCell>
                          <TableCell>{r.hora_inicio}</TableCell>
                          <TableCell>{r.hora_termino}</TableCell>
                          <TableCell>
                            <EstadoBadge estado={r.estado} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <p className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Próximo <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ===================== SKELETON LOADING =====================

function ProfileSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-80 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <Skeleton className="h-40 w-40 rounded-full mx-auto" />
            <div className="text-center space-y-3">
              <Skeleton className="h-7 w-56 mx-auto" />
              <Skeleton className="h-5 w-32 mx-auto" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="pt-6 space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===================== HOOKS HELPERS =====================

const EMPTY_TEACHER: TeacherInfo = {
  pessoaid: 0,
  name: "",
  numero_documento: "",
  employeeId: "",
  email: "",
  phone: "",
  phone2: "",
  department: "",
  category: "",
  office: "",
  hireDate: "",
  birthDate: "",
  address: "",
};
function convertPTDateToISO(date: string) {
  if (!date) return "";

  const [day, month, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function mapTeacherData(data: NonNullable<ReturnType<typeof useQueryTeacherProfile>["data"]>): TeacherInfo {
  return {
    pessoaid: data.pessoaid,
    name: data.nome || "",
    numero_documento: data.numero_documento || "",
    employeeId: data.n_mecanografico || "",
    email: data.email || "",
    phone: data.contacto_1 || "",
    phone2: data.contacto_2 || "",
    department: data.faculdade_designacao || "",
    category: data.descricao_categoria || "",
    office: data.escalao || "",
    hireDate: data.data_inicio_docente || "",
    birthDate: convertPTDateToISO(data.data_nascimento) || "",
    address: data.endereco || "",
  };
}

function usePasswordStrength(password: string) {
  return useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  }, [password]);
}

function getStrengthLabel(score: number): string {
  const labels: Record<number, string> = {
    0: "",
    25: "Muito fraca",
    50: "Fraca",
    75: "Boa",
    100: "Forte",
  };
  return labels[score] ?? "";
}

function formatDatePT(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("pt-AO");
  } catch {
    return dateStr;
  }
}

// ===================== MAIN COMPONENT =====================

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>(EMPTY_TEACHER);
  const [passwords, setPasswords] = useState<PasswordState>({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState<ShowPasswordState>({
    current: false,
    new: false,
    confirm: false,
  });

  const { user } = useAuth();
  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdatePersonUser();
  const { data: userDate } = useCurrentUser("GA");

  const isDocente = userDate?.roles?.docente ?? false;
  const isSaving = isUpdatingPassword || isUpdatingUser;

  const { data: academicYear, isLoading: isLoadingAcademicYear, isError: isErrorAcademicYear } =
    useQueryAnoAcademico();

  const {
    data: teacherInfoData,
    isLoading: teacherInfoDataLoading,
    isError: teacherInfoError,
  } = useQueryTeacherProfile(user?.user?.pk_utilizador);

  const activeYear = useMemo(
    () => academicYear?.find((ay) => ay.estado.toLowerCase() === "activo"),
    [academicYear],
  );

  const {
    data: turmData,
    isLoading: isLoadingTurmaData,
    isError: isErrorTurma,
  } = useQueryListSchedules({
    teacherId: teacherInfoData?.codigo_docente,
    anoLectivo: activeYear?.codigo,
  });

  // Sync server data → local state
  useEffect(() => {
    if (teacherInfoData) {
      setTeacherInfo(mapTeacherData(teacherInfoData));
    }
  }, [teacherInfoData]);

  const initials = useMemo(
    () =>
      teacherInfo.name
        ? teacherInfo.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
        : "",
    [teacherInfo.name],
  );

  const passwordStrength = usePasswordStrength(passwords.new);
  const strengthLabel = getStrengthLabel(passwordStrength);

  // ---- Handlers ----

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    // Revert unsaved changes
    if (teacherInfoData) setTeacherInfo(mapTeacherData(teacherInfoData));
    setPasswords({ current: "", new: "", confirm: "" });
  }, [teacherInfoData]);

  function formatToInputDate(date: string | null) {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }

  const handlePasswordSave = useCallback(async () => {
    if (!passwords.current) return toast.error("Introduza a senha atual.");
    if (passwords.new.length < 8) return toast.error("A senha deve ter no mínimo 8 caracteres.");
    if (passwords.new !== passwords.confirm) return toast.error("As senhas não coincidem.");

    try {
      await updatePassword({
        senhaAtual: passwords.current,
        novaSenha: passwords.new,
        confirmarNovaSenha: passwords.confirm,
        platform: "GA",
      });
      setPasswords({ current: "", new: "", confirm: "" });
      setIsEditing(false);
    } catch {
      // Error toast handled by the mutation hook
    }
  }, [passwords, updatePassword]);

  const handlePersonalUpdate = useCallback(async () => {
    if (!teacherInfo.name || !teacherInfo.email) {
      return toast.error("Nome e email são obrigatórios.");
    }
    if (teacherInfo.numero_documento && teacherInfo.numero_documento.length < 5) {
      return toast.error("O número de documento deve ter pelo menos 5 caracteres.");
    }
    if (teacherInfo.phone && !/^\d{9,}$/.test(teacherInfo.phone)) {
      return toast.error("O número de telefone deve conter apenas dígitos e ter pelo menos 9 caracteres.");
    }

    if (teacherInfo.phone2 && !/^\d{9,}$/.test(teacherInfo.phone2)) {
      return toast.error("O número de telefone 2 deve conter apenas dígitos e ter pelo menos 9 caracteres.");
    }
    if (teacherInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherInfo.email)) {
      return toast.error("Introduza um endereço de email válido.");
    }
    if (!teacherInfo.pessoaid) {
      return toast.error("ID do docente não encontrado. Impossível atualizar informações.");
    }
    try {
      await updateUser({
        id: teacherInfo.pessoaid,
        payload: {
          nomeCompleto: teacherInfo.name,
          numDocIdentificacao: teacherInfo.numero_documento || null,
          email: teacherInfo.email || null,
          dataDeNascimento: formatToInputDate(teacherInfo.birthDate),
          telefone1: teacherInfo.phone || null,
          telefone2: teacherInfo.phone2 || null,
        },
      });
      setIsEditing(false);
    } catch {
      toast.error("Erro ao atualizar informações pessoais.");
    }
  }, [teacherInfo, updateUser]);

  const handleSave = useCallback(() => {
    if (activeTab === "personal") return handlePersonalUpdate();
    if (activeTab === "security") return handlePasswordSave();
  }, [activeTab, handlePersonalUpdate, handlePasswordSave]);

  const canShowSaveButtons =
    isEditing &&
    activeTab !== "classes" &&
    !(activeTab === "professional" && !isDocente);

  // ---- Loading / Error states ----

  const isLoading = isLoadingAcademicYear || teacherInfoDataLoading || isLoadingTurmaData;
  const hasError = isErrorAcademicYear || teacherInfoError || isErrorTurma;

  if (isLoading) return <ProfileSkeleton />;

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-6 p-8">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Erro a processar informações do perfil</h2>
          <p className="text-muted-foreground max-w-md">
            Não foi possível carregar os dados do docente. Verifique a sua ligação à internet ou
            tente novamente.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  // ---- Render ----

  return (
    <div className="space-y-8 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil do Docente</h1>
          <p className="text-muted-foreground">Visualize e edite as suas informações profissionais</p>
        </div>
        <Button variant={isEditing ? "default" : "outline"} onClick={() => setIsEditing((v) => !v)}>
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Cancelar" : "Editar Dados"}
        </Button>
      </div>

      {/* Secção Superior */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Avatar + Info Rápida */}
        <Card>
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-40 w-40 border-4 border-background">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                  {initials || "NA"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-semibold">{teacherInfo.name}</h3>
              <p className="text-sm text-muted-foreground">Nº Mec: {teacherInfo.employeeId || "N/A"}</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Briefcase className="h-4 w-4" />
                <span>{teacherInfo.category || "N/A"}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{teacherInfo.department || "N/A"}</span>
              </div>
            </div>
            <Button className="w-full" variant="outline" disabled={!isEditing}>
              Alterar Foto
            </Button>
          </CardContent>
        </Card>

        {/* Informações Detalhadas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            {isEditing && <CardDescription>Campos editáveis estão ativos.</CardDescription>}
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Pessoal</TabsTrigger>
                <TabsTrigger value="professional">Profissional</TabsTrigger>
                <TabsTrigger value="classes">Horários</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
              </TabsList>

              {/* PESSOAL */}
              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.name}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Institucional</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={teacherInfo.email}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone Principal</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.phone}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone Alternativo</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.phone2}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({ ...prev, phone2: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={teacherInfo.birthDate || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({
                            ...prev,
                            birthDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Documento</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.numero_documento}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({ ...prev, numero_documento: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* PROFISSIONAL */}
              <TabsContent value="professional" className="space-y-4 pt-4">
                {!isDocente ? (
                  <RestrictedAccessAlert section="os seus dados profissionais" />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nº de Funcionário</Label>
                      <Input value={teacherInfo.employeeId} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Input
                        value={teacherInfo.category}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({ ...prev, category: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Faculdade / Departamento</Label>
                      <Input value={teacherInfo.department} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Escalão</Label>
                      <Input
                        value={teacherInfo.office}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setTeacherInfo((prev) => ({ ...prev, office: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Data de Admissão</Label>
                      <Input value={formatDatePT(teacherInfo.hireDate)} disabled />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* HORÁRIOS */}
              <TabsContent value="classes" className="pt-4">
                {!isDocente ? (
                  <RestrictedAccessAlert section="os seus horários" />
                ) : isLoadingTurmaData ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-28 w-full rounded-lg" />
                    ))}
                  </div>
                ) : turmData?.horarios?.length ? (
                  <div className="space-y-4">
                    {turmData.horarios.map((cls) => (
                      <div
                        key={cls.codigo_horario}
                        className="flex items-center gap-4 rounded-lg border bg-card p-5 transition-all hover:shadow-md"
                      >
                        <GraduationCap className="h-12 w-12 text-primary" />
                        <div className="flex-1">
                          <p className="font-semibold text-lg">
                            {cls.codigo_grade} – {cls.grade}
                          </p>
                          <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                            <p>• Horário: {cls.horario}</p>
                            <p>• Sala: {cls.sala}</p>
                            {cls.docente && <p>• Docente: {cls.docente}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={GraduationCap}
                    title="Nenhum horário encontrado"
                    description="Não existem turmas ou horários atribuídos ao docente no ano lectivo ativo."
                  />
                )}
              </TabsContent>

              {/* SEGURANÇA */}
              <TabsContent value="security" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium border-b pb-2">Atualizar Senha</h3>
                </div>

                <PasswordInput
                  label="Senha Atual"
                  value={passwords.current}
                  disabled={!isEditing}
                  show={showPasswords.current}
                  onToggleShow={() =>
                    setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                  }
                  onChange={(v) => setPasswords((prev) => ({ ...prev, current: v }))}
                />

                <div className="space-y-2">
                  <PasswordInput
                    label="Nova Senha"
                    value={passwords.new}
                    disabled={!isEditing}
                    show={showPasswords.new}
                    onToggleShow={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                    onChange={(v) => setPasswords((prev) => ({ ...prev, new: v }))}
                  />
                  <Progress value={passwordStrength} className="h-1" />
                  {strengthLabel && (
                    <p className="text-xs text-muted-foreground">{strengthLabel}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <PasswordInput
                    label="Confirmar Nova Senha"
                    value={passwords.confirm}
                    disabled={!isEditing}
                    show={showPasswords.confirm}
                    onToggleShow={() =>
                      setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                    }
                    onChange={(v) => setPasswords((prev) => ({ ...prev, confirm: v }))}
                  />
                  {passwords.confirm && (
                    <p
                      className={`text-xs ${passwords.new === passwords.confirm ? "text-green-600" : "text-red-500"
                        }`}
                    >
                      {passwords.new === passwords.confirm
                        ? "As senhas coincidem"
                        : "As senhas não coincidem"}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {canShowSaveButtons && (
              <div className="mt-8 flex gap-3">
                <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
                  {isSaving ? "A guardar..." : "Guardar Alterações"}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secção Inferior — Tabs Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade do Docente</CardTitle>
          <CardDescription>Consulte a sua assiduidade, avaliações, pautas e contratos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assiduidade" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assiduidade" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Assiduidade
              </TabsTrigger>
              <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Avaliações
              </TabsTrigger>
              <TabsTrigger value="pautas" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Pautas
              </TabsTrigger>
              <TabsTrigger value="contratos" className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" /> Contratos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assiduidade" className="pt-6">
              <AssiduidadeTab
                docenteId={teacherInfoData?.codigo_docente?.toString()}
                isDocente={isDocente}
              />
            </TabsContent>

            <TabsContent value="avaliacoes" className="pt-6">
              <EmptyState
                icon={BarChart2}
                title="Avaliações"
                description="Aqui será apresentado o histórico de avaliações lançadas pelo docente."
              />
            </TabsContent>

            <TabsContent value="pautas" className="pt-6">
              <EmptyState
                icon={FileText}
                title="Pautas"
                description="Aqui serão listadas as pautas submetidas pelo docente."
              />
            </TabsContent>

            <TabsContent value="contratos" className="pt-6">
              <EmptyState
                icon={ScrollText}
                title="Contratos"
                description="Aqui será apresentada a informação contratual do docente."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfile;