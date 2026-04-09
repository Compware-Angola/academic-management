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
  // useUpdateStudentDetails <- Supondo que você criará este hook
} from "@/hooks/tudents/use-query-students";
import { useEffect, useState } from "react";

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

type DadosPessoaisProps = {
  codigoMatricula: number;
  value?: string;
};

export function DadosPessoais({
  codigoMatricula,
  value = "dados-pessoais",
}: DadosPessoaisProps) {
  const { data: student, isLoading } = useStudentDetail(codigoMatricula);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomeCompleto: student?.nome_completo ?? "",
      dataNascimento: student?.data_nascimento ?? "",
      genero: student?.sexo ?? "",
      numeroBI: student?.bi ?? "",
      dataEmissao: "",
      dataValidade: "",
      nacionalidade: student?.nacionalidade ?? "",
      nomePai: student?.pai ?? "",
      nomeMae: student?.mae ?? "",
      profissao: "",
      ocupacao: "",
      naturalidade: student?.naturalidade ?? "",
      provincia: student?.naturalidade ?? "",
      municipio: student?.naturalidade ?? "",
      morada: student?.morada ?? "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        nomeCompleto: student.nome_completo,
        dataNascimento: student.data_nascimento,
        genero: student.sexo,
        numeroBI: student.bi,
        nacionalidade: student.nacionalidade,
        nomePai: student.pai,
        nomeMae: student.mae,
        naturalidade: student.naturalidade,
        provincia: student.naturalidade,
        municipio: student.naturalidade,
        morada: student.morada,
      });
    }
  }, [form, student]);

  if (isLoading)
    return <div className="p-4 text-center">A carregar dados...</div>;

  function onSubmit(values: FormValues) {
    console.log("Dados atualizados:", values);
    // Aqui chamarias a tua mutation: updateDetails.mutateAsync(...)
    setIsEditing(false);
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
            onClick={() => setIsEditing(!isEditing)}
            className="flex gap-2"
          >
            <Pencil className="h-4 w-4" /> {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 flex gap-2"
              onClick={form.handleSubmit(onSubmit)}
            >
              <Save className="h-4 w-4" /> Salvar
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
              label="Data de Emissao:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="dataValidade"
              label="Data de Validade:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="nacionalidade"
              label="Nacionalidade:"
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
            <InputFormField
              control={form.control}
              name="profissao"
              label="Profissao:"
              disabled={!isEditing}
            />
            <InputFormField
              control={form.control}
              name="ocupacao"
              label="Ocupacao:"
              disabled={!isEditing}
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
