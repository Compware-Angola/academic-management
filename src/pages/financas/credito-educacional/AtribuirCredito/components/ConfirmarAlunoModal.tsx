import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Aluno = {
  nome_completo: string;
  bi: string;
  curso: string;
  periodo: string;
  ja_bolsista?: boolean;
  bolsa?: string | null;
};

interface ConfirmarAlunoModalProps {
  open: boolean;
  aluno: Aluno | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmarAlunoModal({
  open,
  aluno,
  onClose,
  onConfirm,
}: ConfirmarAlunoModalProps) {
  if (!aluno) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Dados do Estudante</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Verifique os dados antes de continuar
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="font-medium">Nome</span>
          <span>{aluno.nome_completo}</span>

          <span className="font-medium">BI</span>
          <span>{aluno.bi}</span>

          <span className="font-medium">Curso</span>
          <span>{aluno.curso}</span>

          <span className="font-medium">Período</span>
          <span>{aluno.periodo}</span>

          <span className="font-medium">Bolseiro</span>
          <span>{aluno.ja_bolsista ? "Sim" : "Não"}</span>

          {aluno.ja_bolsista && aluno.bolsa && (
            <>
              <span className="font-medium">Bolsa</span>
              <span>{aluno.bolsa}</span>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={aluno.ja_bolsista} onClick={onConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
