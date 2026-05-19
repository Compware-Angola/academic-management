import { FormEvent, ReactNode, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateVaga } from "@/hooks/access_exam/use-create-vaga";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import { ListaVagas } from "./ListaVagas";

export default function ConfigurarVaga() {
  const [activeTab, setActiveTab] = useState("criar");
  const [exportActions, setExportActions] = useState<ReactNode>(null);
  const [cursoId, setCursoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [anoLetivoId, setAnoLetivoId] = useState("");
  const [numVagas, setNumVagas] = useState("");
  const [cursosOpcionais, setCursosOpcionais] = useState("");

  const { data: cursos = [], isLoading: isLoadingCursos } = useCursos();
  const { data: periodos = [], isLoading: isLoadingPeriodos } =
    useQueryPeriod();
  const { data: anosLetivos = [], isLoading: isLoadingAnosLetivos } =
    useQueryAnoAcademico();

  const createVaga = useCreateVaga();

  function resetForm() {
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
        cursosOpcionais: cursosOpcionais.trim() || undefined,
      },
      {
        onSuccess: resetForm,
      }
    );
  }

  const form = (
    <Card>
      <CardHeader>
        <CardTitle>Criar vaga</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormSelect
              label="Curso"
              value={cursoId}
              onChange={setCursoId}
              options={cursos}
              loading={isLoadingCursos}
              disabled={createVaga.isPending}
              map={(curso) => ({
                key: curso.codigo,
                value: curso.codigo,
                label: curso.designacao,
              })}
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

            <FormSelect
              label="Ano lectivo"
              value={anoLetivoId}
              onChange={setAnoLetivoId}
              options={anosLetivos}
              loading={isLoadingAnosLetivos}
              disabled={createVaga.isPending}
              map={(anoLetivo) => ({
                key: anoLetivo.codigo,
                value: anoLetivo.codigo,
                label: anoLetivo.designacao,
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
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <TabsList>
          <TabsTrigger value="criar">Criação de vagas</TabsTrigger>
          <TabsTrigger value="listagem">Listagem de vagas</TabsTrigger>
        </TabsList>

        {activeTab === "listagem" && exportActions}
      </div>

      <TabsContent value="criar">{form}</TabsContent>

      <TabsContent value="listagem">
        <ListaVagas onExportActionsChange={setExportActions} />
      </TabsContent>
    </Tabs>
  );
}
