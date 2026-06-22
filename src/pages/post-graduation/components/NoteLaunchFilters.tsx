import { FormSelect } from "@/components/common/FormSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostGraduationNoteLaunchOptions } from "@/services/post-graduation/fetch-note-launch-options.service";

export type NoteLaunchFilterState = {
  academicYearId: string;
  degreeId: string;
  semesterId: string;
  periodId: string;
  courseId: string;
  curricularYearId: string;
  curricularGradeId: string;
  scheduleId: string;
  examTypeId: string;
  assessmentTypeId: string;
};

type BasicOption = {
  codigo: number | string;
  designacao: string;
};

type DegreeOption = {
  id: number;
  designation: string;
};

type NoteLaunchFiltersProps = {
  filters: NoteLaunchFilterState;
  academicYears: BasicOption[];
  degrees: DegreeOption[];
  semesters: BasicOption[];
  options?: PostGraduationNoteLaunchOptions;
  courses: PostGraduationNoteLaunchOptions["courses"];
  curricularYears: PostGraduationNoteLaunchOptions["curricularYears"];
  curricularUnits: PostGraduationNoteLaunchOptions["curricularUnits"];
  schedules: PostGraduationNoteLaunchOptions["schedules"];
  isLoadingAcademicYears: boolean;
  isLoadingDegrees: boolean;
  isLoadingSemesters: boolean;
  isLoadingOptions: boolean;
  isAcademicYearsError: boolean;
  isDegreesError: boolean;
  isSemestersError: boolean;
  isOptionsError: boolean;
  hasBaseFilters: boolean;
  onChange: (field: keyof NoteLaunchFilterState, value: string) => void;
};

export function NoteLaunchFilters({
  filters,
  academicYears,
  degrees,
  semesters,
  options,
  courses,
  curricularYears,
  curricularUnits,
  schedules,
  isLoadingAcademicYears,
  isLoadingDegrees,
  isLoadingSemesters,
  isLoadingOptions,
  isAcademicYearsError,
  isDegreesError,
  isSemestersError,
  isOptionsError,
  hasBaseFilters,
  onChange,
}: NoteLaunchFiltersProps) {
  const hasInitialDataError =
    isAcademicYearsError || isDegreesError || isSemestersError;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contexto acadêmico</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <FormSelect
            label="Ano Lectivo"
            value={filters.academicYearId}
            options={academicYears}
            loading={isLoadingAcademicYears}
            disabled={isLoadingAcademicYears || isAcademicYearsError}
            map={(item) => ({
              key: item.codigo,
              value: item.codigo,
              label: item.designacao,
            })}
            onChange={(value) => onChange("academicYearId", value)}
          />

          <FormSelect
            label="Grau"
            value={filters.degreeId}
            options={degrees}
            loading={isLoadingDegrees}
            disabled={isLoadingDegrees || isDegreesError}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => onChange("degreeId", value)}
          />

          <FormSelect
            label="Semestre"
            value={filters.semesterId}
            options={semesters}
            loading={isLoadingSemesters}
            disabled={isLoadingSemesters || isSemestersError}
            map={(item) => ({
              key: item.codigo,
              value: item.codigo,
              label: item.designacao,
            })}
            onChange={(value) => onChange("semesterId", value)}
          />

          <FormSelect
            label="Período"
            value={filters.periodId}
            options={options?.periods ?? []}
            loading={isLoadingOptions}
            disabled={!hasBaseFilters || isOptionsError}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => onChange("periodId", value)}
          />

          <FormSelect
            label="Curso"
            value={filters.courseId}
            options={courses}
            loading={isLoadingOptions}
            disabled={!filters.periodId || isOptionsError}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => onChange("courseId", value)}
          />

          <FormSelect
            label="Ano Curricular"
            value={filters.curricularYearId}
            options={curricularYears}
            loading={isLoadingOptions}
            disabled={!filters.courseId || isOptionsError}
            map={(item) => ({
              key: `${item.courseId}-${item.id}`,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => onChange("curricularYearId", value)}
          />

          <FormSelect
            label="Unidade Curricular"
            value={filters.curricularGradeId}
            options={curricularUnits}
            loading={isLoadingOptions}
            disabled={!filters.curricularYearId || isOptionsError}
            map={(item) => ({
              key: item.curricularGradeId,
              value: item.curricularGradeId,
              label: item.designation,
            })}
            onChange={(value) => onChange("curricularGradeId", value)}
          />

          <FormSelect
            label="Horário"
            value={filters.scheduleId}
            options={schedules}
            loading={isLoadingOptions}
            disabled={!filters.curricularGradeId || isOptionsError}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => onChange("scheduleId", value)}
          />

          <FormSelect
            label="Tipo de Prova"
            value={filters.examTypeId}
            options={options?.examTypes ?? []}
            loading={isLoadingOptions}
            disabled={!filters.scheduleId || isOptionsError}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => onChange("examTypeId", value)}
          />

          <FormSelect
            label="Tipo de Avaliação"
            value={filters.assessmentTypeId}
            options={options?.assessmentTypes ?? []}
            loading={isLoadingOptions}
            disabled={!filters.scheduleId || isOptionsError}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) => onChange("assessmentTypeId", value)}
          />
        </div>

        {hasInitialDataError && (
          <p className="text-sm text-destructive">
            Não foi possível carregar os filtros institucionais.
          </p>
        )}

        {isOptionsError && hasBaseFilters && (
          <p className="text-sm text-destructive">
            Não foi possível carregar as opções de lançamento de notas.
          </p>
        )}
      </CardContent>
    </Card>
  );
}