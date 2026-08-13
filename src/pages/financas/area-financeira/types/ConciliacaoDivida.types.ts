// src/types/negotiation.ts

export enum NegotiationType {
  PARCIAL = "PARCIAL",
  TOTAL = "TOTAL",
}

export const NEGOTIATION_TYPE_LABEL: Record<NegotiationType, string> = {
  [NegotiationType.PARCIAL]: "Parcial",
  [NegotiationType.TOTAL]: "Total",
};

export interface NegotiationStudent {
  id: number;
  name: string;
  number: string; // nº de estudante
}

export interface NegotiationCourse {
  id: number;
  name: string;
}

export interface NegotiationItem {
  id: number;
  invoiceItemId: number;
  description: string;
  originalValue: number;
  negotiatedValue: number;
  discountValue: number;
  fineValue: number;
  valueToPay: number;
}

export interface Negotiation {
  id?: number;
  student: NegotiationStudent;
  course: NegotiationCourse;
  type: NegotiationType;
  items: NegotiationItem[];
}

export interface NegotiationSubmitPayload {
  studentId: number;
  courseId: number;
  type: NegotiationType;
  observation: string;
  items: { invoiceItemId: number; negotiatedValue: number }[];
}
