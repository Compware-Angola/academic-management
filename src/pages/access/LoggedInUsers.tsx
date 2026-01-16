import { useState } from "react";
import {
  RefreshCw,
  PowerOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

import { UserLogadoItem } from "@/services/access/fetch-user-logado.service";
import { useQueryUsersLogados } from "@/hooks/acess/use-query-users-logados";
import { useMutationMakLoggedOut } from "@/hooks/mutations/use-mutation-login";

export default function LoggedInUsers() {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<"1" | "0" | "2">("1");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { mutate: makLogout, isPending } = useMutationMakLoggedOut();

  const handleLogout = (utilizadorId: number) => {
    if (!utilizadorId) return;

    makLogout({
      utilizadorId,
      platform: "GA",
    });
  };

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQueryUsersLogados({
    estado: Number(estado) as 0 | 1 | 2,
    search: search.trim() || undefined,
    page,
    limit,
  });

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Utilizadores Logados</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold tracking-tight">
            Utilizadores Logados
          </h1>

          <p className="text-muted-foreground">
            Total: {isLoading ? "..." : total} utilizadores
            {isFetching && " (atualizando...)"}
          </p>
        </div>

        <Button onClick={ ()=>refetch()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2 min-w-[200px]">
          <label className="text-sm font-medium">Estado</label>
          <Select
            value={estado}
            onValueChange={(v) => {
              setEstado(v as "1" | "0" | "2");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Logados</SelectItem>
              <SelectItem value="0">Não Logados</SelectItem>
              <SelectItem value="2">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2 min-w-[300px]">
          <label className="text-sm font-medium">Pesquisar</label>
          <Input
            placeholder="Nome, username, email, IP ou código..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-destructive">
                  Erro ao carregar dados: {error.message}
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhum utilizador encontrado
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((user: UserLogadoItem) => (
                <TableRow key={`${user.codigo}-${user.ultimaatividade || "no-date"}`}>
                  <TableCell className="font-mono text-sm">
                    {user.codigo}
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.nome}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email || "—"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {user.ip}
                  </TableCell>
                  <TableCell>{user.ultimaatividade}</TableCell>
                  <TableCell>
                    <Badge variant={user.logado === 1 ? "default" : "secondary"}>
                      {user.logado === 1 ? "Logado" : "Deslogado"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          title="Forçar logout"
                          disabled={user.logado !== 1 || isPending}
                        >
                          <PowerOff className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Forçar logout do utilizador?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem a certeza que deseja forçar o logout de{" "}
                            <strong>{user.nome}</strong>?  
                            A sessão será terminada imediatamente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleLogout(user.utilizador)}
                          >
                            Confirmar logout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} • {total} registos
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
