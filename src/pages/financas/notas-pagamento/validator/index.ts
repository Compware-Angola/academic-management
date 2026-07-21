import { z } from "zod";
export const FORMA_PAGAMENTO = {
  CASH: "6",
  TPA: "1",
} as const;
export const optionalStringSchema = (fieldName: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null) return undefined;
      return value;
    },
    z
      .string({
        invalid_type_error: `${fieldName} deve ser texto`,
      })
      .optional(),
  );

function isTipoBancario(formaPagamento?: string) {
  if (!formaPagamento) return false;

  return formaPagamento === FORMA_PAGAMENTO.TPA;
}

export function validarPagamento(
  formData: any,
  valorAPagar: number,
  valorTotal: number,
) {
  const pagamentoSchema = z
    .object({
      nOperacaoBancaria: optionalStringSchema("Número de operação bancária"),

      observacao: z
        .string({
          invalid_type_error: "Observação deve ser texto",
        })
        .default("Pagamento via Mutue Finanças"),

      dataBanco: optionalStringSchema("Data do banco"),

      codigoPreInscricao: z
        .number({
          required_error: "Código da pré-inscrição é obrigatório",
          invalid_type_error: "Código da pré-inscrição deve ser um número",
        })
        .int(),

      formaPagamento: z
        .string({
          required_error: "Forma de pagamento é obrigatória",
        })
        .nonempty("Forma de pagamento é obrigatória"),

      valorDepositado: z.number({
        required_error: "Valor depositado é obrigatório",
        invalid_type_error: "Valor depositado deve ser numérico",
      }),
      dataRegisto: z
        .string({
          required_error: "Data de registo é obrigatória",
        })
        .nonempty("Data de registo é obrigatória"),

      canal: z.number().int(),

      estado: z.number().int(),

      tipoPagamento: z
        .string({
          required_error: "Tipo de pagamento é obrigatório",
        })
        .nonempty("Tipo de pagamento é obrigatório"),

      codigoFactura: z.number().int(),

      instituicaoId: z.number().int(),

      caixaId: z.number().int(),

      dataOperacao: optionalStringSchema("Data da operação"),

      statusMovimento: z.number().int(),

      infoAdicional: z.string().optional(),

      corrente: z.number().int(),

      anoLectivo: z.number().int(),

      feitoComReserva: z.enum(["Y", "N"]).default("N"),
      valorReservaUtilizado: z.number().optional().default(0),
    })

    // ✅ VALIDAÇÃO CONDICIONAL
    .superRefine((data, ctx) => {
      console.log(data);
      const totalPago =
        data.valorDepositado +
        (data.feitoComReserva === "Y"
          ? Number(data.valorReservaUtilizado || 0)
          : 0);

      if (totalPago < valorAPagar) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["valorDepositado"],
          message: `O total pago (depósito + reserva) deve ser pelo menos ${valorAPagar}.`,
        });
      }
      const pagamentoBancario = isTipoBancario(data.formaPagamento);

      if (pagamentoBancario) {
        if (!data.nOperacaoBancaria) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["nOperacaoBancaria"],
            message: "Número da operação bancária é obrigatório",
          });
        }

        if (!data.dataBanco) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dataBanco"],
            message: "Data do banco é obrigatória",
          });
        }

        if (!data.dataOperacao) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["dataOperacao"],
            message: "Data da operação é obrigatória",
          });
        }
      }
    });

  try {
    const validatedData = pagamentoSchema.parse(formData);

    return {
      valid: true,
      data: validatedData,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        valid: false,
        errors: err.errors,
        message: err.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      valid: false,
      errors: [{ message: "Erro desconhecido" }],
      message: "Erro desconhecido",
    };
  }
}
