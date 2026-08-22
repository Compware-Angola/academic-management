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
  student?: StudentDetail | null;
  payment?: PaymentItem;
  factura: Factura;
  facturaItems: FacturaItem[];
}
const createFacturaItem = (
  facturaItems: FacturaItem[],
  data: string,
  payment?: PaymentItem,
) => {
  return facturaItems?.map((t) => {
    const description =
      t.prestacao == null ? t?.descricaoservico : `${t.prestacao} ªPrestação`;

    return {
      date: formatDisplayPt(data),
      description: description,
      paymentMode: payment?.forma_pagamento,
      value: formatNumberMilhares(t?.total),
      cadeiras_recurso_epoca_especial: t?.cadeiras_recurso_epoca_especial,
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
  const studentNumber = String(student?.codigo_matricula ?? "");
  const isCandidate = !studentNumber;
  const receiptData = {
    receiptNumber: receiptNumber,
    studentNumber: studentNumber,
    studentName:
      student?.nome_completo ?? factura?.nome_aluno ?? payment?.nome_completo,
    studentId: student?.bi ?? factura?.bi_aluno,
    course:
      student?.curso ??
      factura?.curso_candidatura ??
      factura?.curso ??
      payment?.curso,
    program: student?.grau ?? factura?.candidatura,
    turno: isCandidate ? factura?.turno : "",
    totalInWords: numeroPorExtensoMoeda(factura?.valor_pagar),
    totalValue: formatNumberMilhares(factura?.valor_pagar),
    payments: createFacturaItem(facturaItems, data, payment),
    city: "Luanda",
    issueDate: formatarData(data),
    officer: payment?.nome_operador,
    department: "Central de Atendimento",
    documentType: "Comprovativo de Pagamento",
  };
  return receiptData;
};

export { createPaymentItem };
