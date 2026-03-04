import { axiosApexGa } from "@/lib/axios-apex-ga";

export type FormaPagamento = {
  codigo: number;
  descricao: string;
};

export async function fetchFormasPagamento(): Promise<FormaPagamento[]> {
  const { data } = await axiosApexGa.get("/uma/payment-method");
  return data.formas_pagamentos ?? [];
}
