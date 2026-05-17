import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Home,
  Loader2,
  LockOpen,
  Search,
  AlertCircle,
  Eye,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useQueryCashRegisters } from "@/hooks/financa/use-cash-register";

import { CashRegister } from "@/services/finance/cash-register.service";

import { OpenCashRegisterForm } from "./components/open-cash-register-form";

function CaixasDisponiveisTab() {
  const [search, setSearch] = useState("");
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(
    null,
  );

  const debouncedSearch = search;
  const { data: dataCashRegisters, isLoading } = useQueryCashRegisters({
    search: debouncedSearch,
  });
  const cashRegisters = dataCashRegisters?.data ?? [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Caixas disponíveis</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar caixa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead className="text-center w-[140px]">Ação</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                cashRegisters.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      #{String(item.code).padStart(3, "0")}
                    </TableCell>

                    <TableCell className="font-medium">{item.name}</TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {item.operator_name ?? "—"}
                    </TableCell>

                    <TableCell className="text-center">
                      {item.status === "aberto" ? (
                        <Link
                          to={`/financas/caixa/${item.code}`}
                          className={buttonVariants({
                            variant: "outline",
                            size: "icon",
                          })}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-950"
                          onClick={() =>
                            setSelectedRegister({
                              blocked: item.blocked,
                              id: item.code,
                              name: item.name,
                              operatorId: item.operator_code,
                              status: item.status,
                            })
                          }
                        >
                          <LockOpen className="h-3.5 w-3.5" />
                          Abrir caixa
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && cashRegisters.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground text-sm"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/40" />
                      <span>Nenhum caixa disponível para abertura</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Open Register Dialog */}
      <Dialog
        open={!!selectedRegister}
        onOpenChange={(open) => !open && setSelectedRegister(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LockOpen className="h-5 w-5 text-muted-foreground" />
              Abrir Caixa
            </DialogTitle>
            <DialogDescription>
              Defina o montante inicial para começar as operações financeiras.
            </DialogDescription>
          </DialogHeader>

          {selectedRegister && (
            <OpenCashRegisterForm
              register={selectedRegister}
              onSuccess={() => setSelectedRegister(null)}
              onCancel={() => setSelectedRegister(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CaixaPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Financeiro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Caixas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Gestão de Caixas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Controle de abertura e fechamento de caixas
        </p>
      </div>

      <CaixasDisponiveisTab />
    </div>
  );
}
