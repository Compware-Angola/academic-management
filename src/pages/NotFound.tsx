import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, RefreshCw, SearchSlash } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 - Página não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-2xl text-center">
        {/* Ícone sutil com animação suave */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="mb-12 inline-block"
        >
          <div className="rounded-full bg-primary/10 p-8 ring-8 ring-primary/5">
            <SearchSlash className="h-16 w-16 text-primary" />
          </div>
        </motion.div>

        {/* 404 com zero destacando */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 font-mono text-9xl font-black tracking-tighter text-foreground"
        >
          4
          <span className="inline-block animate-pulse text-primary">0</span>
          4
        </motion.h1>

        {/* Título e descrição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-3xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-lg text-muted-foreground">
            O endereço solicitado não existe ou foi removido.
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            <code className="rounded bg-muted px-2 py-1 text-foreground/80">
              {location.pathname}
            </code>
          </p>
        </motion.div>

        {/* Botões com estilo idêntico ao teu sistema */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          {/* Botão primário - Dashboard */}
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-primary/30"
          >
            <Home size={20} />
            Voltar ao Dashboard
          </a>

          {/* Botão secundário - Recarregar */}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-8 py-4 font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-4 focus-visible:ring-ring/50"
          >
            <RefreshCw size={20} />
            Recarregar página
          </button>
        </motion.div>

        {/* Mensagem de suporte discreta */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-sm text-muted-foreground"
        >
          Se o problema persistir, entre em contato com o suporte técnico.
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;