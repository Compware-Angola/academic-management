import { useState } from "react";
import { AlertCircle, Ban, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutationInactivateRegistration } from "@/hooks/students/use-mutation-inactivate-registration";
import { useStudentDetail } from "@/hooks/students/use-query-students";

type InativarMatriculaProps = {
  codigoMatricula: number;
  value?: string;
};

export function InativarMatricula({
  codigoMatricula,
  value = "inativar-matricula",
}: InativarMatriculaProps) {
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [motivo, setMotivo] = useState("");

  const { data: student, isFetching } = useStudentDetail(codigoMatricula);
  const inactivateRegistration = useMutationInactivateRegistration();

  const estadoMatricula = student?.estado?.trim().toLowerCase();
  const isInativa =
    estadoMatricula === "inactivo" || estadoMatricula === "inativo";
  const isDiplomado =
    estadoMatricula === "diplomado" || estadoMatricula === "concluido";
  const isPending = inactivateRegistration.isPending;

  async function handleInativar() {
    await inactivateRegistration.mutateAsync({
      codigoMatricula,
      motivo: motivo.trim() || undefined,
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
              <Ban className="h-5 w-5" />
              Inativar Matrícula
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4">
              <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
              <div className="space-y-1">
                <p className="font-medium">Atenção antes de inativar</p>
                <p className="text-sm text-muted-foreground">
                  Esta ação irá alterar o estado da matrícula para{" "}
                  <span className="font-medium">Inactivo</span>. Depois da
                  confirmação, o perfil do estudante será atualizado para
                  refletir o novo estado.
                </p>
              </div>
            </div>

            {isInativa && (
              <p className="text-sm text-muted-foreground">
                Esta matrícula já se encontra inativa.
              </p>
            )}

            {isDiplomado && (
              <p className="text-sm text-muted-foreground">
                Matrículas diplomadas não podem ser inativadas por este fluxo.
              </p>
            )}

            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => setConfirmacaoAberta(true)}
                disabled={isFetching || isPending || isInativa || isDiplomado}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>A inativar...</span>
                  </>
                ) : (
                  "Inativar Matrícula"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inativar matrícula do estudante</DialogTitle>
            <DialogDescription>
              Esta operação irá alterar o estado da matrícula para Inactivo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="motivoInativarMatricula">
              Motivo da inativação
            </Label>
            <Textarea
              id="motivoInativarMatricula"
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              placeholder="Descreva o motivo da inativação"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              O motivo será enviado junto com a operação.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmacaoAberta(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleInativar}
              disabled={isPending || !motivo.trim()}
            >
              {isPending ? "A inativar..." : "Confirmar inativação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
