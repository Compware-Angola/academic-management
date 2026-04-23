import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce"; // opcional, pode remover se não tiver
import { useCreateTopico, useDeleteTopico, useTopicos, useUpdateTopico } from "@/hooks/access_exam/use-exames-de-acesso.hooks";
import { Topico } from "@/services/access_exam/topic-exam.service";



const ANOS_LETIVOS = [
  { id: 21, label: "2022/2023" },
  { id: 22, label: "2023/2024" },
  { id: 23, label: "2024/2025" },
  { id: 24, label: "2025/2026" },
];

const PAGE_SIZE = 10;

export default function ListarTopicos() {
  const { toast } = useToast();

  // ── filtros ──────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filtroAno, setFiltroAno] = useState("todos");
  const [page, setPage] = useState(1);

  // ── query ────────────────────────────────────────────
  const { data, isLoading, isError } = useTopicos({
    designacao: search || undefined,
    anoLetivoId: filtroAno !== "todos" ? Number(filtroAno) : undefined,
    page,
    limit: PAGE_SIZE,
  });

  const topicos = data?.data ?? [];
  const pagination = data?.pagination;

  // ── mutations ────────────────────────────────────────
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
    setFormData({ designacao: "", anoLetivoId: "", arquivo: null, arquivoNome: "" });
    setDialogOpen(true);
  };

  const openEdit = (t: Topico) => {
    setEditingTopico(t);
    setFormData({
      designacao: t.designacao,
      anoLetivoId: String(t.ano_lectivo_id),
      arquivo: null,
      arquivoNome: t.arquivo ?? "",
    });
    setDialogOpen(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({
        title: "Formato inválido",
        description: "Apenas ficheiros PDF são aceites.",
        variant: "destructive",
      });
      return;
    }
    setFormData((p) => ({ ...p, arquivo: file, arquivoNome: file.name }));
  };

  const handleSave = () => {
    if (!formData.designacao.trim() || !formData.anoLetivoId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a designação e o ano letivo.",
        variant: "destructive",
      });
      return;
    }

    if (editingTopico) {
      updateMutation.mutate(
        {
          id: editingTopico.id,
          payload: {
            designacao: formData.designacao,
            arquivo: formData.arquivoNome || editingTopico.arquivo,
          },
        },
        {
          onSuccess: () => {
            toast({ title: "Tópico atualizado", description: `"${formData.designacao}" guardado com sucesso.` });
            setDialogOpen(false);
          },
          onError: () => {
            toast({ title: "Erro ao atualizar", description: "Tente novamente.", variant: "destructive" });
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          designacao: formData.designacao,
          anoLetivoId: Number(formData.anoLetivoId),
          arquivo: formData.arquivoNome || "documento.pdf",
        },
        {
          onSuccess: () => {
            toast({ title: "Tópico criado", description: `"${formData.designacao}" adicionado.` });
            setDialogOpen(false);
          },
          onError: () => {
            toast({ title: "Erro ao criar", description: "Tente novamente.", variant: "destructive" });
          },
        }
      );
    }
  };

  const openPdf = (t: Topico) => {
    if (!t.arquivo) return;
    // ajuste o base URL conforme o teu ambiente
    const url = `/uploads/${t.arquivo}`;
    setPdfPreview({ titulo: t.designacao, url });
    setPdfDialogOpen(true);
  };

  const downloadPdf = (t: Topico) => {
    if (!t.arquivo) return;
    const url = `/uploads/${t.arquivo}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = t.arquivo;
    a.click();
    toast({ title: "Download iniciado", description: t.arquivo });
  };

  const handleDelete = () => {
    if (confirmDeleteId == null) return;
    deleteMutation.mutate(confirmDeleteId, {
      onSuccess: () => {
        toast({ title: "Tópico removido" });
        setConfirmDeleteId(null);
      },
      onError: () => {
        toast({ title: "Erro ao remover", variant: "destructive" });
        setConfirmDeleteId(null);
      },
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  // ── render ────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title="Listar Tópicos"
        subtitle="Gestão de tópicos para os exames de acesso"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Tópico
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar designação..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select
              value={filtroAno}
              onValueChange={(v) => { setFiltroAno(v); setPage(1); }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ano letivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os anos</SelectItem>
                {ANOS_LETIVOS.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                          className="text-sm truncate max-w-[160px]"
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
                  <TableCell className="text-right space-x-1">
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
        <DialogContent className="max-w-lg">
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
              <Label htmlFor="ano">Ano Letivo *</Label>
              <Select
                value={formData.anoLetivoId}
                onValueChange={(v) =>
                  setFormData((p) => ({ ...p, anoLetivoId: v }))
                }
              >
                <SelectTrigger id="ano">
                  <SelectValue placeholder="Seleccione um ano" />
                </SelectTrigger>
                <SelectContent>
                  {ANOS_LETIVOS.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
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