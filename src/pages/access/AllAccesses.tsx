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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryAccesses } from "@/hooks/acess/use-query-accesses";

export function ListarAcessos() {
  // ----- Paginação -----
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  // ----- Query -----
  const { data: acessos, isLoading } = useQueryAccesses({
    apenasAtivos: true,
    page: currentPage,
    limit: itemsPerPage,
  });

  const data = acessos?.data ?? [];
  const total = acessos?.total ?? 0;
  const totalPages = acessos?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Todos Acessos" />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Designação</TableHead>
              <TableHead>Sigla</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  A carregar...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((acesso) => (
                <TableRow key={acesso.id}>
                  <TableCell>{acesso.id}</TableCell>
                  <TableCell>{acesso.designacao}</TableCell>
                  <TableCell>{acesso.sigla}</TableCell>
                  <TableCell>{acesso.moduloNome}</TableCell>
                  <TableCell>{acesso.tipoAcesso}</TableCell>
                  <TableCell>
                    <Badge variant={acesso.ativo ? "default" : "secondary"}>
                      {acesso.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum acesso encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {data.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, total)} de {total} registos
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
              Página {currentPage} de {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
