import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, GraduationCap } from "lucide-react";
import { useMutationDiplomarAluno } from "@/hooks/students/use-mutation-diplomar-aluno";
import { useMutationDesdiplomarAluno } from "@/hooks/students/use-mutation-desdiplomar-aluno";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { Input } from "@/components/ui/input";

type DiplomarProps = {
  value: string;
  codigoMatricula: number;
};
const today = new Date();

export function Diplomar({ value, codigoMatricula }: DiplomarProps) {
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [dataActa, setDataActa] = useState<Date | undefined>(undefined);

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [motivo, setMotivo] = useState("");

  const { mutate: diplomarAluno, isPending } = useMutationDiplomarAluno();
  const { mutateAsync: desdiplomarAluno, isPending: isDesdiplomando } =
    useMutationDesdiplomarAluno();
  const { data: student, isFetching } = useStudentDetail(codigoMatricula);

  const isDiplomado = student?.estado?.toLowerCase() === "diplomado";

  function handleDiplomar() {
    diplomarAluno({
      codigoMatricula,
      imprimeCartaConclusao: false,
    });
  }

  async function handleDesdiplomar() {
    await desdiplomarAluno({
      codigoMatricula,
      motivo: motivo.trim(),
    });

    setMotivo("");
    setConfirmacaoAberta(false);
  }

  return (
    <TabsContent value={value} className="mt-0">
      <div className="space-y-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/40 px-4 py-3 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Diplomar Estudante
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertCircle className="h-5 w-5 mt-0.5 text-amber-500" />
              <div className="space-y-1">
                <p className="font-medium">
                  {isDiplomado
                    ? "Atenção antes de anular diploma"
                    : "Atenção antes de diplomar"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isDiplomado ? (
                    <>
                      Esta ação irá anular a diplomação do estudante, remover o
                      registo de conclusão do curso e voltar o estado da
                      matrícula para <span className="font-medium">activo</span>
                      .
                    </>
                  ) : (
                    <>
                      Esta ação irá alterar o estado da matrícula para{" "}
                      <span className="font-medium">diplomado</span>, registar a
                      conclusão do curso e criar o log da operação.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-between items-end">
              {!isDiplomado ? (
                <div>
                  <label className="text-sm font-medium">Data da Acta</label>
                  <Input
                    type="date"
                    value={formatDateForInput(dataActa)}
                    onChange={(e) => {
                      setDataActa(
                        e.target.value
                          ? new Date(e.target.value + "T00:00:00")
                          : undefined,
                      );
                    }}
                  />
                </div>
              ) : (
                <div />
              )}

              <div>
                {isDiplomado ? (
                  <Button
                    variant="destructive"
                    onClick={() => setConfirmacaoAberta(true)}
                    disabled={isFetching || isDesdiplomando}
                  >
                    {isDesdiplomando ? "Anulando..." : "Anular Diploma"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleDiplomar}
                    disabled={isPending || isFetching || !dataActa}
                  >
                    {isPending ? "Diplomando..." : "Diplomar Estudante"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anular diploma do estudante</DialogTitle>
            <DialogDescription>
              Esta operação irá remover o registo de conclusão do curso e voltar
              o estado da matrícula para activo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="motivoDesdiplomar">Motivo da anulação</Label>
            <Textarea
              id="motivoDesdiplomar"
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              placeholder="Descreva o motivo da anulação"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              O motivo será registado no log da operação.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmacaoAberta(false)}
              disabled={isDesdiplomando}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDesdiplomar}
              disabled={isDesdiplomando || !motivo.trim()}
            >
              {isDesdiplomando ? "Anulando..." : "Confirmar anulação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
