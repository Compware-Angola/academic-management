import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileText, ChevronLeft, ChevronRight, BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryStatusAgendamento } from "@/hooks/assiduidade/use-fetch-assiduidade-status-agendamentos";
import { useQueryControloGeralAssiduidade } from "@/hooks/sumario/use-fetch-controle-geral-assiduidade-sumario";
import { FormSelect } from "@/components/common/FormSelect";
import { Skeleton } from "@/components/ui/skeleton";



export default function ControleGeral() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: statusAgendamentos, isLoading: isLoadingStatusAgendamento } = useQueryStatusAgendamento({ enabled: true });

  const SEMESTRE = [
    { key: "1", label: "1º Semestre", value: "1" },
    { key: "2", label: "2º Semestre", value: "2" },
  ];

  const { data: teachersData = [] } = useQueryTeacther();

  const [filters, setFilters] = useState({
    docente: "",
    anoCurricular: "all",
    unidadeCurricular: "",
    dataInicio: "",
    dataFim: "",
    estado: "",
    anoLectivo: "",
    semestre: "",
    curso: "",
    page: 1,
    limit: 10,
  });

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } = useQueryDisciplinaWithFilter({
    curso: filters.curso,
    semestre: filters.semestre,
    classe: filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
  });

  const { data: controloGeral, isLoading: isLoadingAulasAgendadas } = useQueryControloGeralAssiduidade({
    docente: filters.docente ? Number(filters.docente) : undefined,
    unidadeCurricular: filters.unidadeCurricular ? Number(filters.unidadeCurricular) : undefined,
    dataInicial: filters.dataInicio || undefined,
    dataFinal: filters.dataFim || undefined,
    estado: filters.estado ? Number(filters.estado) : undefined,
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    page: filters.page,
    limit: filters.limit,
  });

  const { data: cursos } = useCursos();
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  // Dados derivados
  const totalPages = controloGeral?.totalPages ?? 1;
  const totalItems = controloGeral?.total ?? controloGeral?.data?.length ?? 0;
  const currentData = controloGeral?.data ?? [];

  const totais = currentData.reduce(
    (acc, item) => {
      acc.sumariosPendentes += item.controleSumarios.pendentes;
      acc.sumariosLancados += item.controleSumarios.lancados;
      acc.sumariosTotal += item.controleSumarios.total;
      acc.assiduidadePendentes += item.controleAssiduidade.pendentes;
      acc.assiduidadePresenca += item.controleAssiduidade.presenca;
      acc.assiduidadeFalta += item.controleAssiduidade.falta;
      acc.assiduidadeTotal += item.controleAssiduidade.total;
      acc.sumarioComAssiduidade += item.sumarioComAssiduidade;
      return acc;
    },
    {
      sumariosPendentes: 0,
      sumariosLancados: 0,
      sumariosTotal: 0,
      assiduidadePendentes: 0,
      assiduidadePresenca: 0,
      assiduidadeFalta: 0,
      assiduidadeTotal: 0,
      sumarioComAssiduidade: 0
    }
  );

  // ==================== EXPORTAÇÃO ====================
  const exportRows = useMemo(
    () =>
      currentData.map((item) => ({
        codigoAgendamento: item.codigo_agendamento,
        curso: item.curso,
        unidadeCurricular: item.unidadeCurricular,
        docente: item.docente,
        horario: item.horario,
        // Sumários
        sumariosPendentes: item.controleSumarios.pendentes,
        sumariosLancados: item.controleSumarios.lancados,
        sumariosTotal: item.controleSumarios.total,
        // Assiduidades
        assiduidadePendentes: item.controleAssiduidade.pendentes,
        assiduidadePresenca: item.controleAssiduidade.presenca,
        assiduidadeFalta: item.controleAssiduidade.falta,
        assiduidadeTotal: item.controleAssiduidade.total,
        // Sum c/ Assid.
        sumarioComAssiduidade: item.sumarioComAssiduidade,
      })),
    [currentData]
  );

  const filtrosAplicados = [
    filters.anoLectivo ? `Ano Letivo: ${filters.anoLectivo}` : null,
    filters.semestre ? `Semestre: ${filters.semestre}º` : null,
    filters.estado ? `Estado: ${filters.estado}` : null,
    filters.dataInicio ? `Data Início: ${filters.dataInicio}` : null,
    filters.dataFim ? `Data Fim: ${filters.dataFim}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const pdfData = exportRows.length
    ? {
      filtros: filtrosAplicados,
      total: exportRows.length,
      rows: exportRows,
    }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Controle Geral de Sumário & Assiduidade"
      subtitle="Visão consolidada de sumários e assiduidades por aula agendada"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        {
          title: "Resumo",
          content: [
            `Total de registos: ${totalItems}`,
            `Sumários Pendentes: ${totais.sumariosPendentes} | Lançados: ${totais.sumariosLancados} | Total: ${totais.sumariosTotal}`,
            `Assiduidade Pendentes: ${totais.assiduidadePendentes} | Presença: ${totais.assiduidadePresenca} | Falta: ${totais.assiduidadeFalta} | Total: ${totais.assiduidadeTotal}`,
          ],
        },
      ]}
      mainTable={{
        headers: [
          { key: "codigoAgendamento", label: "Código", width: "8%" },
          { key: "curso", label: "Curso", width: "12%" },
          { key: "unidadeCurricular", label: "UC", width: "16%" },
          { key: "docente", label: "Docente", width: "14%" },
          { key: "horario", label: "Horário", width: "10%" },
          { key: "sumariosPendentes", label: "S.Pend.", width: "6%" },
          { key: "sumariosLancados", label: "S.Lanç.", width: "6%" },
          { key: "sumariosTotal", label: "S.Tot.", width: "6%" },
          { key: "assiduidadePendentes", label: "A.Pend.", width: "6%" },
          { key: "assiduidadePresenca", label: "A.Pres.", width: "6%" },
          { key: "assiduidadeFalta", label: "A.Falt.", width: "6%" },
          { key: "assiduidadeTotal", label: "A.Tot.", width: "6%" },
          { key: "sumarioComAssiduidade", label: "S.c/A.", width: "6%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
      documentTitle: "Controle Geral de Sumário & Assiduidade",
      subtitle: "Visão consolidada de sumários e assiduidades por aula agendada",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        {
          title: "Resumo",
          content: [
            `Total de registos: ${totalItems}`,
            `Sumários Pendentes: ${totais.sumariosPendentes} | Lançados: ${totais.sumariosLancados} | Total: ${totais.sumariosTotal}`,
            `Assiduidade Pendentes: ${totais.assiduidadePendentes} | Presença: ${totais.assiduidadePresenca} | Falta: ${totais.assiduidadeFalta} | Total: ${totais.assiduidadeTotal}`,
          ],
        },
      ],
      mainTable: {
        headers: [
          { key: "codigoAgendamento", label: "Código", width: 14 },
          { key: "curso", label: "Curso", width: 25 },
          { key: "unidadeCurricular", label: "Unidade Curricular", width: 30 },
          { key: "docente", label: "Docente", width: 30 },
          { key: "horario", label: "Horário", width: 18 },
          { key: "sumariosPendentes", label: "Sum. Pendentes", width: 16 },
          { key: "sumariosLancados", label: "Sum. Lançados", width: 16 },
          { key: "sumariosTotal", label: "Sum. Total", width: 14 },
          { key: "assiduidadePendentes", label: "Assid. Pendentes", width: 18 },
          { key: "assiduidadePresenca", label: "Assid. Presença", width: 18 },
          { key: "assiduidadeFalta", label: "Assid. Falta", width: 15 },
          { key: "assiduidadeTotal", label: "Assid. Total", width: 14 },
          { key: "sumarioComAssiduidade", label: "Sum. c/ Assid.", width: 16 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
    : null;

  const baseFileName = `Controle_Geral_Sumario_Assiduidade_${new Date().toISOString().slice(0, 10)}`;
  // ==================== FIM EXPORTAÇÃO ====================

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = Number(value);
    setItemsPerPage(newLimit);
    updateFilters({ limit: newLimit, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const updateFilters = (newValues: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newValues,
      page: 1,
    }));
    setCurrentPage(1);
  };


  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Início</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/sumario/listagem">Sumário</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Controle Geral</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Controle Geral de Sumário & Assiduidade</h1>
            <p className="text-sm text-muted-foreground">Visão consolidada de sumários e assiduidades por aula agendada</p>
          </div>
        </div>

        {/* Botões de exportação */}
        <div className="flex flex-wrap gap-2">
          {pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`${baseFileName}.pdf`}
              showDownload
              showPrint
            />
          )}
          {excelProps && (
            <ExcelActions
              excelProps={excelProps}
              fileName={`${baseFileName}.xlsx`}
              showDownload
            />
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showMoreFilters ? (
                <>Menos filtros <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>Mais filtros <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setFilters({
                  docente: "",
                  anoLectivo: "",
                  semestre: "",
                  estado: "",
                  dataInicio: "",
                  dataFim: "",
                  curso: "",
                  anoCurricular: "all",
                  unidadeCurricular: "",
                  page: 1,
                  limit: itemsPerPage,
                });
                setCurrentPage(1);
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Filtros sempre visíveis */}
          <div className="space-y-1.5">
            <Label>Ano Letivo</Label>
            <FormSelect
              disabled={isLoadingAcademicYear}
              value={filters.anoLectivo}
              onChange={(v) => updateFilters({ anoLectivo: v })}
              options={anosAcademicos ?? []}
              map={(a) => ({ key: a.codigo, label: a.designacao, value: String(a.codigo) })}
              placeholder="Selecione o ano..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Estado</Label>
            <FormSelect
              disabled={isLoadingStatusAgendamento}
              value={filters.estado ?? ""}
              onChange={(v) => updateFilters({ estado: v === "" ? "" : v })}
              options={[
                { key: "todos", label: "Todos os estados", value: null },
                ...(statusAgendamentos ?? []).map((s) => ({
                  key: s.codigo,
                  label: s.designacao,
                  value: String(s.codigo),
                })),
              ]}
              map={(opt) => opt}
              placeholder="Selecione o estado..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Semestre</Label>
            <FormSelect
              value={filters.semestre}
              onChange={(v) => updateFilters({ semestre: v })}
              options={SEMESTRE}
              map={(s) => ({ key: s.key, label: s.label, value: s.value })}
              placeholder="Selecione o semestre..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Docente</Label>
            <FormCommandSelect
              value={filters.docente}
              options={teachersData}
              map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
              onChange={(codigo) => updateFilters({ docente: codigo })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data início</Label>
            <Input
              type="date"
              value={filters.dataInicio ?? ""}
              onChange={(e) => updateFilters({ dataInicio: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data fim</Label>
            <Input
              type="date"
              value={filters.dataFim ?? ""}
              onChange={(e) => updateFilters({ dataFim: e.target.value })}
            />
          </div>

          {showMoreFilters && (
            <>
              <div className="space-y-1.5">
                <Label>Curso</Label>
                <FormCommandSelect
                  value={filters.curso}
                  options={cursos}
                  map={(c) => ({
                    key: c.codigo.toString(),
                    value: c.codigo.toString(),
                    label: c.designacao,
                  })}
                  onChange={(v) => updateFilters({ curso: v, unidadeCurricular: "" })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Ano Curricular</Label>
                <Select
                  value={filters.anoCurricular}
                  onValueChange={(v) => updateFilters({ anoCurricular: v, unidadeCurricular: "" })}
                  disabled={!filters.curso}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filters.curso ? "Todos os anos" : "Selecione curso"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {anosCurriculares.map((ac) => (
                      <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                        {ac.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Unidade Curricular</Label>
                <FormCommandSelect
                  value={filters.unidadeCurricular}
                  options={unidadesCurriculares}
                  map={(u) => ({ key: u.pk.toString(), value: u.pk.toString(), label: u.descricao })}
                  placeholder={
                    !filters.curso
                      ? "Selecione curso"
                      : !filters.semestre
                        ? "Selecione semestre"
                        : isLoadingUC
                          ? "Carregando UCs..."
                          : "Selecionar UC"
                  }
                  onChange={(u) => updateFilters({ unidadeCurricular: u })}
                />
              </div>
            </>
          )}
        </div>
      </div>


      {/* Resumo Sumários vs Assiduidades */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Card Sumários */}
        <Card className="p-4 md:col-span-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Resumo de Sumários
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Pendentes", value: totais.sumariosPendentes, color: "text-amber-600" },
              { label: "Lançados", value: totais.sumariosLancados, color: "text-emerald-600" },
              { label: "Total", value: totais.sumariosTotal, color: "text-foreground" },
            ].map((item) => (
              <div key={item.label} className="text-center p-2 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Card Assiduidade */}
        <Card className="p-4 md:col-span-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Resumo de Assiduidades
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Pendentes", value: totais.assiduidadePendentes, color: "text-amber-600" },
              { label: "Presença", value: totais.assiduidadePresenca, color: "text-emerald-600" },
              { label: "Falta", value: totais.assiduidadeFalta, color: "text-red-600" },
              { label: "Total", value: totais.assiduidadeTotal, color: "text-foreground" },
            ].map((item) => (
              <div key={item.label} className="text-center p-2 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Card Sumário com Assiduidade (menor) */}
        <Card className="p-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Sumário com Assiduidade
          </h3>
          <div className="text-center p-2 rounded-md bg-muted/50">
            <p className="text-xl font-bold text-amber-600">
              {totais.sumarioComAssiduidade}
            </p>
          </div>
        </Card>
      </div>

      {/* Tabela Principal */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className="border-r align-middle">Código</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">Curso</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">UC</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">Docente</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">Horário</TableHead>
                <TableHead colSpan={3} className="text-center border-r bg-blue-50 dark:bg-blue-950/30 font-semibold">Controle de Sumários</TableHead>
                <TableHead colSpan={4} className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 font-semibold">Controle de Assiduidades</TableHead>
                <TableHead rowSpan={2} className="text-center align-middle bg-purple-50 dark:bg-purple-950/30 font-semibold">Sum. c/ Assid.</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center border-r bg-blue-50 dark:bg-blue-950/30 text-xs">Pend.</TableHead>
                <TableHead className="text-center border-r bg-blue-50 dark:bg-blue-950/30 text-xs">Lanç.</TableHead>
                <TableHead className="text-center border-r bg-blue-50 dark:bg-blue-950/30 text-xs">Total</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Pend.</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Pres.</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Falta</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingAulasAgendadas ? (
                <TableRow>
                  <TableCell colSpan={13} className="py-10">
                    <div className="flex flex-col gap-3 w-full">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={18} className="text-center py-10 text-muted-foreground">
                    Nenhum registo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((item) => (
                  <TableRow key={item.codigo_agendamento}>
                    <TableCell className="border-r font-mono text-xs">{item.codigo_agendamento}</TableCell>
                    <TableCell className="border-r font-mono text-xs">{item.curso}</TableCell>
                    <TableCell className="border-r text-sm font-medium">{item.unidadeCurricular}</TableCell>
                    <TableCell className="border-r text-sm">{item.docente}</TableCell>
                    <TableCell className="border-r text-sm whitespace-nowrap">{item.horario}</TableCell>
                    {/* Sumários */}
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10">
                      <span className={item.controleSumarios.pendentes > 0 ? "text-amber-600 font-semibold" : "text-muted-foreground"}>{item.controleSumarios.pendentes}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10">
                      <span className="text-emerald-600 font-semibold">{item.controleSumarios.lancados}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10 font-semibold">{item.controleSumarios.total}</TableCell>
                    {/* Assiduidades */}
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className={item.controleAssiduidade.pendentes > 0 ? "text-amber-600 font-semibold" : "text-muted-foreground"}>{item.controleAssiduidade.pendentes}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className="text-emerald-600 font-semibold">{item.controleAssiduidade.presenca}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className="text-red-600 font-semibold">{item.controleAssiduidade.falta}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10 font-semibold">{item.controleAssiduidade.total}</TableCell>
                    {/* Sum c/ Assiduidade */}
                    <TableCell className="text-center bg-purple-50/50 dark:bg-purple-950/10">
                      <span className="font-semibold text-primary">{item.sumarioComAssiduidade}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between p-4 border-t flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Itens por página:</span>
            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{totalItems} resultado(s)</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}