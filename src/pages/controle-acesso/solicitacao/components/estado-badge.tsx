import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export type EstadoOption = {
  value: string;
  label: string;
  variant: BadgeVariant;
};

export const ESTADOS: EstadoOption[] = [
  {
    value: "solicitacao encaminhada",
    label: "Solicitação Encaminhada",
    variant: "outline",
  },

  {
    value: "Solicitações Respondidas",
    label: "Solicitações Respondidas",
    variant: "default",
  }
];

const ESTADO_MAP = Object.fromEntries(
  ESTADOS.map((e) => [e.value, e])
);

/* ---------------- NORMALIZAÇÃO ---------------- */

export function normalizeEstado(value?: string): string {
  if (!value) return "solicitacao_encaminhada";

  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

/* ---------------- BADGE ---------------- */

export function getEstadoBadge(estado?: string) {
  const key = normalizeEstado(estado);
  const config = ESTADO_MAP[key];

  if (!config) {
    return <Badge variant="outline">{estado ?? "Estado desconhecido"}</Badge>;
  }

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
