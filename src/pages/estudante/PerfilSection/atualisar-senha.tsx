"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { useResetPassword } from "@/hooks/tudents/use-query-students";
import { TabsContent } from "@/components/ui/tabs";

const schema = z.object({
  novaSenha: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(
      /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\/\\]/,
      "Deve conter pelo menos um caractere especial",
    ),
});

type FormValues = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8 caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    {
      label: "Caractere especial",
      ok: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\/\\]/.test(password),
    },
  ];

  const score = checks.filter((c) => c.ok).length;
  const barColor =
    score <= 1
      ? "bg-destructive"
      : score === 2
        ? "bg-amber-500"
        : "bg-green-500";

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? barColor : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map(({ label, ok }) => (
          <span
            key={label}
            className={`text-xs flex items-center gap-1 transition-colors ${
              ok ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${ok ? "bg-green-500" : "bg-muted-foreground/50"}`}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AtualizarSenha({
  codigoMatricula,
  value = "atualizar-senha",
}: {
  codigoMatricula: number;
  value?: string;
}) {
  const [show, setShow] = useState(false);
  const resetPassword = useResetPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { novaSenha: "" },
  });

  const novaSenha = form.watch("novaSenha");

  function onSubmit(values: FormValues) {
    console.log(values);
    resetPassword.mutateAsync({ codigoMatricula, senha: values.novaSenha });
    form.reset();
  }

  return (
    <TabsContent value={value} className="space-y-4 px-4">
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-lg">Atualizar Senha</CardTitle>
      </div>
      <CardDescription>
        Define uma nova senha para este estudante.
      </CardDescription>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="novaSenha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {novaSenha && <PasswordStrength password={novaSenha} />}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={resetPassword.isPending}
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
