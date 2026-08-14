/**
 * Camada de serviço das Configurações do Sistema.
 *
 * Actualmente usa mocks persistidos em localStorage.
 * Para ligar à API real basta substituir o corpo de cada função por um fetch,
 * mantendo as mesmas assinaturas e tipos.
 */

export interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    color: string;
    titleSize: number;
    subtitleSize: number;
    lineHeight: number;
}

export interface Signature {
    id: string;
    userId: string;
    name: string;
    email?: string;
    position: string;
    department: string;
    imageUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type SignatureInput = Omit<Signature, "id" | "createdAt" | "updatedAt">;

export interface DocumentType {
    id: string;
    label: string;
}

export interface DocumentSignatureMap {
    [documentTypeId: string]: string | null;
}

export interface SystemUser {
    id: string;
    name: string;
    email: string;
    position?: string;
    department?: string;
}

export const FONT_FAMILIES = [
    "Arial",
    "Times New Roman",
    "Roboto",
    "Open Sans",
    "Calibri",
    "Georgia",
];

export const FONT_WEIGHTS = [
    { value: "300", label: "Leve (300)" },
    { value: "400", label: "Normal (400)" },
    { value: "500", label: "Médio (500)" },
    { value: "600", label: "Semi-negrito (600)" },
    { value: "700", label: "Negrito (700)" },
];

export const DEFAULT_FONT_SETTINGS: FontSettings = {
    fontFamily: "Arial",
    fontSize: 12,
    fontWeight: "400",
    color: "#1f2937",
    titleSize: 20,
    subtitleSize: 15,
    lineHeight: 1.5,
};

export const DOCUMENT_TYPES: DocumentType[] = [
    { id: "declaracao", label: "Declaração" },
    { id: "certificado", label: "Certificado" },
    { id: "recibo", label: "Recibo" },
    { id: "contrato", label: "Contrato" },
    { id: "factura", label: "Factura" },
];

export const SIGNATURE_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
export const SIGNATURE_MAX_SIZE = 2 * 1024 * 1024; // 2MB

const STORAGE_KEYS = {
    font: "cfg.documentos.fonte",
    signatures: "cfg.documentos.assinaturas",
    docSignatures: "cfg.documentos.assinaturasPorDocumento",
};

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function read<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function write<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

const PLACEHOLDER_SIGNATURE =
    "data:image/svg+xml;base64," +
    btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><path d="M10 60 C 50 10, 80 70, 120 40 S 200 10, 230 45" fill="none" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/></svg>`,
    );

const SEED_SIGNATURES: Signature[] = [
    {
        id: "sig-1",
        userId: "usr-1",
        name: "João Manuel",
        email: "joao.manuel@uma.co.ao",
        position: "Director Geral",
        department: "Administração",
        imageUrl: PLACEHOLDER_SIGNATURE,
        isActive: true,
        createdAt: "2026-01-12T09:00:00.000Z",
        updatedAt: "2026-01-12T09:00:00.000Z",
    },
    {
        id: "sig-2",
        userId: "usr-2",
        name: "Maria José",
        email: "maria.jose@uma.co.ao",
        position: "Directora Financeira",
        department: "Financeiro",
        imageUrl: PLACEHOLDER_SIGNATURE,
        isActive: true,
        createdAt: "2026-02-03T09:00:00.000Z",
        updatedAt: "2026-02-03T09:00:00.000Z",
    },
    {
        id: "sig-3",
        userId: "usr-3",
        name: "Pedro Alberto",
        email: "pedro.alberto@uma.co.ao",
        position: "Director Académico",
        department: "Académico",
        imageUrl: PLACEHOLDER_SIGNATURE,
        isActive: false,
        createdAt: "2026-03-20T09:00:00.000Z",
        updatedAt: "2026-04-02T09:00:00.000Z",
    },
];

const SYSTEM_USERS: SystemUser[] = [
    { id: "usr-1", name: "João Manuel", email: "joao.manuel@uma.co.ao", position: "Director Geral", department: "Administração" },
    { id: "usr-2", name: "Maria José", email: "maria.jose@uma.co.ao", position: "Directora Financeira", department: "Financeiro" },
    { id: "usr-3", name: "Pedro Alberto", email: "pedro.alberto@uma.co.ao", position: "Director Académico", department: "Académico" },
    { id: "usr-4", name: "Ana Cristina", email: "ana.cristina@uma.co.ao", position: "Secretária Geral", department: "Secretaria" },
    { id: "usr-5", name: "Carlos Domingos", email: "carlos.domingos@uma.co.ao", position: "Tesoureiro", department: "Financeiro" },
];

/* ------------------------------- Configurações ------------------------------ */

export async function fetchFontSettings(): Promise<FontSettings> {
    await delay();
    return read<FontSettings>(STORAGE_KEYS.font, DEFAULT_FONT_SETTINGS);
}

export async function updateFontSettings(settings: FontSettings): Promise<FontSettings> {
    await delay();
    write(STORAGE_KEYS.font, settings);
    return settings;
}

/* -------------------------------- Assinaturas ------------------------------- */

export async function fetchSignatures(): Promise<Signature[]> {
    await delay();
    return read<Signature[]>(STORAGE_KEYS.signatures, SEED_SIGNATURES);
}

export async function createSignature(input: SignatureInput): Promise<Signature> {
    await delay();
    const list = read<Signature[]>(STORAGE_KEYS.signatures, SEED_SIGNATURES);
    const now = new Date().toISOString();
    const created: Signature = { ...input, id: `sig-${Date.now()}`, createdAt: now, updatedAt: now };
    write(STORAGE_KEYS.signatures, [...list, created]);
    return created;
}

export async function updateSignature(id: string, input: Partial<SignatureInput>): Promise<Signature> {
    await delay();
    const list = read<Signature[]>(STORAGE_KEYS.signatures, SEED_SIGNATURES);
    const next = list.map((s) =>
        s.id === id ? { ...s, ...input, updatedAt: new Date().toISOString() } : s,
    );
    write(STORAGE_KEYS.signatures, next);
    return next.find((s) => s.id === id)!;
}

export async function toggleSignatureActive(id: string, isActive: boolean): Promise<Signature> {
    return updateSignature(id, { isActive });
}

export async function deleteSignature(id: string): Promise<void> {
    await delay();
    const list = read<Signature[]>(STORAGE_KEYS.signatures, SEED_SIGNATURES);
    write(
        STORAGE_KEYS.signatures,
        list.filter((s) => s.id !== id),
    );
    const map = read<DocumentSignatureMap>(STORAGE_KEYS.docSignatures, {});
    Object.keys(map).forEach((k) => {
        if (map[k] === id) map[k] = null;
    });
    write(STORAGE_KEYS.docSignatures, map);
}

/** Upload da imagem. No mock devolve um data URL; na API real devolverá a URL do ficheiro. */
export async function uploadSignatureImage(file: File): Promise<string> {
    if (!SIGNATURE_MIME_TYPES.includes(file.type)) {
        throw new Error("Formato inválido. Utilize PNG, JPG ou SVG.");
    }
    if (file.size > SIGNATURE_MAX_SIZE) {
        throw new Error("A imagem não pode exceder 2MB.");
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Não foi possível ler o ficheiro."));
        reader.readAsDataURL(file);
    });
}

/* --------------------- Assinaturas por tipo de documento -------------------- */

export async function fetchDocumentSignatures(): Promise<DocumentSignatureMap> {
    await delay();
    return read<DocumentSignatureMap>(STORAGE_KEYS.docSignatures, {
        declaracao: "sig-1",
        certificado: "sig-3",
        recibo: "sig-2",
        contrato: "sig-1",
        factura: null,
    });
}

export async function updateDocumentSignatures(map: DocumentSignatureMap): Promise<DocumentSignatureMap> {
    await delay();
    write(STORAGE_KEYS.docSignatures, map);
    return map;
}

/* --------------------------------- Users ----------------------------------- */

export async function fetchSystemUsers(): Promise<SystemUser[]> {
    await delay(200);
    return SYSTEM_USERS;
}