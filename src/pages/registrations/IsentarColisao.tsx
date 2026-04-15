import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Home,
  Loader2,
  Save,
  Search,
  UserCheck,
} from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { PaginationComponent } from "@/components/common/PaginationComponent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { useQuerySearchStudentsCollisionExemption } from "@/hooks/registrations/use-query-search-students-collision-exemption";


type TipoAplicacao = "estudante" | "curso";

export default function IsentarColisao() {
  const { toast } = useToast();

  const [tipoAplicacao, setTipoAplicacao] =
    useState<TipoAplicacao>("estudante");

  const [anoLectivo, setAnoLectivo] = useState("");
  const [curso, setCurso] = useState("");
  const [turno, setTurno] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const [studentPage, setStudentPage] = useState(1);
  const [studentLimit, setStudentLimit] = useState(10);

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
    data: searchedStudentsResponse,
    isLoading: isSearchingStudents,
  } = useQuerySearchStudentsCollisionExemption({
    page: studentPage,
    limit: studentLimit,
    anoLectivo: anoLectivo ? Number(anoLectivo) : 0,
    curso: curso ? Number(curso) : 0,
    turno: turno ? Number(turno) : 0,
    search: studentSearch,
  });

  const searchedStudents = searchedStudentsResponse?.data ?? [];
  const hasNext = studentPage < (searchedStudentsResponse?.totalPages ?? 1);

  const canSearchStudents =
    tipoAplicacao === "estudante" &&
    Number(anoLectivo) > 0 &&
    Number(curso) > 0 &&
    Number(turno) > 0 &&
    studentSearch.trim().length > 0;

  const resumoSelecionado = useMemo(() => {
    if (!selectedStudent) return null;

    return {
      matricula: selectedStudent.matricula,
      nome: selectedStudent.nome,
      curso: selectedStudent.curso,
      email: selectedStudent.email || "-",
      telefone: selectedStudent.telefone || "-",
    };
  }, [selectedStudent]);

  function resetStudentSearchState() {
    setStudentSearch("");
    setSelectedStudent(null);
    setStudentPage(1);
  }

  function handleTrocarTipo(value: string) {
    const novoTipo = value as TipoAplicacao;
    setTipoAplicacao(novoTipo);

    setCurso("");
    setTurno("");
    resetStudentSearchState();
  }

  async function handleSalvar() {
    try {
      if (!anoLectivo) {
        toast({
          title: "Campo obrigatório",
          description: "Selecione o ano lectivo.",
          variant: "destructive",
        });
        return;
      }

      if (tipoAplicacao === "estudante") {
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

        if (!selectedStudent) {
          toast({
            title: "Seleção obrigatória",
            description: "Selecione um estudante.",
            variant: "destructive",
          });
          return;
        }

        const response = await isentarMatricula({
          matricula: Number(selectedStudent.matricula),
          anoLectivo: Number(anoLectivo),
        });

        toast({
          title: "Sucesso",
          description: response.message,
        });

        setSelectedStudent(null);
        setStudentSearch("");
        setStudentPage(1);
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
        anoLectivo: Number(anoLectivo),
      });

      toast({
        title: "Sucesso",
        description: response.message,
      });

      setCurso("");
      setTurno("");
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
    <div className="p-6 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Gestão Académica</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Isentar Colisão</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Isentar Colisão"
        subtitle="Aplicar exceções administrativas para conflitos de horários"
      />

      <Card>
        <CardHeader>
          <CardTitle>Configuração da Aplicação</CardTitle>
        </CardHeader>

        <CardContent>
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
        </CardContent>
      </Card>

      {tipoAplicacao === "estudante" ? (
        <Card>
          <CardHeader>
            <CardTitle>Aplicação por Estudante</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <CourseSelect
                  value={curso}
                  onChangeValue={(value) => {
                    setCurso(String(value));
                    resetStudentSearchState();
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Turno</label>
                <Select
                  value={turno}
                  onValueChange={(value) => {
                    setTurno(value);
                    resetStudentSearchState();
                  }}
                >
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

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Pesquisar estudante por matrícula ou nome
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite a matrícula ou nome"
                    value={studentSearch}
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      setSelectedStudent(null);
                      setStudentPage(1);
                    }}
                    className="pl-9"
                    disabled={!anoLectivo || !curso || !turno}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-amber-50 text-amber-900 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div className="text-sm">
                Esta ação cria uma exceção de colisão para uma matrícula
                específica no ano lectivo selecionado.
              </div>
            </div>

            {canSearchStudents && (
              <div className="space-y-4">
                {isSearchingStudents ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    A pesquisar estudantes...
                  </div>
                ) : searchedStudents.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nenhum estudante encontrado.
                  </div>
                ) : (
                  <>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Matrícula</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Ação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchedStudents.map((student) => (
                            <TableRow key={student.matricula}>
                              <TableCell>{student.matricula}</TableCell>
                              <TableCell>{student.nome}</TableCell>
                              <TableCell>{student.curso}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={
                                    selectedStudent?.matricula ===
                                    student.matricula
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => setSelectedStudent(student)}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Selecionar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <PaginationComponent
                      hasNext={hasNext}
                      limit={studentLimit}
                      page={studentPage}
                      setLimit={setStudentLimit}
                      setPage={setStudentPage}
                    />
                  </>
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
                  <strong>Email:</strong> {resumoSelecionado.email}
                </p>
                <p>
                  <strong>Telefone:</strong> {resumoSelecionado.telefone}
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aplicação por Curso</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
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
                Esta ação cria uma exceção de colisão para o curso no ano
                lectivo selecionado. No legado, a duplicidade é validada por
                curso + ano lectivo.
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSalvar}
                disabled={isSubmitting || !anoLectivo || !curso || !turno}
              >
                {isSavingCurso ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Isentar por Curso
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}