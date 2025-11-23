// src/components/UnderConstruction.tsx
import { motion } from "framer-motion";
import { Home, Wrench, Sparkles, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnderConstruction() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="w-full max-w-2xl text-center">
                {/* Ícone animado com engrenagens */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 16 }}
                    className="mb-12 inline-block"
                >
                    <div className="relative">
                        <div className="rounded-full bg-primary/10 p-10 ring-8 ring-primary/5">
                            <Wrench className="h-20 w-20 text-primary" />
                        </div>

                        {/* Engrenagens girando ao fundo */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-4 -left-4 opacity-30"
                        >
                            <Sparkles className="h-12 w-12 text-primary" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-6 -right-6 opacity-30"
                        >
                            <Sparkles className="h-10 w-10 text-primary" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Título principal */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl"
                >
                    Em desenvolvimento
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground"
                >
                    Estamos trabalhando duro para trazer esta funcionalidade o mais breve possível.
                    <br />
                    Volte em breve ou acesse as áreas já disponíveis.
                </motion.p>

                {/* Barra de progresso estilizada (falsa, só visual) */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mx-auto mb-10 h-3 w-full max-w-md overflow-hidden rounded-full bg-muted"
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "10%" }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                        className="h-full w-1/3 bg-primary"
                    />
                </motion.div>

                {/* Botões */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col gap-4 sm:flex-row sm:justify-center"
                >
                    <Link to="/dashboard" className="inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-primary/30"
                    >
                        <span>  Ir para o Dashboard</span>
                    </Link>


                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-8 py-4 font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-4 focus-visible:ring-ring/50"
                    >
                        <RefreshCw size={20} />
                        Recarregar página
                    </button>
                </motion.div>

                {/* Rodapé discreto */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-sm text-muted-foreground"
                >
                    Obrigado pela paciência • Equipe de Desenvolvimento
                </motion.p>
            </div>
        </div>
    );
}