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
import { ChevronDown, ChevronUp, Home } from "lucide-react";
import { Link } from "react-router-dom";

import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useQueryStateLesson } from "@/hooks/use-fetch-state-lesson";
import { useQueryControleAssiduidade } from "@/hooks/assiduidade/use-fetch-controle-assiduidade";
import { Label } from "recharts";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useCursos } from "@/hooks/use-cursos";

function SummaryCard({
  title,
  value,
  className = "",
  valueClassName = "",
}: {
  title: string;
  value: number;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className={`text-2xl font-bold mt-1 ${valueClassName}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ControleAssiduidade() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data: anosAcademicos, isLoading: loadingAno } =
    useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: teachersData = [] } = useQueryTeacther();
  const { data: lessonState = [] } = useQueryStateLesson();
  const { data: cursos = [] } = useCursos();

  const [filters, setFilters] = useState({
    docente: "",
    dataInicial: "",
    dataFinal: "",
    estado: "",
    anoLectivo: "",
    semestre: "",
    curso: "",
    gradeCurricular: "",
    page: 1,
    limit: 20,
  });

  
const {
  data: gradesCurriculares = [],
  isLoading: isLoadingGradeCurricular,
} = useQueryDisciplinaWithFilter(
  {
    curso: filters.curso,
    semestre: filters.semestre,
  },
  {
    enabled: !!filters.curso && !!filters.semestre,
  }
);
      

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 1 } : {}),
    }));
  };

  const queryFilters = {
    docente: filters.docente ? Number(filters.docente) : undefined,
    dataInicial: filters.dataInicial || undefined,
    dataFinal: filters.dataFinal || undefined,
    estado: filters.estado ? Number(filters.estado) : undefined,
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    gradeCurricular: filters.gradeCurricular
    ? Number(filters.gradeCurricular)
    : undefined,
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
  const resumo = response?.resumo ?? {
    marcacoesPendentes: 0,
    presencasMarcadas: 0,
    faltasMarcadas: 0,
  };

  const total = response?.total ?? 0;
  const totalPages = Math.ceil(total / filters.limit);

  const exportRows = aulas.map((item: any) => ({
    data: new Date(item.data_aula).toLocaleDateString(),
    horario: `${item.hora_inicio} - ${item.hora_fim}`,
    curso: item.curso,
    unidade_curricular: item.unidade_curricular,
    tempo: item.ordem_tempo,
    docente: item.docente,
    estado: item.estado_agendamento_designacao || "—",
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
            content: `
Total de registos: ${total}
Marcações Pendentes: ${resumo.marcacoesPendentes}
Presenças Marcadas: ${resumo.presencasMarcadas}
Faltas Marcadas: ${resumo.faltasMarcadas}
            `,
          },
        ]}
        mainTable={{
          headers: [
            { key: "data", label: "Data", width: "12%" },
            { key: "horario", label: "Horário", width: "16%" },
            { key: "curso", label: "Curso", width: "18%" },
            { key: "unidade_curricular", label: "Unidade Curricular", width: "24%" },
            { key: "tempo", label: "Tempo", width: "10%" },
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
              content: `
Total de registos: ${total}
Marcações Pendentes: ${resumo.marcacoesPendentes}
Presenças Marcadas: ${resumo.presencasMarcadas}
Faltas Marcadas: ${resumo.faltasMarcadas}
              `,
            },
          ],
          mainTable: {
            headers: [
              { key: "data", label: "Data", width: 18 },
              { key: "horario", label: "Horário", width: 20 },
              { key: "curso", label: "Curso", width: 22 },
              { key: "unidade_curricular", label: "Unidade Curricular", width: 35 },
              { key: "tempo", label: "Tempo", width: 12 },
              { key: "docente", label: "Docente", width: 25 },
              { key: "estado", label: "Estado", width: 20 },
            ],
            rows: exportRows,
          },
          footerNotice: "Documento gerado automaticamente pelo sistema.",
          primaryColor: "#1e40af",
        }
      : null;

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  
  <div className="flex items-center gap-2 flex-wrap">
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
  </div>

  {exportRows.length > 0 && (
    <div className="flex flex-wrap gap-2">
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
</div>

      

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtros</CardTitle>

             <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMoreFilters(!showMoreFilters)}
        className="text-muted-foreground hover:text-foreground"
      >
        {showMoreFilters ? (
          <>
            Menos filtros <ChevronUp className="ml-1 h-4 w-4" />
          </>
        ) : (
          <>
            Mais filtros <ChevronDown className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>

      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          setFilters({
            docente: "",
            dataInicial: "",
            dataFinal: "",
            estado: "",
            anoLectivo: "",
            semestre: "",
            curso: "",
            gradeCurricular: "",
            page: 1,
            limit: 20,
          })
        }
      >
        Limpar filtros
      </Button>
    </div>
         
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">

            <FormSelect
              label="Ano Letivo"
              value={filters.anoLectivo}
              onChange={(v) => handleFilterChange("anoLectivo", v)}
              options={anosAcademicos ?? []}
              map={(a) => ({
                key: String(a.codigo),
                label: a.designacao,
                value: String(a.codigo),
              })}
              disabled={loadingAno}
            />

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
  label="Semestre"
  value={filters.semestre}
  onChange={(v) =>
    setFilters((prev) => ({
      ...prev,
      semestre: v,
      gradeCurricular: "",
      page: 1,
    }))
  }
  options={semestres ?? []}
  map={(s) => ({
    key: String(s.codigo),
    label: s.designacao,
    value: String(s.codigo),
  })}
/>

            <div className="space-y-1.5">
              <FormCommandSelect
                label="Docente"
                value={filters.docente}
                options={teachersData ?? []}
                map={(t) => ({
                  key: String(t.codigo),
                  label: t.nome,
                  value: String(t.codigo),
                })}
                placeholder="Selecionar docente..."
                onChange={(v) => handleFilterChange("docente", v)}
              />
            </div>

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
                
                {showMoreFilters && (
  <>

      <div className="space-y-1.5">
    
    <FormCommandSelect
      label="Curso"
      value={filters.curso}
      options={cursos}
      map={(c) => ({
        key: String(c.codigo),
        value: String(c.codigo),
        label: c.designacao,
      })}
      placeholder="Selecionar curso..."
      onChange={(v) =>
        setFilters((prev) => ({
          ...prev,
          curso: v,
          gradeCurricular: "",
          page: 1,
        }))
      }
    />
  </div>

  <div className="space-y-1.5">
    
    <FormCommandSelect
      label="Grade Curricular"
      value={filters.gradeCurricular}
      options={gradesCurriculares}
      map={(g) => ({
        key: String(g.pk),
        value: String(g.pk),
        label: g.descricao,
      })}
      placeholder={
        !filters.curso
          ? "Selecione o curso"
          : !filters.semestre
          ? "Selecione o semestre"
          : isLoadingGradeCurricular
          ? "Carregando..."
          : "Selecionar grade curricular"
      }
      onChange={(v) => handleFilterChange("gradeCurricular", v)}
    />
  </div>

  </>

  
)}
            
          </div>
        </CardContent>
      </Card>

      {!!response && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <SummaryCard
      title="Marcações Pendentes"
      value={response.resumo?.marcacoesPendentes ?? 0}
      className="border-amber-500/30 bg-amber-500/5"
      valueClassName="text-amber-700"
    />

    <SummaryCard
      title="Presenças Marcadas"
      value={response.resumo?.presencasMarcadas ?? 0}
      className="border-emerald-500/30 bg-emerald-500/5"
      valueClassName="text-emerald-700"
    />

    <SummaryCard
      title="Faltas Marcadas"
      value={response.resumo?.faltasMarcadas ?? 0}
      className="border-red-500/30 bg-red-500/5"
      valueClassName="text-red-700"
    />
  </div>
)}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resultados</CardTitle>

        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Data da Aula</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Unidade Curricular</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Docente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    A carregar aulas...
                  </TableCell>
                </TableRow>
              ) : aulas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhuma aula encontrada
                  </TableCell>
                </TableRow>
              ) : (
                aulas.map((item: any) => (
                  <TableRow key={item.codigo}>
                    <TableCell>{item.codigo}</TableCell>
                    <TableCell>
                      {new Date(item.data_aula).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {item.hora_inicio} - {item.hora_fim}
                    </TableCell>
                    <TableCell>{item.curso}</TableCell>
                    <TableCell>{item.unidade_curricular}</TableCell>
                    <TableCell>{item.ordem_tempo}</TableCell>
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
