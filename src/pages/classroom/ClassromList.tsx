import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  Building,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuerySalasNew } from "@/hooks/salas/use-query-sala";
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
import { useMutationDeleteSala } from "@/hooks/salas/use-mutation-delete-sala";
import { Room } from "@/services/salas/fetch-sala";
import { CreateSalaModal } from "./create-sala-modal";

export default function ClassromList() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [salaToEdit, setSalaToEdit] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSala, setSelectedSala] = useState<{
    id: string;
    descricao: string;
  } | null>(null);

  // Dados da API
  const { data: salas = [], isLoading, refetch } = useQuerySalasNew();
  const { mutate: deleteSala, isPending: deleting } = useMutationDeleteSala();

  // Filtro de pesquisa
  const filteredData = salas.filter((item) =>
    item.designacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Abrir modal para criar
  const handleOpenCreate = () => {
    setSalaToEdit(null);
    setOpenCreateModal(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (item: Room) => {
    setSalaToEdit(item);
    setOpenCreateModal(true);
  };

  // Fechar modal e limpar estado
  const handleCloseModal = (open: boolean) => {
    setOpenCreateModal(open);
    if (!open) {
      setSalaToEdit(null); // limpa ao fechar
    }
  };

  // Excluir sala
  const handleOpenDelete = (item: Room) => {
    setSelectedSala({
      id: item.codigo.toString(),
      descricao: item.designacao,
    });
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedSala) return;
    deleteSala(selectedSala.id, {
      onSuccess: () => {
        setOpenDialog(false);
        setSelectedSala(null);
        refetch(); // opcional: refetch após excluir
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Gestão de Salas</span>
        <span>/</span>
        <span className="text-foreground">Listar salas</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listar salas</h1>
          <p className="text-muted-foreground mt-1">
            Gestão completa de salas e espaços académicos
          </p>
        </div>
        <Button size="sm" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova sala
        </Button>
      </div>

      {/* Filtro de pesquisa */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Descrição da sala..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum registo encontrado</p>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Capacidade Exame</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-sm">
                        {item.codigo}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.designacao}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.tipo_sala}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.capacidade}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.capacidadeexameacessoprova}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.utilizavel?.toUpperCase() === "SIM"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {item.utilizavel?.toUpperCase() === "SIM"
                            ? "Disponível"
                            : "Indisponível"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            title="Editar sala"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(item)}
                            title="Excluir sala"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Itens por página:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir a sala{" "}
              <strong>{selectedSala?.descricao}</strong>?<br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Criação/Edição */}
      <CreateSalaModal
        open={openCreateModal}
        onOpenChange={handleCloseModal}
        sala={salaToEdit}
        onSuccess={refetch} // atualiza a lista após salvar
      />
    </div>
  );
}
