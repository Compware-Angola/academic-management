import { motion } from "framer-motion";
import { ShieldAlert, Sparkles, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl text-center">
        {/* Ícone animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="mb-12 inline-block"
        >
          <div className="relative">
            <div className="rounded-full bg-destructive/10 p-10 ring-8 ring-destructive/5">
              <ShieldAlert className="h-20 w-20 text-destructive" />
            </div>

            {/* Efeitos animados */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -left-4 opacity-30"
            >
              <Sparkles className="h-12 w-12 text-destructive" />
            </motion.div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-6 -right-6 opacity-30"
            >
              <Sparkles className="h-10 w-10 text-destructive" />
            </motion.div>
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl"
        >
          Acesso negado
        </motion.h1>

        {/* Mensagem */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground"
        >
          Você não tem permissão para acessar esta página.
          <br />
          Caso ache que isto é um erro, entre em contacto com o administrador do sistema.
        </motion.p>

        {/* Barra visual */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mx-auto mb-10 h-3 w-full max-w-md overflow-hidden rounded-full bg-muted"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="h-full w-1/2 bg-destructive"
          />
        </motion.div>

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-primary/30"
          >
            <Home size={20} />
            Ir para o Dashboard
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-8 py-4 font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-4 focus-visible:ring-ring/50"
          >
            <RefreshCw size={20} />
            Recarregar página
          </button>
        </motion.div>

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-sm text-muted-foreground"
        >
          Permissões são definidas por grupo • Sistema Académico
        </motion.p>
      </div>
    </div>
  );
}
