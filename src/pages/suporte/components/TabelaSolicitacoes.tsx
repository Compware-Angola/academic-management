// components/suporte/TabelaSolicitacoes.tsx
import { Eye, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Solicitacao {
    contactos_id: number;
    estudante: string;
    bilhete_identidade: string;
    codigo_matricula: string;
    descricao_tipo_suporte: string;
    assunto: string;
    status_mensagem: number;
    data_mensagem: string;
    file_name1?: string;
    file_name2?: string;
    file_name3?: string;
}

interface TabelaSolicitacoesProps {
    solicitacoes: Solicitacao[];
    onVerDetalhes: (id: number) => void;
    onVerAnexos: (solicitacao: Solicitacao) => void;
    BadgeStatus: React.ComponentType<{ status: number }>;
}

export function TabelaSolicitacoes({
    solicitacoes,
    onVerDetalhes,
    onVerAnexos,
    BadgeStatus,
}: TabelaSolicitacoesProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Estudante</TableHead>
                        <TableHead>Bilhete de Identidade</TableHead>
                        <TableHead>Matricula</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Assunto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Anexos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {solicitacoes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                                Nenhuma solicitação encontrada
                            </TableCell>
                        </TableRow>
                    ) : (
                        solicitacoes.map((sol) => (
                            <TableRow key={sol.contactos_id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{sol.contactos_id}</TableCell>
                                <TableCell>{sol.estudante}</TableCell>
                                <TableCell>{sol.bilhete_identidade}</TableCell>
                                <TableCell>{sol.codigo_matricula}</TableCell>
                                <TableCell className="max-w-[180px] truncate">{sol.descricao_tipo_suporte}</TableCell>
                                <TableCell className="max-w-[220px] truncate">{sol.assunto}</TableCell>
                                <TableCell>
                                    <BadgeStatus status={sol.status_mensagem} />
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{sol.data_mensagem}</TableCell>
                                <TableCell>
                                    {sol.file_name1 || sol.file_name2 || sol.file_name3 ? (
                                        <Button variant="ghost" size="sm" onClick={() => onVerAnexos(sol)}>
                                            <Paperclip className="mr-1 h-4 w-4" />
                                            {[sol.file_name1, sol.file_name2, sol.file_name3].filter(Boolean).length}
                                        </Button>
                                    ) : (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => onVerDetalhes(sol.contactos_id)}>
                                        <Eye className="mr-1 h-4 w-4" />
                                        Ver / Responder
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}