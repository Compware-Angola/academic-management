import { z } from "zod";
import { FORMA_PAGAMENTO } from ".";

// ─── helpers ────────────────────────────────────────────────────────────────

/** Trata "" e null como undefined para campos opcionais */
const optStr = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().optional(),
);

/** Campo obrigatório que rejeita string vazia */
const reqStr = (msg: string) =>
  z.string({ required_error: msg }).trim().min(1, { message: msg });

// ─── schema do formulário (tudo string — vem de <input>) ─────────────────────

export const liquidarNotaSchema = z
  .object({
    forma_pagamento: reqStr("Forma de pagamento é obrigatória"),
    tipo_pagamento: reqStr("Tipo de pagamento é obrigatório"),
    codigo_factura: z.string().optional(),

    valor_depositado: z
      .string({ required_error: "Valor depositado é obrigatório" })
      .trim()
      .min(1, "Valor depositado é obrigatório")
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
        message: "Valor depositado deve ser um número positivo",
      }),

    ano_lectivo: z.string().optional(),
    data_registo: z.string().optional(),
    caixa_id: reqStr("Caixa é obrigatória"),
    corrente: z.string().default("1"),
    observacao: z.string().optional(),

    // bancários — opcionais por defeito, tornam-se obrigatórios via superRefine
    n_operacao_bancaria: optStr,
    data_banco: optStr,
    data_operacao: optStr,
  })
  // ── validação condicional TPA ─────────────────────────────────────────────
  .superRefine((data, ctx) => {
    if (data.forma_pagamento !== FORMA_PAGAMENTO.TPA) return;

    if (!data.n_operacao_bancaria?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["n_operacao_bancaria"],
        message: "Nº da operação bancária é obrigatório para pagamento TPA",
      });
    }

    if (!data.data_banco?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data_banco"],
        message: "Data do banco é obrigatória para pagamento TPA",
      });
    }

    if (!data.data_operacao?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data_operacao"],
        message: "Data da operação é obrigatória para pagamento TPA",
      });
    }
  });

export type LiquidarNotaFormValues = z.infer<typeof liquidarNotaSchema>;
