import { TabsContent } from "@/components/ui/tabs";
import { useQueryStudentNotes } from "@/hooks/tudents/use-query-student-notes";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { parseFilter } from "@/util/parse-filter";

type NotesProps = {
  codigoMatricula: number;
  value?: string;
};
const Notes = ({ codigoMatricula, value }: NotesProps) => {
  const [academicYear, setAcademicYear] = useState<string>("23");
  const { data: pautaResponse, isLoading: loadingPauta } = useQueryStudentNotes(
    {
      anoLectivo: parseFilter(academicYear),
      codigoMatricula,
    },
  );
  const getResultadoBadge = (resultado: string) => {
    if (resultado === "Aprovado") {
      return (
        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
          Aprovado
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
        Reprovado
      </Badge>
    );
  };
  const pautas = pautaResponse?.data ?? [];
  return (
    <>
      <TabsContent value={value} className="space-y-4">
        <div className="grid grid-cols-4">
          <AcademicYearSelect
            value={academicYear}
            onChangeValue={(v) => setAcademicYear(v)}
          />
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Resultados</h3>

          {loadingPauta ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : pautas.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Nenhum registo encontrado
              </p>
              <p className="text-sm text-muted-foreground">
                Utilize os filtros acima para pesquisar
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UC</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Semestre</TableHead>
                      <TableHead className="text-center">1ª Freq</TableHead>
                      <TableHead className="text-center">2ª Freq</TableHead>
                      <TableHead className="text-center">Exame</TableHead>
                      <TableHead className="text-center">Recurso</TableHead>
                      <TableHead className="text-center">Oral</TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">EE</TableHead>
                      <TableHead className="text-center">OEE</TableHead>
                      <TableHead className="text-center">MEL</TableHead>
                      <TableHead className="text-center">Média</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead className="text-center">Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pautas.map((pauta) => (
                      <TableRow key={pauta.codigoGradeAluno}>
                        {/* 👇 mantém teu row igual */}
                        <TableCell>{pauta.unidadeCurricular}</TableCell>
                        <TableCell>{pauta.ano}</TableCell>
                        <TableCell>{pauta.semestre}</TableCell>
                        <TableCell className="text-center">
                          {pauta.nota1f || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.nota2f || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.notaEx || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.notaRec || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.notaOr || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.notaPra || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.notaEE || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.notaOEE || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {pauta.notaMel || "-"}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {pauta.media}
                        </TableCell>
                        <TableCell>
                          {getResultadoBadge(pauta.resultado)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                {pauta.obs.length > 0 ? (
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>
                                  Detalhes - {pauta.nome_completo}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">
                                    Fórmula de Cálculo
                                  </h4>
                                  <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                                    {pauta.formula.map((f, i) => (
                                      <p key={i} className="text-sm">
                                        {f}
                                      </p>
                                    ))}
                                  </div>
                                </div>

                                {pauta.obs.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 text-amber-600">
                                      Observações
                                    </h4>
                                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 space-y-1">
                                      {pauta.obs.map((o, i) => (
                                        <p
                                          key={i}
                                          className="text-sm text-amber-800 dark:text-amber-200"
                                        >
                                          {o}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Semestre:
                                    </span>
                                    <span className="ml-2">
                                      {pauta.semestre}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Duração:
                                    </span>
                                    <span className="ml-2">
                                      {pauta.duracao}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Nota Prática:
                                    </span>
                                    <span className="ml-2">
                                      {pauta.notaPra || "-"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Nota Oral:
                                    </span>
                                    <span className="ml-2">
                                      {pauta.notaOr || "-"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Nota Melhoria:
                                    </span>
                                    <span className="ml-2">
                                      {pauta.notaMel || "-"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Nota EE:
                                    </span>
                                    <span className="ml-2">
                                      {pauta.notaEE || "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação (backend) */}
              {/* <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, total)} de {total}{" "}
                  registos
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <span className="text-sm">
                    Página {currentPage} de {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div> */}
            </>
          )}
        </div>
      </TabsContent>
    </>
  );
};
export { Notes };
