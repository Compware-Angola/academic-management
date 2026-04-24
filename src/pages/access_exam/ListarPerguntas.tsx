import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ListChecks,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pergunta, Resposta } from "@/services/access_exam/questions.service";
import { useCreatePergunta, useCreateResposta, useDeleteResposta, usePerguntas, useRespostasByPergunta, useUpdatePergunta, useUpdateResposta } from "@/hooks/access_exam/use-exames-de-acesso.hooks";
import { useTiposPerguntaList } from "@/hooks/access_exam/use-tipos-disciplinas.hooks";
import { DisciplinaCommandSelect } from "./components/Disciplinacommandselect";
import { parseFilter } from "@/util/parse-filter";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { LatexText } from "@/util/LatexText";



const TIPO_RESPOSTA_CORRETA_ID = 1; // id que representa "Verdadeira / Correcta"
const TIPO_RESPOSTA_ERRADA_ID = 2;  // id que representa "Falsa / Errada"

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export const tipoBadgeVariant: Record<number, { label: string; variant: BadgeVariant }> = {
  1: { label: "Verdadeiro/Falso", variant: "secondary" },
  2: { label: "Múltipla", variant: "default" },
  3: { label: "Normal", variant: "outline" },
};
// ─── componente interno: respostas de uma pergunta ───────────────────────────

function RespostasManager({ pergunta }: { pergunta: Pergunta }) {
  const { toast } = useToast();

  const { data: respostas = [], isLoading } = useRespostasByPergunta(pergunta.id);

  const createResposta = useCreateResposta();
  const updateResposta = useUpdateResposta();
  const deleteResposta = useDeleteResposta();

  const [novaResposta, setNovaResposta] = useState({ texto: "", correta: false });
  const [editingRespostaId, setEditingRespostaId] = useState<number | null>(null);
  const [editRespostaForm, setEditRespostaForm] = useState({ texto: "", correta: false });
  const [confirmDeleteResposta, setConfirmDeleteResposta] = useState<number | null>(null);

  const addResposta = () => {
    if (!novaResposta.texto.trim()) return;
    createResposta.mutate(
      {
        descricao: novaResposta.texto,
        tipoRespostaId: novaResposta.correta
          ? TIPO_RESPOSTA_CORRETA_ID
          : TIPO_RESPOSTA_ERRADA_ID,
        perguntaId: pergunta.id,
      },
      {
        onSuccess: () => {
          toast({ title: "Resposta adicionada" });
          setNovaResposta({ texto: "", correta: false });
        },
        onError: () =>
          toast({ title: "Erro ao adicionar resposta", variant: "destructive" }),
      }
    );
  };

  const startEditResposta = (r: Resposta) => {
    setEditingRespostaId(r.id);
    setEditRespostaForm({
      texto: r.descricao,
      correta: r.tipo_resposta_id === TIPO_RESPOSTA_CORRETA_ID,
    });
  };

  const saveEditResposta = () => {
    if (editingRespostaId == null) return;
    updateResposta.mutate(
      {
        id: editingRespostaId,
        payload: {
          descricao: editRespostaForm.texto,
          tipoRespostaId: editRespostaForm.correta
            ? TIPO_RESPOSTA_CORRETA_ID
            : TIPO_RESPOSTA_ERRADA_ID,
          perguntaId: pergunta.id,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Resposta atualizada" });
          setEditingRespostaId(null);
        },
        onError: () =>
          toast({ title: "Erro ao atualizar resposta", variant: "destructive" }),
      }
    );
  };

  const handleDeleteResposta = () => {
    if (confirmDeleteResposta == null) return;
    deleteResposta.mutate(
      { id: confirmDeleteResposta, perguntaId: pergunta.id },
      {
        onSuccess: () => {
          toast({ title: "Resposta removida" });
          setConfirmDeleteResposta(null);
        },
        onError: () =>
          toast({ title: "Erro ao remover resposta", variant: "destructive" }),
      }
    );
  };

  return (
    <>
      <Tabs defaultValue="lista" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">
            Lista ({isLoading ? "…" : respostas.length})
          </TabsTrigger>
          <TabsTrigger value="nova">Nova resposta</TabsTrigger>
        </TabsList>

        {/* ── lista ── */}
        <TabsContent
          value="lista"
          className="space-y-2 mt-4 max-h-[400px] overflow-y-auto"
        >
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && respostas.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Sem respostas. Adicione uma na aba "Nova resposta".
            </p>
          )}

          {respostas.map((r) => {
            const isCorreta = r.tipo_resposta_id === TIPO_RESPOSTA_CORRETA_ID;
            return (
              <div key={r.id} className="rounded-md border p-3">
                {editingRespostaId === r.id ? (
                  <div className="space-y-3">
                    <Textarea
                      rows={2}
                      value={editRespostaForm.texto}
                      onChange={(e) =>
                        setEditRespostaForm((s) => ({
                          ...s,
                          texto: e.target.value,
                        }))
                      }
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editRespostaForm.correta}
                          onCheckedChange={(v) =>
                            setEditRespostaForm((s) => ({ ...s, correta: v }))
                          }
                        />
                        <Label className="text-sm">Correcta</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRespostaId(null)}
                          disabled={updateResposta.isPending}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveEditResposta}
                          disabled={updateResposta.isPending}
                        >
                          {updateResposta.isPending ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3 mr-1" />
                          )}
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                      {isCorreta ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{r.descricao}</p>
                        {isCorreta && (
                          <Badge variant="default" className="mt-1 text-xs">
                            Resposta correcta
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditResposta(r)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmDeleteResposta(r.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        {/* ── nova ── */}
        <TabsContent value="nova" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="novoTexto">Texto da resposta</Label>
            <Textarea
              id="novoTexto"
              rows={3}
              value={novaResposta.texto}
              onChange={(e) =>
                setNovaResposta((s) => ({ ...s, texto: e.target.value }))
              }
              placeholder="Escreva a resposta..."
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="correta">Marcar como correcta</Label>
            <Switch
              id="correta"
              checked={novaResposta.correta}
              onCheckedChange={(v) =>
                setNovaResposta((s) => ({ ...s, correta: v }))
              }
            />
          </div>
          <Button
            onClick={addResposta}
            className="w-full"
            disabled={!novaResposta.texto.trim() || createResposta.isPending}
          >
            {createResposta.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Adicionar resposta
          </Button>
        </TabsContent>
      </Tabs>

      {/* Confirm delete resposta */}
      <Dialog
        open={confirmDeleteResposta !== null}
        onOpenChange={(o) => !o && setConfirmDeleteResposta(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover resposta</DialogTitle>
            <DialogDescription>
              Esta acção não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteResposta(null)}
              disabled={deleteResposta.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteResposta}
              disabled={deleteResposta.isPending}
            >
              {deleteResposta.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── página principal ────────────────────────────────────────────────────────

const PAGE_SIZE_PERGUNTAS = 10;

export default function ListarPerguntas() {
  const { toast } = useToast();
  const { data: tiposPergunta } = useTiposPerguntaList();

  // ── filtros ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todos");
  const [page, setPage] = useState(1);

  // ── query ────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = usePerguntas({
    descricao: search || undefined,
    disciplinaId: parseFilter(filtroDisciplina),
    page,
    limit: PAGE_SIZE_PERGUNTAS,
  });

  const perguntas = data?.data ?? [];
  const pagination = data?.pagination;



  // ── mutations ────────────────────────────────────────────────────────────
  const createPergunta = useCreatePergunta();
  const updatePergunta = useUpdatePergunta();

  // ── form state (pergunta) ────────────────────────────────────────────────
  const [pDialogOpen, setPDialogOpen] = useState(false);
  const [editingPergunta, setEditingPergunta] = useState<Pergunta | null>(null);
  const [pForm, setPForm] = useState({
    enunciado: "",
    disciplinaId: "",
    tipoPerguntaId: "1",
    cotacao: 1,
  });

  // ── respostas dialog ─────────────────────────────────────────────────────
  const [rDialogOpen, setRDialogOpen] = useState(false);
  const [activePergunta, setActivePergunta] = useState<Pergunta | null>(null);

  // ── delete confirm (pergunta) ────────────────────────────────────────────
  // Nota: a API não expõe DELETE /perguntas/:id no spec fornecido,
  // mas mantemos o botão desabilitado / comentado para quando existir.
  const [confirmDeletePergunta, setConfirmDeletePergunta] = useState<
    number | null
  >(null);

  // ── handlers ─────────────────────────────────────────────────────────────
  const openCreatePergunta = () => {
    setEditingPergunta(null);
    setPForm({ enunciado: "", disciplinaId: "", tipoPerguntaId: "1", cotacao: 1 });
    setPDialogOpen(true);
  };

  const openEditPergunta = (p: Pergunta) => {
    setEditingPergunta(p);
    setPForm({
      enunciado: p.descricao,
      disciplinaId: String(p.disciplina_id),
      tipoPerguntaId: String(p.tipo_pergunta_id),
      cotacao: p.cotacao,
    });
    setPDialogOpen(true);
  };

  const savePergunta = () => {
    if (!pForm.enunciado.trim() || !pForm.disciplinaId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o enunciado e a disciplina.",
        variant: "destructive",
      });
      return;
    }

    if (editingPergunta) {
      updatePergunta.mutate(
        {
          id: editingPergunta.id,
          payload: {
            descricao: pForm.enunciado,
            disciplinaId: Number(pForm.disciplinaId),
            tipoPerguntaId: Number(pForm.tipoPerguntaId),
            cotacao: pForm.cotacao,
          },
        },
        {
          onSuccess: () => {
            toast({ title: "Pergunta atualizada" });
            setPDialogOpen(false);
          },
          onError: () =>
            toast({ title: "Erro ao atualizar", variant: "destructive" }),
        }
      );
    } else {
      createPergunta.mutate(
        {
          descricao: pForm.enunciado,
          disciplinaId: Number(pForm.disciplinaId),
          tipoPerguntaId: Number(pForm.tipoPerguntaId),
          cotacao: pForm.cotacao,
        },
        {
          onSuccess: () => {
            toast({ title: "Pergunta criada" });
            setPDialogOpen(false);
          },
          onError: () =>
            toast({ title: "Erro ao criar", variant: "destructive" }),
        }
      );
    }
  };

  const openRespostas = (p: Pergunta) => {
    setActivePergunta(p);
    setRDialogOpen(true);
  };

  const isSaving = createPergunta.isPending || updatePergunta.isPending;

  // EXPORT
  const exportRows = useMemo(
    () =>
      perguntas.map((p) => ({
        id: p.id,
        enunciado: p.descricao,
        disciplina: p.disciplina,
        tipo: p.tipo_pergunta,
        cotacao: p.cotacao,
        criadoEm: p.created_at
          ? new Date(p.created_at).toLocaleDateString("pt-AO")
          : "—",
      })),
    [perguntas]
  );
  const pdfData = exportRows.length
    ? {
      filtros: [
        search ? `Pesquisa: ${search}` : null,
        filtroDisciplina && filtroDisciplina !== "todos"
          ? `Disciplina: ${filtroDisciplina}`
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
      documentTitle="Lista de Perguntas"
      subtitle="Banco de perguntas dos exames de acesso"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros || "Sem filtros",
        },
      ]}
      mainTable={{
        headers: [
          { key: "id", label: "ID", width: "10%" },
          { key: "enunciado", label: "Enunciado", width: "40%" },
          { key: "disciplina", label: "Disciplina", width: "20%" },
          { key: "tipo", label: "Tipo", width: "15%" },
          { key: "cotacao", label: "Cotação", width: "15%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;
  const excelProps = pdfData
    ? {
      documentTitle: "Lista de Perguntas",
      subtitle: "Banco de perguntas dos exames de acesso",
      infoSections: [
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros || "Sem filtros",
        },
        { title: "Resumo", content: [`Total: ${exportRows.length}`] },
      ],
      mainTable: {
        headers: [
          { key: "id", label: "ID", width: 10 },
          { key: "enunciado", label: "Enunciado", width: 50 },
          { key: "disciplina", label: "Disciplina", width: 25 },
          { key: "tipo", label: "Tipo", width: 20 },
          { key: "cotacao", label: "Cotação", width: 15 },
          { key: "criadoEm", label: "Criado Em", width: 20 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
    : null;
  const baseFileName = `Perguntas_${new Date()
    .toISOString()
    .slice(0, 10)}`;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title="Listar Perguntas"
        subtitle="Banco de perguntas e respostas para exames de acesso"
        actions={
          <div className="flex gap-2">
            <Button onClick={openCreatePergunta}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Pergunta
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
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">

            {/* Pesquisa */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar enunciado..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-10"
              />
            </div>

            {/* Select Disciplina */}
            <div className="w-[260px]">
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
          {/* Tabela */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Enunciado</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Cotação</TableHead>
                <TableHead>Criado Em</TableHead>
                <TableHead className="text-right">Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-destructive"
                  >
                    Erro ao carregar perguntas.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && perguntas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhuma pergunta encontrada.
                  </TableCell>
                </TableRow>
              )}

              {perguntas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>

                  <TableCell
                    className="max-w-[320px] truncate"
                    title={p.descricao}
                  >

                    <LatexText text={p.descricao} /></TableCell>
                  <TableCell>{p.disciplina}</TableCell>
                  <TableCell>
                    <Badge variant={tipoBadgeVariant[p.tipo_pergunta_id]?.variant}>
                      {tipoBadgeVariant[p.tipo_pergunta_id]?.label ?? p.tipo_pergunta}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{p.cotacao}</Badge>
                  </TableCell>
                  <TableCell>
                    {p.created_at
                      ? new Date(p.created_at).toLocaleDateString("pt-AO")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openRespostas(p)}
                      title="Gerir respostas"
                    >
                      <ListChecks className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditPergunta(p)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirmDeletePergunta(p.id)}
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
                Página {pagination.page} de {pagination.totalPages} —{" "}
                {pagination.total} resultados
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

      {/* ── Pergunta Create / Edit Dialog ── */}
      <Dialog open={pDialogOpen} onOpenChange={setPDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPergunta ? "Editar Pergunta" : "Nova Pergunta"}
            </DialogTitle>
            <DialogDescription>Preencha os dados da pergunta.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="enunciado">Enunciado *</Label>
              <Textarea
                id="enunciado"
                rows={3}
                value={pForm.enunciado}
                onChange={(e) =>
                  setPForm((s) => ({ ...s, enunciado: e.target.value }))
                }
                placeholder="Escreva o enunciado da pergunta..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Disciplina */}
              <div className="space-y-2">
                <Label>Disciplina *</Label>
                <DisciplinaCommandSelect
                  value={pForm.disciplinaId}
                  onChangeValue={(v) =>
                    setPForm((s) => ({ ...s, disciplinaId: v }))
                  }
                  label="Disciplina"
                  labelMode="inside"
                  enableDefaultSelectItem
                />
              </div>

              {/* Tipo de pergunta */}
              <div className="space-y-2">
                <Label>Tipo de pergunta</Label>
                <Select
                  value={pForm.tipoPerguntaId?.toString()}
                  onValueChange={(v) =>
                    setPForm((s) => ({ ...s, tipoPerguntaId: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>

                  <SelectContent>
                    {tiposPergunta?.map((tipo) => (
                      <SelectItem key={tipo.codigo} value={tipo.codigo.toString()}>
                        {tipo.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cotação */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cotacao">Cotação</Label>
                <Input
                  id="cotacao"
                  type="number"
                  min={0}
                  step={0.5}
                  value={pForm.cotacao}
                  onChange={(e) =>
                    setPForm((s) => ({
                      ...s,
                      cotacao: Number(e.target.value),
                    }))
                  }
                />
              </div>

            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={savePergunta} disabled={isSaving}>
              {isSaving && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingPergunta ? "Guardar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Respostas Manager Dialog ── */}
      <Dialog open={rDialogOpen} onOpenChange={setRDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Respostas
            </DialogTitle>
            <DialogDescription className="line-clamp-2">
              {activePergunta?.descricao}
            </DialogDescription>
          </DialogHeader>

          {activePergunta && <RespostasManager pergunta={activePergunta} />}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm delete pergunta ── */}
      <Dialog
        open={confirmDeletePergunta !== null}
        onOpenChange={(o) => !o && setConfirmDeletePergunta(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover pergunta</DialogTitle>
            <DialogDescription>
              Todas as respostas associadas serão também removidas. Continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeletePergunta(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Adicionar useDeletePergunta quando o endpoint estiver disponível
                toast({ title: "Funcionalidade em desenvolvimento." });
                setConfirmDeletePergunta(null);
              }}
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}