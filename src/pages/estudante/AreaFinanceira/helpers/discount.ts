import { SelectedPayment } from "../components/mensalidade";

const isDesc5Active = (
  desc: { estado: number; data_inicio: string; data_fim: string } | undefined,
): boolean => {
  if (!desc || desc.estado !== 1) return false;
  const hoje = new Date();
  return hoje >= new Date(desc.data_inicio) && hoje <= new Date(desc.data_fim);
};

const hasAnyItemWithDiscount = (
  payments: Map<number, SelectedPayment>,
): boolean => Array.from(payments.values()).some((p) => (p.desconto ?? 0) > 0);

export const canApplyAnnualDiscount = (
  desc5Data:
    | { taxa: number; estado: number; data_inicio: string; data_fim: string }[]
    | undefined,
  selectedPayments: Map<number, SelectedPayment>,
): boolean => {
  const desc = desc5Data?.[0];
  return (
    isDesc5Active(desc) &&
    selectedPayments.size >= 10 &&
    !hasAnyItemWithDiscount(selectedPayments)
  );
};

export const calcAnnualDiscount = (total: number, taxa: number): number =>
  total * (taxa / 100);
