import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Lock, Mail } from "lucide-react";
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

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "O username deve ter pelo menos 3 caracteres")
    .max(60, "Username muito longo"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});
type LoginFormData = z.infer<typeof loginSchema>;
const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${data.username ?? "Utilizador"}`,
          });
          navigate("/dashboard");
        },
        onError: (err: Error) => {
          const message = "Erro ao autenticar. Verifique credenciais.";
          toast({
            title: "Erro ao fazer login",
            description: message,
            variant: "destructive",
          });
        },
      },
    );
  };

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
                {/* Campo Username */}
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

                {/* Campo Password */}
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

                {/* Botão de Submit */}
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
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Button
                type="button"
                variant="link"
                className="px-0 text-primary hover:text-primary/80"
                onClick={() =>
                  toast({
                    title: "Registro",
                    description:
                      "Entre em contato com a administração para criar uma conta",
                  })
                }
              >
                Solicitar acesso
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© 2025 Portal Académico. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
