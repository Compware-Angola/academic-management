import { Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type AcademicYearParams = {
  designacao: string;
  estado: string;
  dataInicioPrimeiroSemestre: string;
  dataFimPrimeiroSemestre: string;
  dataInicioSegundoSemestre: string;
  dataFimSegundoSemestre: string;
};

type PeriodosLetivosCardProps = {
  data?: AcademicYearParams | null;
  loading?: boolean;
  updating?: boolean;
  onToggleEstado: (checked: boolean) => void;
  formatarData: (data: string) => string;
  calcularDias: (inicio: string, fim: string) => number;
};

export function PeriodosLetivosCard({
  data,
  loading = false,
  updating = false,
  onToggleEstado,
  formatarData,
  calcularDias,
}: PeriodosLetivosCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Períodos Letivos — {data?.designacao || "Carregando..."}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !data ? (
          <div className="py-16 text-center text-muted-foreground">
            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-30" />
            <p className="text-lg">
              Selecione um ano letivo para visualizar os parâmetros
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-52">Ano Letivo</TableHead>
                <TableHead>Início 1º Semestre</TableHead>
                <TableHead>Fim 1º Semestre</TableHead>
                <TableHead>Início 2º Semestre</TableHead>
                <TableHead>Fim 2º Semestre</TableHead>
                <TableHead className="text-center">Duração Total</TableHead>
                <TableHead className="w-32 text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow className="transition-colors hover:bg-muted/50">
                <TableCell className="text-lg font-bold text-primary">
                  {data.designacao}
                </TableCell>

                <TableCell>
                  {formatarData(data.dataInicioPrimeiroSemestre)}
                </TableCell>

                <TableCell>
                  {formatarData(data.dataFimPrimeiroSemestre)}
                </TableCell>

                <TableCell>
                  {formatarData(data.dataInicioSegundoSemestre)}
                </TableCell>

                <TableCell>
                  {formatarData(data.dataFimSegundoSemestre)}
                </TableCell>

                <TableCell className="text-center">
                  {calcularDias(
                    data.dataInicioPrimeiroSemestre,
                    data.dataFimSegundoSemestre,
                  )}{" "}
                  dias
                </TableCell>

                <TableCell className="text-center">
                  <Badge>{data.estado}</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
