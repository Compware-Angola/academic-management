import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Copy, ExternalLink, Link2, ClipboardCheck, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const InscricaoEpocaEspecial = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const inscricaoLink = `${import.meta.env.VITE_PORTAL_APP_URL}/auth/login?tab=register`;

  async function handleCopyLink() {
    try {
      setLoading(true);

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(inscricaoLink);
      } else {
        fallbackCopy();
      }

      setCopied(true);
      toast.success("Link copiado!");

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao copiar");
    } finally {
      setLoading(false);
    }
  }
  function fallbackCopy() {
    const textarea = document.createElement("textarea");
    textarea.value = inscricaoLink;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
      toast.success("Link copiado (fallback)!");
    } catch {
      toast.error("Não foi possível copiar");
    }

    document.body.removeChild(textarea);
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/exame-acesso">Exame de Acesso</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inscrição Época Especial</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <GraduationCap className="h-7 w-7 text-primary animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inscrição — Época Especial</h1>
          <p className="text-muted-foreground">Exame de Acesso · Gestão de inscrições e candidaturas</p>
        </div>
      </div>

      {/* Card do Link */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Link de Inscrição
          </CardTitle>
          <CardDescription>
            Partilhe este link com os candidatos para que possam submeter as suas inscrições na época especial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={inscricaoLink}
              readOnly
              className="bg-background font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              disabled={loading}
              title="Copiar link"
              className={copied ? "text-green-600 border-green-500" : ""}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : copied ? (
                <ClipboardCheck className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(inscricaoLink, "_blank")}
              title="Abrir formulário"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Animação central */}
      <Card className="flex items-center justify-center py-16">
        <CardContent className="flex flex-col items-center gap-6 p-0">

          {/* Figura do estudante SVG animada */}
          <div className="relative">

            {/* Ondas de fundo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="absolute h-40 w-40 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
              <span className="absolute h-56 w-56 rounded-full border border-primary/5 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
              <span className="absolute h-72 w-72 rounded-full border border-primary/5 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.6s" }} />
            </div>

            {/* SVG do estudante */}
            <svg
              width="160"
              height="200"
              viewBox="0 0 160 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 drop-shadow-md"
              style={{ animation: "float 3s ease-in-out infinite" }}
            >
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                }
                @keyframes wave {
                  0%, 100% { transform: rotate(0deg); }
                  25% { transform: rotate(20deg); }
                  75% { transform: rotate(-10deg); }
                }
              `}</style>

              {/* Corpo */}
              <rect x="52" y="95" width="56" height="70" rx="10" fill="hsl(var(--primary))" opacity="0.9" />

              {/* Cabeça */}
              <circle cx="80" cy="72" r="26" fill="#FBBF8A" />

              {/* Cabelo */}
              <ellipse cx="80" cy="50" rx="26" ry="12" fill="#3B1A08" />
              <rect x="54" y="48" width="8" height="20" rx="4" fill="#3B1A08" />
              <rect x="98" y="48" width="8" height="20" rx="4" fill="#3B1A08" />

              {/* Olhos */}
              <circle cx="72" cy="72" r="3.5" fill="#1e293b" />
              <circle cx="88" cy="72" r="3.5" fill="#1e293b" />
              <circle cx="73" cy="71" r="1" fill="white" />
              <circle cx="89" cy="71" r="1" fill="white" />

              {/* Sorriso */}
              <path d="M73 80 Q80 87 87 80" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Braço esquerdo — estático */}
              <rect x="30" y="98" width="24" height="12" rx="6" fill="hsl(var(--primary))" opacity="0.9" />

              {/* Braço direito — acenando */}
              <g style={{ transformOrigin: "108px 104px", animation: "wave 1.5s ease-in-out infinite" }}>
                <rect x="108" y="98" width="24" height="12" rx="6" fill="hsl(var(--primary))" opacity="0.9" />
                {/* Mão */}
                <circle cx="134" cy="104" r="7" fill="#FBBF8A" />
              </g>

              {/* Mão esquerda */}
              <circle cx="28" cy="104" r="7" fill="#FBBF8A" />

              {/* Pernas */}
              <rect x="58" y="158" width="18" height="36" rx="8" fill="hsl(var(--primary))" opacity="0.7" />
              <rect x="84" y="158" width="18" height="36" rx="8" fill="hsl(var(--primary))" opacity="0.7" />

              {/* Sapatos */}
              <ellipse cx="67" cy="193" rx="13" ry="6" fill="#1e293b" />
              <ellipse cx="93" cy="193" rx="13" ry="6" fill="#1e293b" />

              {/* Livro na mão esquerda */}
              <rect x="10" y="96" width="20" height="26" rx="3" fill="#f8fafc" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <line x1="20" y1="96" x2="20" y2="122" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <line x1="13" y1="104" x2="18" y2="104" stroke="#94a3b8" strokeWidth="1" />
              <line x1="13" y1="108" x2="18" y2="108" stroke="#94a3b8" strokeWidth="1" />
              <line x1="13" y1="112" x2="18" y2="112" stroke="#94a3b8" strokeWidth="1" />

              {/* Chapéu de formatura */}
              <rect x="58" y="42" width="44" height="8" rx="2" fill="#1e293b" />
              <polygon points="80,20 58,42 102,42" fill="#1e293b" />
              <line x1="102" y1="42" x2="110" y2="56" stroke="#FCD34D" strokeWidth="2" />
              <circle cx="110" cy="58" r="4" fill="#FCD34D" />
            </svg>
          </div>

          {/* Texto */}
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold">Formulário de inscrição disponível</p>
            <p className="text-sm text-muted-foreground">Partilhe o link acima com os candidatos para iniciarem a inscrição</p>
          </div>

        </CardContent>
      </Card>

    </div>
  );
};

export default InscricaoEpocaEspecial;