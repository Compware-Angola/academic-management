import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home, Loader2, Save, Search } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

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

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useMutationIsentarColisaoCurso, useMutationIsentarColisaoMatricula } from "@/hooks/registrations/use-mutation-isentar-colisao";


type TipoAplicacao = "estudante" | "curso";

export default function IsentarColisao() {
  const [tipoAplicacao, setTipoAplicacao] =
    useState<TipoAplicacao>("estudante");

  const [anoLectivo, setAnoLectivo] = useState("");
  const [codigoMatricula, setCodigoMatricula] = useState("");
  const [curso, setCurso] = useState("");
  const [turno, setTurno] = useState("");

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

  async function handleSalvar() {
    try {
      if (!anoLectivo) {
        alert("Selecione o ano lectivo.");
        return;
      }

      if (tipoAplicacao === "estudante") {
        if (!codigoMatricula) {
          alert("Informe a matrícula do estudante.");
          return;
        }

        const response = await isentarMatricula({
          matricula: Number(codigoMatricula),
          anoLectivo: Number(anoLectivo),
        });

        alert(response.message);
        setCodigoMatricula("");
        return;
      }

      if (!curso) {
        alert("Selecione o curso.");
        return;
      }

      if (!turno) {
        alert("Selecione o turno.");
        return;
      }

      const response = await isentarCurso({
        curso: Number(curso),
        turno: Number(turno),
        anoLectivo: Number(anoLectivo),
      });

      alert(response.message);
      setCurso("");
      setTurno("");
    } catch (error: any) {
      alert(
        error?.response?.data?.message || "Erro ao aplicar isenção de colisão."
      );
    }
  }

  function handleTrocarTipo(value: string) {
    const novoTipo = value as TipoAplicacao;
    setTipoAplicacao(novoTipo);

    setCodigoMatricula("");
    setCurso("");
    setTurno("");
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
          <CardTitle>Modo de Aplicação</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Select value={anoLectivo} onValueChange={setAnoLectivo}>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Pesquisar estudante pela matrícula
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite o número da matrícula"
                    value={codigoMatricula}
                    onChange={(e) => setCodigoMatricula(e.target.value)}
                    className="pl-9"
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

            <div className="flex justify-end">
              <Button onClick={handleSalvar} disabled={isSubmitting}>
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
                <CourseSelect value={curso} onChangeValue={(v) => setCurso(String(v))} />
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
              <Button onClick={handleSalvar} disabled={isSubmitting}>
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