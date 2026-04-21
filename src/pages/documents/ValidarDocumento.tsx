import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileSearch, Loader2, ShieldCheck, FileText, Award, Receipt, GraduationCap, BookOpen, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultStatus = "valido" | "invalido" | null;

interface DocumentoValidado {
  codigo: string;
  tipo: string;
  emitidoPor: string;
  dataEmissao: string;
  validade: string;
  titular: string;
  documentoNum: string;
  observacoes?: string;
}

const TIPOS_DOCUMENTO = [
  { value: "declaracao", label: "Declaração de Matrícula", icon: FileText },
  { value: "certificado", label: "Certificado de Habilitação", icon: Award },
  { value: "diploma", label: "Diploma", icon: GraduationCap },
  { value: "historico", label: "Histórico Escolar", icon: BookOpen },
  { value: "recibo", label: "Recibo / Comprovativo", icon: Receipt },
];

// Códigos de teste (mock)
const VALID_DOCUMENTS: Record<string, DocumentoValidado> = {
  "DECL-2025-001": {
    codigo: "DECL-2025-001",
    tipo: "Declaração de Matrícula",
    emitidoPor: "Secretaria Académica",
    dataEmissao: "12/03/2025",
    validade: "12/09/2025",
    titular: "João Silva Mendes",
    documentoNum: "20231054",
  },
  "CERT-2024-789": {
    codigo: "CERT-2024-789",
    tipo: "Certificado de Habilitação",
    emitidoPor: "Reitoria",
    dataEmissao: "05/11/2024",
    validade: "Permanente",
    titular: "Maria Tavares",
    documentoNum: "20180223",
  },
  "DIP-2023-456": {
    codigo: "DIP-2023-456",
    tipo: "Diploma",
    emitidoPor: "Reitoria",
    dataEmissao: "20/07/2023",
    validade: "Permanente",
    titular: "Pedro Costa",
    documentoNum: "20190112",
    observacoes: "Curso de Engenharia Informática — Classificação Final: 16",
  },
};

export default function ValidarDocumento() {
  const [tipo, setTipo] = useState<string>("");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ResultStatus>(null);
  const [resultado, setResultado] = useState<DocumentoValidado | null>(null);
  const [codigoConsultado, setCodigoConsultado] = useState("");

  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !codigo.trim()) return;

    setLoading(true);
    setStatus(null);
    setResultado(null);

    setTimeout(() => {
      const doc = VALID_DOCUMENTS[codigo.trim().toUpperCase()];
      const tipoLabel = TIPOS_DOCUMENTO.find((t) => t.value === tipo)?.label;
      setCodigoConsultado(codigo.trim().toUpperCase());

      if (doc && doc.tipo === tipoLabel) {
        setStatus("valido");
        setResultado(doc);
      } else {
        setStatus("invalido");
      }
      setLoading(false);
    }, 900);
  };

  const handleReset = () => {
    setTipo("");
    setCodigo("");
    setStatus(null);
    setResultado(null);
    setCodigoConsultado("");
  };

  const tipoSelecionado = TIPOS_DOCUMENTO.find((t) => t.value === tipo);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Validar Documento"
        subtitle="Verifique a autenticidade de documentos institucionais"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Formulário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Dados de Validação</CardTitle>
                <CardDescription>Selecione o tipo e introduza o código</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleValidar} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de documento *</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_DOCUMENTO.map((t) => {
                      const Icon = t.icon;
                      return (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{t.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código de validação *</Label>
                <Input
                  id="codigo"
                  placeholder="Ex: DECL-2025-001"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="font-mono uppercase"
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  O código encontra-se no rodapé do documento.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={!tipo || !codigo.trim() || loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      A validar...
                    </>
                  ) : (
                    <>
                      <FileSearch className="mr-2 h-4 w-4" />
                      Validar
                    </>
                  )}
                </Button>
                {(status || codigo || tipo) && (
                  <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 rounded-md border border-dashed border-border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Códigos para teste:</p>
              <ul className="text-xs text-muted-foreground space-y-0.5 font-mono">
                <li>• DECL-2025-001</li>
                <li>• CERT-2024-789</li>
                <li>• DIP-2023-456</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Resultado */}
        <div className="lg:col-span-3">
          {!status && !loading && (
            <Card className="h-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-center py-16 px-6 h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <FileSearch className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Aguardando validação
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Selecione o tipo de documento e introduza o código para verificar a sua autenticidade.
                </p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center text-center py-16 h-full">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">A consultar base de dados...</p>
              </CardContent>
            </Card>
          )}

          {status === "valido" && resultado && (
            <Card
              className={cn(
                "border-2 animate-in fade-in zoom-in-95 duration-300",
                "border-emerald-500/40 bg-emerald-500/5",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl text-emerald-700 dark:text-emerald-400">
                        Documento Válido
                      </CardTitle>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                        Autenticado
                      </Badge>
                    </div>
                    <CardDescription>
                      Este documento foi emitido oficialmente pela instituição.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <DadoLinha label="Código" value={resultado.codigo} mono />
                  <DadoLinha label="Tipo de documento" value={resultado.tipo} />
                  <DadoLinha label="Titular" value={resultado.titular} />
                  <DadoLinha label="Nº de documento" value={resultado.documentoNum} mono />
                  <DadoLinha label="Emitido por" value={resultado.emitidoPor} />
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <DadoLinha label="Data de emissão" value={resultado.dataEmissao} />
                    <DadoLinha label="Validade" value={resultado.validade} />
                  </div>
                  {resultado.observacoes && (
                    <div className="pt-2 mt-2 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Observações</p>
                      <p className="text-sm text-foreground">{resultado.observacoes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {status === "invalido" && (
            <Card
              className={cn(
                "border-2 animate-in fade-in zoom-in-95 duration-300",
                "border-destructive/40 bg-destructive/5",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <XCircle className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl text-destructive">
                        Documento Inválido
                      </CardTitle>
                      <Badge variant="destructive">Não encontrado</Badge>
                    </div>
                    <CardDescription>
                      Não foi possível validar este documento.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <DadoLinha label="Código consultado" value={codigoConsultado} mono />
                  <DadoLinha label="Tipo selecionado" value={tipoSelecionado?.label || "—"} />
                  <div className="pt-2 mt-2 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Possíveis causas:</p>
                    <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                      <li>O código não existe na base de dados</li>
                      <li>O tipo de documento não corresponde ao código</li>
                      <li>O documento foi revogado ou expirou</li>
                      <li>Erro de digitação — verifique o código e tente novamente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DadoLinha({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={cn("text-sm text-foreground", mono && "font-mono")}>{value}</span>
    </div>
  );
}