import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutationLogin } from "@/hooks/mutations/use-mutation-login";

// ───────────────────────────────────────────────
//  Arquivo src/config/env.ts (precisas criar ou manter):
//
// export const APP_ENV = import.meta.env.VITE_APP_ENV as string | undefined;
//
// export const isDevelop = APP_ENV === 'develop';
// export const isPrePrd  = APP_ENV === 'pre-prd';
// ───────────────────────────────────────────────
import { APP_ENV, isDevelop, isPrePrd } from "@/config/env";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "O username deve ter pelo menos 3 caracteres")
    .max(60, "Username muito longo"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const loginMutation = useMutationLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormData) => {
    const { username, password } = values;
    loginMutation.mutate({ username, password, platform: "GA" });
  };

  // Mostra apenas em develop ou pre-prd
  const showEnvLabel = isDevelop || isPrePrd;

  // Texto amigável para a label
  const envDisplay = isDevelop
    ? "Ambiente: Desenvolvimento"
    : isPrePrd
      ? "Ambiente: Pré-produção"
      : "";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Portal Académico
          </h1>
          <p className="text-muted-foreground">Sistema de Gestão Académica</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Iniciar Sessão</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="seu.usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    form.formState.isSubmitting || loginMutation.isPending
                  }
                >
                  {form.formState.isSubmitting || loginMutation.isPending
                    ? "Entrando..."
                    : "Entrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          {showEnvLabel && (
            <p>
              {envDisplay} • v{APP_ENV}
            </p>
          )}
          {/* <p>© 2025 Portal Académico. Todos os direitos reservados.</p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;