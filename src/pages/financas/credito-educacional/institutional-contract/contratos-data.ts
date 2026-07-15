

export const fmt = (v: number) =>
    new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(v);

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-PT");

export type Status = "expirado" | "expira_breve" | "activo";

export function getStatus(dataFim: string): { status: Status; diasRestantes: number } {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const fim = new Date(dataFim);
    const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { status: "expirado", diasRestantes: diff };
    if (diff <= 30) return { status: "expira_breve", diasRestantes: diff };
    return { status: "activo", diasRestantes: diff };
}