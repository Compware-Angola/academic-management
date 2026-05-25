import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { ArrowLeft, CheckCircle, DollarSign } from "lucide-react";

import { formatNumber } from "@/util/format-number";

export function CloseCashRegisterPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [formData, setFormData] = useState({
    totalCollectedAmount: "",

    collectedDepositAmount: "",

    collectedPaymentAmount: "",

    invoicedPaymentAmount: "",

    observation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCollected = Number(formData.totalCollectedAmount) || 0;

  const totalDeposits = Number(formData.collectedDepositAmount) || 0;

  const totalPayments = Number(formData.collectedPaymentAmount) || 0;

  const totalInvoiced = Number(formData.invoicedPaymentAmount) || 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        totalCollectedAmount: totalCollected,

        collectedDepositAmount: totalDeposits,

        collectedPaymentAmount: totalPayments,

        invoicedPaymentAmount: totalInvoiced,

        observation: formData.observation || undefined,
      };

      /*
      await api.put(
        `/cash-registers/${id}/close`,
        payload,
      );
      */

      alert("Caixa fechado e enviado para validação");

      navigate("/financas/caixas");
    } catch (error) {
      console.error(error);

      alert("Erro ao fechar caixa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* HEADER */}

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/financas/caixas")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Fechar Caixa</h1>

          <p className="text-muted-foreground">
            Informe os valores arrecadados para finalizar o expediente
          </p>
        </div>
      </div>

      {/* FORM */}

      <Card>
        <CardHeader>
          <CardTitle>Dados do Fechamento</CardTitle>

          <CardDescription>
            Valores finais informados pelo operador
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* TOTAL ARRECADADO */}

          <div className="space-y-2">
            <Label>Valor Total Arrecadado</Label>

            <Input
              type="number"
              min={0}
              placeholder="0.00"
              value={formData.totalCollectedAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalCollectedAmount: e.target.value,
                })
              }
            />

            <p className="text-xs text-muted-foreground">
              Soma geral arrecadada no expediente
            </p>
          </div>

          {/* DEPÓSITOS */}

          <div className="space-y-2">
            <Label>Valor de Depósitos</Label>

            <Input
              type="number"
              min={0}
              placeholder="0.00"
              value={formData.collectedDepositAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  collectedDepositAmount: e.target.value,
                })
              }
            />

            <p className="text-xs text-muted-foreground">
              Total recebido via depósitos ou transferências
            </p>
          </div>

          {/* PAGAMENTOS */}

          <div className="space-y-2">
            <Label>Valor de Pagamentos</Label>

            <Input
              type="number"
              min={0}
              placeholder="0.00"
              value={formData.collectedPaymentAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  collectedPaymentAmount: e.target.value,
                })
              }
            />

            <p className="text-xs text-muted-foreground">
              Total recebido via TPA, dinheiro ou pagamentos
            </p>
          </div>

          {/* FACTURADO */}

          <div className="space-y-2">
            <Label>Valor Facturado</Label>

            <Input
              type="number"
              min={0}
              placeholder="0.00"
              value={formData.invoicedPaymentAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  invoicedPaymentAmount: e.target.value,
                })
              }
            />

            <p className="text-xs text-muted-foreground">
              Valor total facturado no sistema
            </p>
          </div>

          {/* OBSERVAÇÃO */}

          <div className="space-y-2">
            <Label>Observação</Label>

            <Textarea
              rows={4}
              placeholder="Digite alguma observação do fechamento..."
              value={formData.observation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  observation: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* RESUMO */}

      <Card>
        <CardHeader>
          <CardTitle>Resumo Informado</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Total Arrecadado</span>

            <span className="font-bold">{formatNumber(totalCollected)} KZ</span>
          </div>

          <div className="flex justify-between">
            <span>Depósitos</span>

            <span className="font-bold">{formatNumber(totalDeposits)} KZ</span>
          </div>

          <div className="flex justify-between">
            <span>Pagamentos</span>

            <span className="font-bold">{formatNumber(totalPayments)} KZ</span>
          </div>

          <div className="flex justify-between">
            <span>Facturado</span>

            <span className="font-bold">{formatNumber(totalInvoiced)} KZ</span>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/financas/caixas")}>
          Cancelar
        </Button>

        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Finalizando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Fechar Caixa
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
