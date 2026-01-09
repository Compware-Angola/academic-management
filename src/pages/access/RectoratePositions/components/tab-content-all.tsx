import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { TabsContent } from "@/components/ui/tabs";
import { useQueryListarCargosAdministrativo } from "@/hooks/controle-acesso/use-query-listar-cargos-administrativos";
import { useQueryFetchTipoCargo } from "@/hooks/cargo/use-query-fetch-tipo-cargo";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Cargo } from "@/services/access/cargos-administrativos/fetch-cargos-administrativos.service";
import { fetchUsersList } from "@/services/access/fect-users.service";
import { useUsers } from "@/hooks/acess/use-query-users";
import { useDebounce } from "@/hooks/use-debounce";
import { useUpdateOcupanteCargo } from "@/hooks/controle-acesso/use-mutation-update-ocupante";
import { useDeleteOcupanteCargo } from "@/hooks/acess/use-mutation-delete-ocupante";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const ALL_OPTION = {
  pk_tipo_cargo: 0,
  descricao: "Todos",
};
export function TabContentAll() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [filtroCargo, setFiltroCargo] = useState("0");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cargoParaExcluir, setCargoParaExcluir] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [novoOcupante, setNovoOcupante] = useState("");
  const { data: cargos = [], isLoading: isLoadingCargos } =
    useQueryListarCargosAdministrativo({
      tipoCargoId:
        Number(filtroCargo) === Number("0") ? undefined : Number(filtroCargo),
    });
  const { data: tipoCargos = [], isLoading: isLoadingTipoCargo } =
    useQueryFetchTipoCargo();
  const { data: usersResponse } = useUsers({ search: debouncedSearch });
  const { mutate: updateOcupante, isPending: isUpdating } =
    useUpdateOcupanteCargo();
  const { mutate: deleteOcupante, isPending: isDeleting } =
    useDeleteOcupanteCargo();

  const users = usersResponse?.data ?? [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const handleSaveEdit = () => {
    if (!selectedCargo) return;
    updateOcupante({
      cargoId: selectedCargo.pkCargo,
      novoUtilizadorId: Number(novoOcupante),
    });
  };
  const handleEdit = (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setNovoOcupante("");
    setEditDialogOpen(true);
  };
  return (
    <TabsContent value="todos" className="mt-4">
      <div className="space-y-4">
        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
          <FormCommandSelect
            disabled={isLoadingTipoCargo}
            value={filtroCargo}
            label="Cargos"
            options={[ALL_OPTION, ...tipoCargos]}
            map={(c) => ({
              key: c.pk_tipo_cargo.toString(),
              value: c.pk_tipo_cargo.toString(),
              label: c.descricao,
            })}
            onChange={setFiltroCargo}
          />
        </div>
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Utilizador</TableHead>
                <TableHead>Faculdade</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCargos ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : cargos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Nenhum registo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                cargos.map((item) => (
                  <TableRow key={item.pkCargo}>
                    <TableCell className="font-mono text-sm">
                      {item.pkCargo}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{item.tipoCargoDescricao}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.utilizadorNome}
                    </TableCell>
                    <TableCell>{item.faculdadeNome || "-"}</TableCell>
                    <TableCell>{item.cursoNome || "-"}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"}>
                        {item.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCargoParaExcluir(item.pkCargo);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Ocupante do Cargo</DialogTitle>
            <DialogDescription>
              Altere o ocupante do cargo selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="actual-ocupante">Actual Ocupante</Label>
              <Input
                id="actual-ocupante"
                value={selectedCargo?.utilizadorNome || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={selectedCargo?.tipoCargoDescricao || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <FormCommandSelect
              disabled={isLoadingCargos}
              value={novoOcupante}
              label="Novo Ocupante"
              options={users}
              map={(u) => ({
                key: u.codigo.toString(),
                value: u.codigo.toString(),
                label: u.nome,
              })}
              onChange={setNovoOcupante}
              onSearchChange={setSearch}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!novoOcupante || isUpdating}
            >
              {isUpdating ? "A guardar..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>

            <AlertDialogDescription>
              Tem a certeza que deseja remover o ocupante deste cargo?
              <br />
              <span className="font-medium text-destructive">
                Esta ação não pode ser desfeita.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                if (!cargoParaExcluir) return;

                deleteOcupante(cargoParaExcluir, {
                  onSuccess: () => {
                    setDeleteOpen(false);
                    setCargoParaExcluir(null);
                  },
                });
              }}
            >
              {isDeleting ? "A eliminar..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );
}
