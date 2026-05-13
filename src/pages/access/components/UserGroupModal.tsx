import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/FormInput";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { UserGroupCard, mapStudent } from "./UserGroupCard";
import { useQueryUsersByGroup } from "@/hooks/acess/use-query-user-grupo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GrupoSelecionado = {
  id: number;
  designacao: string;
  descricao: string;
  sigla: string;
  fkTipoDeGrupo: number;
};
type UserGroupModalProps = {
  grupo: GrupoSelecionado;
  isOpen: boolean;
  onClose: () => void;
};

export default function UserGroupModal({
  grupo,
  isOpen,
  onClose,
}: UserGroupModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: userResponse,
    isLoading,
    isError,
  } = useQueryUsersByGroup({
    limit: limit,
    page: page,
    nome: searchTerm,
    pkGrupo: grupo?.id,
  });

  const tableData = userResponse?.data ?? [];
  const totalPages = userResponse?.totalPages ?? 0;

  const total = userResponse?.total ?? 0;
  const closeModal = () => {
    onClose();
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl! max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl">
            <span className="text-muted-foreground font-mono text-lg">
              {grupo?.designacao || "Carregando..."} ({total || "..."})
            </span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <FormInput
              placeholder="Entra com uma pesquisa"
              onDebounce={(v) => setSearchTerm(v)}
            />
          </div>
        </DialogDescription>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Carregando Utilizadores...
              </p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-destructive">
              Erro ao carregar os Utilizadores.
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Nenhum Utilizador encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {tableData.map((user) => (
                <UserGroupCard item={mapStudent(user)} />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {Math.min((page - 1) * limit + tableData.length, total)}{" "}
              de {total} registros
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {page} de {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>

              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-9">
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
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={closeModal} size="lg">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
