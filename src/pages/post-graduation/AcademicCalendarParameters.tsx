import { useEffect, useMemo, useState } from "react";
import { Calendar, CreditCard, Pencil, Plus, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryAcademicYearMonthlyFees } from "@/hooks/academiccalendar/use-query-academic-year-monthly-fees";
import { useQueryAcademicYearVacancies } from "@/hooks/academiccalendar/use-query-academic-year-vacancies";
import { useQueryAcademicYearParams } from "@/hooks/academiccalendar/use-query-academic-years-params";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { Vacancy } from "@/services/academiccalendar/fetch-vacancies-per-course";
import { formatDateOnlyPt } from "@/util/date-formate";
import { EditVagaModal } from "@/pages/academiccalendar/components/modals/EditVagaModal";
import { ParametersEditModal } from "@/pages/academiccalendar/components/modals/ParametersEditModal";

const ITEMS_PER_PAGE = 10;
const MONTHLY_ITEMS_PER_PAGE = 6;
const MASTERS_DEGREE_ID = "2";

export default function PostGraduationAcademicCalendarParameters() {
  const [academicYearId, setAcademicYearId] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonthlyPage, setCurrentMonthlyPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [vacancyToEdit, setVacancyToEdit] = useState<{
    id: number;
    numberOfVacancies: number;
  } | null>(null);

  const {
    data: academicYears = [],
    isLoading: isLoadingAcademicYears,
    isError: isAcademicYearsError,
  } = useQueryAnoAcademico();
  const {
    data: applicationTypes = [],
    isLoading: isLoadingApplicationTypes,
    isError: isApplicationTypesError,
  } = useQueryTipoCandidatura();

  const degrees = useMemo(
    () =>
      applicationTypes.filter(
        (applicationType) =>
          applicationType.codigo === 2 || applicationType.codigo === 3,
      ),
    [applicationTypes],
  );

  const selectedAcademicYearId = Number(academicYearId) || undefined;
  const selectedDegreeId = Number(degreeId) || undefined;

  const {
    academicYearParams,
    isLoading: isLoadingAcademicYearParams,
    isFetching: isFetchingAcademicYearParams,
    isError: isAcademicYearParamsError,
  } = useQueryAcademicYearParams(selectedAcademicYearId, {
    enabled: Boolean(selectedAcademicYearId),
  });

  const {
    vacancies,
    isLoading: isLoadingVacancies,
    isFetching: isFetchingVacancies,
    isError: isVacanciesError,
  } = useQueryAcademicYearVacancies({
    codigoAno: selectedAcademicYearId,
    tipoCandidatura: selectedDegreeId,
    enabled: Boolean(selectedAcademicYearId && selectedDegreeId),
  });

  const {
    monthlyFees,
    isLoading: isLoadingMonthlyFees,
    isFetching: isFetchingMonthlyFees,
    isError: isMonthlyFeesError,
  } = useQueryAcademicYearMonthlyFees({
    codigoAno: selectedAcademicYearId,
    enabled: Boolean(selectedAcademicYearId),
  });

  useEffect(() => {
    if (academicYearId || academicYears.length === 0) return;

    const activeAcademicYear = academicYears.find((academicYear) =>
      ["activo", "ativo"].includes(
        academicYear.estado?.trim().toLowerCase(),
      ),
    );

    if (activeAcademicYear) {
      setAcademicYearId(String(activeAcademicYear.codigo));
    }
  }, [academicYearId, academicYears]);

  useEffect(() => {
    if (degreeId || degrees.length === 0) return;

    const mastersDegree = degrees.find(
      (degree) => String(degree.codigo) === MASTERS_DEGREE_ID,
    );

    setDegreeId(String(mastersDegree?.codigo ?? degrees[0].codigo));
  }, [degreeId, degrees]);

  useEffect(() => {
    setCurrentPage(1);
  }, [academicYearId, degreeId]);

  useEffect(() => {
    setCurrentMonthlyPage(1);
  }, [academicYearId]);

  const selectedDegreeName =
    degrees.find((degree) => degree.codigo === selectedDegreeId)?.designacao ??
    "Pós-Graduação";

  const totalPages = Math.max(
    1,
    Math.ceil(vacancies.length / ITEMS_PER_PAGE),
  );
  const paginatedVacancies = vacancies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalMonthlyPages = Math.max(
    1,
    Math.ceil(monthlyFees.length / MONTHLY_ITEMS_PER_PAGE),
  );
  const paginatedMonthlyFees = monthlyFees.slice(
    (currentMonthlyPage - 1) * MONTHLY_ITEMS_PER_PAGE,
    currentMonthlyPage * MONTHLY_ITEMS_PER_PAGE,
  );

  const academicPeriodDays = useMemo(() => {
    if (
      !academicYearParams?.dataInicioPrimeiroSemestre ||
      !academicYearParams?.dataFimSegundoSemestre
    ) {
      return null;
    }

    const startDate = new Date(
      `${academicYearParams.dataInicioPrimeiroSemestre}T00:00:00`,
    );
    const endDate = new Date(
      `${academicYearParams.dataFimSegundoSemestre}T00:00:00`,
    );

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return null;
    }

    return Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }, [academicYearParams]);

  function handleEditVacancy(vacancy: Vacancy) {
    setVacancyToEdit({
      id: vacancy.codigo,
      numberOfVacancies: vacancy.numeroVagas,
    });
  }

  const isLoadingFilters =
    isLoadingAcademicYears || isLoadingApplicationTypes;
  const hasValidFilters = Boolean(
    selectedAcademicYearId && selectedDegreeId,
  );

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Parâmetros do Calendário de Pós-Graduação"
        actions={
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Parâmetro
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Selecione o ano lectivo e o grau de Pós-Graduação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingFilters ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ano Lectivo</Label>
                <Select
                  value={academicYearId}
                  onValueChange={setAcademicYearId}
                  disabled={isAcademicYearsError}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano lectivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((academicYear) => (
                      <SelectItem
                        key={academicYear.codigo}
                        value={String(academicYear.codigo)}
                      >
                        {academicYear.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isAcademicYearsError && (
                  <p className="text-sm text-destructive">
                    Não foi possível carregar os anos lectivos.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Grau</Label>
                <Select
                  value={degreeId}
                  onValueChange={setDegreeId}
                  disabled={isApplicationTypesError}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grau" />
                  </SelectTrigger>
                  <SelectContent>
                    {degrees.map((degree) => (
                      <SelectItem
                        key={degree.codigo}
                        value={String(degree.codigo)}
                      >
                        {degree.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isApplicationTypesError && (
                  <p className="text-sm text-destructive">
                    Não foi possível carregar os graus.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {hasValidFilters && academicYearParams && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            {selectedDegreeName} — {academicYearParams.designacao}
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Parâmetros académicos e financeiros do ano lectivo
          </p>
        </div>
      )}

      <Tabs defaultValue="academic-year" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3">
          <TabsTrigger value="academic-year">
            Calendário Académico
          </TabsTrigger>
          <TabsTrigger value="vacancies">Vagas por Curso</TabsTrigger>
          <TabsTrigger value="monthly-fees">Mensalidades</TabsTrigger>
        </TabsList>

        <TabsContent value="academic-year" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Períodos Lectivos —{" "}
                {academicYearParams?.designacao ?? "Ano não selecionado"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAcademicYearParams ||
              isFetchingAcademicYearParams ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : isAcademicYearParamsError ? (
                <p className="py-12 text-center text-destructive">
                  Não foi possível carregar os períodos do ano lectivo.
                </p>
              ) : !academicYearParams ? (
                <p className="py-12 text-center text-muted-foreground">
                  Selecione um ano lectivo para visualizar os períodos.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ano Lectivo</TableHead>
                        <TableHead>Início 1.º Semestre</TableHead>
                        <TableHead>Fim 1.º Semestre</TableHead>
                        <TableHead>Início 2.º Semestre</TableHead>
                        <TableHead>Fim 2.º Semestre</TableHead>
                        <TableHead className="text-center">
                          Duração Total
                        </TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold text-primary">
                          {academicYearParams.designacao}
                        </TableCell>
                        <TableCell>
                          {formatDateOnlyPt(
                            academicYearParams.dataInicioPrimeiroSemestre,
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDateOnlyPt(
                            academicYearParams.dataFimPrimeiroSemestre,
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDateOnlyPt(
                            academicYearParams.dataInicioSegundoSemestre,
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDateOnlyPt(
                            academicYearParams.dataFimSegundoSemestre,
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {academicPeriodDays === null
                            ? "-"
                            : `${academicPeriodDays} dias`}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              ["activo", "ativo"].includes(
                                academicYearParams.estado
                                  .trim()
                                  .toLowerCase(),
                              )
                                ? "default"
                                : "secondary"
                            }
                          >
                            {academicYearParams.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacancies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vagas Disponíveis — {selectedDegreeName}
              </CardTitle>
              <CardDescription>
                Total de vagas:{" "}
                {vacancies.reduce(
                  (total, vacancy) => total + vacancy.numeroVagas,
                  0,
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingVacancies || isFetchingVacancies ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : isVacanciesError ? (
                <p className="py-12 text-center text-destructive">
                  Não foi possível carregar as vagas.
                </p>
              ) : vacancies.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  Nenhuma vaga encontrada para o ano e grau selecionados.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Curso</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead className="text-right">Vagas</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedVacancies.map((vacancy) => (
                          <TableRow key={vacancy.codigo}>
                            <TableCell className="font-medium">
                              {vacancy.cursoDescricao}
                            </TableCell>
                            <TableCell>{vacancy.periodoDescricao}</TableCell>
                            <TableCell className="text-right font-bold text-primary">
                              {vacancy.numeroVagas}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="icon"
                                title="Editar número de vagas"
                                onClick={() => handleEditVacancy(vacancy)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                          }
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setCurrentPage((page) =>
                              Math.min(totalPages, page + 1),
                            )
                          }
                        >
                          Próxima
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly-fees" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Calendário de Mensalidades —{" "}
                {academicYearParams?.designacao ?? "Ano não selecionado"}
              </CardTitle>
              <CardDescription>
                Total de prestações: {monthlyFees.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMonthlyFees || isFetchingMonthlyFees ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : isMonthlyFeesError ? (
                <p className="py-12 text-center text-destructive">
                  Não foi possível carregar as mensalidades.
                </p>
              ) : monthlyFees.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  Nenhuma mensalidade encontrada para o ano selecionado.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mês</TableHead>
                          <TableHead>Prestação</TableHead>
                          <TableHead>Semestre</TableHead>
                          <TableHead>Data Limite</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedMonthlyFees.map((monthlyFee) => (
                          <TableRow
                            key={`${monthlyFee.prestacao}-${monthlyFee.designacao}`}
                          >
                            <TableCell className="font-medium">
                              {monthlyFee.designacao}
                            </TableCell>
                            <TableCell>
                              {monthlyFee.prestacao}.ª Prestação
                            </TableCell>
                            <TableCell>{monthlyFee.semestre}</TableCell>
                            <TableCell>
                              {formatDateOnlyPt(
                                monthlyFee.dataLimite.split("T")[0],
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalMonthlyPages > 1 && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Página {currentMonthlyPage} de {totalMonthlyPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentMonthlyPage === 1}
                          onClick={() =>
                            setCurrentMonthlyPage((page) =>
                              Math.max(1, page - 1),
                            )
                          }
                        >
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={
                            currentMonthlyPage === totalMonthlyPages
                          }
                          onClick={() =>
                            setCurrentMonthlyPage((page) =>
                              Math.min(totalMonthlyPages, page + 1),
                            )
                          }
                        >
                          Próxima
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {vacancyToEdit && (
        <EditVagaModal
          open
          onClose={() => setVacancyToEdit(null)}
          idVaga={vacancyToEdit.id}
          numeroVagasAtual={vacancyToEdit.numberOfVacancies}
        />
      )}

      <ParametersEditModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
