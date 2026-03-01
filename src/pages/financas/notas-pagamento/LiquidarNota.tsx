import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Home, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryFacturas } from "@/hooks/horario/use-query-invoice";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FormaPagamentoSelect } from "@/components/common/global-selects/TipoPagamentoSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { CaixaSelect } from "@/components/common/global-selects/CaixaSelect";
import { PagamentoStatus } from "@/components/common/PagamentoStatus";
import { validarPagamento } from "./validator";
import { useCreatePayment } from "@/hooks/financas/nota-pagamento/use-mutation-pagamento";
import { formatDisplay } from "@/util/date-formate";
import { formatNumber } from "@/util/format-number";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("pt-AO");
};

const tipoPagamentoOptions = [
  {
    key: "BOLSA",
    value: "Bolsa",
  },
  {
    key: "NORMAL",
    value: "Normal",
  },
];

export default function LiquidarNota() {
  const { codigo } = useParams<{ codigo: string }>();
  const { mutate, isPending } = useCreatePayment();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //const nota = mockNotasPagamento.find((n) => n.numero === "1222303");

  const [formData, setFormData] = useState({
    n_operacao_bancaria: "",
    observacao: "",
    ano_lectivo: "",
    valorAPagar: "",
    data_banco: "",
    forma_pagamento: "",
    valor_depositado: "",
    conta_movimentada: "",
    data_registo: new Date().toISOString().split("T")[0],
    tipo_pagamento: "",
    codigo_factura: codigo,
    instituicao_id: "",
    caixa_id: "",
    status_pagamento: "",
    data_operacao: "",
    status_movimento: "",
    corrente: "1",
    feito_com_reserva: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const pagamento = {
      data: formatDisplay(new Date()),
      nOperacaoBancaria: formData.n_operacao_bancaria,
      observacao: "Pagamento via Mutue Finanças",
      dataBanco: formData.data_banco,
      codigoPreInscricao: 123,
      formaPagamento: formData.forma_pagamento,
      valorDepositado: Number(formData.valor_depositado),
      contaMovimentada: 5,
      dataRegisto: formData.data_registo,
      canal: 14,
      estado: 1,
      tipoPagamento: formData.tipo_pagamento,
      codigoFactura: Number(factura.codigo),
      instituicaoId: 1,
      caixaId: Number(formData.caixa_id),
      dataOperacao: formData.data_operacao,
      statusMovimento: 0,
      infoAdicional: formData.observacao,
      corrente: 1,
      feitoComReserva: "N",
      anoLectivo: Number(formData.ano_lectivo),
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

  const factura = facturasResponses?.data?.[0];
  const isFacturaPago = factura?.estado == 1;

  useEffect(() => {
    if (factura) {
      setFormData({
        ...formData,
        ano_lectivo: factura?.codigo_ano_lectivo.toString(),
        valor_depositado: factura?.valor_pagar.toString(),
      });
    }
  }, [factura]);

  if (isLoading) {
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

      {/* Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/financas/notas-pagamento")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Liquidar Nota de Pagamento</h1>
          <p className="text-muted-foreground">
            Preencha os dados para liquidar a nota{" "}
            <span className="font-mono font-semibold">{factura.codigo}</span>
          </p>
        </div>
      </div>

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
              <p className="font-medium">{formatDate(factura.data_factura)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <PagamentoStatus status={factura.estado} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Liquidação */}
      <form>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Dados da Operação Bancária
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="n_operacao_bancaria">
                  Nº Operação Bancária
                </Label>
                <Input
                  id="n_operacao_bancaria"
                  placeholder="Ex: OPB-001234"
                  value={formData.n_operacao_bancaria}
                  onChange={(e) =>
                    handleChange("n_operacao_bancaria", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_banco">Data Banco *</Label>
                <Input
                  id="data_banco"
                  type="date"
                  value={formData.data_banco}
                  onChange={(e) => handleChange("data_banco", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_operacao">Data da Operação</Label>
                <Input
                  id="data_operacao"
                  type="date"
                  value={formData.data_operacao}
                  onChange={(e) =>
                    handleChange("data_operacao", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_registo">Data de Registo</Label>
                <Input
                  id="data_registo"
                  type="date"
                  value={formData.data_registo}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conta_movimentada">Conta Movimentada</Label>
                <Input
                  id="conta_movimentada"
                  placeholder="Ex: AO06.0000.0000.0000.0000"
                  value={formData.conta_movimentada}
                  onChange={(e) =>
                    handleChange("conta_movimentada", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
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

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Dados do Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormaPagamentoSelect
                  value={formData.forma_pagamento}
                  onChangeValue={(v) =>
                    setFormData({ ...formData, forma_pagamento: v })
                  }
                />
              </div>
              <div className="space-y-2">
                <FormSelect
                  label="Tipo de Pagamento"
                  value={formData.tipo_pagamento}
                  onChange={(v) =>
                    setFormData({ ...formData, tipo_pagamento: v })
                  }
                  options={tipoPagamentoOptions}
                  map={(a) => ({ key: a.key, label: a.value, value: a.key })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo_factura">Código Factura</Label>
                <Input
                  id="codigo_factura"
                  value={formData.codigo_factura}
                  readOnly
                  className="bg-muted"
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
                <Label htmlFor="valor_depositado">Valor Depositado *</Label>
                <Input
                  id="valor_depositado"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex: 1200"
                  value={formData.valor_depositado}
                  onChange={(e) =>
                    handleChange("valor_depositado", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <AcademicYearSelect
                  disabled
                  onChangeValue={(v) =>
                    setFormData({ ...formData, ano_lectivo: v })
                  }
                  value={formData.ano_lectivo}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Estado e Controlo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <CaixaSelect
                  value={formData.caixa_id}
                  onChangeValue={(v) =>
                    setFormData({ ...formData, caixa_id: v })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corrente">Corrente</Label>
                <Select
                  value={formData.corrente}
                  onValueChange={(v) => handleChange("corrente", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sim</SelectItem>
                    <SelectItem value="0">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2 w-full">
                <Textarea
                  id="observacao"
                  placeholder="Observações sobre a liquidação..."
                  rows={3}
                  value={formData.observacao}
                  onChange={(e) => handleChange("observacao", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
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
            type="button"
            onClick={() => handleSubmit()}
            className="gap-2"
            disabled={isPending || isFacturaPago}
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
    </div>
  );
}
