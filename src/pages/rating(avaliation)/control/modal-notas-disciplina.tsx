import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { format } from "date-fns";
import { useQueryNotasProva } from "@/hooks/avaliacao/use-query-notas-prova";

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
  const [search, setSearch] = useState("");

  const { data = [], isLoading } = useQueryNotasProva({
    turmaOuHorarioId,
    tipoAvaliacaoId,
    anoLectivoId,
  });

  // 🔍 Filtragem por nome ou nº do aluno
  const alunosFiltrados = useMemo(() => {
    const termo = search.toLowerCase().trim();

    if (!termo) return data;

    return data.filter(
      (aluno) =>
        aluno.alunoNome.toLowerCase().includes(termo) ||
        String(aluno.numeroAluno).includes(termo),
    );
  }, [search, data]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl!">
        <DialogHeader>
          <DialogTitle>
            Notas lançadas — {alunosFiltrados.length} aluno(s)
          </DialogTitle>
        </DialogHeader>

        {/* 🔎 Campo de pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por número ou nome do aluno..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="space-y-3 mt-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : alunosFiltrados.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">
            Nenhum aluno encontrado com esse filtro.
          </p>
        ) : (
          <div className="max-h-120 overflow-y-auto rounded-md border mt-4">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                  <TableHead className="text-center w-15">Nº Matricula</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center w-20">Nota</TableHead>
                  <TableHead className="text-center w-36">
                    Data Lançamento
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {alunosFiltrados.map((aluno, index) => (
                  <TableRow
                    key={aluno.numeroAluno || 'NA-' + index}
                    className={index % 2 === 0 ? "bg-muted/40" : ""}
                  >
                    <TableCell>{aluno.matricula}</TableCell>

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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
