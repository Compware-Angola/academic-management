"use client";

import { CardDescription, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { InputFormField } from "@/components/inputFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Save } from "lucide-react";
import {
  useStudentDetail,
  useUpdatePersonalData,
  // useUpdateStudentDetails <- Supondo que você criará este hook
} from "@/hooks/tudents/use-query-students";
import { useEffect, useState } from "react";
import {
  useNacionalidadesDropdownFilter,
  useOcupacoesDropdownFilter,
  useProfissoesDropdownFilter,
} from "@/hooks/dropdown-filters";
import { SelectFormField } from "@/components/selectFormField";

const schema = z.object({
  nomeCompleto: z.string().min(3, "Nome muito curto"),
  dataNascimento: z.string().optional().or(z.literal("")),
  genero: z.string().optional().or(z.literal("")),
  numeroBI: z.string().optional().or(z.literal("")),
  dataEmissao: z.string().optional().or(z.literal("")),
  dataValidade: z.string().optional().or(z.literal("")),
  nacionalidade: z.string().optional().or(z.literal("")),
  nomePai: z.string().optional().or(z.literal("")),
  nomeMae: z.string().optional().or(z.literal("")),
  profissao: z.string().optional().or(z.literal("")),
  ocupacao: z.string().optional().or(z.literal("")),
  naturalidade: z.string().optional().or(z.literal("")),
  provincia: z.string().optional().or(z.literal("")),
  municipio: z.string().optional().or(z.literal("")),
  morada: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;
function formatDate(date?: string | null) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

type DadosPessoaisProps = {
  codigoMatricula: number;
  value?: string;
};

export function DadosPessoais({
  codigoMatricula,
  value = "dados-pessoais",
}: DadosPessoaisProps) {
  const { data: student, isLoading } = useStudentDetail(codigoMatricula);
  const { data: profissoes = [] } = useProfissoesDropdownFilter();
  const { data: ocupacoes = [] } = useOcupacoesDropdownFilter();
  const { data: nacionalidades = [] } = useNacionalidadesDropdownFilter();
  const updateMutation = useUpdatePersonalData();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomeCompleto: "",
      dataNascimento: "",
      genero: "",
      numeroBI: "",
      dataEmissao: "",
      dataValidade: "",
      nacionalidade: "",
      nomePai: "",
      nomeMae: "",
      profissao: "",
      ocupacao: "",
      naturalidade: "",
      provincia: "",
      municipio: "",
      morada: "",
    },
  });
  const { isDirty } = form.formState;
  useEffect(() => {
    if (student) {
      form.reset({
        nomeCompleto: student.nome_completo ?? "",
        dataNascimento: formatDate(student.data_nascimento),
        genero: student.sexo ?? "",
        numeroBI: student.bi ?? "",
        dataEmissao: formatDate(student.data_emissao_bi),
        dataValidade: formatDate(student.data_validade_bi),
        nacionalidade:
          nacionalidades
            .find(
              (nacionalidade) => nacionalidade.label === student.nacionalidade,
            )
            ?.value.toString() ?? "",
        nomePai: student.pai ?? "",
        nomeMae: student.mae ?? "",
        profissao: student.profissao_codigo?.toString() ?? "",
        ocupacao: student.ocupacao_codigo?.toString() ?? "",
        naturalidade: student.naturalidade ?? "",
        provincia: student.naturalidade ?? "",
        municipio: student.naturalidade ?? "",
        morada: student.morada ?? "",
      });
    }
  }, [student, form]);

  if (isLoading)
    return <div className="p-4 text-center">A carregar dados...</div>;

  async function onSubmit(values: FormValues) {
    try {
      await updateMutation.mutateAsync({
        codigoMatricula,
        nomeCompleto:
          values.nomeCompleto !== student?.nome_completo
            ? values.nomeCompleto
            : undefined,
        dataNascimento:
          values.dataNascimento !== formatDate(student?.data_nascimento)
            ? values.dataNascimento
            : undefined,
        genero: values.genero !== student?.sexo ? values.genero : undefined,
        numeroBI: values.numeroBI !== student?.bi ? values.numeroBI : undefined,
        dataEmissao:
          values.dataEmissao !== formatDate(student?.data_emissao_bi)
            ? values.dataEmissao
            : undefined,
        dataValidade:
          values.dataValidade !== formatDate(student?.data_validade_bi)
            ? values.dataValidade
            : undefined,
        nacionalidade:
          values.nacionalidade !== student?.nacionalidade
            ? values.nacionalidade
            : undefined,
        nomePai: values.nomePai !== student?.pai ? values.nomePai : undefined,
        nomeMae: values.nomeMae !== student?.mae ? values.nomeMae : undefined,
        profissao:
          Number(values.profissao) !== student?.profissao_codigo
            ? Number(values.profissao)
            : undefined,
        ocupacao:
          Number(values.ocupacao) !== student?.ocupacao_codigo
            ? Number(values.ocupacao)
            : undefined,
        naturalidade:
          values.naturalidade !== student?.naturalidade
            ? values.naturalidade
            : undefined,
        morada: values.morada !== student?.morada ? values.morada : undefined,
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <TabsContent value={value} className="space-y-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <CardTitle className="text-lg uppercase text-primary">
            Dados Pessoais
          </CardTitle>
          <CardDescription>
            Gerencie as informações básicas e de morada.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditing(!isEditing);
              form.reset();
            }}
            className="flex gap-2"
          >
            <Pencil className="h-4 w-4" /> {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button
              disabled={!isDirty || updateMutation.isPending}
              size="sm"
              className="bg-green-600 hover:bg-green-700 flex gap-2"
              onClick={form.handleSubmit(onSubmit)}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Salvar
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          {/* SECÇÃO: DADOS PESSOAIS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputFormField
              control={form.control}
              name="nomeCompleto"
              label="Nome Completo:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="dataNascimento"
              label="Data de Nascimento:"
              type="date"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="genero"
              label="Genero:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="numeroBI"
              label="Numero BI:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="dataEmissao"
              type="date"
              label="Data de Emissao:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="dataValidade"
              type="date"
              label="Data de Validade:"
              disabled={!isEditing}
            />
            <SelectFormField
              control={form.control}
              name="nacionalidade"
              label="Nacionalidade:"
              items={nacionalidades.map((nacionalidade) => ({
                value: nacionalidade.value.toString(),
                label: nacionalidade.label,
              }))}
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="nomePai"
              label="Nome do Pai:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="nomeMae"
              label="Nome da Mae:"
              disabled={!isEditing}
            />
            <SelectFormField
              control={form.control}
              name="profissao"
              label="Profissao:"
              disabled={!isEditing}
              items={profissoes.map((profissao) => ({
                value: profissao.value.toString(),
                label: profissao.label,
              }))}
            />
            <SelectFormField
              control={form.control}
              name="ocupacao"
              label="Ocupacao:"
              disabled={!isEditing}
              items={ocupacoes.map((ocupacao) => ({
                value: ocupacao.value.toString(),
                label: ocupacao.label,
              }))}
            />
            <InputFormField
              control={form.control}
              name="naturalidade"
              label="Naturalidade:"
              disabled={!isEditing}
            />
          </div>

          {/* SECÇÃO: MORADA */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase border-b pb-1">
              Morada
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputFormField
                control={form.control}
                name="provincia"
                label="Provincia:"
                disabled={!isEditing}
              />
              <InputFormField
                control={form.control}
                name="municipio"
                label="Municipio:"
                disabled={!isEditing}
              />
              <InputFormField
                control={form.control}
                name="morada"
                label="Morada:"
                disabled={!isEditing}
              />
            </div>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
}
