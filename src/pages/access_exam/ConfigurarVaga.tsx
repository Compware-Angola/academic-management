import { FormEvent, ReactNode, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateVaga } from "@/hooks/access_exam/use-create-vaga";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { ListaVagas } from "./ListaVagas";
import { PageHeader } from "@/components/common/PageHeader";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { parseFilter } from "@/util/parse-filter";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";

export default function ConfigurarVaga() {
  const [activeTab, setActiveTab] = useState("listagem");
  const [exportActions, setExportActions] = useState<ReactNode>(null);
  const [cursoId, setCursoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [anoLetivoId, setAnoLetivoId] = useState("");
  const [numVagas, setNumVagas] = useState("");
  const [cursosOpcionais, setCursosOpcionais] = useState("");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState("");

  const { data: periodos = [], isLoading: isLoadingPeriodos } =
    useQueryPeriod();
  const { data: anosLetivos = [], isLoading: isLoadingAnosLetivos } =
    useQueryAnoAcademico();

  const createVaga = useCreateVaga();

  function resetForm() {
    setTipoCandidaturaId("");
    setCursoId("");
    setPeriodoId("");
    setAnoLetivoId("");
    setNumVagas("");
    setCursosOpcionais("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cursoId || !periodoId || !anoLetivoId || !numVagas) {
      toast.warning("Preencha todos os campos obrigatórios.");
      return;
    }

    createVaga.mutate(
      {
        cursoId: Number(cursoId),
        periodoId: Number(periodoId),
        anoLetivoId: Number(anoLetivoId),
        numVagas: Number(numVagas),
        tipoCandidaturaId: Number(tipoCandidaturaId),
        cursosOpcionais: cursosOpcionais.trim() || undefined,
      },
      {
        onSuccess: resetForm,
      }
    );
  }



  return (
    <>
      <PageHeader
        title="Configurar Vaga"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="listagem">Listagem de vagas</TabsTrigger>
            <TabsTrigger value="criar">Criação de vagas</TabsTrigger>
          </TabsList>

          {activeTab === "listagem" && exportActions}
        </div>

        <TabsContent value="criar">
          <Card>
            <CardHeader>
              <CardTitle>Criar vaga</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <TipoCandidaturaSelect
                    label="Tipo de candidatura"
                    value={tipoCandidaturaId}
                    onChangeValue={setTipoCandidaturaId}
                    disabled={createVaga.isPending}
                  />
                  <AcademicYearSelect
                    value={anoLetivoId}
                    tipoCandidaturaId={parseFilter(tipoCandidaturaId)}
                    onChangeValue={(value) => {
                      setAnoLetivoId((value))
                      setCursoId("all");
                      setPeriodoId("all");
                    }}
                  />

                  <CourseSelect
                    label="Curso"
                    value={cursoId}
                    onChangeValue={setCursoId}
                    disabled={createVaga.isPending}
                    params={{ tipoCandidaturaId: parseFilter(tipoCandidaturaId) }}
                  />

                  <FormSelect
                    label="Período"
                    value={periodoId}
                    onChange={setPeriodoId}
                    options={periodos}
                    loading={isLoadingPeriodos}
                    disabled={createVaga.isPending}
                    map={(periodo) => ({
                      key: periodo.codigo,
                      value: periodo.codigo,
                      label: periodo.designacao,
                    })}
                  />


                  <div className="flex flex-col gap-2">
                    <Label htmlFor="num-vagas">Número de vagas</Label>
                    <Input
                      id="num-vagas"
                      type="number"
                      min={1}
                      value={numVagas}
                      onChange={(event) => setNumVagas(event.target.value)}
                      disabled={createVaga.isPending}
                    />
                  </div>
                </div>


                <Button type="submit" disabled={createVaga.isPending}>
                  {createVaga.isPending ? (
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

        <TabsContent value="listagem">
          <ListaVagas onExportActionsChange={setExportActions} />
        </TabsContent>
      </Tabs>
    </>
  );
}
