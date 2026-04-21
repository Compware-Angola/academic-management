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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  FileSearch,
  Loader2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useDocumentTypes } from "@/hooks/documents/use-document-types";
import { useValidateDocument } from "@/hooks/documents/use-validate-document";

/* =========================
   PAGE
========================= */
export default function ValidarDocumento() {
  const [tipo, setTipo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const { data: typeDocs = [] } = useDocumentTypes();

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useValidateDocument(searchCode);

  const loading = isLoading || isFetching;

  /* =========================
     VALIDAR
  ========================= */
  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipo || !codigo.trim()) return;

    setSearchCode(codigo.trim().toUpperCase());
  };

  /* =========================
     RESET
  ========================= */
  const handleReset = () => {
    setTipo("");
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
        {/* FORM */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Dados de Validação
                </CardTitle>
                <CardDescription>
                  introduza o código do documento
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleValidar} className="space-y-4">
              {/* tipo 
              <div className="space-y-2">
                <Label>Tipo de documento *</Label>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeDocs.map((t) => (
                      <SelectItem
                        key={t.codigo}
                        value={String(t.codigo)}
                      >
                        {t.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
*/}
              {/* código */}
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: 39677QMFVZ"
                  className="font-mono uppercase"
                />
              </div>

              {/* buttons */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!tipo || !codigo.trim() || loading}
                  className="flex-1"
                >
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

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* RESULTADO */}
        <div className="lg:col-span-3">
          {!searchCode && (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <FileSearch className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Aguarde a validação do documento
                </p>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card>
              <CardContent className="py-16 text-center">
                <Loader2 className="h-10 w-10 mx-auto animate-spin mb-3" />
                <p>Validando documento...</p>
              </CardContent>
            </Card>
          )}

          {isError && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="py-10 text-center">
                <XCircle className="h-10 w-10 mx-auto text-destructive mb-2" />
                <p>Documento inválido ou não encontrado</p>
              </CardContent>
            </Card>
          )}

          {data && (
            <Card className="border-emerald-500/40 bg-emerald-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-600" />
                  <CardTitle>Documento Válido</CardTitle>
                  <Badge>Autenticado</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <Dado label="Nome" value={data.nome_completo} />
                <Dado label="BI" value={data.bi} />
                <Dado label="Curso" value={data.curso} />
                <Dado label="Documento" value={data.tipo_documento} />
                <Dado label="Emitido por" value={data.utilizador} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTE AUXILIAR
========================= */
function Dado({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}