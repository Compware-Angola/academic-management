import { useMemo, useState } from "react";
import {
  AlertCircle,
  Loader2,
  Save,
  Search,
  UserCheck,
} from "lucide-react";

import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { useToast } from "@/hooks/use-toast";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useMutationIsentarColisaoCurso, useMutationIsentarColisaoMatricula } from "@/hooks/registrations/use-mutation-isentar-colisao";
import { useQueryStudentInfo } from "@/hooks/registrations/use-query-student-colision";

type TipoAplicacao = "estudante" | "curso";

type Props = {
  onSuccess?: () => void;
};

export function IsentarColisaoForm({ onSuccess }: Props) {
  const { toast } = useToast();
   
  const [tipoAplicacao, setTipoAplicacao] =
    useState<TipoAplicacao>("estudante");

  const [anoLectivo, setAnoLectivo] = useState("");
  const [curso, setCurso] = useState("");
  const [turno, setTurno] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [searchedMatricula, setSearchedMatricula] = useState<number>();
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const { data: anosLectivos = [] } = useQueryAnoAcademico();
  const { data: periodos = [] } = useQueryPeriod();

  const {
    mutateAsync: isentarMatricula,
    isPending: isSavingMatricula,
  } = useMutationIsentarColisaoMatricula();

  const {
    mutateAsync: isentarCurso,
    isPending: isSavingCurso,
  } = useMutationIsentarColisaoCurso();

  const isSubmitting = isSavingMatricula || isSavingCurso;

  const {
    data: estudanteEncontrado,
    isLoading: isSearchingStudents,
    isError: studentSearchError,
  } = useQueryStudentInfo(searchedMatricula);

  const canSearchStudents =
    tipoAplicacao === "estudante" &&
    studentSearch.trim().length > 0;

  const resumoSelecionado = useMemo(() => {
    if (!selectedStudent) return null;

    return {
      matricula: selectedStudent.matricula ?? selectedStudent.codigoMatricula,
      nome: selectedStudent.nome ?? selectedStudent.nomeCompleto,
      curso: selectedStudent.curso,
      bilhete: selectedStudent.bilhete || "-",
      periodo: selectedStudent.periodo || "-",
    };
  }, [selectedStudent]);

  function resetStudentSearchState() {
    setStudentSearch("");
    setSearchedMatricula(undefined);
    setSelectedStudent(null);
  }

  function resetForm() {
    setTipoAplicacao("estudante");
    setAnoLectivo("");
    setCurso("");
    setTurno("");
    resetStudentSearchState();
  }

  function handleTrocarTipo(value: string) {
    const novoTipo = value as TipoAplicacao;
    setTipoAplicacao(novoTipo);
    if (novoTipo === "estudante") {
      setCurso("");
      setTurno("");
    }
    resetStudentSearchState();
  }

  function handlePesquisarEstudante() {
    const matricula = Number(studentSearch);

    if (!matricula) {
      toast({
        title: "Campo obrigatório",
        description: "Informe uma matrícula válida.",
        variant: "destructive",
      });
      return;
    }

    setSelectedStudent(null);
    setSearchedMatricula(matricula);
  }

  async function handleSalvar() {
    try {
      if (tipoAplicacao === "estudante") {
        if (!selectedStudent) {
          toast({
            title: "Seleção obrigatória",
            description: "Selecione um estudante.",
            variant: "destructive",
          });
          return;
        }

        const response = await isentarMatricula({
          matricula: Number(
            selectedStudent.matricula ?? selectedStudent.codigoMatricula
          ),
        });

        toast({
          title: "Sucesso",
          description: response.message,
        });

        resetForm();
        onSuccess?.();
        return;
      }

      if (!curso) {
        toast({
          title: "Campo obrigatório",
          description: "Selecione o curso.",
          variant: "destructive",
        });
        return;
      }

      if (!turno) {
        toast({
          title: "Campo obrigatório",
          description: "Selecione o turno.",
          variant: "destructive",
        });
        return;
      }

      const response = await isentarCurso({
        curso: Number(curso),
        turno: Number(turno),
      });

      toast({
        title: "Sucesso",
        description: response.message,
      });

      resetForm();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description:
          error?.response?.data?.message ||
          "Erro ao aplicar isenção de colisão.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Aplicar por</label>
          <Select value={tipoAplicacao} onValueChange={handleTrocarTipo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o modo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="estudante">Estudante</SelectItem>
              <SelectItem value="curso">Curso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ano Lectivo</label>
          <Select
            value={anoLectivo}
            onValueChange={(value) => {
              setAnoLectivo(value);
              resetStudentSearchState();
            }}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano lectivo" />
            </SelectTrigger>
            <SelectContent>
              {anosLectivos.map((ano: any) => (
                <SelectItem
                  key={ano.codigo ?? ano.CODIGO}
                  value={String(ano.codigo ?? ano.CODIGO)}
                >
                  {ano.designacao ?? ano.DESIGNACAO}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {tipoAplicacao === "estudante" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Curso</label>
              <Input value="" placeholder="Inativo no modo estudante" disabled />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Input value="" placeholder="Inativo no modo estudante" disabled />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Pesquisar estudante por matrícula ou nome
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite a matrícula"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setSelectedStudent(null);
                    setSearchedMatricula(undefined);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">.</label>
              <Button
                type="button"
                variant="outline"
                onClick={handlePesquisarEstudante}
                disabled={!canSearchStudents || isSearchingStudents}
              >
                {isSearchingStudents ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Pesquisar
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-amber-50 text-amber-900 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div className="text-sm">
              Esta ação cria uma exceção de colisão para uma matrícula
              específica no ano lectivo corrente.
            </div>
          </div>

          {searchedMatricula && (
            <div className="space-y-4">
              {isSearchingStudents ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A pesquisar estudante...
                </div>
              ) : studentSearchError || !estudanteEncontrado ? (
                <div className="text-sm text-muted-foreground">
                  Nenhum estudante encontrado.
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>BI</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{estudanteEncontrado.codigoMatricula}</TableCell>
                        <TableCell>{estudanteEncontrado.nomeCompleto}</TableCell>
                        <TableCell>{estudanteEncontrado.curso}</TableCell>
                        <TableCell>{estudanteEncontrado.bilhete}</TableCell>
                        <TableCell>{estudanteEncontrado.periodo}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            size="sm"
                            variant={
                              selectedStudent?.codigoMatricula ===
                              estudanteEncontrado.codigoMatricula
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setSelectedStudent(estudanteEncontrado)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Selecionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {resumoSelecionado && (
            <div className="rounded-lg border bg-green-50 text-green-900 p-4 space-y-1">
              <p>
                <strong>Matrícula:</strong> {resumoSelecionado.matricula}
              </p>
              <p>
                <strong>Nome:</strong> {resumoSelecionado.nome}
              </p>
              <p>
                <strong>Curso:</strong> {resumoSelecionado.curso}
              </p>
              <p>
                <strong>BI:</strong> {resumoSelecionado.bilhete}
              </p>
              <p>
                <strong>Período:</strong> {resumoSelecionado.periodo}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSalvar}
              disabled={isSubmitting || !selectedStudent}
            >
              {isSavingMatricula ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Isentar por Matrícula
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <CourseSelect
                value={curso}
                onChangeValue={(value) => setCurso(String(value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Select value={turno} onValueChange={setTurno}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((item: any) => (
                    <SelectItem
                      key={item.codigo ?? item.CODIGO}
                      value={String(item.codigo ?? item.CODIGO)}
                    >
                      {item.designacao ?? item.DESIGNACAO}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border bg-amber-50 text-amber-900 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div className="text-sm">
              Esta ação cria uma exceção de colisão para o curso no ano lectivo
              corrente. No legado, a duplicidade é validada por curso + ano
              lectivo corrente.
            </div>
          </div>

          <div className="flex justify-end">
              <Button
                onClick={handleSalvar}
                disabled={isSubmitting || !curso || !turno}
              >
              {isSavingCurso ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Isentar por Curso
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
