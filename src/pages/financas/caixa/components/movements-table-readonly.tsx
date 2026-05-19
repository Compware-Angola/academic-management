// src/pages/financas/caixa/components/movements-table-readonly.tsx

import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryCashRegisterMovements } from "@/hooks/financa/use-cash-register";
import { CashRegisterMovement } from "@/services/finance/cash-register.service";
import { formatCurrencyAOA } from "@/util/format-currency";
import { useQueryMyCashRegister } from "@/hooks/financa/use-cash-register";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { MovementDetails } from "./MovementDetails";



export function MovementsTableReadOnly() {
  const { data: currentUser } = useCurrentUser("GA")
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovement, setSelectedMovement] =
    useState<CashRegisterMovement | null>(null);
  const { data, isLoading } = useQueryCashRegisterMovements({
    search: search || undefined,
    page,
    limit: 10,
    operatorId: currentUser.user.pk_utilizador,
  });

  const movements = data?.data ?? [];
  const meta = data?.meta;

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (meta && page < meta.totalPages) setPage(page + 1);
  };

  const getStatusBadge = (status: string, adminStatus?: string) => {
    if (adminStatus === "validado") {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 border-green-200"
        >
          Validado
        </Badge>
      );
    }
    if (adminStatus === "rejeitado") {
      return <Badge variant="destructive">Rejeitado</Badge>;
    }

    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      aberto: "default",
      fechado: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Histórico de Movimentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar movimentos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Código</TableHead>
                <TableHead>Caixa</TableHead>
                <TableHead>Valor Abertura</TableHead>
                <TableHead>Total Arrecadado</TableHead>
                <TableHead>Data Abertura</TableHead>
                <TableHead>Data Fecho</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando movimentos...
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                movements.map((movement) => (
                  <TableRow key={movement.code}>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      #{String(movement.code).padStart(3, "0")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.cash_register_name}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrencyAOA(movement.opening_amount)}
                    </TableCell>
                    <TableCell className="text-blue-600 font-medium">
                      {formatCurrencyAOA(movement.total_collected_amount)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(movement.date_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {movement.closing_date
                        ? new Date(movement.closing_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(movement.status, movement.admin_status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedMovement(movement)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
                      <span>Nenhum movimento encontrado</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(meta.page - 1) * meta.limit + 1} -{" "}
              {Math.min(meta.page * meta.limit, meta.total)} de {meta.total}{" "}
              resultados
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page === meta.totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog
        open={!!selectedMovement}
        onOpenChange={(open) => !open && setSelectedMovement(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Movimento</DialogTitle>
            <DialogDescription>
              Informações detalhadas do movimento #{selectedMovement?.code}
            </DialogDescription>
          </DialogHeader>
          {selectedMovement && <MovementDetails movement={selectedMovement} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
