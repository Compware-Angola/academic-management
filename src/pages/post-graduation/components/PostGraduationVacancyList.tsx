import { ReactNode, useEffect, useMemo, useState } from "react";
import { Edit, Loader2 } from "lucide-react";

import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { FormSelect } from "@/components/common/FormSelect";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutationUpdatePostGraduationVacancy } from "@/hooks/post-graduation/use-mutation-vacancies";
import { useQueryPostGraduationVacancies } from "@/hooks/post-graduation/use-query-vacancies";
import { useQueryPostGraduationVacancyOptions } from "@/hooks/post-graduation/use-query-vacancy-options";
import { PostGraduationDegree } from "@/services/post-graduation/fetch-degrees.service";
import {
  PostGraduationVacancy,
  PostGraduationVacancyOption,
} from "@/services/post-graduation/vacancies.service";
import { AnoAcademico } from "@/services/fetch-anos-academico";

const PAGE_SIZE = 10;

type PostGraduationVacancyListProps = {
  academicYears: AnoAcademico[];
  degrees: PostGraduationDegree[];
  initialAcademicYearId: string;
  initialDegreeId: string;
  isLoadingAcademicYears: boolean;
  isLoadingDegrees: boolean;
  onExportActionsChange?: (actions: ReactNode) => void;
};

function parseOptionalFilter(value: string) {
  return value === "all" ? undefined : Number(value);
}

export function PostGraduationVacancyList({
  academicYears,
  degrees,
  initialAcademicYearId,
  initialDegreeId,
  isLoadingAcademicYears,
  isLoadingDegrees,
  onExportActionsChange,
}: PostGraduationVacancyListProps) {
  const [academicYearId, setAcademicYearId] = useState(initialAcademicYearId);
  const [degreeId, setDegreeId] = useState(initialDegreeId);
  const [courseId, setCourseId] = useState("all");
  const [periodId, setPeriodId] = useState("all");
  const [page, setPage] = useState(1);
  const [vacancyToEdit, setVacancyToEdit] =
    useState<PostGraduationVacancy | null>(null);
  const [numberOfVacancies, setNumberOfVacancies] = useState("");

  useEffect(() => {
    if (!academicYearId && initialAcademicYearId) {
      setAcademicYearId(initialAcademicYearId);
    }
  }, [academicYearId, initialAcademicYearId]);

  useEffect(() => {
    if (!degreeId && initialDegreeId) {
      setDegreeId(initialDegreeId);
    }
  }, [degreeId, initialDegreeId]);

  const selectedDegreeId = Number(degreeId);
  const { data: options, isLoading: isLoadingOptions } =
    useQueryPostGraduationVacancyOptions(selectedDegreeId);
  const courses = options?.courses ?? [];
  const periods = options?.periods ?? [];

  const { data, isLoading, isError } = useQueryPostGraduationVacancies({
    academicYearId: Number(academicYearId),
    degreeId: selectedDegreeId,
    courseId: parseOptionalFilter(courseId),
    periodId: parseOptionalFilter(periodId),
    page,
    limit: PAGE_SIZE,
  });

  const updateVacancy = useMutationUpdatePostGraduationVacancy();
  const vacancies = useMemo(() => data?.data ?? [], [data?.data]);

  const exportRows = useMemo(
    () =>
      vacancies.map((vacancy) => ({
        curso: vacancy.course,
        periodo: vacancy.period,
        anoLectivo: vacancy.academicYear,
        total: vacancy.totalVacancies,
        ocupadas: vacancy.occupiedVacancies,
        disponiveis: vacancy.availableVacancies,
        excesso: vacancy.excessConfirmations,
      })),
    [vacancies],
  );

  const selectedCourse =
    courses.find((course) => String(course.id) === courseId)?.designation ??
    "Todos";
  const selectedPeriod =
    periods.find((period) => String(period.id) === periodId)?.designation ??
    "Todos";
  const selectedAcademicYear =
    academicYears.find((year) => String(year.codigo) === academicYearId)
      ?.designacao ?? "-";
  const selectedDegree =
    degrees.find((degree) => String(degree.id) === degreeId)?.designation ??
    "-";

  const exportFilters = [
    `Ano lectivo: ${selectedAcademicYear}`,
    `Grau: ${selectedDegree}`,
    `Curso: ${selectedCourse}`,
    `Período: ${selectedPeriod}`,
  ].join(" | ");

  const pdfContent = useMemo(
    () =>
      exportRows.length ? (
        <GenericPDFDocument
          documentTitle="Listagem de Vagas da Pós-Graduação"
          subtitle="Vagas configuradas por curso, período e ano lectivo"
          infoSections={[
            { title: "Filtros Aplicados", content: exportFilters },
            {
              title: "Resumo",
              content: [
                `Total de registos: ${data?.total ?? exportRows.length}`,
              ],
            },
          ]}
          mainTable={{
            headers: [
              { key: "curso", label: "Curso", width: "24%" },
              { key: "periodo", label: "Período", width: "13%" },
              { key: "anoLectivo", label: "Ano lectivo", width: "15%" },
              { key: "total", label: "Total", width: "11%" },
              { key: "ocupadas", label: "Ocupadas", width: "12%" },
              { key: "disponiveis", label: "Disponíveis", width: "13%" },
              { key: "excesso", label: "Excesso", width: "12%" },
            ],
            rows: exportRows,
            headerBackground: "#0D1B48",
          }}
          footerNotice="Documento gerado automaticamente pelo sistema."
        />
      ) : null,
    [data?.total, exportFilters, exportRows],
  );

  const excelProps = useMemo(
    () =>
      exportRows.length
        ? {
            documentTitle: "Listagem de Vagas da Pós-Graduação",
            subtitle: "Vagas configuradas por curso, período e ano lectivo",
            infoSections: [
              { title: "Filtros Aplicados", content: exportFilters },
              {
                title: "Resumo",
                content: [
                  `Total de registos: ${data?.total ?? exportRows.length}`,
                ],
              },
            ],
            mainTable: {
              headers: [
                { key: "curso", label: "Curso", width: 35 },
                { key: "periodo", label: "Período", width: 18 },
                { key: "anoLectivo", label: "Ano lectivo", width: 18 },
                { key: "total", label: "Total", width: 12 },
                { key: "ocupadas", label: "Ocupadas", width: 14 },
                { key: "disponiveis", label: "Disponíveis", width: 16 },
                { key: "excesso", label: "Excesso", width: 12 },
              ],
              rows: exportRows,
            },
            footerNotice: "Documento gerado automaticamente pelo sistema.",
            primaryColor: "#0D1B48",
          }
        : null,
    [data?.total, exportFilters, exportRows],
  );

  const fileName = useMemo(
    () =>
      `Vagas_Pos_Graduacao_${new Date().toISOString().slice(0, 10)}`,
    [],
  );
  const exportActions = useMemo(
    () =>
      pdfContent || excelProps ? (
        <div className="flex flex-wrap justify-end gap-2">
          {pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`${fileName}.pdf`}
              showDownload
              showPrint
            />
          )}
          {excelProps && (
            <ExcelActions
              excelProps={excelProps}
              fileName={`${fileName}.xlsx`}
              showDownload
            />
          )}
        </div>
      ) : null,
    [excelProps, fileName, pdfContent],
  );

  useEffect(() => {
    onExportActionsChange?.(exportActions);

    return () => onExportActionsChange?.(null);
  }, [exportActions, onExportActionsChange]);

  function handleAcademicYearChange(value: string) {
    setAcademicYearId(value);
    setPage(1);
  }

  function handleDegreeChange(value: string) {
    setDegreeId(value);
    setCourseId("all");
    setPeriodId("all");
    setPage(1);
  }

  function handleOptionalFilterChange(
    setter: (value: string) => void,
    value: string,
  ) {
    setter(value);
    setPage(1);
  }

  function openEditDialog(vacancy: PostGraduationVacancy) {
    setVacancyToEdit(vacancy);
    setNumberOfVacancies(String(vacancy.totalVacancies));
  }

  function handleUpdate() {
    if (!vacancyToEdit || Number(numberOfVacancies) < 1) {
      return;
    }

    updateVacancy.mutate(
      {
        vacancyId: vacancyToEdit.id,
        payload: { numberOfVacancies: Number(numberOfVacancies) },
      },
      {
        onSuccess: () => setVacancyToEdit(null),
      },
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormSelect
            label="Ano lectivo"
            value={academicYearId}
            onChange={handleAcademicYearChange}
            options={academicYears}
            loading={isLoadingAcademicYears}
            map={(year) => ({
              key: year.codigo,
              value: year.codigo,
              label: year.designacao,
            })}
          />

          <FormSelect
            label="Grau"
            value={degreeId}
            onChange={handleDegreeChange}
            options={degrees}
            loading={isLoadingDegrees}
            map={(degree) => ({
              key: degree.id ?? degree.designation,
              value: degree.id ?? "",
              label: degree.designation,
            })}
          />

          <FormCommandSelect<PostGraduationVacancyOption>
            label="Curso"
            value={courseId}
            onChange={(value) =>
              handleOptionalFilterChange(setCourseId, value)
            }
            options={courses}
            isLoading={isLoadingOptions}
            disabled={!selectedDegreeId}
            width="full"
            defaultSelectItem={[
              { key: "all-courses", value: "all", label: "Todos" },
            ]}
            map={(course) => ({
              key: course.id,
              value: course.id,
              label: course.designation,
            })}
          />

          <FormSelect
            label="Período"
            value={periodId}
            onChange={(value) =>
              handleOptionalFilterChange(setPeriodId, value)
            }
            options={periods}
            loading={isLoadingOptions}
            disabled={!selectedDegreeId}
            defaultSelectItem={[{ value: "all", label: "Todos" }]}
            map={(period) => ({
              key: period.id,
              value: period.id,
              label: period.designation,
            })}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">
            Não foi possível carregar as vagas.
          </p>
        ) : vacancies.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma vaga encontrada para os filtros selecionados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Ano lectivo</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ocupadas</TableHead>
                  <TableHead>Disponíveis</TableHead>
                  <TableHead>Excesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vacancies.map((vacancy) => (
                  <TableRow key={vacancy.id}>
                    <TableCell>{vacancy.course}</TableCell>
                    <TableCell>{vacancy.period}</TableCell>
                    <TableCell>{vacancy.academicYear}</TableCell>
                    <TableCell>{vacancy.totalVacancies}</TableCell>
                    <TableCell>{vacancy.occupiedVacancies}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {vacancy.availableVacancies}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vacancy.excessConfirmations > 0 ? (
                        <Badge variant="destructive">
                          {vacancy.excessConfirmations}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Editar número de vagas"
                          onClick={() => openEditDialog(vacancy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              {data.page} / {data.totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={page >= data.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Próxima
            </Button>
          </div>
        )}

        <Dialog
          open={!!vacancyToEdit}
          onOpenChange={(open) => !open && setVacancyToEdit(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Atualizar vaga</DialogTitle>
              <DialogDescription>
                A identificação académica da vaga não pode ser alterada.
              </DialogDescription>
            </DialogHeader>

            {vacancyToEdit && (
              <div className="space-y-4">
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Curso:</strong>{" "}
                    {vacancyToEdit.course}
                  </p>
                  <p>
                    <strong className="text-foreground">Período:</strong>{" "}
                    {vacancyToEdit.period}
                  </p>
                  <p>
                    <strong className="text-foreground">Ano lectivo:</strong>{" "}
                    {vacancyToEdit.academicYear}
                  </p>
                  <p>
                    <strong className="text-foreground">Vagas ocupadas:</strong>{" "}
                    {vacancyToEdit.occupiedVacancies}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="post-graduation-vacancy-total">
                    Número de vagas
                  </Label>
                  <Input
                    id="post-graduation-vacancy-total"
                    type="number"
                    min={Math.max(1, vacancyToEdit.occupiedVacancies)}
                    value={numberOfVacancies}
                    onChange={(event) =>
                      setNumberOfVacancies(event.target.value)
                    }
                    disabled={updateVacancy.isPending}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateVacancy.isPending}
                onClick={() => setVacancyToEdit(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={
                  updateVacancy.isPending ||
                  !vacancyToEdit ||
                  Number(numberOfVacancies) <
                    Math.max(1, vacancyToEdit.occupiedVacancies)
                }
                onClick={handleUpdate}
              >
                {updateVacancy.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
