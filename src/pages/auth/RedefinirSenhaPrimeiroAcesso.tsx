import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, Lock, Eye, EyeOff, Check, X } from "lucide-react";
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

// ────────────────────────────────────────────────
// Validação em tempo real (igual ao UserEditModal)
// ────────────────────────────────────────────────
function validatePasswordSteps(password: string) {
  return {
    minLength: password.length >= 8,
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[!@#$%^&*()_+\-=[\]{}|;:',.<>/?~]/.test(password),
  };
}

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

const RedefinirSenhaPrimeiroAcesso = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({ variant: "destructive", description: "Link inválido ou expirado." });
      navigate("/login");
    }
  }, [token, navigate]);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const newPasswordValue = form.watch("newPassword");

  const steps = validatePasswordSteps(newPasswordValue);
  const isStrongPassword = Object.values(steps).every(Boolean);
  const passwordsMatch = newPasswordValue === form.watch("confirmPassword") && newPasswordValue !== "";

  const canSubmit = isStrongPassword && passwordsMatch;

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
              <form onSubmit={onSubmit} className="space-y-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                            className={
                              field.value && !isStrongPassword
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            }
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {field.value && (
                        <ul className="mt-3 space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            {steps.minLength ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            Mínimo 8 caracteres
                          </li>
                          <li className="flex items-center gap-2">
                            {steps.upperCase ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            Pelo menos 1 letra maiúscula
                          </li>
                          <li className="flex items-center gap-2">
                            {steps.lowerCase ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            Pelo menos 1 letra minúscula
                          </li>
                          <li className="flex items-center gap-2">
                            {steps.number ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            Pelo menos 1 número
                          </li>
                          <li className="flex items-center gap-2">
                            {steps.symbol ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            Pelo menos 1 símbolo
                          </li>
                        </ul>
                      )}

                      <FormDescription className="text-xs mt-2">
                        A senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.
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
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                          className={
                            field.value && !passwordsMatch
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
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
                    resetMutation.isPending ||
                    !canSubmit ||
                    form.formState.isSubmitting
                  }
                >
                  {resetMutation.isPending ? "A guardar..." : "Definir Senha"}
                </Button>
              </form>
            </Form>

      
          </CardContent>
        </Card>

        {showEnvLabel && (
          <div className="mt-8 text-center text-xs text-muted-foreground/60">
            <p>{isDevelop ? "Desenvolvimento" : "Pré-produção"} • v{APP_ENV}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedefinirSenhaPrimeiroAcesso;