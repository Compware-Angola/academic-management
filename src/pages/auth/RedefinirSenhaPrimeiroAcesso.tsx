
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Lock, AlertCircle } from "lucide-react";
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
  FormDescription,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";



import { APP_ENV, isDevelop, isPrePrd } from "@/config/env";
import { resetPassword } from "@/services/auth/login.service";

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Pelo menos 1 maiúscula")
      .regex(/[a-z]/, "Pelo menos 1 minúscula")
      .regex(/[0-9]/, "Pelo menos 1 número")
      .regex(/[^A-Za-z0-9]/, "Pelo menos 1 símbolo"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

const RedefinirSenhaPrimeiroAcesso = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>()

  useEffect(() => {
    if (!token) {
      toast({ variant: "destructive", description: "Link inválido ou expirado." });
      navigate("/login");
    }
  }, [token, navigate]);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const resetMutation = useMutation({
    mutationFn: ({ newPassword }: { newPassword: string }) =>
      resetPassword(token!, newPassword),
    onSuccess: () => {
      toast({
        title: "Senha definida com sucesso",
        description: "Agora pode fazer login normalmente.",
      });
      navigate("/login");
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: err?.message || "Link inválido, expirado ou já utilizado.",
      });
      navigate("/primeiro-acesso"); // ou /login
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    resetMutation.mutate({ newPassword: values.newPassword });
  });

  const showEnvLabel = isDevelop || isPrePrd;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Definir Senha</h1>
          <p className="text-muted-foreground">Crie uma senha forte para a sua conta</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-6 w-6" /> Nova Senha
            </CardTitle>
            <CardDescription>
              Esta é a sua primeira configuração de senha. Escolha uma forte e segura.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-5">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || resetMutation.isPending || !form.formState.isValid}
                >
                  {resetMutation.isPending ? "A guardar..." : "Definir Senha"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm flex items-start gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Regras da senha:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Pelo menos 8 caracteres</li>
                  <li>Uma letra maiúscula</li>
                  <li>Uma letra minúscula</li>
                  <li>Um número</li>
                  <li>Um símbolo especial</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          {showEnvLabel && <p>{isDevelop ? "Desenvolvimento" : "Pré-produção"} • v{APP_ENV}</p>}
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenhaPrimeiroAcesso;