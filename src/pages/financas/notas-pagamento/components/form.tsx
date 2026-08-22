import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryFacturas } from "@/hooks/horario/use-query-invoice";
import { FORMA_PAGAMENTO, validarPagamento } from "../validator";
import { useCreatePayment } from "@/hooks/financas/nota-pagamento/use-mutation-pagamento";
import { formatDisplay } from "@/util/date-formate";
import { formatNumber } from "@/util/format-number";
import { parseDateFilter } from "@/util/parse-filter";
import { useQueryMyCashRegister } from "@/hooks/financa/use-cash-register";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { Factura } from "@/services/finance/listar-facturas.service";
import { usePermission } from "@/auth/permission.helper";
import { useQueryFormaPagamento } from "@/hooks/financa/use-forma-pagamento";
import { PermissionTypeDetails } from "@/constants/permission.type";
import { useForm } from "react-hook-form";
import { PaymentForm, paymentSchema } from "../validator/payment-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { SelectFormField } from "@/components/selectFormField";
import { InputFormField } from "@/components/inputFormField";
import { TextareaFormField } from "@/components/TextareaFormField";
import { useQueryReservaEstudante } from "@/hooks/financas/alunos/use-query-reserva";

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("pt-AO");
};

const tipoPagamentoOptions = [
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "BOLSA",
    label: "Bolsa",
  },
];

export function FormNotaPagamento({ factura }: { factura: Factura }) {
  const { codigo } = useParams<{ codigo: string }>();
  const { hasPermission } = usePermission();
  const { data: formas, isLoading: isLoadingFormas } = useQueryFormaPagamento({
    status: 1,
  });
  const formaPagamentos = formas?.filter((f) => {
    if (
      !hasPermission(PermissionTypeDetails.PAGAMENTO_EM_CASH.sigla) &&
      f.codigo.toString() === FORMA_PAGAMENTO.CASH
    ) {
      return false;
    }
    return f;
  });
  const { data: myCashRegister, isLoading: isLoadingCashRegister } =
    useQueryMyCashRegister();
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const codigoEstudante = factura?.codigo_matricula;

  const { data: reserva, isLoading: isLoadingReserva } =
    useQueryReservaEstudante(codigoEstudante);
  const valorReserva = reserva?.saldo ?? 0;

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      forma_pagamento: FORMA_PAGAMENTO.TPA,
      tipo_pagamento: tipoPagamentoOptions[0].value,
      valor_depositado: factura?.valor_pagar.toString() ?? "",
      codigo_factura: factura.codigo.toString(),
      data_registo: new Date().toISOString().split("T")[0],
      ano_lectivo:
        academicYear
          ?.find((a) => a.estado.toLocaleLowerCase() === "activo")
          ?.codigo.toString() || "",
      caixa_id: myCashRegister?.id.toString() ?? "",
      corrente: "",
      usar_reserva: false,
    },
  });
  const formaPagamentoValue = form.watch("forma_pagamento");
  const usarReserva = form.watch("usar_reserva");
  const valorDepositado = form.watch("valor_depositado");
  const { mutate, isPending } = useCreatePayment();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Valor que falta cobrir considerando só o que foi digitado na forma de pagamento (TPA/Cash)
  const valorFaltante = Math.max(
    factura.valor_pagar - Number(valorDepositado || 0),
    0,
  );

  // Quanto será efetivamente retirado da reserva: no máximo o que falta, no máximo o que existe em reserva
  const valorUsadoReserva = usarReserva
    ? Math.min(valorFaltante, valorReserva)
    : 0;

  // A reserva marcada não é suficiente para cobrir o que falta
  const reservaInsuficiente = usarReserva && valorReserva < valorFaltante;

  // Total efetivamente coberto: valor depositado (TPA/Cash) + valor retirado da reserva
  const valorTotalCoberto = Number(valorDepositado || 0) + valorUsadoReserva;

  const valorEmFalta = Math.max(factura.valor_pagar - valorTotalCoberto, 0);

  // Só habilita o botão se o total cobrir o valor a pagar E a reserva usada for suficiente
  const cobreValorTotal =
    valorTotalCoberto >= factura.valor_pagar && !reservaInsuficiente;

  // Ao marcar "usar reserva", avisa de imediato se a reserva não cobre o que falta
  const handleUsarReservaChange = (checked: boolean) => {
    form.setValue("usar_reserva", checked, { shouldValidate: true });
    if (checked) {
      const faltante = Math.max(
        factura.valor_pagar - Number(valorDepositado || 0),
        0,
      );
      if (valorReserva < faltante) {
        toast({
          description: `A reserva (${formatNumber(
            valorReserva,
          )}) não é suficiente para cobrir o valor em falta (${formatNumber(
            faltante,
          )}). Ajuste o valor depositado.`,
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (data: PaymentForm) => {
    const pagamento = {
      data: formatDisplay(new Date()),
      nOperacaoBancaria:
        data.forma_pagamento === FORMA_PAGAMENTO.TPA
          ? data.n_operacao_bancaria
          : undefined,
      observacao: data.observacao,
      dataBanco:
        data.forma_pagamento === FORMA_PAGAMENTO.TPA
          ? parseDateFilter(data.data_banco)
          : undefined,
      codigoPreInscricao: 123,
      formaPagamento: data.forma_pagamento,
      valorDepositado: Number(data.valor_depositado),
      // contaMovimentada: 5,
      dataRegisto: data.data_registo,
      canal: 14,
      estado: 1,
      tipoPagamento: data.tipo_pagamento,
      codigoFactura: Number(factura.codigo),
      instituicaoId: 1,
      caixaId: Number(data.caixa_id),
      dataOperacao:
        data.forma_pagamento === FORMA_PAGAMENTO.TPA
          ? parseDateFilter(data.data_operacao)
          : undefined,
      statusMovimento: 0,
      infoAdicional: data.observacao,
      corrente: Number(data.corrente),
      feitoComReserva: data.usar_reserva ? "Y" : "N",
      valorReservaUtilizado: data.usar_reserva
        ? valorUsadoReserva
        : 0,
      anoLectivo: Number(data.ano_lectivo),
    };
    const resultadoValidacao = validarPagamento(
      pagamento,
      factura.valor_pagar,
      factura.total_preco,
    );
    if (!resultadoValidacao.valid) {
      toast({
        description: resultadoValidacao.message,
        variant: "destructive",
      });
      return;
    }
    if (!cobreValorTotal) {
      toast({
        description:
          "O valor depositado, mesmo somando a reserva, não cobre o valor a pagar.",
        variant: "destructive",
      });
      return;
    }
    mutate(pagamento);
  };
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

  const isFacturaPago = factura?.estado == 1;

  useEffect(() => {
    if (academicYear) {
      form.setValue(
        "ano_lectivo",
        academicYear
          .find((a) => a.estado.toLocaleLowerCase() === "activo")
          ?.codigo.toString() || "",
      );
    }
  }, [academicYear]);

  if (isLoading || isLoadingCashRegister) {
    return (
      <Card className="p-20 flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando nota...</p>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados do Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <SelectFormField
                    control={form.control}
                    name="forma_pagamento"
                    label="Forma de pagamento"
                    placeholder="Seleciona a forma"
                    items={
                      formaPagamentos?.map((forma) => {
                        return {
                          label: forma.descricao,
                          value: forma.codigo.toString(),
                        };
                      }) || []
                    }
                  />
                </div>
                <div className="space-y-2">
                  <SelectFormField
                    control={form.control}
                    name="tipo_pagamento"
                    label="Tipo de pagamento"
                    placeholder="Seleciona o tipo"
                    items={tipoPagamentoOptions?.map((tipo) => {
                      return {
                        label: tipo.label,
                        value: tipo.value,
                      };
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <InputFormField
                    control={form.control}
                    name="codigo_factura"
                    label="Código Factura"
                    placeholder="Digite o código da factura"
                    disabled={!!codigo}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_geral">Valor Total (KZ)</Label>
                  <Input
                    id="total_geral"
                    type="number"
                    disabled
                    min="0"
                    step="0.01"
                    value={factura.total_preco}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_geral">Valor a Pagar (KZ)</Label>
                  <Input
                    id="total_geral"
                    type="number"
                    disabled
                    min="0"
                    step="0.01"
                    value={factura.valor_pagar}
                  />
                </div>
                <div className="space-y-2">
                  <InputFormField
                    control={form.control}
                    name="valor_depositado"
                    label={`Valor Depositado (${formaPagamentos?.find(
                      (f) => f.codigo.toString() === formaPagamentoValue,
                    )?.descricao ?? "forma selecionada"
                      }) *`}
                    placeholder="Digite o valor"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SelectFormField
                  control={form.control}
                  name="ano_lectivo"
                  label="Ano Letivo"
                  placeholder="Selecione o ano letivo"

                  items={
                    academicYear?.map((year) => {
                      return {
                        label: year.designacao,
                        value: year.codigo.toString(),
                      };
                    }) || []
                  }
                />
                <div>
                  <InputFormField
                    control={form.control}
                    name="data_registo"
                    label="Data de Registo"
                    type="date"
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NOVO: Card de Reserva do Estudante */}
          <Card>
            <CardHeader className="flex! space-x-2 flex-row! items-center">
              <Wallet className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Reserva do Estudante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingReserva ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A verificar valor em reserva...
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Valor em Reserva
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {formatNumber(valorReserva)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="usar_reserva"
                      checked={usarReserva}
                      disabled={valorReserva <= 0}
                      onCheckedChange={(checked) =>
                        handleUsarReservaChange(checked === true)
                      }
                    />
                    <Label htmlFor="usar_reserva" className="cursor-pointer">
                      Usar reserva para cobrir o que falta
                    </Label>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Valor Retirado da Reserva
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatNumber(valorUsadoReserva)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {valorEmFalta > 0 ? "Falta Cobrir" : "Situação"}
                    </p>
                    <p
                      className={`text-2xl font-bold ${valorEmFalta > 0 ? "text-red-600" : "text-green-600"
                        }`}
                    >
                      {valorEmFalta > 0
                        ? formatNumber(valorEmFalta)
                        : "Cobre a factura"}
                    </p>
                  </div>
                </div>
              )}

              {!isLoadingReserva && usarReserva && valorUsadoReserva > 0 && (
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Resumo da Reserva após Utilização
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Saldo Atual</p>
                      <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                        {formatNumber(valorReserva)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">A Retirar Agora</p>
                      <p className="text-base font-semibold text-primary">
                        - {formatNumber(valorUsadoReserva)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Saldo Restante</p>
                      <p
                        className={`text-base font-semibold ${valorReserva - valorUsadoReserva > 0
                            ? "text-green-600"
                            : "text-gray-800 dark:text-gray-100"
                          }`}
                      >
                        {formatNumber(valorReserva - valorUsadoReserva)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isLoadingReserva && reservaInsuficiente && (
                <p className="text-sm text-red-600 font-medium">
                  A reserva disponível ({formatNumber(valorReserva)}) não é
                  suficiente para cobrir o valor em falta (
                  {formatNumber(valorFaltante)}). Não é possível liquidar a
                  nota enquanto isto não for ajustado.
                </p>
              )}

              {!isLoadingReserva && !reservaInsuficiente && valorEmFalta > 0 && (
                <p className="text-sm text-red-600">
                  O valor depositado
                  {usarReserva ? " somado ao valor retirado da reserva " : " "}
                  ainda não cobre o valor a pagar da factura.
                </p>
              )}
            </CardContent>
          </Card>

          {formaPagamentoValue === FORMA_PAGAMENTO.TPA && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Dados da Operação Bancária
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <InputFormField
                      control={form.control}
                      name="n_operacao_bancaria"
                      label="Nº Operação Bancária"
                      placeholder="Ex: OPB-001234"
                    />
                  </div>

                  <div className="space-y-2">
                    <InputFormField
                      control={form.control}
                      name="data_banco"
                      label="Data Banco *"
                      type="date"
                    />
                  </div>
                  <div className="space-y-2">
                    <InputFormField
                      control={form.control}
                      name="data_operacao"
                      label="Data da Operação"
                      type="date"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex! space-x-2 flex-row! items-center">
              <CardTitle className="text-lg">Fórmula</CardTitle>
              <p>(Composição do valor a pagar)</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Valor Total
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatNumber(factura.total_preco)}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-gray-100">
                    -
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Desconto
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-gray-100">
                    {formatNumber(factura?.desconto)}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary"> + </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Multa
                  </p>
                  <p className="text-2xl font-bold  text-primary dark:text-gray-100">
                    {formatNumber(factura.total_multa)}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary"> = </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Valor a Pagar
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatNumber(factura.valor_pagar)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado e Controlo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <SelectFormField
                    control={form.control}
                    name="caixa_id"
                    label="Caixa"
                    placeholder="Selecione a caixa"
                    items={
                      myCashRegister
                        ? [
                          {
                            label: myCashRegister.name,
                            value: myCashRegister.id.toString(),
                          },
                        ]
                        : []
                    }
                  />
                </div>

                <div className="space-y-2">
                  <SelectFormField
                    control={form.control}
                    name="corrente"
                    label="Corrente"
                    placeholder="Selecione a corrente"
                    items={[
                      {
                        label: "Sim",
                        value: "1",
                      },
                      {
                        label: "Não",
                        value: "0",
                      },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2 w-full">
                  <TextareaFormField
                    control={form.control}
                    name="observacao"
                    label="Observações"
                    placeholder="Observações sobre a liquidação..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/financas/notas-pagamento")}
          >
            <ArrowLeft className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="gap-2"
            disabled={isPending || isFacturaPago || !cobreValorTotal}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isPending ? "A processar..." : "Liquidar Nota"}
          </Button>
        </div>
      </form>
    </Form>
  );
}