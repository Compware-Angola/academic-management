import { PaymentItem } from "@/services/financas/nota-pagamento/fetch-payment.service";
import {
  Factura,
  FacturaItem,
} from "@/services/finance/listar-facturas.service";
import { StudentDetail } from "@/services/students/students.service";
import { numeroPorExtensoMoeda } from "./numeroPorExtenso";
import { formatarData, formatDisplayPt } from "./date-formate";
import { formatNumberMilhares } from "./format-number";

interface CreatePaymentItemProps {
  student: StudentDetail;
  payment: PaymentItem;
  factura: Factura;
  facturaItems: FacturaItem[];
}
const createFacturaItem = (
  facturaItems: FacturaItem[],
  payment: PaymentItem,
  data: string,
) => {
  return facturaItems?.map((t) => {
    const description =
      t.prestacao == null ? t?.descricaoservico : `${t.prestacao} ªPrestação`;

    return {
      date: formatDisplayPt(data),
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
  const year = new Date().getFullYear();
  const receiptNumber = `${factura?.codigo}/${year}`;
  const data = !payment?.data_registro
    ? factura?.data_factura
    : payment?.data_registro;
  const receiptData = {
    receiptNumber: receiptNumber,
    studentNumber: String(student?.codigo_matricula ?? ""),
    studentName: student?.nome_completo,
    studentId: student?.bi,
    course: student?.curso,
    program: student?.grau,
    totalInWords: numeroPorExtensoMoeda(factura?.valor_pagar),
    totalValue: formatNumberMilhares(factura?.valor_pagar),
    payments: createFacturaItem(facturaItems, payment, data),
    city: "Luanda",
    issueDate: formatarData(data),
    officer: payment?.nome_operador,
    department: "Central de Atendimento",
    documentType: "Comprovativo de Pagamento",
  };
  return receiptData;
};

export { createPaymentItem };
