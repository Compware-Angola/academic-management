import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download } from "lucide-react";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { CANDIDATURAS } from "../types/types";
// ajusta o caminho conforme a tua estrutura

interface ParametrosFormProps {
  tipoCandidatura: number;
  onChangeTipoCandidatura: (v: number) => void;
  origemAno: string;
  onChangeOrigemAno: (v: string) => void;
  destinoAno: string;
  onChangeDestinoAno: (v: string) => void;
  onCarregar: () => void;
}

export function ParametrosForm({
  tipoCandidatura,
  onChangeTipoCandidatura,
  origemAno,
  onChangeOrigemAno,
  destinoAno,
  onChangeDestinoAno,
  onCarregar,
}: ParametrosFormProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Copy className="h-5 w-5 text-primary" /> Parâmetros da Importação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Tipo de Candidatura</Label>
            <Select
              value={String(tipoCandidatura)}
              onValueChange={(v) => onChangeTipoCandidatura(Number(v))}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CANDIDATURAS.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AcademicYearsAvailableForOperationSelect
            label="Origem"
            value={origemAno}
            onChangeValue={onChangeOrigemAno}
            tipoCandidaturaId={tipoCandidatura}
            onlyConfigurable={false}
          />

          <AcademicYearsAvailableForOperationSelect
            label="Destino"
            value={destinoAno}
            onChangeValue={onChangeDestinoAno}
            tipoCandidaturaId={tipoCandidatura}
          />
        </div>
        <Separator />
        <div className="flex justify-end">
          <Button
            onClick={onCarregar}
            size="lg"
            className="gap-2"
            disabled={!origemAno || !destinoAno}
          >
            <Download className="h-4 w-4" /> Carregar Serviços
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
