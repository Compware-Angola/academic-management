import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { FormSelectIsaac } from "@/components/common/FormSelectIsaac";

import { useCursos } from "@/hooks/use-cursos";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { usePresenceAttendance } from "@/hooks/avaliacao/use-presence-attendance";

export default function PresenceList() {
  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    unidadeCurricular: "",
    horarioId: "",
    tipoAvaliacao: "",
    tipoProva: "",
  });

  // Hook da API
  const [anoLectivo, setAnoLectivo] = useState(21);
  const [horarioPk, setHorarioPk] = useState(20505);
  const [situacaoFinanceira, setSituacaoFinanceira] = useState(2);
  const [tipoAvaliacao1, setTipoAvaliacao] = useState(2);

  const {
    data: presenceAttendanceList,
    isLoading,
    refetch,
  } = usePresenceAttendance(
    {
      anoLectivo,
      horarioPk,
      situacao_financeira: situacaoFinanceira,
      tipo_avaliacao: tipoAvaliacao1,
    },
    true
  );

  // Popula estudantes da API para a tabela
  const estudantes = useMemo(() => {
    if (!presenceAttendanceList) return [];
    return presenceAttendanceList.map((item, index) => ({
      id: index + 1,
      numero: item.numero_matricula.toString(),
      nome: item.nome,
      curso: "Licenciatura em Informática",
      situacaoFinanceira:
        item.meses_pagos >= item.meses_obrigatorios
          ? "Regular"
          : item.eh_bolseiro
          ? "Isento"
          : "Devedor",
      presente: item.primeira_frequencia > 0 || item.segunda_frequencia > 0,
    }));
  }, [presenceAttendanceList]);

  const handlePresencaChange = (estudanteId: number, presente: boolean) => {
    estudantes.forEach((e) => {
      if (e.id === estudanteId) e.presente = presente;
    });
  };

  const handleMarcarTodos = (presente: boolean) => {
    estudantes.forEach((e) => (e.presente = presente));
  };

  const handleSavePresencas = () => {
    const presentes = estudantes.filter((e) => e.presente).length;
    const ausentes = estudantes.filter((e) => !e.presente).length;
    toast({
      title: "Presenças guardadas",
      description: `${presentes} presentes, ${ausentes} ausentes registados com sucesso.`,
    });
  };

  const getSituacaoFinanceiraBadge = (situacao: string) => {
    switch (situacao) {
      case "Regular":
        return (
          <Badge variant="default" className="bg-green-600">
            Regular
          </Badge>
        );
      case "Devedor":
        return <Badge variant="destructive">Devedor</Badge>;
      case "Isento":
        return <Badge variant="secondary">Isento</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
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
          <BreadcrumbItem>
            <BreadcrumbLink>Avaliações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lista de Presença</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Lista de Presença</h1>
      <p className="text-muted-foreground">
        Gestão de presenças em avaliações académicas.
      </p>

      {/* Botão Listar */}
      <div className="flex gap-2 mb-4">
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-5 w-5 mr-2" />
          Listar
        </Button>
        <Button onClick={() => handleMarcarTodos(true)}>Marcar Todos</Button>
        <Button onClick={() => handleMarcarTodos(false)}>
          Desmarcar Todos
        </Button>
        <Button onClick={handleSavePresencas}>Guardar Presenças</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudantes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando estudantes...</p>
          ) : estudantes.length === 0 ? (
            <div className="text-center py-12">Nenhum registo encontrado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableRow>
                    <TableHead className="w-12">Presente</TableHead>
                    <TableHead>Nº Estudante</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Situação Financeira</TableHead>
                  </TableRow>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudantes.map((estudante) => (
                  <TableRow key={estudante.id}>
                    <TableCell>
                      <Checkbox
                        checked={estudante.presente}
                        onCheckedChange={(checked) =>
                          handlePresencaChange(estudante.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-mono">
                      {estudante.numero}
                    </TableCell>
                    <TableCell>{estudante.nome}</TableCell>
                    <TableCell>{estudante.curso}</TableCell>
                    <TableCell>
                      {getSituacaoFinanceiraBadge(estudante.situacaoFinanceira)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
