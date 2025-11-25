import { axiosApexGa } from "@/lib/axios-apex-ga";
export type User = {
    codigo: number;
    nome: string;
    telefone: string;
    email: string;
};

export type UsersResponse = {
    utilizadores: User[];
};
/**
 * Busca a lista de utilizadores do endpoint UMA
 * @returns Array de utilizadores
 */
export async function fetchUsers(): Promise<User[]> {
    try {
        const { data } = await axiosApexGa.get<UsersResponse>(
            "/uma/utilizadoreslist"
        );


        return data.utilizadores ?? [];
    } catch (error) {
        console.error("Erro ao carregar utilizadores:", error);
        return []; // ou lança o erro se preferires que o componente trate
    }
}