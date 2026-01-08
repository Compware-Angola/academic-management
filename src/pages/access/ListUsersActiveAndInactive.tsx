import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Key, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { usersQueryActive } from "@/hooks/acess/use-query-users-active";
import { useUpdateUserPassword } from "@/hooks/acess/use-mutation-updade-user";
import { AuthStorage } from "@/util/auth-storage";

const estadosAtivo = [
  { codigo: "true", designacao: "Ativo" },
  { codigo: "false", designacao: "Inativo" },
];

type FiltroUsuario = {
  ativo?: boolean;
};

interface RefPessoa {
  pk: number;
  desc: string;
}

interface Utilizador {
  pkUtilizador: number;
  nome: string;
  username: string;
  email: string;
  active: boolean;
  refPessoa: RefPessoa;
  createdAt: string;
  updatedAt: string;
}

export default function ListaUtilizadoresActiveOrInactive() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState<FiltroUsuario>({
    ativo: undefined,
  });

  

  const { data: users, isLoading } = usersQueryActive(filtro);
  const { mutateAsync: updatePassword } = useUpdateUserPassword();
  const user = AuthStorage.getUser();

  //console.log("Users Filters: ", users)

  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUtilizador, setSelectedUtilizador] =
    useState<Utilizador | null>(null);
  const [novaSenha, setNovaSenha] = useState("");
  const itemsPerPage = 10;

  const filteredData = users ?? [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (utilizador: Utilizador) => {
    setSelectedUtilizador(utilizador);
    setNovaSenha("");
    setIsModalOpen(true);
  };

  const handleAlterarSenha = async () => {
    if (!novaSenha.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira a nova senha.",
        variant: "destructive",
      });
      return;
    }

    if (novaSenha.length < 8) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    //console.log("New Password: ",novaSenha)

    await updatePassword({
      utilizadorId: user.user_id,
      novaSenha: novaSenha,
    });

    //console.log("Response: ", response)

    toast({
      title: "Sucesso",
      description: `Senha do utilizador ${selectedUtilizador?.nome} alterada com sucesso.`,
    });

    setIsModalOpen(false);
    setNovaSenha("");
    setSelectedUtilizador(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Utilizadores Ativo/Inativo"
        subtitle="Visualize e gerencie todos os utilizadores do sistema"
      />

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <FormSelect
            label="Estado do Utilizador"
            options={estadosAtivo}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
            value={
              filtro.ativo === undefined ? "" : filtro.ativo ? "true" : "false"
            }
            onChange={(value) =>
              setFiltro({
                ativo: value === "" ? undefined : value === "true",
              })
            }
          />
        </div>
      </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Username</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Pessoa Ref.</TableHead>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableHead className="font-semibold">Criado em</TableHead>
                <TableHead className="font-semibold">Atualizado em</TableHead>
                <TableHead className="font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum utilizador encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((utilizador) => (
                  <TableRow key={utilizador.pkUtilizador}>
                    <TableCell>{utilizador.pkUtilizador}</TableCell>
                    <TableCell className="font-medium">{utilizador.nome}</TableCell>
                    <TableCell>{utilizador.username}</TableCell>
                    <TableCell>{utilizador.email}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {utilizador.refPessoa.desc} (ID: {utilizador.refPessoa.pk})
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={utilizador.active ? "default" : "secondary"}>
                        {utilizador.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(utilizador.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(utilizador.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() => navigate(`/acessos/utilizador/${utilizador.pkUtilizador}`)}
                          >
                          Ver Acessos
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(utilizador)}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        Alterar Senha
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="novaSenha">Nova Senha</Label>
              <Input
                id="novaSenha"
                type="password"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAlterarSenha}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
