import { useState } from "react";
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

import { useValidateDocument } from "@/hooks/documents/use-validate-document";

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

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function ValidarDocumento() {
  const [codigo, setCodigo] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const { data, isLoading, isError, isFetching } = useValidateDocument(searchCode);
  const loading = isLoading || isFetching;

  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    setSearchCode(codigo.trim().toUpperCase());
  };

  const handleReset = () => {
    setCodigo("");
    setSearchCode("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Validar Documento"
        subtitle="Verifique a autenticidade de documentos institucionais"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── FORM ──────────────────────────────────────────── */}
        <Card className="lg:col-span-2">
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

                <Button type="button" variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ── RESULTADO ─────────────────────────────────────── */}
        <div className="lg:col-span-3">

          {/* Idle */}
          {!searchCode && !loading && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <FileSearch className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Aguarde a validação do documento</p>
              </CardContent>
            </Card>
          )}

          {/* Loading */}
          {loading && (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="h-10 w-10 mx-auto animate-spin mb-3" />
                <p>A validar documento...</p>
              </CardContent>
            </Card>
          )}

          {/* Erro */}
          {isError && !loading && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="py-10 text-center">
                <XCircle className="h-10 w-10 mx-auto text-destructive mb-2" />
                <p>Documento inválido ou não encontrado</p>
              </CardContent>
            </Card>
          )}

          {/* Sucesso */}
          {data && !loading && (
            <Card
              className={cn(
                "border-emerald-500/40 bg-emerald-500/5",
                "animate-in fade-in slide-in-from-bottom-4 duration-500",
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  {/* Foto */}
                  {data.foto ? (
                    <img
                      src={`data:image/jpeg;base64,${data.foto}`}
                      alt={data.nome_completo}
                      className="h-16 w-16 rounded-xl object-cover ring-2 ring-emerald-500/30 ring-offset-2"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
                      <User className="h-7 w-7" />
                    </div>
                  )}

                  {/* Título */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <CardTitle className="text-base">Documento Válido</CardTitle>
                      <Badge variant="secondary" className="text-xs">Autenticado</Badge>
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