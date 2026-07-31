import { useState } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, CheckCircle2, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { useAuth } from "@/hooks/use-auth";
import {
  useGradesCurricularesDuplicadas,
  useMutationAtualizarEstadoGradeCurricular,
} from "@/hooks/students/use-query-students";

type Props = {
  codigoMatricula: number;
  value?: string;
};

export function GradesDuplicadasSection({
  codigoMatricula: numeroDeMatricula,
  value = "grades-duplicadas",
}: Props) {
  const [anoLectivo, setAnoLectivo] = useState("");
  const [loadingCodigo, setLoadingCodigo] = useState<number | null>(null);

  const { user } = useAuth();

  const {
    data: grades = [],
    isLoading,
    isError,
  } = useGradesCurricularesDuplicadas({
    numeroDeMatricula,
    anoLectivo: Number(anoLectivo),
  });
  console.log(grades);
  const { mutateAsync: atualizarEstado } =
    useMutationAtualizarEstadoGradeCurricular();

  const handleToggleEstado = async (codigo: number, estadoAtual: number) => {
    setLoadingCodigo(codigo);
    try {
      await atualizarEstado({
        codigo,
        estado: estadoAtual === 1 ? 0 : 1,
        codigoUtilizador: Number(user?.user.codigo),
      });
    } finally {
      setLoadingCodigo(null);
    }
  };

  if (!numeroDeMatricula) {
    return <div>Matrícula inválida</div>;
  }

  return (
    <TabsContent value={value} className="space-y-4">
      <div>
        <CardHeader>
          <CardTitle className="text-lg">Disciplinas Duplicadas</CardTitle>
          <CardDescription>
            Disciplinas com o mesmo nome atribuídas mais de uma vez ao aluno.
            Desactive a que não deve permanecer.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AcademicYearSelect
              label="Ano Lectivo"
              enableDefaultSelectItem={false}
              value={anoLectivo}
              onChangeValue={setAnoLectivo}
            />
          </div>

          {!anoLectivo ? (
            <div className="text-center text-muted-foreground py-10">
              Seleccione um ano lectivo para verificar duplicados.
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-destructive py-10">
              Erro ao carregar as disciplinas duplicadas. Tente novamente.
            </div>
          ) : grades.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Nenhuma disciplina duplicada encontrada para este ano.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="text-center">Classe</TableHead>
                    <TableHead className="text-center">Semestre</TableHead>
                    <TableHead className="text-center">Nota</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((g) => (
                    <TableRow key={g.codigo}>
                      <TableCell className="font-mono text-sm">
                        {g.codigo}
                      </TableCell>
                      <TableCell className="font-medium">
                        {g.disciplina}
                      </TableCell>
                      <TableCell className="text-center">{g.classe}</TableCell>
                      <TableCell className="text-center">
                        {g.semestre}
                      </TableCell>
                      <TableCell className="text-center">{g.nota}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={g.estado === 1 ? "default" : "secondary"}
                        >
                          {g.estado === 1 ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="icon"
                          variant={g.estado === 1 ? "destructive" : "outline"}
                          className={
                            g.estado === 1
                              ? ""
                              : "text-green-600 border-green-600 hover:bg-green-50"
                          }
                          disabled={loadingCodigo === g.codigo}
                          onClick={() => handleToggleEstado(g.codigo, g.estado)}
                        >
                          {loadingCodigo === g.codigo ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : g.estado === 1 ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </div>
    </TabsContent>
  );
}
