import { z } from "zod";
export const optionalStringSchema = (fieldName: string) =>
  z.preprocess(
    (value) => {
      if (value === "") return undefined;
      if (value === null) return undefined;
      return value;
    },
    z
      .string({
        invalid_type_error: `${fieldName} deve ser texto`,
      })
      .optional(),
  );
export function validarPagamento(
  formData: any,
  valorAPagar: number,
  valorTotal: number,
) {
  const pagamentoSchema = z.object({
    nOperacaoBancaria: optionalStringSchema("Número de operação bancária"),

    observacao: z
      .string({ invalid_type_error: "Observação deve ser texto" })
      .default("Pagamento via Mutue Finanças"),

    dataBanco: optionalStringSchema("Data do banco"),

    codigoPreInscricao: z
      .number({
        required_error: "Código da pré-inscrição é obrigatório",
        invalid_type_error: "Código da pré-inscrição deve ser um número",
      })
      .int("Código da pré-inscrição deve ser um número inteiro"),

    formaPagamento: z
      .string({
        required_error: "Forma de pagamento é obrigatória",
        invalid_type_error: "Forma de pagamento deve ser texto",
      })
      .nonempty("Forma de pagamento não pode estar vazia"),

    valorDepositado: z
      .number({
        required_error: "Valor depositado é obrigatório",
        invalid_type_error: "Valor depositado deve ser numérico",
      })
      .refine((val) => val >= valorAPagar, {
        message: `O valor depositado não pode ser menor que o valor a pagar (${valorAPagar})`,
      }),
    contaMovimentada: z
      .number({
        required_error: "Conta movimentada é obrigatória",
        invalid_type_error: "Conta movimentada deve ser um número",
      })
      .int("Conta movimentada deve ser um número inteiro"),

    dataRegisto: z
      .string({
        required_error: "Data de registo é obrigatória",
        invalid_type_error: "Data de registo deve ser texto",
      })
      .nonempty("Data de registo não pode estar vazia"),

    canal: z
      .number({
        required_error: "Canal é obrigatório",
        invalid_type_error: "Canal deve ser um número",
      })
      .int("Canal deve ser um número inteiro"),

    estado: z
      .number({
        required_error: "Estado é obrigatório",
        invalid_type_error: "Estado deve ser texto",
      })
      .int("Estado deve ser inteiro"),

    tipoPagamento: z
      .string({
        required_error: "Tipo de pagamento é obrigatório",
        invalid_type_error: "Tipo de pagamento deve ser texto",
      })
      .nonempty("Tipo de pagamento não pode estar vazio"),

    codigoFactura: z
      .number({
        required_error: "Código da fatura é obrigatório",
        invalid_type_error: "Código da fatura deve ser numérico",
      })
      .int("Código da fatura deve ser um número inteiro"),

    instituicaoId: z
      .number({
        required_error: "Instituição é obrigatória",
        invalid_type_error: "Instituição deve ser numérico",
      })
      .int("Instituição deve ser um número inteiro"),

    caixaId: z
      .number({
        required_error: "Caixa é obrigatório",
        invalid_type_error: "Caixa deve ser numérico",
      })
      .int("Caixa deve ser um número inteiro"),

    dataOperacao: optionalStringSchema("Data da operação"),

    statusMovimento: z
      .number({
        required_error: "Status do movimento é obrigatório",
        invalid_type_error: "Status do movimento deve ser numérico",
      })
      .int("Status do movimento deve ser um número inteiro"),

    infoAdicional: z
      .string({ invalid_type_error: "Informações adicionais devem ser texto" })
      .optional(),

    corrente: z
      .number({
        required_error: "Corrente é obrigatória",
        invalid_type_error: "Corrente deve ser numérico",
      })
      .int("Corrente deve ser um número inteiro"),

    anoLectivo: z
      .number({
        required_error: "Ano Lectivo é obrigatória",
        invalid_type_error: "Ano Lectivo deve ser numérico",
      })
      .int("Corrente deve ser um número inteiro"),

    feitoComReserva: z.enum(["S", "N"], {
      invalid_type_error: "Feito com reserva deve ser 'S' ou 'N'",
    }),
  });
  console.log(formData);
  try {
    const validatedData = pagamentoSchema.parse(formData);

    return { valid: true, data: validatedData };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const mensagemErro = err.errors.map((e) => e.message).join(", ");
      return { valid: false, errors: err.errors, message: mensagemErro };
    }
    return {
      valid: false,
      errors: [{ message: "Erro desconhecido" }],
      message: "Erro desconhecido",
    };
  }
}
