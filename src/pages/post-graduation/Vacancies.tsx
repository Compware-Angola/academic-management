import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutationCreatePostGraduationVacancy } from "@/hooks/post-graduation/use-mutation-vacancies";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryPostGraduationVacancyOptions } from "@/hooks/post-graduation/use-query-vacancy-options";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { PostGraduationVacancyOption } from "@/services/post-graduation/vacancies.service";
import { PostGraduationVacancyList } from "./components/PostGraduationVacancyList";

const MASTERS_DEGREE_ID = "2";

export default function PostGraduationVacancies() {
  const [activeTab, setActiveTab] = useState("create");
  const [exportActions, setExportActions] = useState<ReactNode>(null);
  const [academicYearId, setAcademicYearId] = useState("");
  const [degreeId, setDegreeId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [numberOfVacancies, setNumberOfVacancies] = useState("");

  const { data: academicYears = [], isLoading: isLoadingAcademicYears } =
    useQueryAnoAcademico();
  const { data: degreesResponse, isLoading: isLoadingDegrees } =
    useQueryPostGraduationDegrees();
  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree) => degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
  );

  const { data: options, isLoading: isLoadingOptions } =
    useQueryPostGraduationVacancyOptions(Number(degreeId));
  const courses = options?.courses ?? [];
  const periods = options?.periods ?? [];
  const createVacancy = useMutationCreatePostGraduationVacancy();

  useEffect(() => {
    if (!academicYearId && academicYears.length) {
      const activeAcademicYear = academicYears.find((year) =>
        ["activo", "ativo"].includes(year.estado?.trim().toLowerCase()),
      );

      if (activeAcademicYear) {
        setAcademicYearId(String(activeAcademicYear.codigo));
      }
    }
  }, [academicYearId, academicYears]);

  useEffect(() => {
    if (!degreeId && degrees.length) {
      const mastersDegree = degrees.find(
        (degree) => String(degree.id) === MASTERS_DEGREE_ID,
      );

      setDegreeId(String(mastersDegree?.id ?? degrees[0].id));
    }
  }, [degreeId, degrees]);

  function handleDegreeChange(value: string) {
    setDegreeId(value);
    setCourseId("");
    setPeriodId("");
  }

  function resetForm() {
    setCourseId("");
    setPeriodId("");
    setNumberOfVacancies("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !academicYearId ||
      !degreeId ||
      !courseId ||
      !periodId ||
      Number(numberOfVacancies) < 1
    ) {
      toast.warning("Preencha todos os campos obrigatórios.");
      return;
    }

    createVacancy.mutate(
      {
        academicYearId: Number(academicYearId),
        degreeId: Number(degreeId),
        courseId: Number(courseId),
        periodId: Number(periodId),
        numberOfVacancies: Number(numberOfVacancies),
      },
      { onSuccess: resetForm },
    );
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <TabsList>
          <TabsTrigger value="create">Criação de vagas</TabsTrigger>
          <TabsTrigger value="list">Listagem de vagas</TabsTrigger>
        </TabsList>

        {activeTab === "list" && exportActions}
      </div>

      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Criar vaga</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormSelect
                  label="Ano lectivo"
                  value={academicYearId}
                  onChange={setAcademicYearId}
                  options={academicYears}
                  loading={isLoadingAcademicYears}
                  disabled={createVacancy.isPending}
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
                  disabled={createVacancy.isPending}
                  map={(degree) => ({
                    key: degree.id ?? degree.designation,
                    value: degree.id ?? "",
                    label: degree.designation,
                  })}
                />

                <FormCommandSelect<PostGraduationVacancyOption>
                  label="Curso"
                  value={courseId}
                  onChange={setCourseId}
                  options={courses}
                  isLoading={isLoadingOptions}
                  disabled={!degreeId || createVacancy.isPending}
                  width="full"
                  map={(course) => ({
                    key: course.id,
                    value: course.id,
                    label: course.designation,
                  })}
                />

                <FormSelect
                  label="Período"
                  value={periodId}
                  onChange={setPeriodId}
                  options={periods}
                  loading={isLoadingOptions}
                  disabled={!degreeId || createVacancy.isPending}
                  map={(period) => ({
                    key: period.id,
                    value: period.id,
                    label: period.designation,
                  })}
                />

                <div className="flex flex-col gap-2">
                  <Label htmlFor="post-graduation-number-of-vacancies">
                    Número de vagas
                  </Label>
                  <Input
                    id="post-graduation-number-of-vacancies"
                    type="number"
                    min={1}
                    value={numberOfVacancies}
                    onChange={(event) =>
                      setNumberOfVacancies(event.target.value)
                    }
                    disabled={createVacancy.isPending}
                  />
                </div>
              </div>

              <Button type="submit" disabled={createVacancy.isPending}>
                {createVacancy.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Guardar
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="list">
        <PostGraduationVacancyList
          academicYears={academicYears}
          degrees={degrees}
          initialAcademicYearId={academicYearId}
          initialDegreeId={degreeId}
          isLoadingAcademicYears={isLoadingAcademicYears}
          isLoadingDegrees={isLoadingDegrees}
          onExportActionsChange={setExportActions}
        />
      </TabsContent>
    </Tabs>
  );
}
