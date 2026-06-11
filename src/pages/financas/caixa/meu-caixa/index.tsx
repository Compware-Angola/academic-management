import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Loader2, Lock, LockOpen, Wallet, History } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  useCloseCashRegister,
  useQueryMyCashRegister,
  useQueryMyCashSummary,
} from "@/hooks/financa/use-cash-register";
import { CashRegisterConfirmationAlert } from "../components/CashRegisterConfirmationAlert";
import { formatCurrencyAOA } from "@/util/format-currency";
import { pdf } from "@react-pdf/renderer";
import { CashClosingPDF } from "./CashClosingPDF";
import { formatDate } from "../../notas-pagamento/components/form";
import { MovementsTableReadOnly } from "../components/movements-table-readonly";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";

function StatusBadge({ status }: { status: string }) {
  const isOpen = status === "aberto";
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border-0 ${isOpen
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        }`}
    >
      {isOpen ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
      {isOpen ? "Aberto" : "Fechado"}
    </Badge>
  );
}

function CaixaCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-2 px-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      ))}
      <div className="flex items-center justify-between border-t-2 pt-3 mt-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-4 w-28 rounded" />
      </div>
    </div>
  );
}

function MeuCaixaAtualTab() {
  const { data: user } = useCurrentUser("GA");
  const [confirmClose, setConfirmClose] = useState(false);

  const { data: myCaixa, isLoading: isLoadingCaixa } = useQueryMyCashRegister();
  const { data, isLoading: isLoadingSummary } = useQueryMyCashSummary();
  const closeMutation = useCloseCashRegister();

  async function handleClose() {
    if (!myCaixa) return;

    const { data: response } = await closeMutation.mutateAsync(myCaixa.id);

    const blob = await pdf(
      <CashClosingPDF
        data={{
          cashRegisterName: myCaixa.name,
          closedAt: formatDate(response.closingDate),
          movementId: response.id,
          openingAmount: response.openingAmount,
          openedAt: formatDate(response.dateAt),
          total: response.totalCollectedAmount,
          operator: user?.user.nome,
          summary: [
            { paymentMethod: "TPA", total: response.collectedTpaAmount },
            { paymentMethod: "Cash", total: response.collectedPaymentAmount },
          ],
        }}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url);

    setConfirmClose(false);
  }

  if (isLoadingCaixa) {
    return (
      <div className="space-y-4">
        <CaixaCardSkeleton />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Resumo por forma de pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SummarySkeleton />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button variant="destructive" className="gap-2" disabled>
            <Lock className="h-4 w-4" />
            Fechar caixa
          </Button>
        </div>
      </div>
    );
  }

  if (myCaixa && (myCaixa.status === "fechado" || myCaixa.blocked === "S")) {
    return <div className="space-y-4"><span className="text-xs text-muted-foreground font-mono">
      codigo de abertura: {myCaixa?.code}
    </span> <CashRegisterConfirmationAlert myCaixa={myCaixa} /></div>;
  }

  if (myCaixa && myCaixa?.status === "aberto" && myCaixa?.blocked === "N") {
    return (
      <div className="space-y-4">

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
                  <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{myCaixa?.name}</h2>
                    <StatusBadge status={myCaixa?.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {data && data.movementID && (
                      <span className="text-xs text-muted-foreground font-mono">
                        #{String(data.movementID)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      valor de abertura:{" "}
                      {formatCurrencyAOA(data?.openingAmount || 0)}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      codigo de abertura: {myCaixa?.code}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Resumo por forma de pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <SummarySkeleton />
            ) : !data || data.summary.length === 0 ? (
              <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                Sem movimentos registados neste caixa.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Forma de Pagamento</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.summary.map((item) => (
                    <TableRow key={item.forma_pagamento_codigo}>
                      <TableCell className="font-medium">
                        {item.forma_pagamento}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-mono text-sm">
                        {formatCurrencyAOA(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 font-semibold bg-muted/30">
                    <TableCell>Total geral</TableCell>
                    <TableCell className="text-right tabular-nums font-mono">
                      {formatCurrencyAOA(
                        data.summary.reduce((acc, i) => acc + i.total, 0) +
                        data.openingAmount,
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => setConfirmClose(true)}
          >
            <Lock className="h-4 w-4" />
            Fechar caixa
          </Button>
        </div>

        <AlertDialog
          open={confirmClose}
          onOpenChange={(open) => {
            if (closeMutation.isPending) return;
            setConfirmClose(open);
          }}
        >
          <AlertDialogContent className="sm:max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-destructive" />
                Fechar caixa
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem a certeza que deseja fechar o caixa{" "}
                <span className="font-semibold text-foreground">
                  {myCaixa.name}
                </span>
                ? Esta acção irá encerrar todas as operações do caixa actual.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel disabled={closeMutation.isPending}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                }}
                disabled={closeMutation.isPending}
                className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {closeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />A fechar...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Fechar caixa
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (!myCaixa) {
    return (
      <Card className="border-dashed">

        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Nenhum caixa aberto</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Não tem nenhum caixa atribuído ou aberto neste momento. Contacte o
              administrador para lhe atribuir um caixa.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

function MeusMovimentosTab() {
  const { data: currentUser } = useCurrentUser("GA");
  if (!currentUser) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold">
              Nenhum movimento encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Você ainda não possui movimentos registrados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <MovementsTableReadOnly />;
}

export function MeuCaixaPage() {
  return (
    <div className="p-6 space-y-6">
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
            <BreadcrumbPage>Meu Caixa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Meu Caixa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie seu caixa atual e acompanhe seu histórico de movimentos
        </p>
      </div>

      <Tabs defaultValue="caixa-atual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="caixa-atual" className="gap-2">
            <Wallet className="h-4 w-4" />
            Caixa Atual
          </TabsTrigger>
          <TabsTrigger value="meus-movimentos" className="gap-2">
            <History className="h-4 w-4" />
            Meus Movimentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="caixa-atual">
          <MeuCaixaAtualTab />
        </TabsContent>

        <TabsContent value="meus-movimentos">
          <MeusMovimentosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
