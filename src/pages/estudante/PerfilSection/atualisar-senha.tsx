/* eslint-disable no-useless-escape */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  useResetPassword,
  useStudentDetail,
} from "@/hooks/students/use-query-students";
import { TabsContent } from "@/components/ui/tabs";
import { PasswordFormField } from "@/components/PasswordFormField";

const schema = z.object({
  novaSenha: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(
      /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\/\\]/,
      "Deve conter pelo menos um caracter especial",
    ),
});

type FormValues = z.infer<typeof schema>;

export function AtualizarSenha({
  codigoMatricula,
  value = "atualizar-senha",
}: {
  codigoMatricula: number;
  value?: string;
}) {
  const { data: student, isLoading } = useStudentDetail(codigoMatricula);
  const resetPassword = useResetPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      novaSenha: "",
    },
  });

  useEffect(() => {
    if (student?.bi) {
      form.reset({
        novaSenha: `${student.bi}@`,
      });
    } else {
      form.reset({
        novaSenha: "",
      });
    }
  }, [student?.codigo_matricula]);

  async function onSubmit(values: FormValues) {
    await resetPassword.mutateAsync({
      codigoMatricula,
      senha: values.novaSenha,
    });

    form.reset({
      novaSenha: student?.bi ? `${student.bi}@` : "",
    });
  }

  return (
    <TabsContent value={value} className="space-y-4 px-4">
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-lg">Atualizar Senha</CardTitle>
      </div>

      <CardDescription className="flex flex-col gap-2">
        {isLoading ? (
          <span className="space-y-2">
            <span className="h-4 w-40 bg-muted animate-pulse rounded" />
            <span className="h-4 w-64 bg-muted animate-pulse rounded" />
          </span>
        ) : (
          <>
            <span>Define uma nova senha para este estudante.</span>

            {student?.bi && (
              <span className="text-red-500">
                <span className="font-bold">Atenção:</span> A senha padrão é o
                BI do estudante seguido de "@".
              </span>
            )}
          </>
        )}
      </CardDescription>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-5"
        >
          <PasswordFormField
            control={form.control}
            name="novaSenha"
            placeholder="••••••••"
            label="Nova Senha"
            showStrength
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={resetPassword.isPending || isLoading}
            >
              {resetPassword.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />A redefinir...
                </>
              ) : (
                "Redefinir Senha"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </TabsContent>
  );
}
