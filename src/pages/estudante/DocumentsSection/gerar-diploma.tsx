import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GraduationCap, CalendarDays } from "lucide-react";
import { DiplomaPreview } from "./DiplomaPreview";
import { useMutationGerarDiploma } from "@/hooks/students/use-mutation-gerar-diploma";
import GerarDiplomaPdf from "@/components/views/docs-students/GerarDiplomaPdf";

type GerarDiplomaProps = {
  value: string;
  codigoMatricula: number;
};

export function GerarDiploma({
  value,
  codigoMatricula,
}: GerarDiplomaProps) {
  const [segundaViaDiploma, setSegundaViaDiploma] = useState(false);
  const [dataEmissao, setDataEmissao] = useState(
    new Date().toISOString().split("T")[0],
  );

  const {
    mutate: handleGerarDiploma,
    data,
    isPending,
  } = useMutationGerarDiploma();

  function onSubmit() {
    handleGerarDiploma({
      codigoMatricula,
      segundaViaDiploma,
    });
  }

  return (
    <TabsContent value={value} className="mt-0">
      <Card className="border rounded-lg overflow-hidden shadow-none">
        <div className="border-b px-6 py-4 bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Emissão de Diploma
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Checkbox
              id="segundaViaDiploma"
              checked={segundaViaDiploma}
              onCheckedChange={(checked) =>
                setSegundaViaDiploma(Boolean(checked))
              }
            />
            <Label htmlFor="segundaViaDiploma" className="text-sm font-medium">
              2ª Via
            </Label>
          </div>

          <div className="grid gap-2 max-w-sm">
            <Label htmlFor="dataEmissao">Data de Emissão</Label>
            <div className="flex items-center gap-2">
              <Input
                id="dataEmissao"
                type="date"
                value={dataEmissao}
                onChange={(e) => setDataEmissao(e.target.value)}
              />
              <Button type="button" size="icon" variant="outline">
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Button
              onClick={onSubmit}
              disabled={isPending}
              className="gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              {isPending ? "Gerando..." : "Gerar Diploma"}
            </Button>
          </div>

          {data?.data ? (
  <div className="space-y-4">
    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
      <p className="font-medium text-sm">Dados do diploma carregados com sucesso.</p>
      <p className="text-sm text-muted-foreground mt-1">
        O documento já está pronto para exportação.
      </p>
    </div>

    <GerarDiplomaPdf
      dados={data.data}
      bgSrc="/logo_bg.png"
      borduraSrc="/bordura_africana.png"
      showDownload={true}
      showPrint={false}
    />
    <DiplomaPreview data={data.data} />
  </div>
) : null}
        </div>
      </Card>
    </TabsContent>
  );
}