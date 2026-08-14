import { useEffect, useState } from "react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Bell, FileText, Loader2, Printer, Save, Settings } from "lucide-react";
import { toast } from "sonner";

import {
  DEFAULT_FONT_SETTINGS, DOCUMENT_TYPES, DocumentSignatureMap, FontSettings,
} from "@/lib/settingsApi";
import {
  useDocumentSignatures, useFontSettings, useSignatures,
  useUpdateDocumentSignatures, useUpdateFontSettings,
} from "@/hooks/useSettings";
import { ConfigSection, ConfiguracoesSidebar } from "./components/ConfiguracoesSidebar";
import { ConfiguracaoFonte } from "./components/ConfiguracaoFonte";
import { ConfiguracaoAssinaturas } from "./components/ConfiguracaoAssinaturas";
import { AssinaturasPorDocumento } from "./components/AssinaturasPorDocumento";
import { DocumentoPreview } from "./components/DocumentoPreview";

const SECTIONS: ConfigSection[] = [
  { id: "documentos", label: "Documentos", description: "Tipo de letra e assinaturas", icon: FileText },
  { id: "empresa", label: "Empresa", description: "Dados, logótipo e cores", icon: Building2, disabled: true },
  { id: "impressao", label: "Impressão & PDF", description: "Formatos e numeração", icon: Printer, disabled: true },
  { id: "notificacoes", label: "Notificações", description: "Emails e alertas", icon: Bell, disabled: true },
];

export default function Configuracoes() {
  const [section, setSection] = useState("documentos");
  const [previewDoc, setPreviewDoc] = useState(DOCUMENT_TYPES[0].id);

  const fontQuery = useFontSettings();
  const signaturesQuery = useSignatures();
  const docSigQuery = useDocumentSignatures();
  const saveFont = useUpdateFontSettings();
  const saveDocSig = useUpdateDocumentSignatures();

  const [font, setFont] = useState<FontSettings>(DEFAULT_FONT_SETTINGS);
  const [docSig, setDocSig] = useState<DocumentSignatureMap>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (fontQuery.data) setFont(fontQuery.data); }, [fontQuery.data]);
  useEffect(() => { if (docSigQuery.data) setDocSig(docSigQuery.data); }, [docSigQuery.data]);

  const signatures = signaturesQuery.data ?? [];
  const previewSignature = signatures.find((s) => s.id === docSig[previewDoc]) ?? null;
  const isSaving = saveFont.isPending || saveDocSig.isPending;

  const handleSave = async () => {
    try {
      await Promise.all([saveFont.mutateAsync(font), saveDocSig.mutateAsync(docSig)]);
      setDirty(false);
      toast.success("Configurações guardadas com sucesso.");
    } catch {
      toast.error("Não foi possível guardar as configurações. Tente novamente.");
    }
  };

  return (
    // FIX: overflow-x-hidden no container raiz impede que qualquer filho
    // "empurre" a página inteira para o lado e cause o salto ao fazer scroll.
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Configurações</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
            <Settings className="h-7 w-7 text-primary" />
            Configurações
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie as configurações gerais utilizadas pelo sistema.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && <Badge variant="secondary">Alterações por guardar</Badge>}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar alterações
          </Button>
        </div>
      </div>

      {/* FIX: grid original não tinha min-w-0 nos filhos. Sem isso, um filho
          com conteúdo largo (ex: tabela) não encolhe e força overflow no grid. */}
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="min-w-0">
          <ConfiguracoesSidebar sections={SECTIONS} active={section} onChange={setSection} />
        </div>

        <div className="min-w-0 space-y-6">
          {section === "documentos" && (
            <>
              <div>
                <h2 className="text-xl font-semibold">Documentos</h2>
                <p className="text-sm text-muted-foreground">
                  Configure a aparência e as assinaturas utilizadas nos documentos gerados pelo sistema.
                </p>
              </div>

              {/* FIX: min-w-0 nas colunas do grid interno também, para o painel
                  de preview (380px) não forçar overflow em ecrãs mais estreitos. */}
              <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
                <div className="min-w-0 space-y-6">
                  <ConfiguracaoFonte
                    value={font}
                    isLoading={fontQuery.isLoading}
                    onChange={(v) => { setFont(v); setDirty(true); }}
                  />
                  <ConfiguracaoAssinaturas
                    signatures={signatures}
                    isLoading={signaturesQuery.isLoading}
                    documentSignatures={docSig}
                  />
                  <AssinaturasPorDocumento
                    signatures={signatures}
                    value={docSig}
                    isLoading={docSigQuery.isLoading}
                    onChange={(v) => { setDocSig(v); setDirty(true); }}
                    previewDocument={previewDoc}
                    onPreviewDocumentChange={setPreviewDoc}
                  />
                </div>

                <div className="min-w-0 space-y-3">
                  <Select value={previewDoc} onValueChange={setPreviewDoc}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((d) => (
                        <SelectItem key={d.id} value={d.id}>Pré-visualizar: {d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DocumentoPreview
                    font={font}
                    signature={previewSignature}
                    documentTitle={DOCUMENT_TYPES.find((d) => d.id === previewDoc)?.label.toUpperCase()}
                  />
                </div>
              </div>
            </>
          )}

          {section !== "documentos" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <Settings className="mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-medium">Secção em preparação</p>
                <p className="max-w-md text-sm text-muted-foreground">
                  Esta área ficará disponível numa próxima fase e seguirá a mesma estrutura da secção
                  de Documentos.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}