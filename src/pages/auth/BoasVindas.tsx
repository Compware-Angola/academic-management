import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const BoasVindas = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 4200);
    const navTimer = setTimeout(() => navigate("/dashboard"), 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-primary/10 via-background to-primary/5 transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-scale-in flex flex-col items-center gap-6 text-center px-6">
        {/* Logo */}
        <img
          src="/logo_uma.png"
          alt="Logotipo da Universidade Metodista de Angola"
          className="h-28 w-auto drop-shadow-lg"
        />

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold text-primary">
          Portal de Gestão Académica
        </h1>

        {/* Nome da Universidade */}
        <p className="text-lg md:text-xl font-medium text-foreground">
          Universidade Metodista de Angola
        </p>

        {/* Descrição */}
        <p className="max-w-md text-sm md:text-base text-muted-foreground">
          Plataforma Oficial para Gestão Académica, Matrículas, Notas,
          Propinas e Processos Administrativos.
        </p>

        {/* Barra de Progresso */}
        <div className="mt-6 h-1 w-56 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              animation: "progress 5s linear forwards",
            }}
          />
        </div>

        {/* Mensagem pequena */}
        <p className="text-xs text-muted-foreground/70 mt-2">
          A carregar o sistema...
        </p>
      </div>

      {/* Rodapé */}
      <div className="absolute bottom-6 text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Universidade Metodista de Angola <br />
        Portal de Gestão Académica • Versão 2.0.0
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BoasVindas;
