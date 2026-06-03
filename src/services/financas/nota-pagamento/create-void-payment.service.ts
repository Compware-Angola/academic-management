import { axiosNestFinance } from "@/lib/axios-nest-finance";

export interface VoidPaymentPayload {
  codigoPagamento: number;
  motivo: string;
}

export interface VoidPaymentResponse {
  success: boolean;
  message?: string;
}

const voidPayment = async (payload: VoidPaymentPayload) => {
  const { data } = await axiosNestFinance.post<VoidPaymentResponse>(
    "/payment/void-payment",
    payload,
  );
};
export { voidPayment };
