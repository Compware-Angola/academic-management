import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { InvoicePayload, InvoiceResponse } from "./create.service";

// -------------------- TIPOS --------------------

export async function createInvoiceNoJobService(
  payload: InvoicePayload,
): Promise<InvoiceResponse> {
  const { data } = await axiosNestFinance.post("/invoices/no-job", payload);
  return data;
}
