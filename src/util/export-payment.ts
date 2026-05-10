import { PaymentItem } from "@/services/financas/nota-pagamento/fetch-payment.service";
import {
  Factura,
  FacturaItem,
} from "@/services/finance/listar-facturas.service";
import { StudentDetail } from "@/services/students/students.service";
import { numeroPorExtenso } from "./numeroPorExtenso";
import { formatarData, formatDisplayPt } from "./date-formate";
import { formatNumber, formatNumberMilhares } from "./format-number";

interface CreatePaymentItemProps {
  student: StudentDetail;
  payment: PaymentItem;
  factura: Factura;
  facturaItems: FacturaItem[];
}
const createFacturaItem = (
  facturaItems: FacturaItem[],
  payment: PaymentItem,
) => {
  return facturaItems?.map((t) => {
    const description =
      t.prestacao == null ? t?.descricaoservico : `${t.prestacao} ªPrestação`;
    return {
      date: formatDisplayPt(payment?.data_operacao),
      description: description,
      paymentMode: payment?.forma_pagamento,
      value: formatNumberMilhares(t?.total),
    };
  });
};
const createPaymentItem = ({
  student,
  facturaItems,
  payment,
  factura,
}: CreatePaymentItemProps) => {
  const receiptData = {
    receiptNumber: "0099/2026",
    studentName: student?.nome_completo,
    studentId: student?.bi,
    course: student?.curso,
    program: student?.grau,
    totalInWords: numeroPorExtenso(factura?.valor_pagar),
    totalValue: formatNumberMilhares(factura?.valor_pagar),
    payments: createFacturaItem(facturaItems, payment),
    city: "Luanda",
    issueDate: formatarData(payment?.data_operacao),
    officer: payment.nome_operador,
    department: "Central de Atendimento",
    documentType: "Comprovativo de Pagamento",
  };
  return receiptData;
};

export { createPaymentItem };
