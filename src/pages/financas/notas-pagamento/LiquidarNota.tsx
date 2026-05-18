import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Loader2 } from "lucide-react";
import { useQueryFacturas } from "@/hooks/horario/use-query-invoice";
import { PagamentoStatus } from "@/components/common/PagamentoStatus";
import { formatNumber } from "@/util/format-number";
import {
  useCashRegisterOpeningCodeVerification,
  useQueryMyCashRegister,
} from "@/hooks/financa/use-cash-register";
import { CashRegisterConfirmationAlert } from "../caixa/components/CashRegisterConfirmationAlert";

import { formatDate, FormNotaPagamento } from "./components/form";

export default function LiquidarNota() {
  const { isVerified: isCashRegisterOpeningCodeVerified, verify } =
    useCashRegisterOpeningCodeVerification();
  const { codigo } = useParams<{ codigo: string }>();

  const navigate = useNavigate();

  const { data: myCashRegister, isLoading: isLoadingCashRegister } =
    useQueryMyCashRegister();

  const {
    data: facturasResponses,
    isLoading,
    refetch,
  } = useQueryFacturas(
    {
      codigoFatura: codigo,
    },
    !!codigo,
  );

  const factura = facturasResponses?.data?.[0];

  if (isLoading || isLoadingCashRegister) {
    return (
      <Card className="p-20 flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando nota...</p>
      </Card>
    );
  }

  if (!factura) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground text-lg">
              Nota de pagamento não encontrada.
            </p>
            <Button
              variant="outline"
              className="mt-4 gap-2"
              onClick={() => navigate("/financas/notas-pagamento")}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar às Notas de Pagamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/financas/notas-pagamento">Notas de Pagamento</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Liquidar Nota</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {myCashRegister && isCashRegisterOpeningCodeVerified ? (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/financas/notas-pagamento")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Liquidar Nota de Pagamento</h1>
          <p className="text-muted-foreground">
            Preencha os dados para liquidar a nota{" "}
            <span className="font-mono font-semibold">{factura.codigo}</span>
          </p>
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/financas/notas-pagamento")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CashRegisterConfirmationAlert
            isOpen={!!myCashRegister}
            onVerified={verify}
          />
        </>
      )}

      {myCashRegister && isCashRegisterOpeningCodeVerified && (
        <>
          {/* Resumo da Nota */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo da Nota</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nº da Nota</p>
                  <p className="font-medium font-mono">{factura.codigo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estudante</p>
                  <p className="font-medium">{factura.nome_aluno}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matrícula</p>
                  <p className="font-medium font-mono">
                    {factura.codigo_matricula}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor a Pagar</p>
                  <p className="font-bold text-primary text-lg">
                    {formatNumber(factura.valor_pagar)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Curso</p>
                  <p className="font-medium">{factura.curso}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Campus</p>
                  <p className="font-medium">{factura.polo}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emissão</p>
                  <p className="font-medium">
                    {formatDate(factura.data_factura)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <PagamentoStatus status={factura.estado} />
                </div>
              </div>
            </CardContent>
          </Card>
          <FormNotaPagamento factura={factura} />
        </>
      )}
    </div>
  );
}
