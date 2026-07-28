import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CANDIDATURAS, ServicoUI } from "../types/types";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function EstadoBadge({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant="outline"
      className={`border-0 text-[11px] ${
        ok
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
      }`}
    >
      {children}
    </Badge>
  );
}

interface ServicoCardProps {
  servico: ServicoUI;
  selecionado: boolean;
  onToggle: () => void;
  onPreco: (v: number) => void;
  onDisponibilizar: (v: boolean) => void;
}

export function ServicoCard({
  servico,
  selecionado,
  onToggle,
  onPreco,
  onDisponibilizar,
}: ServicoCardProps) {
  const candidatura = CANDIDATURAS.find(
    (c) => c.id === servico.tipoCandidatura,
  );

  return (
    <div
      className={`group rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/40 ${
        selecionado
          ? "border-primary/60 ring-1 ring-primary/20 bg-primary/[0.03]"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selecionado}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground truncate">
              {servico.descricao}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {servico.codigo}
            </span>
            <Badge variant="secondary" className="text-[11px]">
              {servico.grupo === "MENSALIDADE"
                ? "Mensalidade"
                : "Outro Serviço"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Chip>Sigla: {servico.sigla}</Chip>
            <EstadoBadge ok={servico.estado === "ACTIVO"}>
              {servico.estado}
            </EstadoBadge>
            <Chip>Polo: {servico.polo_designacao}</Chip>
            {candidatura && <Chip>{candidatura.label}</Chip>}
            <Chip>Ano: {servico.anolectivo}</Chip>
            {/* ajustar mapeamento de estadoSolicitacao conforme a regra real do backend */}
            <EstadoBadge ok={servico.estadoSolicitacao === 1}>
              {servico.estadoSolicitacao === 1 ? "DISPONÍVEL" : "SUSPENSO"}
            </EstadoBadge>
          </div>

          <div className="flex flex-wrap items-end gap-6 pt-1">
            <div className="w-44">
              <Label className="text-xs text-muted-foreground">Preço</Label>
              <Input
                type="text"
                inputMode="numeric"
                value={String(servico.preco)}
                onChange={(e) => {
                  const digitos = e.target.value.replace(/[^\d]/g, "");
                  onPreco(digitos === "" ? 0 : Number(digitos));
                }}
                className="mt-1 h-9"
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={servico.disponibilizarAluno}
                onCheckedChange={onDisponibilizar}
              />
              <span className="text-sm text-muted-foreground">
                Disponibilizar ao Aluno
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
