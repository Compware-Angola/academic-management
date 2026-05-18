export interface CashSummaryRow {
  paymentMethod: string;
  total: number;
}

export interface CashClosingPDFData {
  movementId: number;
  cashRegisterName: string;
  operator: string;

  openedAt: string;
  closedAt: string;

  openingAmount: number;

  summary: CashSummaryRow[];

  total: number;
}
