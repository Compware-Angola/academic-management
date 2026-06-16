import { Building, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PagamentoBolsa } from "@/services/financas/bolsa/pagamento-bolsa.service";
import { useListarPagamentoBolsaEstudantes } from "@/hooks/financas/bolsa/pagamento-bolsa";

export interface ModalDetalhePagamentoBolsaProps {
    openDetalhe: PagamentoBolsa | null;
    setOpenDetalhe: (open: PagamentoBolsa | null) => void;
    selected: PagamentoBolsa | null;
}

export const ModalDetalhePagamentoBolsa = ({
    openDetalhe,
    setOpenDetalhe,
    selected,
}: ModalDetalhePagamentoBolsaProps) => {
    const { isLoading, isError, error, data } =
        useListarPagamentoBolsaEstudantes(
            {
                codigoBolsa: selected?.codigo_bolsa ?? 0,
                codigoInstituicao: selected?.codigo_instituicao,
            },
            {
                enabled: !!selected,
            }
        );

    const estudantes = data?.data ?? [];



    return (
        <Dialog
            open={!!openDetalhe}
            onOpenChange={(o) => !o && setOpenDetalhe(null)}
        >
            <DialogContent className="!max-w-[1400px] w-[95vw] max-h-[90vh] overflow-y-auto">
                {selected && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                {selected.bolsa}
                            </DialogTitle>

                            <DialogDescription>
                                DETALHES DE PAGAMENTO DA BOLSA
                            </DialogDescription>
                        </DialogHeader>

                        {isLoading && (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        )}

                        {isError && (
                            <div className="text-red-500 py-4">
                                Erro ao carregar dados:{" "}
                                {error instanceof Error
                                    ? error.message
                                    : "Erro desconhecido"}
                            </div>
                        )}

                        {!isLoading && !isError && (
                            <>
                                {/* Resumo */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div className="border rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Bolsa
                                        </p>
                                        <p className="font-semibold">
                                            {data?.bolsa.designacao}
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Instituição
                                        </p>
                                        <p className="font-semibold">
                                            {data?.bolsa.instituicao || "N/A"}
                                        </p>
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Total Estudantes
                                        </p>
                                        <p className="font-semibold">
                                            {data?.meta.total ?? 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Tabela */}
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold mb-3">
                                        Estudantes Bolseiros
                                    </h4>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>BI</TableHead>
                                                <TableHead>Curso</TableHead>
                                                <TableHead>Ano Lectivo</TableHead>
                                                <TableHead>Semestre</TableHead>

                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {estudantes.length > 0 ? (
                                                estudantes.map((estudante) => (
                                                    <TableRow
                                                        key={
                                                            estudante.codigo_bolseiro
                                                        }
                                                    >
                                                        <TableCell>
                                                            {
                                                                estudante.codigo_bolseiro
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {estudante.nome}
                                                        </TableCell>
                                                        <TableCell>
                                                            {estudante.bi}
                                                        </TableCell>
                                                        <TableCell>
                                                            {estudante.curso}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                estudante.ano_lectivo
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {String(estudante.semestre) === "1"
                                                                ? "1º Semestre"
                                                                : String(estudante.semestre) === "2"
                                                                    ? "2º Semestre"
                                                                    : "Anual"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="text-center py-6"
                                                    >
                                                        Nenhum estudante encontrado
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>


                                </div>
                            </>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};