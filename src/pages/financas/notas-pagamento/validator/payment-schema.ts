// payment-schema.ts
import { z } from "zod";
export const FORMA_PAGAMENTO = {
  CASH: "6",
  TPA: "1",
} as const;
export const paymentSchema = z.discriminatedUnion("forma_pagamento", [
  z.object({
    forma_pagamento: z.literal(FORMA_PAGAMENTO.CASH),
    tipo_pagamento: z
      .string({ message: "Tipo de pagamento obrigatório" })
      .min(1, "Tipo de pagamento obrigatório"),
    codigo_factura: z
      .string({ message: "Código da factura obrigatório" })
      .min(1, "Código da factura obrigatório"),
    valor_depositado: z
      .number({ message: "Valor obrigatório" })
      .min(1, "Valor obrigatório"),
    ano_lectivo: z
      .string({ message: "Ano lectivo obrigatório" })
      .min(1, "Ano lectivo obrigatório"),
    data_registo: z
      .string({ message: "Data de registo obrigatória" })
      .min(1, "Data de registo obrigatória"),
    observacao: z.string().optional(),
    caixa_id: z
      .string({ message: "Caixa obrigatória" })
      .min(1, "Caixa obrigatória"),
    corrente: z.string().min(1, "Corrente obrigatória"),
  }),

  z.object({
    forma_pagamento: z.literal(FORMA_PAGAMENTO.TPA),
    tipo_pagamento: z
      .string({ message: "Tipo de pagamento obrigatório" })
      .min(1, "Tipo de pagamento obrigatório"),
    codigo_factura: z
      .string({ message: "Código da factura obrigatório" })
      .min(1, "Código da factura obrigatório"),
    valor_depositado: z
      .number({ message: "Valor obrigatório" })
      .min(1, "Valor obrigatório"),
    n_operacao_bancaria: z
      .string({ message: "Operação obrigatória" })
      .min(1, "Operação obrigatória"),
    data_registo: z
      .string({ message: "Data de registo obrigatória" })
      .min(1, "Data de registo obrigatória"),
    ano_lectivo: z
      .string({ message: "Ano lectivo obrigatório" })
      .min(1, "Ano lectivo obrigatório"),
    data_banco: z
      .string({ message: "Data do banco obrigatória" })
      .min(1, "Data do banco obrigatória"),
    data_operacao: z
      .string({ message: "Data da operação obrigatória" })
      .min(1, "Data da operação obrigatória"),
    observacao: z.string().optional(),
    caixa_id: z
      .string({ message: "Caixa obrigatória" })
      .min(1, "Caixa obrigatória"),
    corrente: z.string().min(1, "Corrente obrigatória"),
  }),
]);

export type PaymentForm = z.infer<typeof paymentSchema>;
