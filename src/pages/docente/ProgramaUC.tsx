import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useMutationUpdateProgramaUCEstado } from "@/hooks/docentes/use-mutation-docente-programa-status";
import { useQueryDocenteListProgramaUC } from "@/hooks/docentes/use-query-docente-programa-uc";
import { useQueryProgramaUCEstado } from "@/hooks/docentes/use-query-docente-programa-uc-status";
import { formatarData } from "@/util/date-formate";
import { parseFilter } from "@/util/parse-filter";
import { Check, File, Loader2, Paperclip, X } from "lucide-react";
import { useId, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UploadProgramaComUCModal } from "./components/UploadProgramaComUCModal";
import { DocenteCursoSelect } from "@/components/common/global-selects/DocenteCursoSelect";
import { DocenteCadeiraSelect } from "@/components/common/global-selects/DocenteCadeiraSelect";
import { useAuth } from "@/hooks/use-auth";
import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";

export default function DocenteLancamentoProgramaUC() {
  const id = useId();
  const { mutateAsync, isPending } = useMutationUpdateProgramaUCEstado();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { user } = useAuth();
  const { user: userData } = useAuth();
  const { data: teacherInfoData, isLoading: teacherInfoDataLoading } =
    useQueryTeacherProfile(userData?.user?.pk_utilizador);
  const docenteId = teacherInfoData?.codigo_docente;

  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    estado: "",
  });
  const defaultSelectItem = [
    {
      label: "Todos",
      value: "all",
      key: id,
    },
  ];
  const closeModal = () => {
    setIsOpenModal(false);
  };
  const openModal = () => {
    setIsOpenModal(true);
  };
  const canLoadProgramaUC =
    !!parseFilter(filters.anoCurricular) &&
    !!parseFilter(filters.anoLectivo) &&
    !!parseFilter(filters.curso) &&
    !!parseFilter(filters.semestre) &&
    !!parseFilter(filters.unidadeCurricular);
  const { data: programaUcResponse, isLoading } = useQueryDocenteListProgramaUC(
    {
      anoCurricular: parseFilter(filters.anoCurricular),
      anoLectivo: parseFilter(filters.anoLectivo),
      codigoCurso: parseFilter(filters.curso),
      semestre: parseFilter(filters.semestre),
      unidadeCurricular: parseFilter(filters.unidadeCurricular),
      page,
      limit,
    },
    {
      enabled: canLoadProgramaUC,
    },
  );

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      if (["curso", "semestre", "anoCurricular"].includes(key)) {
        newFilters.unidadeCurricular = "";
      }

      return newFilters;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendente
          </Badge>
        );
      case "Aprovado":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Aprovado
          </Badge>
        );

      case "Regeitado":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Regeitado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  const programas = programaUcResponse?.data ?? [];
  const total = programaUcResponse?.total;
  const totalPages = programaUcResponse?.totalPages;
  return (
    <>
      <div className="min-h-screen bg-background p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/docente">Docente</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Lançamento de Programa UC</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6 text-foreground">
            Lançamento de Programa UC
          </h1>
          <Button size="sm" onClick={() => openModal()}>
            <File className="h-4 w-4 mr-2" />
            Novo Programa
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-4">
              <AcademicYearSelect
                value={filters.anoLectivo}
                onChangeValue={(v) => updateFilter("anoLectivo", v)}
              />
              <SemestreSelect
                value={filters.semestre}
                onChangeValue={(v) => updateFilter("semestre", v)}
              />
              <DocenteCursoSelect
                props={{
                  anoLectivo: parseFilter(filters.anoLectivo),
                  docenteId,
                }}
                value={filters.curso}
                onChangeValue={(v) => updateFilter("curso", v)}
              />
              <AnoCurricularSelect
                value={filters.anoCurricular}
                onChangeValue={(v) => updateFilter("anoCurricular", v)}
                curso={filters.curso}
              />
              <DocenteCadeiraSelect
                params={{
                  anoLectivo: parseFilter(filters.anoLectivo),
                  classeId: parseFilter(filters.anoCurricular),
                  cursoId: parseFilter(filters.curso),
                  semestreId: parseFilter(filters.semestre),
                  docenteId,
                }}
                value={filters.unidadeCurricular}
                onChangeValue={(v) => updateFilter("unidadeCurricular", v)}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Programas com UC</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando Horários...</p>
              </div>
            ) : programas.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                Nenhum Programa encontrada.
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Ano Lectivo</TableHead>
                        <TableHead>Docente</TableHead>
                        <TableHead>UC</TableHead>
                        <TableHead>Data de Lançamento</TableHead>
                        <TableHead>Data de Validação</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programas.map((item) => (
                        <TableRow key={item.codigo}>
                          <TableCell>{item.codigo}</TableCell>
                          <TableCell>{item.anolectivo}</TableCell>
                          <TableCell>{item.docente}</TableCell>
                          <TableCell>{item.gradecurricular}</TableCell>
                          <TableCell>
                            {" "}
                            {formatarData(item.datacriacao)}
                          </TableCell>
                          <TableCell>
                            {formatarData(item.dataactualizacao)}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.estado)}</TableCell>

                          <TableCell className="text-center flex space-x-2">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="bg-blue-500 text-white"
                                size="icon"
                              >
                                <Paperclip />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    A mostrar {programas.length} de {total} registos
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Anterior
                    </Button>
                    <span>
                      Página {page} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Próxima
                    </Button>

                    <Select
                      value={String(limit)}
                      onValueChange={(v) => {
                        setLimit(Number(v));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <UploadProgramaComUCModal
        docenteId={docenteId}
        isModalOpen={isOpenModal}
        payload={filters}
        setIsModalOpen={closeModal}
      />
    </>
  );
}
