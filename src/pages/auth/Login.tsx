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
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
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
import { useState } from "react";
import { useMutationLogin } from "@/hooks/mutations/use-mutation-login";
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
  const [showPassword, setShowPassword] = useState(false);

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

  const showEnvLabel = isDevelop || isPrePrd;
  const envDisplay = isDevelop
    ? "Ambiente: Desenvolvimento"
    : isPrePrd
      ? "Ambiente: Pré-produção"
      : "";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "var(--bg-page)" }}>

      {/* Inline styles scoped to this page */}
      <style>{`
        :root {
          --angola-red:    #b91c1c;
          --angola-yellow: #d97706;
          --angola-green:  #15803d;
          --bg-page:       #f5f4f1;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-wrapper .input-icon {
          position: absolute;
          left: 12px;
          color: #9ca3af;
          pointer-events: none;
          width: 16px;
          height: 16px;
        }

        .login-input-wrapper input {
          padding-left: 2.25rem !important;
        }

        .login-input-wrapper input.has-toggle {
          padding-right: 2.5rem !important;
        }

        .toggle-password {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #9ca3af;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .toggle-password:hover {
          color: #6b7280;
        }

        .angola-stripe {
          height: 4px;
          background: linear-gradient(
            90deg,
            var(--angola-red)    0%,
            var(--angola-red)    60%,
            var(--angola-yellow) 60%,
            var(--angola-yellow) 80%,
            var(--angola-green)  80%,
            var(--angola-green)  100%
          );
          border-radius: 4px 4px 0 0;
        }

        .btn-entrar {
          width: 100%;
          height: 42px;
          background: var(--angola-red);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s;
        }

        .btn-entrar:hover:not(:disabled) {
          background: #991b1b;
        }

        .btn-entrar:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="w-full max-w-md">

        {/* Header — logo + título */}
        <div className="text-center mb-8">
          <div className="inline-block mb-5">
            <img
              src="/logo_uma.png"
              alt="Logotipo da Universidade Metodista de Angola"
              className="h-28 w-auto drop-shadow-lg"
            />
          </div>

          <h1
            className="text-3xl font-bold text-foreground mb-1"
            style={{ letterSpacing: "-0.3px" }}
          >
            Portal Académico
          </h1>
          <p className="text-muted-foreground text-sm">
            Sistema de Gestão Académica
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: "14px",
            border: "0.5px solid #e5e7eb",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {/* Faixa das cores de Angola */}
          <div className="angola-stripe" />

          <div style={{ padding: "1.75rem 1.75rem 2rem" }}>
            <h2
              className="text-xl font-semibold text-foreground mb-1"
              style={{ marginBottom: "4px" }}
            >
              Iniciar Sessão
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Digite suas credenciais para acessar o sistema
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="login-input-wrapper">
                          <User className="input-icon" aria-hidden="true" />
                          <Input placeholder="seu.usuario" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Senha */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Senha
                      </FormLabel>
                      <FormControl>
                        <div className="login-input-wrapper">
                          <Lock className="input-icon" aria-hidden="true" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="has-toggle"
                            {...field}
                          />
                          <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={
                              showPassword ? "Ocultar senha" : "Mostrar senha"
                            }
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
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
                  <LogIn size={16} />
                  {form.formState.isSubmitting || loginMutation.isPending
                    ? "Entrando..."
                    : "Entrar"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center text-xs text-muted-foreground/60">
          {showEnvLabel && (
            <p>
              {envDisplay} • v{APP_ENV}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;