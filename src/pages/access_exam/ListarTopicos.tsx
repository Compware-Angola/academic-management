import { useRef, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Download,
  Eye,
  Upload,
  Loader2,
} from "lucide-react";


import { useCreateTopico, useDeleteTopico, useTopicos, useUpdateTopico } from "@/hooks/access_exam/use-exames-de-acesso.hooks";
import { Topico } from "@/services/access_exam/topic-exam.service";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { parseFilter } from "@/util/parse-filter";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { viewFile } from "@/services/upload/upload-single.service";
import { toast } from "sonner";



const PAGE_SIZE = 10;

export default function ListarTopicos() {

  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  // ── filtros ──────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filtroAno, setFiltroAno] = useState("all");
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // ── query ────────────────────────────────────────────
  const { data, isLoading, isError } = useTopicos({
    designacao: search || undefined,
    anoLetivoId: parseFilter(filtroAno),
    page,
    limit: PAGE_SIZE,
  });

  const topicos = data?.data ?? [];
  const pagination = data?.pagination;

  // ── mutations ────────────────────────────────────────
  const uploadMutation = useUploadSingle();
  const createMutation = useCreateTopico();
  const updateMutation = useUpdateTopico();
  const deleteMutation = useDeleteTopico();

  // ── form state ───────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopico, setEditingTopico] = useState<Topico | null>(null);
  const [formData, setFormData] = useState({
    designacao: "",
    anoLetivoId: "",
    arquivo: null as File | null,
    arquivoNome: "",
  });

  // ── pdf preview ──────────────────────────────────────
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{
    titulo: string;
    url: string;
  } | null>(null);

  // ── delete confirm ───────────────────────────────────
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // ── handlers ─────────────────────────────────────────
  const openCreate = () => {
    setEditingTopico(null);
    clearFileInput()
    setFormData({ designacao: "", anoLetivoId: "", arquivo: null, arquivoNome: "" });
    setDialogOpen(true);
  };

  const openEdit = (t: Topico) => {
    clearFileInput()
    setEditingTopico(t);
    setFormData({
      designacao: t.designacao,
      anoLetivoId: String(t.ano_lectivo_id),
      arquivo: null,
      arquivoNome: t.arquivo ?? "",
    });
    setDialogOpen(true);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {

        toast.error(`Formato inválido`, {
          position: "top-right",
        });
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      toast.success(`Arquivo selecionado.${file.name} pronto para submissão.`, {
        position: "top-right",
      });

    }
  };
  const clearFileInput = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSave = async () => {
    let uploadResponse: any
    if (!formData.designacao.trim() || !formData.anoLetivoId) {

      toast.error(`Campos obrigatórios.Preencha a designação e o ano letivo.`, {
        position: "top-right",
      });
      return;
    }
    if (selectedFile == null && editingTopico == null) {
      toast.error(`Arquivo obrigatório`, {
        position: "top-right",
      });
      return;
    }

    if (selectedFile) {

      uploadResponse = await uploadMutation.mutateAsync(selectedFile);
      if (!uploadResponse.file?.path) {
        toast.error(`Erro ao Fazer upload`, {
          position: "top-right",
        });
        return;
      }

    }


    if (editingTopico) {
      updateMutation.mutate(
        {
          id: editingTopico.id,
          payload: {
            designacao: formData.designacao,
            arquivo: uploadResponse?.file?.filename || editingTopico.arquivo,
          },
        },
        {
          onSuccess: () => {
            toast.success(`Tópico ${formData.designacao} Atualizado`, {
              position: "top-right",
            });
            setDialogOpen(false);
          },
          onError: () => {
            toast.error(`Erro ao Atualizar`, {
              position: "top-right",
            });
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          designacao: formData.designacao,
          anoLetivoId: Number(formData.anoLetivoId),
          arquivo: uploadResponse?.file?.filename || "documento.pdf",
        },
        {
          onSuccess: () => {
            toast.success(`Tópico criado`, {
              position: "top-right",
            });
            setDialogOpen(false);
          },
          onError: () => {

            toast.error(`Erro ao Criar`, {
              position: "top-right",
            });
          },
        }
      );
    }
  };

  const openPdf = async (t: Topico) => {
    if (!t.arquivo) return;

    try {
      const blob = await viewFile(t.arquivo);

      const fileUrl = URL.createObjectURL(blob);

      setPdfPreview({
        titulo: t.designacao,
        url: fileUrl,
      });

      setPdfDialogOpen(true);
    } catch (error: any) {
      console.error("Erro ao abrir PDF:", error.message);
      toast.error(`Documento Não foi encontrado`, {
        position: "top-right",
      });
    }
  };

  const downloadPdf = async (t: Topico) => {
    try {
      if (!t.arquivo) return;
      const blob = await viewFile(t.arquivo);
      const fileUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = t.arquivo;
      a.click();

      toast.success(`Download iniciado`, {
        position: "top-right",
      });

    } catch (error: any) {
      console.error("Erro ao abrir PDF:", error.message);
      toast.error(`Documento Não foi encontrado`, {
        position: "top-right",
      });

    }

  };

  const handleDelete = () => {
    if (confirmDeleteId == null) return;
    deleteMutation.mutate(confirmDeleteId, {
      onSuccess: () => {
        toast.success(`Tópico removido`, {
          position: "top-right",
        });
        setConfirmDeleteId(null);
      },
      onError: () => {

        toast.error(`Erro ao remover`, {
          position: "top-right",
        });
        setConfirmDeleteId(null);
      },
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;


  // EXPORT
  const exportRows = useMemo(
  () =>
    topicos.map((t) => ({
      id: t.id,
      designacao: t.designacao,
      anoLetivo: t.ano_letivo,
     
      criadoEm: t.created_at
        ? new Date(t.created_at).toLocaleDateString("pt-AO")
        : "—",
    })),
  [topicos]
);
const pdfData = exportRows.length
  ? {
      filtros: [
        search ? `Pesquisa: ${search}` : null,
        filtroAno && filtroAno !== "all"
          ? `Ano Letivo: ${filtroAno}`
          : null,
      ]
        .filter(Boolean)
        .join(" | "),
      total: exportRows.length,
      rows: exportRows,
    }
  : null;

const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Lista de Tópicos"
    subtitle="Tópicos dos exames de acesso"
    infoSections={[
      {
        title: "Filtros Aplicados",
        content: pdfData.filtros || "Sem filtros",
      },
    ]}
    mainTable={{
      headers: [
        { key: "id", label: "ID", width: "10%" },
        { key: "designacao", label: "Designação", width: "30%" },
        { key: "anoLetivo", label: "Ano Letivo", width: "20%" },
     
        { key: "criadoEm", label: "Criado Em", width: "20%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#0D1B48",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;
const excelProps = pdfData
  ? {
      documentTitle: "Lista de Tópicos",
      subtitle: "Tópicos dos exames de acesso",
      infoSections: [
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros || "Sem filtros",
        },
        { title: "Resumo", content: [`Total: ${pdfData.total}`] },
      ],
      mainTable: {
        headers: [
          { key: "id", label: "ID", width: 10 },
          { key: "designacao", label: "Designação", width: 30 },
          { key: "anoLetivo", label: "Ano Letivo", width: 20 },
          
          { key: "criadoEm", label: "Criado Em", width: 20 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
  : null;
const baseFileName = `Topicos_${new Date()
  .toISOString()
  .slice(0, 10)}`;
  // ── render ────────────────────────────────────────────
  return (
    <div className="space-y-6">
   <PageHeader
  title="Listar Tópicos"
  subtitle="Gestão de tópicos para os exames de acesso"
  actions={
    <div className="flex gap-2">
      <Button onClick={openCreate}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Tópico
      </Button>

      {pdfContent && (
        <PDFActions
          document={pdfContent}
          fileName={`${baseFileName}.pdf`}
          showDownload
          showPrint
        />
      )}

      {excelProps && (
        <ExcelActions
          excelProps={excelProps}
          fileName={`${baseFileName}.xlsx`}
          showDownload
        />
      )}
    </div>
  }
/>

      <Card>
        <CardContent className="pt-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">

            {/* Pesquisa */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar designação..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 w-full"
              />
            </div>

            {/* Ano Letivo */}
            <div className="w-full">
              <FormSelect
                label="Ano Letivo"
                disabled={isLoadingAcademicYear}
                loading={isLoadingAcademicYear}
                value={filtroAno?.toString() ?? "all"}
                onChange={(v) => {
                  setFiltroAno(v === "all" ? undefined : v);
                  setPage(1);
                }}
                options={[
                  { codigo: "all", designacao: "Todos" },
                  ...(academicYear ?? [])
                ]}
                map={(a) => ({
                  key: a.codigo,
                  label: a.designacao,
                  value: a.codigo,
                })}
              />
            </div>

          </div>

          {/* Tabela */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Designação</TableHead>
                <TableHead>Ano Letivo</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Criado Em</TableHead>
                <TableHead className="text-right">Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-destructive">
                    Erro ao carregar tópicos.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && topicos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhum tópico encontrado.
                  </TableCell>
                </TableRow>
              )}

              {topicos.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.id}</TableCell>
                  <TableCell>{t.designacao}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{t.ano_letivo}</Badge>
                  </TableCell>
                  <TableCell>
                    {t.arquivo ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span
                          className="text-sm truncate max-w-40"
                          title={t.arquivo}
                        >
                          {t.arquivo}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {t.created_at
                      ? new Date(t.created_at).toLocaleDateString("pt-AO")
                      : "—"}
                  </TableCell>
                 <TableCell className="text-right">
  <div className="flex items-center justify-end gap-1">
    <Button
      variant="ghost"
      size="icon"
      disabled={!t.arquivo}
      onClick={() => openPdf(t)}
      title="Ver PDF"
    >
      <Eye className="h-4 w-4" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      disabled={!t.arquivo}
      onClick={() => downloadPdf(t)}
      title="Baixar PDF"
    >
      <Download className="h-4 w-4" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onClick={() => openEdit(t)}
      title="Editar"
    >
      <Edit className="h-4 w-4" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onClick={() => setConfirmDeleteId(t.id)}
      title="Remover"
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  </div>
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>
                Página {pagination.page} de {pagination.totalPages} — {pagination.total} resultados
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
        </CardContent>
      </Card>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg!">
          <DialogHeader>
            <DialogTitle>
              {editingTopico ? "Editar Tópico" : "Novo Tópico"}
            </DialogTitle>
            <DialogDescription>
              {editingTopico
                ? "Actualize os dados do tópico."
                : "Preencha os dados para criar um novo tópico."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="designacao">Designação *</Label>
              <Input
                id="designacao"
                value={formData.designacao}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, designacao: e.target.value }))
                }
                placeholder="Ex: Introdução à Álgebra Linear"
              />
            </div>
            <div className="space-y-2">


              <FormSelect
                label="Ano Letivo"
                disabled={isLoadingAcademicYear}
                loading={isLoadingAcademicYear}
                value={formData.anoLetivoId}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, anoLetivoId: v }))
                }
                options={academicYear}
                map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arquivo">Arquivo (PDF)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="arquivo"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFile}
                  className="flex-1"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {selectedFile.name}
                    <Button variant="ghost" size="sm" onClick={clearFileInput}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </p>
                )}
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {formData.arquivoNome && (
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  {formData.arquivoNome}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingTopico ? "Guardar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── PDF Preview Dialog ── */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="max-w-4xl! h-[80vh]! flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {pdfPreview?.titulo}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-md border bg-muted">
            {pdfPreview?.url ? (
              <iframe
                src={pdfPreview.url}
                title={pdfPreview.titulo}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Sem documento.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfDialogOpen(false)}>
              Fechar
            </Button>
            {pdfPreview?.url && (
              <Button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = pdfPreview.url;
                  a.download = pdfPreview.titulo + ".pdf";
                  a.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(o) => !o && setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover tópico</DialogTitle>
            <DialogDescription>
              Esta acção não pode ser desfeita. Tem certeza?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}