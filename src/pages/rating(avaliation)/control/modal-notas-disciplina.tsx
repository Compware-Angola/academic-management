import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import { format } from "date-fns";
import { useQueryNotasProva } from "@/hooks/discplina/use-query-notas-prova";

type Props = {
  open: boolean;
  onClose: () => void;

  turmaOuHorarioId?: number;
  tipoAvaliacaoId?: number;
  anoLectivoId?: number;
};

export function ModalNotasDisciplina({
  open,
  onClose,
  turmaOuHorarioId,
  tipoAvaliacaoId,
  anoLectivoId,
}: Props) {
  const { data = [], isLoading } = useQueryNotasProva({
    turmaOuHorarioId,
    tipoAvaliacaoId,
    anoLectivoId,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Notas lançadas — alunos</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead className="text-center">Nota</TableHead>
                <TableHead className="text-center">Data Lançamento</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((aluno) => (
                <TableRow key={aluno.alunoId}>
                  <TableCell>{aluno.numeroAluno}</TableCell>

                  <TableCell className="font-medium">
                    {aluno.alunoNome}
                  </TableCell>

                  <TableCell className="text-center font-semibold">
                    {aluno.nota}
                  </TableCell>

                  <TableCell className="text-center">
                    {format(new Date(aluno.dataLancamento), "dd/MM/yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
