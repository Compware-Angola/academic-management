// src/pages/UserAccess.tsx
import { useMemo, useState } from "react";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

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
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";   // ← Novo
import { Skeleton } from "@/components/ui/skeleton";

import {
  RefreshCw,
  Plus,
  Shield,
  ChevronLeft,
  ChevronRight,
  Edit,
  Lock,
  User as UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useUsers } from "@/hooks/acess/use-query-users";
import { useToggleUserStatus } from "@/hooks/acess/use-query-users"; // ← Novo
import { User } from "@/services/access/fect-users.service";

import { UserPermissionsModal } from "./components/UserPermissionsModal";
import { PasswordEditModal } from "./components/UserEditPassword";
import { UserEditModal } from "./components/UserEditModal";

type UserActionType = "password" | "permissions" | "profile" | null;

export default function UserAccess() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [ativo, setAtivo] = useState<boolean | undefined>(undefined);
  
  const navigate = useNavigate();
  const [typeToEdit, setTypeToEdit] = useState<UserActionType>(null);

  // Hooks
  const {
    data: usersResponse,
    isLoading,
    isError,
    refetch,
  } = useUsers({
    search: searchTerm || undefined,
    page: currentPage,
    limit: itemsPerPage,
    ativo,
  });

  const toggleMutation = useToggleUserStatus();

  const handleEditUser = (user: User, type: UserActionType) => {
    setSelectedUser(user);
    setTypeToEdit(type);
  };

  // Função para alternar estado com Switch
  const handleToggleStatus = (userId: number) => {
    toggleMutation.mutate(userId, {
      onSuccess: (result) => {
        console.log(result.message);
      },
      onError: (error: any) => {
        alert(`Erro ao alterar estado: ${error.message}`);
      },
    });
  };

  // Dados extraídos da resposta paginada
  const users = usersResponse?.data ?? [];
  const total = usersResponse?.total ?? 0;
  const totalPages = usersResponse?.totalPages ?? 1;

  const pdfData = useMemo(() => {
    if (!users.length) return null;

    return {
      filtros: [
        ativo === undefined
          ? "Estado: Todos"
          : ativo
            ? "Estado: Ativos"
            : "Estado: Inativos",
        searchTerm && `Pesquisa: ${searchTerm}`,
      ]
        .filter(Boolean)
        .join(" | "),

      total,

      rows: users.map((u: User) => ({
        codigo: u.codigo,
        nome: u.nome,
        username: u.username,
        email: u.email || "N/A",
        telefone1: u.telefone1 || "N/A",
        telefone2: u.telefone2 || "N/A",
      })),
    };
  }, [users, total, ativo, searchTerm]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Acessos por Utilizador"
      subtitle="Listagem de utilizadores do sistema"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        {
          title: "Resumo",
          content: [`Total de utilizadores: ${pdfData.total}`],
        },
      ]}
      mainTable={{
        headers: [
          { key: "codigo", label: "Código", width: "8%" },
          { key: "nome", label: "Nome", width: "22%" },
          { key: "username", label: "Username", width: "15%" },
          { key: "email", label: "Email", width: "20%" },
          { key: "telefone1", label: "Telefone", width: "15%" },
          { key: "telefone2", label: "Telefone (2)", width: "15%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Acessos por Utilizador",
        subtitle: "Listagem de utilizadores do sistema",
        infoSections: [
          { title: "Filtros Aplicados", content: pdfData.filtros },
          {
            title: "Resumo",
            content: [`Total de utilizadores: ${pdfData.total}`],
          },
        ],
        mainTable: {
          headers: [
            { key: "codigo", label: "Código", width: 10 },
            { key: "nome", label: "Nome", width: 30 },
            { key: "username", label: "Username", width: 20 },
            { key: "email", label: "Email", width: 30 },
            { key: "telefone1", label: "Telefone", width: 20 },
            { key: "telefone2", label: "Telefone (2)", width: 20 },
          ],
          rows: pdfData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Utilizadores_${new Date().toISOString().slice(0, 10)}`;

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Início
          </Link>
          <span>/</span>
          <span className="text-foreground">Acessos por utilizador</span>
        </nav>

        {/* Exportações */}
        {pdfData && excelProps && (
          <div className="flex gap-2">
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`${baseFileName}.pdf`}
                showDownload
                showPrint
              />
            )}

            <ExcelActions
              excelProps={excelProps}
              fileName={`${baseFileName}.xlsx`}
              showDownload
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Acessos por utilizador
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão de permissões por utilizador
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/acessos/criar-utilizador")}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Utilizador
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              autoComplete="off"
              placeholder="Nome, username, código..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={
                ativo === undefined ? "all" : ativo ? "active" : "inactive"
              }
              onValueChange={(value) => {
                setCurrentPage(1);
                if (value === "all") {
                  setAtivo(undefined);
                } else if (value === "active") {
                  setAtivo(true);
                } else {
                  setAtivo(false);
                }
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Itens por página</Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-32">
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

      {/* Tabela + Loading + Empty State */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(itemsPerPage)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-lg font-medium text-destructive">
            Erro ao carregar utilizadores
          </p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Nenhum utilizador encontrado</p>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Tente ajustar a pesquisa
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Telefone (2)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.codigo}>
                      <TableCell className="font-mono">{user.codigo}</TableCell>
                      <TableCell className="font-medium max-w-md truncate">
                        {user.nome}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.username}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.email || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.telefone1 || "N/A"}
                      </TableCell>

                      {/* === SWITCH DE ESTADO === */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={user.activestate === 1}
                            disabled={toggleMutation.isPending}
                            onCheckedChange={() => handleToggleStatus(user.codigo)}
                          />
                          <span className="text-sm font-medium">
                            {user.activestate === 1 ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {user.telefone2 || "N/A"}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Editar Perfil"
                            title="Editar Perfil"
                            onClick={() => handleEditUser(user, "profile")}
                          >
                            <UserIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Editar Senha"
                            title="Editar Senha"
                            onClick={() => handleEditUser(user, "password")}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>

                          <Button
                            aria-label="Gerenciar Permissões"
                            title="Gerenciar Permissões"
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditUser(user, "permissions")}
                          >
                            <Shield className="h-4 w-4" />
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
            <div className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, total)} de {total}{" "}
              utilizadores
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm px-3 py-1">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {typeToEdit === "permissions" && selectedUser && (
        <UserPermissionsModal
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      )}

      {typeToEdit === "password" && selectedUser && (
        <PasswordEditModal
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
          onSuccess={() => {
            refetch();
            setSelectedUser(null);
            setTypeToEdit(null);
          }}
        />
      )}

      {typeToEdit === "profile" && selectedUser && (
        <UserEditModal
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
          onSuccess={() => {
            refetch();
            setSelectedUser(null);
            setTypeToEdit(null);
          }}
        />
      )}
    </div>
  );
}