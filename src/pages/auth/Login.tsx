import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Lock, LogIn, Users, BarChart2, FileCheck, CalendarDays, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useMutationLogin } from "@/hooks/mutations/use-mutation-login";
import { APP_ENV, isDevelop, isPrePrd } from "@/config/env";
import { useTheme } from "@/hooks/use-theme";

import logo from "@/assets/logo_uma.png";
import studentsBg from "@/assets/students-bg.jpg";
import { LogoBackground } from "./components/logo-background";

const loginSchema = z.object({
  username: z
    .string()
    .min(2, "O username deve ter pelo menos 2 caracteres")
    .max(60, "Username muito longo"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { setTheme } = useTheme();
  const loginMutation = useMutationLogin();
  const [showPassword, setShowPassword] = useState(false);

  // Força modo light enquanto a página de login está montada
  useEffect(() => {
    setTheme("light");
  }, []);

  const showEnvLabel = isDevelop || isPrePrd;
  const envDisplay = isDevelop
    ? "Ambiente: Desenvolvimento"
    : isPrePrd
      ? "Ambiente: Pré-produção"
      : "";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: LoginFormData) => {
    const { username, password } = values;
    loginMutation.mutate({ username, password, platform: "GA" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* LEFT — Imagem + Conteúdo */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden text-white p-12">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${studentsBg})` }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-animated-red opacity-70 mix-blend-multiply" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-brand-yellow/15 blur-3xl animate-float-slow [animation-delay:-6s]" />

        <div className="relative z-10 h-12" />

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight">
            Bem-vindo ao
            <br />
            <span className="bg-gradient-to-r from-white via-brand-yellow to-white bg-clip-text text-transparent">
              Gestão Académica
            </span>
          </h1>

          <p className="max-w-md text-base text-white/85">
            Gerencie turmas, docentes, pautas e actividades académicas numa plataforma centralizada.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/90">
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <BarChart2 className="h-4 w-4 text-brand-yellow" />
              </span>
              Relatórios de desempenho académico por turma e curso
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <FileCheck className="h-4 w-4 text-brand-yellow" />
              </span>
              Gestão e aprovação de pautas e avaliações
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <Users className="h-4 w-4 text-brand-yellow" />
              </span>
              Visão geral de docentes, turmas e cargas horárias
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <CalendarDays className="h-4 w-4 text-brand-yellow" />
              </span>
              Calendário académico e controlo de actividades
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur">
                <MessageSquare className="h-4 w-4 text-brand-yellow" />
              </span>
              Comunicação interna entre docentes e direcção
            </li>
          </ul>
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Universidade Metodista de Angola
          </p>
        </div>
      </aside>

      {/* RIGHT — Formulário */}
      <main className="relative flex items-center justify-center p-6 sm:p-10 bg-white">
        <LogoBackground top="2.5rem" right="2.5rem" />
        <LogoBackground bottom="2.5rem" left="2.5rem" />
        <div className="w-full max-w-md space-y-8">
          {/* Logo Mobile */}
          <div className="flex justify-center lg:hidden">
            <div className="rounded-2xl bg-white p-3 shadow-md ring-1 ring-border">
              <img src={logo} alt="Metodista de Angola" className="h-12 w-auto" />
            </div>
          </div>

          { /* barra branca em cima do logo */}
          <div className="flex justify-center">
            <div className="">
              <img src={logo} alt="Metodista de Angola" className="h-20 w-auto" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Entrar na conta</h2>
            <p className="text-sm text-muted-foreground">
              Digite suas credenciais para acessar o sistema.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          autoComplete="username"
                          placeholder="seu.usuario"
                          className="h-11 pl-10 bg-white"
                        />
                      </div>
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-11 pl-10 pr-10 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting || loginMutation.isPending}
                className="h-11 w-full bg-brand-red text-white hover:bg-brand-red/90 shadow-lg shadow-brand-red/30 transition-all hover:shadow-xl hover:shadow-brand-red/40 hover:-translate-y-0.5"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting || loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>

          {showEnvLabel && (
            <p className="text-center text-xs text-muted-foreground">
              {envDisplay} • v{APP_ENV}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;