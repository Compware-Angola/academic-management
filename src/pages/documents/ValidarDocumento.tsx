import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
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
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  FileSearch,
  Loader2,
  ShieldCheck,
  RotateCcw,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildImageAssets } from "@/util/build-image-assets";
import { useValidateDocument } from "@/hooks/documents/use-validate-document";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ── Dado simples ─────────────────────────────────────────── */
function Dado({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
    </div>
  );
}

/* ── Grupo de campos com título ────────────────────────────── */
function Grupo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
    </div>
  );
}

function fmt(d?: string | null) {
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat("pt-AO", {
      day: "2-digit", month: "short", year: "numeric",
    }).format(new Date(d));
  } catch { return d; }
}

/* ── Animação de verificação ──────────────────────────────── */
function VerifiedAnimation({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      {/* Círculo animado com SVG check */}
      <div className="relative flex items-center justify-center">
        {/* Anel pulsante externo */}
        <span className="absolute inline-flex h-24 w-24 rounded-full bg-emerald-400/20 animate-ping" />
        {/* Anel base */}
        <span className="relative inline-flex h-20 w-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 items-center justify-center">
          {/* SVG check com stroke-dasharray para animação de desenho */}
          <svg
            viewBox="0 0 52 52"
            className="w-10 h-10"
            style={{ overflow: "visible" }}
          >
            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="157"
              strokeDashoffset="157"
              style={{
                animation: "drawCircle 0.5s ease forwards",
              }}
            />
            <polyline
              points="14,27 22,35 38,18"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset="40"
              style={{
                animation: "drawCheck 0.4s ease 0.5s forwards",
              }}
            />
          </svg>
        </span>
      </div>

      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-emerald-600">Documento Verificado</p>
        <p className="text-xs text-muted-foreground">A carregar informação...</p>
      </div>

      {/* CSS keyframes injetados inline */}
      <style>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function ValidarDocumento() {
  const [codigo, setCodigo] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { data, isLoading, isError, isFetching } = useValidateDocument(searchCode);
  const loading = isLoading || isFetching;

  /* Quando os dados chegam, mostra animação antes do resultado */
  useEffect(() => {
    if (data && !loading) {
      setShowAnimation(true);
      setShowResult(false);
    }
  }, [data, loading]);

  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    setShowAnimation(false);
    setShowResult(false);
    setSearchCode(codigo.trim().toUpperCase());
  };

  const handleReset = () => {
    setCodigo("");
    setSearchCode("");
    setShowAnimation(false);
    setShowResult(false);
  };

  /* Estado do painel direito */
  const panelState: "idle" | "loading" | "error" | "animating" | "result" =
    loading ? "loading"
    : isError && searchCode ? "error"
    : showAnimation ? "animating"
    : showResult && data ? "result"
    : "idle";

  const photoUrl = buildImageAssets(data?.foto);
  const initials =
    data?.nome_completo
      ?.trim()
      .split(/\s+/)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) ?? "??";
  return (
    <div className="space-y-6">
      <PageHeader
        title="Validar Documento"
        subtitle="Verifique a autenticidade de documentos institucionais"
      />
{/* Card informativo sobre documentos verificáveis */}
<Card className="border-primary/20 bg-primary/5">
  <CardHeader className="pb-3">
    <div className="flex items-center gap-2">
      <ShieldCheck className="h-4 w-4 text-primary" />
      <CardTitle className="text-sm font-semibold">Documentos que podem ser verificados</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        {
          icon: "🎓",
          title: "Certidão",
          desc: "Certidão académica que comprova a situação do estudante na instituição.",
        },
        {
          icon: "📄",
          title: "Declaração com Notas",
          desc: "Declaração oficial com o registo de aproveitamento académico do estudante.",
        },
        {
          icon: "📋",
          title: "Declaração sem Notas",
          desc: "Declaração simples de matrícula ou frequência, sem detalhes de notas.",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="flex gap-3 rounded-lg border border-border/60 bg-background/60 px-4 py-3"
        >
          <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
          <div>
            <p className="text-xs font-semibold mb-0.5">{item.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

{/* Grid: form fixo à esquerda, resultado à direita com scroll */}
      {/* Grid: form fixo à esquerda, resultado à direita com scroll */}
      <div className="grid gap-6 lg:grid-cols-5 lg:items-start">

        {/* ── FORM (sticky) ─────────────────────────────────── */}
        <Card className="lg:col-span-2 lg:sticky lg:top-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Dados de Validação</CardTitle>
                <CardDescription>Introduza o código do documento</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleValidar} className="space-y-4">
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="Ex: 39677QMFVZ"
                  className="font-mono uppercase"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              {/* Botões sempre alinhados numa row */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!codigo.trim() || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />A validar...</>
                  ) : (
                    <><FileSearch className="mr-2 h-4 w-4" />Validar</>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!searchCode && !codigo}
                  className="shrink-0 w-10 px-0"
                  title="Limpar"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Status badge debaixo do form quando há resultado */}
            {panelState === "result" && data && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium truncate">
                  {data.nome_completo}
                </p>
              </div>
            )}

            {panelState === "error" && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/5 px-3 py-2 border border-destructive/20">
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive font-medium">
                  Documento não encontrado
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── RESULTADO (scrollável) ─────────────────────────── */}
        <div className="lg:col-span-3">

          {/* Idle */}
          {panelState === "idle" && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <FileSearch className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">Aguarde a validação do documento</p>
              </CardContent>
            </Card>
          )}

          {/* Loading */}
          {panelState === "loading" && (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">A validar documento...</p>
              </CardContent>
            </Card>
          )}

          {/* Erro */}
          {panelState === "error" && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="py-14 text-center space-y-2">
                <XCircle className="h-10 w-10 mx-auto text-destructive mb-2" />
                <p className="font-semibold">Documento inválido</p>
                <p className="text-sm text-muted-foreground">O código introduzido não foi encontrado no sistema.</p>
              </CardContent>
            </Card>
          )}

          {/* Animação de verificação */}
          {panelState === "animating" && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent>
                <VerifiedAnimation onDone={() => { setShowAnimation(false); setShowResult(true); }} />
              </CardContent>
            </Card>
          )}

          {/* Resultado completo */}
          {panelState === "result" && data && (
            <Card
              className={cn(
                "border-emerald-500/40 bg-emerald-500/5",
                "animate-in fade-in slide-in-from-bottom-2 duration-500",
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  {/* Foto */}
                   <Avatar className="h-32 w-32">
            <AvatarImage
              src={photoUrl}
              alt={data?.nome_completo || "Foto do estudante"}
              key={photoUrl}
            />
            <AvatarFallback className="text-3xl font-medium bg-linear-to-br from-gray-100 to-gray-200 text-gray-600">
              {initials}
            </AvatarFallback>
          </Avatar>

                  {/* Título */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <CardTitle className="text-base">Documento Válido</CardTitle>
                      <Badge variant="secondary" className="text-xs">Verificado</Badge>
                    </div>
                    <p className="text-sm font-semibold truncate">{data.nome_completo}</p>
                    <p className="text-xs text-muted-foreground truncate">{data.curso}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="h-px bg-border" />

                <Grupo title="Identificação">
                  <Dado label="Bilhete de Identidade" value={data.bi} />
                  <Dado label="Data de Nascimento" value={fmt(data.data_nascimento)} />
                  <Dado label="Sexo" value={data.sexo} />
                  <Dado label="Estado Civil" value={data.estado_civil} />
                  <Dado label="Naturalidade" value={data.naturalidade} />
                  <Dado label="Nacionalidade" value={data.nacionalidade} />
                </Grupo>

                <div className="h-px bg-border" />

                <Grupo title="Académico">
                  <Dado label="Curso" value={data.curso} />
                  <Dado label="Faculdade" value={data.faculdade} />
                  <Dado label="Grau" value={data.grau} />
                  <Dado label="Regime" value={data.regime} />
                  <Dado label="Período" value={data.periodo} />
                  <Dado label="Nº Matrícula" value={data.codigo_matricula} />
                </Grupo>

                <div className="h-px bg-border" />

                <Grupo title="Contactos">
                  <Dado label="Email" value={data.email} />
                  <Dado label="Contacto" value={data.contacto} />
                </Grupo>

                <div className="h-px bg-border" />

                <Grupo title="Emissão">
                  <Dado label="Tipo de Documento" value={data.tipo_documento} />
                  <Dado label="Emitido Por" value={data.utilizador} />
                  <Dado label="Data de Registo" value={fmt(data.data_registo)} />
                  <Dado label="Estado" value={data.estado} />
                </Grupo>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}