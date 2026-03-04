import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useQueryStateLesson } from "@/hooks/use-fetch-state-lesson";
import { useQueryControleAssiduidade } from "@/hooks/assiduidade/use-fetch-controle-assiduidade";


export default function ControleAssiduidade() {
  const { data: anosAcademicos, isLoading: loadingAno } =
    useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: teachersData = [] } = useQueryTeacther();
  const { data: lessonState = [] } = useQueryStateLesson();

  const [filters, setFilters] = useState({
    docente: "",
    dataInicial: "",
    dataFinal: "",
    estado: "",
    anoLectivo: "",
    semestre: "",
    page: 1,
    limit: 20,
  });

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const queryFilters = {
    docente: filters.docente ? Number(filters.docente) : undefined,
    dataInicial: filters.dataInicial || undefined,
    dataFinal: filters.dataFinal || undefined,
    estado: filters.estado ? Number(filters.estado) : undefined,
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    page: filters.page,
    limit: filters.limit,
  };

  const { data: response, isLoading } =
    useQueryControleAssiduidade(queryFilters, {
      enabled:
        !!queryFilters.docente &&
        !!queryFilters.dataInicial &&
        !!queryFilters.dataFinal,
    });

  const aulas = response?.data ?? [];
  
const total = response?.total ?? 0;
const totalPages = Math.ceil(total / filters.limit);
const exportRows = aulas.map((item: any) => ({
  data: new Date(item.data_aula).toLocaleDateString(),
  horario: `${item.hora_inicio} - ${item.hora_fim}`,
  curso: item.curso,
  unidade_curricular: item.unidade_curricular,
  docente: item.docente,
}));

const pdfContent =
  exportRows.length > 0 ? (
    <GenericPDFDocument
      documentTitle="Controle de Assiduidade"
      subtitle="Relatório de aulas por docente"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: `
Docente: ${filters.docente || "—"}
Data Inicial: ${filters.dataInicial || "—"}
Data Final: ${filters.dataFinal || "—"}
          `,
        },
        {
          title: "Resumo",
          content: `Total de registos: ${total}`,
        },
      ]}
      mainTable={{
        headers: [
          { key: "data", label: "Data", width: "15%" },
          { key: "horario", label: "Horário", width: "20%" },
          { key: "curso", label: "Curso", width: "20%" },
          { key: "unidade_curricular", label: "Unidade Curricular", width: "25%" },
          { key: "docente", label: "Docente", width: "20%" },
        ],
        rows: exportRows,
        headerBackground: "#1e40af",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps =
  exportRows.length > 0
    ? {
        documentTitle: "Controle de Assiduidade",
        subtitle: "Relatório de aulas por docente",
        infoSections: [
          {
            title: "Resumo",
            content: `Total de registos: ${total}`,
          },
        ],
        mainTable: {
          headers: [
            { key: "data", label: "Data", width: 20 },
            { key: "horario", label: "Horário", width: 25 },
            { key: "curso", label: "Curso", width: 25 },
            { key: "unidade_curricular", label: "Unidade Curricular", width: 35 },
            { key: "docente", label: "Docente", width: 25 },
          ],
          rows: exportRows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#1e40af",
      }
    : null;

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
            <BreadcrumbLink>Académico</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Controle de Assiduidade</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* FILTROS (Swagger) */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">

            <FormSelect
              label="Docente"
              value={filters.docente}
              onChange={(v) => handleFilterChange("docente", v)}
              options={teachersData ?? []}
              map={(t) => ({
                key: String(t.codigo),
                label: t.nome,
                value: String(t.codigo),
              })}
              placeholder="Selecione o docente"
            />

            <div>
              <label className="text-sm font-medium">Data Inicial *</label>
              <Input
                type="date"
                value={filters.dataInicial}
                onChange={(e) =>
                  handleFilterChange("dataInicial", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Data Final *</label>
              <Input
                type="date"
                value={filters.dataFinal}
                onChange={(e) =>
                  handleFilterChange("dataFinal", e.target.value)
                }
              />
            </div>

            <FormSelect
              label="Estado da Aula"
              value={filters.estado}
              onChange={(v) => handleFilterChange("estado", v)}
              options={lessonState ?? []}
              map={(e) => ({
                key: String(e.PK_ESTADO_AGENDAMENTO),
                label: e.DESIGNACAO,
                value: String(e.PK_ESTADO_AGENDAMENTO),
              })}
            />

            <FormSelect
              label="Ano Letivo"
              value={filters.anoLectivo}
              onChange={(v) =>
                handleFilterChange("anoLectivo", v)
              }
              options={anosAcademicos ?? []}
              map={(a) => ({
                key: String(a.codigo),
                label: a.designacao,
                value: String(a.codigo),
              })}
              disabled={loadingAno}
            />

            <FormSelect
              label="Semestre"
              value={filters.semestre}
              onChange={(v) =>
                handleFilterChange("semestre", v)
              }
              options={semestres ?? []}
              map={(s) => ({
                key: String(s.codigo),
                label: s.designacao,
                value: String(s.codigo),
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABELA */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resultados</CardTitle>

          {exportRows.length > 0 && (
            <div className="flex gap-2">
              {pdfContent && (
                <PDFActions
                  document={pdfContent}
                  fileName={`Controle_Assiduidade_${new Date()
                    .toISOString()
                    .slice(0, 10)}.pdf`}
                  showDownload
                  showPrint
                />
              )}

              {excelProps && (
                <ExcelActions
                  excelProps={excelProps}
                  fileName={`Controle_Assiduidade_${new Date()
                    .toISOString()
                    .slice(0, 10)}.xlsx`}
                  showDownload
                />
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Unidade Curricular</TableHead>
                <TableHead>Docente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    A carregar aulas...
                  </TableCell>
                </TableRow>
              ) : aulas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma aula encontrada
                  </TableCell>
                </TableRow>
              ) : (
                aulas.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell>
                      {new Date(item.data_aula).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {item.hora_inicio} - {item.hora_fim}
                    </TableCell>
                    <TableCell>{item.curso}</TableCell>
                    <TableCell>{item.unidade_curricular}</TableCell>
                    <TableCell>{item.docente}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
              
              {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">
                  Página {filters.page} de {totalPages} • {total} registos
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page === 1}
                    onClick={() =>
                      handleFilterChange("page", filters.page - 1)
                    }
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page >= totalPages}
                    onClick={() =>
                      handleFilterChange("page", filters.page + 1)
                    }
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}

        </CardContent>
      </Card>
    </div>
  );
}