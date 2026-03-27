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
import { useQueryDocenteAlunos } from "@/hooks/defesa-tfc/docente-aluonos";
import { DocenteAlunoResponse } from "@/services/defesa-tfc/docente-aluno.service";
type OrientandoModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  docenteId: number;
  anoLectivoId: number;
};
export default function OrientandoModal(props: OrientandoModalProps) {
  const { open, setOpen, docenteId, anoLectivoId } = props;
  const { data: docenteAlunos, isLoading } = useQueryDocenteAlunos({
    docenteId,
    anoLectivoId,
  });
  const alunos = docenteAlunos?.alunos || [];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl! w-full">
        <DialogHeader>
          <DialogTitle>Orientando Modal</DialogTitle>
        </DialogHeader>
        <div className="over">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tema</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Data de Atribuição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : alunos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum aluno encontrado
                  </TableCell>
                </TableRow>
              ) : (
                alunos.map((aluno) => (
                  <TableRow key={aluno.matricula}>
                    <TableCell>{aluno.nome_aluno}</TableCell>
                    <TableCell>{aluno.curso}</TableCell>
                    <TableCell>{aluno.tema}</TableCell>
                    <TableCell>{aluno.matricula}</TableCell>
                    <TableCell>{aluno.data_atribuicao}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
