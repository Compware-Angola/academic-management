import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  useQueryCadeirasEpocaEspecial,
  useQueryCadeirasRecuros,
} from "@/hooks/students/use-recursos-UC";
import { ServicoItem } from "./servicos.types";
import { Cadeira } from "@/services/students/fetch-recurso-uc.service";

interface ModalCadeirasRecursoProps {
  open: boolean;
  servico: ServicoItem | null;
  onOpenChange: (open: boolean) => void;
  anoLetivo: number;
  matricula: number;
  onConfirm?: (idsSelecionados: Cadeira[]) => void;
}

export function ModalCadeirasRecurso({
  open,
  servico,
  onOpenChange,
  anoLetivo,
  matricula,
  onConfirm,
}: ModalCadeirasRecursoProps) {
  const [selecionadas, setSelecionadas] = useState<Set<string | number>>(
    new Set(),
  );
  const isRecurso = servico?.sigla == "IaEdRurso";

  const recursoQuery = useQueryCadeirasRecuros(
    { anoLetivo, matricula },
    { enabled: isRecurso },
  );

  const epocaEspecialQuery = useQueryCadeirasEpocaEspecial(
    { anoLetivo, matricula },
    { enabled: !isRecurso },
  );

  const {
    data: cadeiras = [],
    isLoading,
    isError,
  } = isRecurso ? recursoQuery : epocaEspecialQuery;
  const totalSelecionadas = selecionadas.size;
  const todasSelecionadas =
    cadeiras.length > 0 && selecionadas.size === cadeiras.length;

  useEffect(() => {
    if (open) {
      setSelecionadas(
        new Set(
          (servico?.cadeirasRecursoIds ?? []).map((c) => c.codigoGradeAluno),
        ),
      );
    }
  }, [open, servico?.codigo]);

  const handleToggleCadeira = (codigoGradeAluno: string | number) => {
    setSelecionadas((prev) => {
      const novo = new Set(prev);
      if (novo.has(codigoGradeAluno)) {
        novo.delete(codigoGradeAluno);
      } else {
        novo.add(codigoGradeAluno);
      }
      return novo;
    });
  };

  const handleToggleTodas = () => {
    if (todasSelecionadas) {
      setSelecionadas(new Set());
    } else {
      setSelecionadas(new Set(cadeiras.map((c) => c.codigoGradeAluno)));
    }
  };

  const handleConfirmar = () => {
    const cadeirasSelecionadas = cadeiras.filter((c) =>
      selecionadas.has(c.codigoGradeAluno),
    );
    onConfirm?.(cadeirasSelecionadas);
    handleFechar();
  };

  const handleFechar = () => {
    setSelecionadas(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-w-3xl sm:w-full">
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle>Seleciona a(s) Cadeira(s)</DialogTitle>
        </DialogHeader>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={todasSelecionadas}
                    onCheckedChange={handleToggleTodas}
                    disabled={isLoading || cadeiras.length === 0}
                  />
                </TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Ano</TableHead>
                {/* <TableHead>Semestre</TableHead>
                <TableHead>Resultado</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-red-600 py-6"
                  >
                    Erro ao carregar cadeiras de recurso.
                  </TableCell>
                </TableRow>
              ) : cadeiras.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-6"
                  >
                    Nenhuma cadeira encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                cadeiras.map((cadeira) => (
                  <TableRow key={cadeira.codigoGradeAluno}>
                    <TableCell>
                      <Checkbox
                        checked={selecionadas.has(cadeira.codigoGradeAluno)}
                        onCheckedChange={() =>
                          handleToggleCadeira(cadeira.codigoGradeAluno)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {cadeira.disciplina}
                    </TableCell>
                    <TableCell>{cadeira.ano}</TableCell>
                    {/* <TableCell>{cadeira.semestre}</TableCell>
                    <TableCell>{cadeira.resultado}</TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleFechar}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={totalSelecionadas === 0 || isLoading}
          >
            Adicionar {totalSelecionadas > 0 && `(${totalSelecionadas})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
