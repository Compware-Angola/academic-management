// src/pages/PrimeiroAcessoEmail.tsx
import { useState } from "react";
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
import { GraduationCap, Mail, AlertCircle } from "lucide-react";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";



import { APP_ENV, isDevelop, isPrePrd } from "@/config/env";
import { requestPasswordReset } from "@/services/auth/login.service";

const emailSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const PrimeiroAcessoEmail = () => {
  const navigate = useNavigate();
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const sendLinkMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => requestPasswordReset(email),
    onSuccess: () => {
      toast({
        title: "Link enviado",
        description: "Verifique o seu email e clique no link recebido para definir a nova senha.",
      });
      // Opcional: redireciona para login ou página de instrução
      navigate("/");
    },
    onError: (err: any) => {
      // Mensagem genérica para não vazar se email existe ou não
      toast({
        variant: "destructive",
        title: "Erro ao enviar link",
        description: err?.message || "Não foi possível enviar o link. Verifique o email ou tente mais tarde.",
      });
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    sendLinkMutation.mutate({ email: values.email });
  });

  const showEnvLabel = isDevelop || isPrePrd;
  const envDisplay = isDevelop ? "Desenvolvimento" : isPrePrd ? "Pré-produção" : "";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Primeiro Acesso</h1>
          <p className="text-muted-foreground">Informe o seu email para receber o link de configuração da senha</p>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6" /> Verificar Email
            </CardTitle>
            <CardDescription>
              Digite o email associado à sua conta. Enviaremos um link seguro para definir a sua senha.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu.email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting || sendLinkMutation.isPending}
                >
                  {sendLinkMutation.isPending ? "Enviando..." : "Receber Link por Email"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm flex items-start gap-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <p>Verifique a caixa de entrada e a pasta de spam. O link expira em breve.</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          {showEnvLabel && <p>{envDisplay} • v{APP_ENV}</p>}
        </div>
      </div>
    </div>
  );
};

export default PrimeiroAcessoEmail;