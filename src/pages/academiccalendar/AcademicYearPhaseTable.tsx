import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Save,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileEdit,
  Settings2,
  Rocket,
  Lock,
  Sparkles,
  ArrowRight,
  Info,
  Power,
  ShieldAlert,
  Calendar,
  CalendarClock,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAcademicYears } from "@/hooks/academiccalendar/use-query-academic-years";
import { useUpdateAcademicYearPhase } from "@/hooks/academiccalendar/use-update-academic-year-phase";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";

const JANELA_ATIVACAO_DIAS = 10;

type EstadoAno =
  | "RASCUNHO"
  | "CONFIGURAVEL"
  | "USAVEL"
  | "ACTIVO"
  | "ENCERRADO";

const ESTADOS: Record<
  EstadoAno,
  {
    label: string;
    descricao: string;
    icon: any;
    badgeCls: string;
    dotCls: string;
    permissoes: {
      criarHorarios: boolean;
      matriculas: boolean;
      inscricoes: boolean;
      podeAtivar: boolean;
      criarPrazos: boolean;
      criarActividadesLectivas: boolean;
      gestaoAfectadoa: boolean;
    };
  }
> = {
  RASCUNHO: {
    label: "Rascunho",
    descricao:
      "Ainda não pode ser utilizado. Não permite criar horários nem matrículas.",
    icon: FileEdit,
    badgeCls:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-200",
    dotCls: "bg-slate-400",
    permissoes: {
      criarHorarios: false,
      matriculas: false,
      inscricoes: false,
      podeAtivar: false,
      criarActividadesLectivas: false,
      criarPrazos: false,
      gestaoAfectadoa: false,
    },
  },
  CONFIGURAVEL: {
    label: "Configurável",
    descricao:
      "Permite preparar o ano lectivo: horários, turmas e demais configurações. Ainda não recebe matrículas.",
    icon: Settings2,
    badgeCls:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200",
    dotCls: "bg-amber-500",
    permissoes: {
      criarHorarios: true,
      matriculas: false,
      inscricoes: false,
      podeAtivar: false,
      criarActividadesLectivas: true,
      criarPrazos: true,
      gestaoAfectadoa: true,
    },
  },
  USAVEL: {
    label: "Usável",
    descricao:
      "Pronto para utilização. Permite horários, matrículas e inscrições. Pode tornar-se o Ano Lectivo Activo.",
    icon: Rocket,
    badgeCls:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200",
    dotCls: "bg-emerald-500",
    permissoes: {
      criarHorarios: true,
      matriculas: true,
      inscricoes: true,
      podeAtivar: true,
      criarActividadesLectivas: true,
      criarPrazos: true,
      gestaoAfectadoa: true,
    },
  },
  ACTIVO: {
    label: "Activo",
    descricao:
      "Este é o Ano Lectivo actualmente activo e em uso. Todas as operações estão disponíveis: horários, matrículas e inscrições.",
    icon: Power,
    badgeCls:
      "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/40 dark:text-violet-200",
    dotCls: "bg-violet-500",
    permissoes: {
      criarHorarios: true,
      matriculas: true,
      inscricoes: true,
      podeAtivar: false,
      criarActividadesLectivas: true,
      criarPrazos: true,
      gestaoAfectadoa: true,
    },
  },
  ENCERRADO: {
    label: "Encerrado",
    descricao: "Apenas consulta. Não permite novas operações.",
    icon: Lock,
    badgeCls:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200",
    dotCls: "bg-rose-500",
    permissoes: {
      criarHorarios: false,
      matriculas: false,
      inscricoes: false,
      podeAtivar: false,
      criarActividadesLectivas: false,
      criarPrazos: false,
      gestaoAfectadoa: false,
    },
  },
};

const ORDEM: EstadoAno[] = [
  "RASCUNHO",
  "CONFIGURAVEL",
  "USAVEL",
  "ACTIVO",
  "ENCERRADO",
];

const TRANSICOES: Record<EstadoAno, EstadoAno[]> = {
  RASCUNHO: ["CONFIGURAVEL"],
  CONFIGURAVEL: ["USAVEL", "RASCUNHO"],
  USAVEL: ["ACTIVO"],
  ACTIVO: ["ENCERRADO"],
  ENCERRADO: [],
};

const PERMISSAO_LABELS: Record<
  keyof typeof ESTADOS.RASCUNHO.permissoes,
  string
> = {
  criarHorarios: "Criar horários",
  matriculas: "Receber matrículas",
  inscricoes: "Realizar inscrições",
  podeAtivar: "Pode ser activado como Ano Activo",
  criarActividadesLectivas: "Criar Actividades Lectivas",
  criarPrazos: "Criar Prazos",
  gestaoAfectadoa: "Gestão de Afectação",
};

interface AnoLetivo {
  id: string;
  nome: string;
  estado: EstadoAno;
  // Derivado directamente da fase: só há um ano no estado ACTIVO de cada vez.
  activo: boolean;
  primeiroSemestre: {
    dataInicio: string;
    dataFim: string;
  };
  segundoSemestre: {
    dataInicio: string;
    dataFim: string;
  };
}

function diasDesde(dataISO: string): number {
  const hoje = new Date();
  const data = new Date(dataISO);
  const msPorDia = 1000 * 60 * 60 * 24;
  const hojeUTC = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const dataUTC = Date.UTC(data.getFullYear(), data.getMonth(), data.getDate());
  return Math.floor((hojeUTC - dataUTC) / msPorDia);
}

function dentroJanelaAtivacao(ano: AnoLetivo): boolean {
  const diff = diasDesde(ano.primeiroSemestre.dataInicio);
  return diff >= -JANELA_ATIVACAO_DIAS;
}

function podeEncerrar(ano: AnoLetivo): boolean {
  return diasDesde(ano.segundoSemestre.dataFim) > 0;
}

function EstadoBadge({ estado }: { estado: EstadoAno }) {
  const cfg = ESTADOS[estado];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${cfg.badgeCls}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </Badge>
  );
}

export default function AcademicYearPhase() {
  const { mutate: updatePhase, isPending: isSaving } =
    useUpdateAcademicYearPhase();
  const [tipoCandidatura, setTipoCandidatura] = useState<number>(1);
  const { data, isLoading, isError } = useAcademicYears({
    tipoCandidatura: tipoCandidatura,
  });
  const anos: AnoLetivo[] = useMemo(() => {
    return (data?.data ?? []).map((a) => ({
      id: String(a.codigo),
      nome: a.designacao,
      estado: a.fase_anolectivo as EstadoAno,
      activo: a.fase_anolectivo === "ACTIVO",
      primeiroSemestre: {
        dataInicio: a.datainicioprimeirosemestre,
        dataFim: a.datafimprimeirosemestre,
      },
      segundoSemestre: {
        dataInicio: a.datainiciosegundosemestre,
        dataFim: a.datafimsegundosemestre,
      },
    }));
  }, [data]);

  const [selectedId, setSelectedId] = useState<string>("");
  const [novoEstado, setNovoEstado] = useState<EstadoAno | null>(null);
  const [confirmAtivar, setConfirmAtivar] = useState(false);

  useEffect(() => {
    if (anos.length === 0) return;
    const selecaoAindaValida = anos.some((a) => a.id === selectedId);
    if (!selectedId || !selecaoAindaValida) {
      setSelectedId(anos.find((a) => a.activo)?.id ?? anos[0].id);
    }
  }, [anos]);

  const anoAtual = anos.find((a) => a.id === selectedId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">A carregar…</p>;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro ao carregar Anos Lectivos</AlertTitle>
        <AlertDescription>Tenta recarregar a página.</AlertDescription>
      </Alert>
    );
  }

  if (!anoAtual) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Sem Anos Lectivos</AlertTitle>
        <AlertDescription>
          Não existem Anos Lectivos para este tipo de candidatura.
        </AlertDescription>
      </Alert>
    );
  }

  const estadoCfg = ESTADOS[anoAtual.estado];

  const transicoesPermitidas = TRANSICOES[anoAtual.estado].filter(
    (d) => d !== "ACTIVO",
  );
  const permissoesAtuais = estadoCfg.permissoes;
  const permissoesNovas = novoEstado ? ESTADOS[novoEstado].permissoes : null;
  const activoAtual = anos.find((a) => a.activo);

  const janelaAtivacaoOk = dentroJanelaAtivacao(anoAtual);
  const encerramentoOk = podeEncerrar(anoAtual);

  const solicitarTransicao = (destino: EstadoAno) => {
    if (!TRANSICOES[anoAtual.estado].includes(destino)) {
      toast.error(
        `Não é possível ir de ${estadoCfg.label} para ${ESTADOS[destino].label}.`,
      );
      return;
    }
    if (destino === "ENCERRADO" && !encerramentoOk) {
      toast.error(
        "Só é possível encerrar o Ano Lectivo depois do fim do 2º semestre.",
      );
      return;
    }
    setNovoEstado(destino);
  };

  const confirmarTransicao = () => {
    if (!novoEstado) return;
    updatePhase(
      { academicYearId: Number(anoAtual.id), faseLectiva: novoEstado },
      { onSuccess: () => setNovoEstado(null) },
    );
  };

  const solicitarAtivar = () => {
    if (anoAtual.estado !== "USAVEL") {
      toast.error("Apenas Anos Lectivos Usáveis podem ser activados.");
      return;
    }
    if (anoAtual.activo) {
      toast.info("Este ano já é o Ano Lectivo Activo.");
      return;
    }
    if (!janelaAtivacaoOk) {
      toast.error(
        `Só é possível activar este Ano Lectivo a partir de ${JANELA_ATIVACAO_DIAS} dias antes do início do 1.º semestre.`,
      );
      return;
    }
    setConfirmAtivar(true);
  };

  const confirmarAtivacao = () => {
    updatePhase(
      { academicYearId: Number(anoAtual.id), faseLectiva: "ACTIVO" },
      { onSuccess: () => setConfirmAtivar(false) },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parâmetros do Calendário Académico"
        subtitle="Home / Calendário Académico (Lic.) / Parâmetros"
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">
                <Calendar className="h-3.5 w-3.5" /> Dados Gerais
              </div>
              <CardTitle className="text-2xl flex items-center gap-3">
                Ano Lectivo {anoAtual.nome}
                {anoAtual.activo && (
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <Sparkles className="h-3 w-3" /> Activo
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="max-w-2xl">
                {estadoCfg.descricao}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-muted-foreground">
                Estado actual
              </span>
              <EstadoBadge estado={anoAtual.estado} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <TipoCandidaturaSelect
                value={tipoCandidatura?.toString()}
                onChangeValue={(v) => setTipoCandidatura(Number(v))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anoLetivo">Ano Lectivo</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger id="anoLetivo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {anos.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      <span className="flex items-center gap-2">
                        {a.nome}
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${ESTADOS[a.estado].dotCls}`}
                        />
                        {a.activo && (
                          <Sparkles className="h-3 w-3 text-primary" />
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ano Lectivo Activo (global)</Label>
              <div className="h-10 flex items-center px-3 rounded-md border bg-muted/40 text-sm">
                {activoAtual ? activoAtual.nome : "Nenhum ano activo"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
              Ciclo de vida do Ano Lectivo
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {ORDEM.map((e, idx) => {
                const cfg = ESTADOS[e];
                const Icon = cfg.icon;
                const currentIdx = ORDEM.indexOf(anoAtual.estado);
                const isCurrent = e === anoAtual.estado;
                const isPast = idx < currentIdx;
                return (
                  <div
                    key={e}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <div
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
                        isCurrent
                          ? `${cfg.badgeCls} border-current shadow-sm ring-2 ring-offset-2 ring-current/20`
                          : isPast
                            ? "bg-muted/60 text-muted-foreground border-muted"
                            : "bg-background text-muted-foreground border-dashed"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{cfg.label}</span>
                    </div>
                    {idx < ORDEM.length - 1 && (
                      <ArrowRight
                        className={`h-4 w-4 ${idx < currentIdx ? "text-foreground" : "text-muted-foreground/40"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">
              <ShieldAlert className="h-3.5 w-3.5" /> Permissões do estado
              actual
            </div>
            <CardTitle>O que está disponível em {estadoCfg.label}</CardTitle>
            <CardDescription>
              Este painel actualiza automaticamente quando o estado muda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                Object.keys(PERMISSAO_LABELS) as Array<
                  keyof typeof PERMISSAO_LABELS
                >
              ).map((k) => {
                const ok = permissoesAtuais[k];
                return (
                  <div
                    key={k}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      ok
                        ? "bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40"
                        : "bg-muted/40 border-border"
                    }`}
                  >
                    {ok ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${ok ? "font-medium" : "text-muted-foreground line-through"}`}
                    >
                      {PERMISSAO_LABELS[k]}
                    </span>
                  </div>
                );
              })}
            </div>

            {anoAtual.estado === "RASCUNHO" && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>
                  Este Ano Lectivo ainda não está configurável.
                </AlertTitle>
                <AlertDescription>
                  Avance para <b>Configurável</b> para começar a preparar
                  horários e turmas.
                </AlertDescription>
              </Alert>
            )}
            {anoAtual.estado === "CONFIGURAVEL" && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Não é possível matricular estudantes enquanto o Ano Lectivo
                  não estiver no estado <b>Usável</b>.
                </AlertDescription>
              </Alert>
            )}
            {anoAtual.estado === "USAVEL" && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {janelaAtivacaoOk ? (
                    <>
                      Este Ano Lectivo já pode ser activado. Usa o botão{" "}
                      <b>Definir como Ano Activo</b> no painel ao lado.
                    </>
                  ) : (
                    <>
                      Este Ano Lectivo só pode ser activado a partir de
                      {JANELA_ATIVACAO_DIAS} dias antes do início do 1.º
                      semestre. (
                      {new Date(
                        anoAtual.primeiroSemestre.dataInicio,
                      ).toLocaleDateString("pt-AO")}
                      ).
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}
            {anoAtual.estado === "ACTIVO" && (
              <Alert className="mt-4">
                <Power className="h-4 w-4" />
                <AlertTitle>Ano Lectivo em uso</AlertTitle>
                <AlertDescription>
                  {encerramentoOk ? (
                    "Este Ano Lectivo já terminou e pode ser encerrado."
                  ) : (
                    <>
                      Este é o Ano Lectivo actualmente activo. Só poderá ser
                      encerrado depois do fim do 2º semestre (
                      {new Date(
                        anoAtual.segundoSemestre.dataFim,
                      ).toLocaleDateString("pt-AO")}
                      ).
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}
            {anoAtual.estado === "ENCERRADO" && (
              <Alert variant="destructive" className="mt-4">
                <Lock className="h-4 w-4" />
                <AlertTitle>Ano Lectivo Encerrado</AlertTitle>
                <AlertDescription>
                  Apenas consulta é permitida. Nenhuma nova operação pode ser
                  realizada.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">
              <Power className="h-3.5 w-3.5" /> Activação
            </div>
            <CardTitle>Estado & Activação</CardTitle>
            <CardDescription>
              Altere o estado ou defina como Ano Activo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Transições disponíveis</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {transicoesPermitidas.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma transição disponível.
                  </p>
                )}
                {transicoesPermitidas.map((dest) => {
                  const cfg = ESTADOS[dest];
                  const Icon = cfg.icon;
                  const bloqueadoPorData =
                    dest === "ENCERRADO" && !encerramentoOk;
                  return (
                    <Button
                      key={dest}
                      variant="outline"
                      size="sm"
                      disabled={isSaving || bloqueadoPorData}
                      title={
                        bloqueadoPorData
                          ? "Só é possível encerrar depois do fim do 2º semestre"
                          : undefined
                      }
                      onClick={() => solicitarTransicao(dest)}
                    >
                      <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                      <Icon className="h-3.5 w-3.5 mr-1" />
                      {cfg.label}
                    </Button>
                  );
                })}
              </div>
              {transicoesPermitidas.includes("ENCERRADO") &&
                !encerramentoOk && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Disponível a partir de{" "}
                    {new Date(
                      anoAtual.segundoSemestre.dataFim,
                    ).toLocaleDateString("pt-AO")}
                  </p>
                )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs">Ano Lectivo Activo</Label>
              {anoAtual.activo ? (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    Este ano é actualmente o <b>Ano Lectivo Activo</b>.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Ao activar, o ano actualmente activo (
                    {activoAtual?.nome ?? "nenhum"}) será desactivado.
                  </p>
                  <Button
                    className="w-full"
                    onClick={solicitarAtivar}
                    disabled={anoAtual.estado !== "USAVEL" || !janelaAtivacaoOk}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    Definir como Ano Activo
                  </Button>
                  {anoAtual.estado !== "USAVEL" && (
                    <p className="text-xs text-destructive">
                      Apenas Anos Lectivos Usáveis podem ser activados.
                    </p>
                  )}
                  {anoAtual.estado === "USAVEL" && !janelaAtivacaoOk && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Só pode ser activado entre {JANELA_ATIVACAO_DIAS} dias
                      antes e {JANELA_ATIVACAO_DIAS} dias depois de{" "}
                      {new Date(
                        anoAtual.primeiroSemestre.dataInicio,
                      ).toLocaleDateString("pt-AO")}
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">
            <Settings2 className="h-3.5 w-3.5" /> Configuração
          </div>
          <CardTitle>Períodos Lectivos</CardTitle>
          <CardDescription>
            Configure as datas de início e fim de cada semestre
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anoAtual.primeiroSemestre && (
              <div className="p-4 border rounded-lg">
                <p className="font-medium text-sm mb-2 text-amber-600">
                  1º Semestre
                </p>
                <p className="text-sm">
                  {new Date(
                    anoAtual.primeiroSemestre.dataInicio,
                  ).toLocaleDateString("pt-AO")}{" "}
                  →{" "}
                  {new Date(
                    anoAtual.primeiroSemestre.dataFim,
                  ).toLocaleDateString("pt-AO")}
                </p>
              </div>
            )}

            {anoAtual.segundoSemestre && (
              <div className="p-4 border rounded-lg">
                <p className="font-medium text-sm mb-2 text-blue-600">
                  2º Semestre
                </p>
                <p className="text-sm">
                  {new Date(
                    anoAtual.segundoSemestre.dataInicio,
                  ).toLocaleDateString("pt-AO")}{" "}
                  →{" "}
                  {new Date(
                    anoAtual.segundoSemestre.dataFim,
                  ).toLocaleDateString("pt-AO")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!novoEstado}
        onOpenChange={(o) => !o && setNovoEstado(null)}
      >
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de estado</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-center gap-3">
                  <EstadoBadge estado={anoAtual.estado} />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  {novoEstado && <EstadoBadge estado={novoEstado} />}
                </div>
                {permissoesNovas && (
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                        Serão habilitadas
                      </p>
                      <ul className="space-y-1">
                        {(
                          Object.keys(PERMISSAO_LABELS) as Array<
                            keyof typeof PERMISSAO_LABELS
                          >
                        )
                          .filter(
                            (k) => permissoesNovas[k] && !permissoesAtuais[k],
                          )
                          .map((k) => (
                            <li
                              className="flex items-start gap-1.5 text-xs"
                              key={k}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5" />
                              <span>{PERMISSAO_LABELS[k]}</span>
                            </li>
                          ))}
                        {(
                          Object.keys(PERMISSAO_LABELS) as Array<
                            keyof typeof PERMISSAO_LABELS
                          >
                        ).filter(
                          (k) => permissoesNovas[k] && !permissoesAtuais[k],
                        ).length === 0 && (
                          <li className="text-xs text-muted-foreground">
                            Nenhuma
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2">
                        Deixarão de existir
                      </p>
                      <ul className="space-y-1">
                        {(
                          Object.keys(PERMISSAO_LABELS) as Array<
                            keyof typeof PERMISSAO_LABELS
                          >
                        )
                          .filter(
                            (k) => permissoesAtuais[k] && !permissoesNovas[k],
                          )
                          .map((k) => (
                            <li
                              className="flex items-start gap-1.5 text-xs"
                              key={k}
                            >
                              <XCircle className="h-3.5 w-3.5 text-rose-600 mt-0.5" />
                              <span>{PERMISSAO_LABELS[k]}</span>
                            </li>
                          ))}
                        {(
                          Object.keys(PERMISSAO_LABELS) as Array<
                            keyof typeof PERMISSAO_LABELS
                          >
                        ).filter(
                          (k) => permissoesAtuais[k] && !permissoesNovas[k],
                        ).length === 0 && (
                          <li className="text-xs text-muted-foreground">
                            Nenhuma
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarTransicao} disabled={isSaving}>
              {isSaving ? "A guardar..." : "Confirmar alteração"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmAtivar} onOpenChange={setConfirmAtivar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Definir Ano Lectivo Activo?</AlertDialogTitle>
            <AlertDialogDescription>
              {anoAtual.nome} passará ao estado <b>Activo</b> e será o único Ano
              Lectivo em uso.
              {activoAtual &&
                ` O ano ${activoAtual.nome} será automaticamente desactivado.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarAtivacao} disabled={isSaving}>
              {isSaving ? "A activar..." : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
