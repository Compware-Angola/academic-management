import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertCircle, GraduationCap } from "lucide-react";
import { useMutationDiplomarAluno } from "@/hooks/students/use-mutation-diplomar-aluno";

type DiplomarProps = {
  value: string;
  codigoMatricula: number;
};

export function Diplomar({ value, codigoMatricula }: DiplomarProps) {
  const [dataConclusao, setDataConclusao] = useState("");
  const [imprimeCartaConclusao, setImprimeCartaConclusao] = useState(false);

  const { mutate: diplomarAluno, isPending } = useMutationDiplomarAluno();

  function handleDiplomar() {
    diplomarAluno({
      codigoMatricula,
      dataConclusao: dataConclusao || undefined,
      imprimeCartaConclusao,
    });
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
                <p className="font-medium">Atenção antes de diplomar</p>
                <p className="text-sm text-muted-foreground">
                  Esta ação irá alterar o estado da matrícula para{" "}
                  <span className="font-medium">diplomado</span>, registar a
                  conclusão do curso e criar o log da operação.
                </p>
              </div>
            </div>

            <div className="grid gap-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="dataConclusao">Data de conclusão</Label>
                <Input
                  id="dataConclusao"
                  type="date"
                  value={dataConclusao}
                  onChange={(e) => setDataConclusao(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Se não informar, o sistema usará a data atual.
                </p>
              </div>

                {
                  /*<div className="flex items-center space-x-2">
                      <Checkbox
                        id="imprimeCartaConclusao"
                        checked={imprimeCartaConclusao}
                        onCheckedChange={(checked) =>
                          setImprimeCartaConclusao(Boolean(checked))
                        }
                      />
                      <Label htmlFor="imprimeCartaConclusao">
                        Imprimir carta de conclusão
                      </Label>
                </div>*/
                }
              
            </div>

            <div className="flex justify-end">
              <Button onClick={handleDiplomar} disabled={isPending}>
                {isPending ? "Diplomando..." : "Diplomar Estudante"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}