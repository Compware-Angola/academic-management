// pages/admin/tipos-suporte.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Hooks e tipos
import {
  useTiposSuporte,
  useCreateTipoSuporte,
  useUpdateTipoSuporte,
  useDeleteTipoSuporte,
 
} from "@/hooks/suporte/use-query-tipo-suporte";
import { useQueryClient } from "@tanstack/react-query";
import { CreateTipoSuportePayload, TipoSuporte, UpdateTipoSuportePayload } from "@/services/suporte/tipo-suporte.service";

const emptyForm: CreateTipoSuportePayload = {
  descricao: "",
};

const ITEMS_PER_PAGE = 5;

export default function TiposSuporte() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estados do formulário e modais
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoSuporte | null>(null);
  const [deletingTipo, setDeletingTipo] = useState<TipoSuporte | null>(null);
  const [formData, setFormData] = useState<CreateTipoSuportePayload | UpdateTipoSuportePayload>(emptyForm);

  // ─── Query principal (listagem paginada + busca) ───
const {
  data: paginatedResponse,
  isLoading,
  isError,
  error,
} = useTiposSuporte({
  page: currentPage,
  limit: ITEMS_PER_PAGE,
  ...(searchTerm.trim() !== "" ? { search: searchTerm.trim() } : {}),
});
  // ─── Mutations ───
  const createMutation = useCreateTipoSuporte();
  const updateMutation = useUpdateTipoSuporte();
  const deleteMutation = useDeleteTipoSuporte();

  // ─── Handlers ───
  const handleOpenCreate = () => {
    setEditingTipo(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleOpenEdit = (tipo: TipoSuporte) => {
    setEditingTipo(tipo);
    setFormData({ descricao: tipo.descricao });
    setShowForm(true);
  };

  const handleOpenDelete = (tipo: TipoSuporte) => {
    setDeletingTipo(tipo);
    setShowDeleteConfirm(true);
  };

  const handleSave = () => {
    if (!formData.descricao?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "A descrição não pode estar vazia.",
        variant: "destructive",
      });
      return;
    }

    const trimmedData = { descricao: formData.descricao.trim() };

    if (editingTipo) {
      updateMutation.mutate(
        { id: editingTipo.id, data: trimmedData },
        {
          onSuccess: () => {
            toast({ title: "Sucesso", description: "Tipo atualizado com sucesso." });
            setShowForm(false);
          },
          onError: (err: any) => {
            toast({
              title: "Erro ao atualizar",
              description: err.message || "Não foi possível atualizar o tipo.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createMutation.mutate(trimmedData, {
        onSuccess: () => {
          toast({ title: "Sucesso", description: "Novo tipo criado com sucesso." });
          setShowForm(false);
          setCurrentPage(1); // voltar à primeira página após criar
        },
        onError: (err: any) => {
          toast({
            title: "Erro ao criar",
            description: err.message || "Não foi possível criar o tipo.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingTipo) return;

    deleteMutation.mutate(deletingTipo.id, {
      onSuccess: () => {
        toast({ title: "Sucesso", description: "Tipo eliminado com sucesso." });
        setShowDeleteConfirm(false);
        setDeletingTipo(null);
      },
      onError: (err: any) => {
        toast({
          title: "Erro ao eliminar",
          description:
            err.message ||
            "Não foi possível eliminar. Pode estar associado a solicitações existentes.",
          variant: "destructive",
        });
      },
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // ─── Render Loading / Error ───
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        <p className="text-lg font-medium">Erro ao carregar os tipos de suporte</p>
        <p className="text-sm">{error?.message || "Tente novamente mais tarde."}</p>
      </div>
    );
  }

  const tipos = paginatedResponse?.data ?? [];
  const totalPages = paginatedResponse?.totalPages ?? 1;
  const totalItens = paginatedResponse?.total ?? 0;

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Cabeçalho + Breadcrumb */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tipos de Suporte</h1>
          <p className="text-muted-foreground">Gerencie as categorias disponíveis para solicitações de suporte</p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Tipo
        </Button>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Administração</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tipos de Suporte</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Filtro / Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Pesquisar por descrição</Label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Digite para filtrar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Limpar busca"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-40 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tipos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                  Nenhum tipo de suporte encontrado
                </TableCell>
              </TableRow>
            ) : (
              tipos.map((tipo) => (
                <TableRow key={tipo.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{tipo.descricao}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(tipo)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDelete(tipo)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {tipos.length} de {totalItens} tipos • Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Próxima
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTipo ? "Editar Tipo de Suporte" : "Criar Novo Tipo de Suporte"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Ex: Problemas de acesso ao portal"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "A guardar..."
                : editingTipo
                ? "Guardar Alterações"
                : "Criar Tipo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de Eliminação */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar o tipo{" "}
              <span className="font-medium">"{deletingTipo?.descricao}"</span>?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "A eliminar..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}