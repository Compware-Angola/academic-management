// src/pages/negotiation/types/ConciliacaoAprovacao.types.ts
import {
  NegotiationStudent,
  NegotiationCourse,
} from "./ConciliacaoDivida.types";

export enum ApprovalStatus {
  PENDENTE = "PENDENTE",
  APROVADO = "APROVADO",
  REJEITADO = "REJEITADO",
}

export const APPROVAL_STATUS_LABEL: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDENTE]: "Pendente",
  [ApprovalStatus.APROVADO]: "Aprovada",
  [ApprovalStatus.REJEITADO]: "Rejeitada",
};

export const APPROVAL_STATUS_BADGE: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDENTE]: "text-amber-700 border-amber-300 bg-amber-100",
  [ApprovalStatus.APROVADO]:
    "text-emerald-700 border-emerald-300 bg-emerald-100",
  [ApprovalStatus.REJEITADO]: "text-red-700 border-red-300 bg-red-100",
};

export interface InvoiceLineItem {
  id: number;
  service: string;
  quantity: number;
  price: number;
  iva: number;
  total: number;
}

export interface ConciliationApproval {
  id: number;
  invoiceCode: string;
  status: ApprovalStatus;
  student: NegotiationStudent;
  course: NegotiationCourse;
  originalItems: InvoiceLineItem[];
  conciliatedItems: InvoiceLineItem[];
}

export interface RejectPayload {
  conciliationId: number;
  reason: string;
}
