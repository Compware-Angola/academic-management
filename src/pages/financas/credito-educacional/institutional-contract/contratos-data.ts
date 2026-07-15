export interface Instituicao {
    id: number; nome: string; sigla: string; nif: string;
    contacto: string; email: string; endereco: string; tipo: string;
}
export interface Estudante { id: number; nome: string; matricula: string; curso: string; }
export interface Bolsa { id: number; estudanteId: number; tipo: string; valor: number; }
export interface Contrato {
    id: number; instituicaoId: number; codigo: string;
    dataInicio: string; dataFim: string; bolsas: Bolsa[];
}

export const INSTITUICOES: Instituicao[] = [
    {
        id: 1, nome: "INAGBE", sigla: "INAGBE", nif: "5417002980", tipo: "Pública",
        contacto: "+244 222 123 456", email: "geral@inagbe.gov.ao", endereco: "Av. 4 de Fevereiro, Luanda"
    },
    {
        id: 2, nome: "Fundação Sonangol", sigla: "FSNG", nif: "5401234567", tipo: "Privada",
        contacto: "+244 222 789 012", email: "info@fsonangol.ao", endereco: "Rua Rainha Ginga, Luanda"
    },
    {
        id: 3, nome: "Ministério da Educação", sigla: "MED", nif: "5410000001", tipo: "Pública",
        contacto: "+244 222 555 111", email: "gab@med.gov.ao", endereco: "Largo António Jacinto, Luanda"
    },
];

export const ESTUDANTES: Estudante[] = [
    { id: 1, nome: "Ana Cristina Neto", matricula: "20231045", curso: "Engenharia Informática" },
    { id: 2, nome: "Bruno Kianda", matricula: "20231089", curso: "Direito" },
    { id: 3, nome: "Cátia Mendes", matricula: "20231120", curso: "Medicina" },
    { id: 4, nome: "Domingos Paulo", matricula: "20231156", curso: "Economia" },
    { id: 5, nome: "Elsa Fortunato", matricula: "20231201", curso: "Arquitectura" },
    { id: 6, nome: "Felisberto Sango", matricula: "20231245", curso: "Gestão" },
];

export const TIPOS_BOLSA = ["Integral", "Parcial 75%", "Parcial 50%", "Manutenção"];

export const INITIAL_CONTRATOS: Contrato[] = [
    {
        id: 1, instituicaoId: 1, codigo: "CT-2024-001", dataInicio: "2024-01-15", dataFim: "2025-01-14",
        bolsas: [
            { id: 11, estudanteId: 1, tipo: "Integral", valor: 350000 },
            { id: 12, estudanteId: 2, tipo: "Parcial 75%", valor: 260000 },
        ]
    },
    {
        id: 2, instituicaoId: 1, codigo: "CT-2025-014", dataInicio: "2025-02-01", dataFim: "2026-01-31",
        bolsas: [
            { id: 21, estudanteId: 3, tipo: "Integral", valor: 380000 },
        ]
    },
    {
        id: 3, instituicaoId: 2, codigo: "CT-2023-007", dataInicio: "2023-03-10", dataFim: "2024-03-09",
        bolsas: [{ id: 31, estudanteId: 4, tipo: "Parcial 50%", valor: 180000 }]
    },
    {
        id: 4, instituicaoId: 2, codigo: "CT-2025-021", dataInicio: "2025-06-01", dataFim: "2026-08-15",
        bolsas: [
            { id: 41, estudanteId: 5, tipo: "Integral", valor: 400000 },
            { id: 42, estudanteId: 6, tipo: "Manutenção", valor: 90000 },
        ]
    },
    {
        id: 5, instituicaoId: 3, codigo: "CT-2024-033", dataInicio: "2024-09-01", dataFim: "2026-02-20",
        bolsas: [{ id: 51, estudanteId: 1, tipo: "Integral", valor: 350000 }]
    },
];

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