import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryListarGrupo } from "@/hooks/controle-acesso/use-query-listar-grupo";
import { Edit, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { Grupo } from "@/services/controle-acesso/listar-grupos.service";
type GrupoTableProps = {
  handleEditGrupo: (grupo: Grupo) => void;
  handleDeleteGrupo: (grupo: Grupo) => void;
};
export function GrupoTable(props: GrupoTableProps) {
  const { handleEditGrupo, handleDeleteGrupo } = props;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [typeGroup, setTypeGroup] = useState<number | string>(1);

  const queryParams = useMemo(
    () => ({
      typeGroup,
      search: debouncedSearch,
      page,
      limit,
    }),
    [typeGroup, debouncedSearch, page, limit]
  );

  const { data: response, isLoading } = useQueryListarGrupo(queryParams);

  const tableData = response?.data ?? [];
  const total = response?.total ?? 0;
  const totalPages = response?.totalPages ?? 1;

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>Grupos de Acesso</CardTitle>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Pesquisar grupo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <Select
            value={String(typeGroup)}
            onValueChange={(value) => {
              setTypeGroup(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Tipo de grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Multiutilizador</SelectItem>
              <SelectItem value="2">Unitário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(limit)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : tableData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum registo encontrado
            </h3>
            <p className="text-muted-foreground">
              Não foram encontrados grupos com os filtros aplicados.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Designação</TableHead>
                    <TableHead>Sigla</TableHead>
                    <TableHead>Utilizadores</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {tableData.map((grupo) => (
                    <TableRow key={grupo.codigo}>
                      <TableCell>{grupo.designacao}</TableCell>
                      <TableCell className="uppercase">{grupo.sigla}</TableCell>
                      <TableCell>{grupo.user_count}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            grupo.active_state === 1 ? "default" : "secondary"
                          }
                        >
                          {grupo.active_state === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(grupo.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Editar */}
                          <Button
                            variant="outline"
                            size="icon"
                            title="Editar grupo"
                            onClick={() => handleEditGrupo(grupo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {/* Excluir */}
                          <Button
                            variant="destructive"
                            size="icon"
                            title={"Excluir grupo"}
                            onClick={() => handleDeleteGrupo(grupo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                A mostrar {tableData.length} de {total} registos
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>

                <span className="text-sm">
                  Página {page} de {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
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
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
