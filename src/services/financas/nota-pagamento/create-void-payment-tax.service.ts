import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface VoidPaymentPayloadTax {
  codigoPagamento: number;
  motivo: string;
}

export interface VoidPaymentTaxResponse {
  success: boolean;
  message?: string;
}

const voidPaymentTax = async (payload: VoidPaymentPayloadTax) => {
  const { data } = await axiosNestFinance.post<VoidPaymentTaxResponse>(
    "/payment/void-payment-tax",
    payload,
  );
};
export { voidPaymentTax };
