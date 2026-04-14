import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, Printer, ChevronLeft, ChevronRight, Home, X, Search, PlayCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useResultadosFinais } from "@/hooks/access_exam/use-resultados-finais";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";
import { parseFilter } from "@/util/parse-filter";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { useCorrigirProvas } from "@/hooks/access_exam/use-corrigir-provas";

type Filters = {
  codigoAnoLetivo: string;
  codigoCurso: string;
  codigoTurno: string;
  codigoFaculdade: string;
  codigoSala: string;

  dataInicio: string;
  dataFim: string;
  dataFimInput: string;
  dataInicioInput: string;
  search: string;

  page: number;
  limit: number;
};

const FILTERS_INITIAL: Filters = {
  codigoAnoLetivo: "",
  codigoCurso: "",
  codigoTurno: "",
  codigoFaculdade: "",
  codigoSala: "",
  dataFimInput: "",
  dataInicio: "",
  dataInicioInput: "",
  dataFim: "",
  search: "",

  page: 1,
  limit: 10,
};

export default function ResultadoFinais() {
  const [filters, setFilters] = useState<Filters>(FILTERS_INITIAL);

  const { data: salas = [] } = useQuerySalas();
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  // === Novo Hook ===
  const { data, isLoading, refetch } = useResultadosFinais({
    codigoAnoLetivo: filters.codigoAnoLetivo ? Number(filters.codigoAnoLetivo) : undefined,
    codigoCurso: filters.codigoCurso ? Number(filters.codigoCurso) : undefined,
    codigoTurno: parseFilter(filters.codigoTurno),
    codigoFaculdade: filters.codigoFaculdade ? Number(filters.codigoFaculdade) : undefined,
    codigoSala: filters.codigoSala ? Number(filters.codigoSala) : undefined,

    search: filters.search || undefined,
    dataInicio: filters.dataInicio || undefined,
    dataFim: filters.dataFim || undefined,
    page: filters.page,
    limit: filters.limit,
  });
  const { mutate: corrigirProvas, isPending } = useCorrigirProvas();

  const seen = new Set<number>();
  const candidatos = (data?.data ?? []).filter((item) => {
    if (seen.has(item.numero_inscricao)) return false;
    seen.add(item.numero_inscricao);
    return true;
  });

  const total = data?.total ?? 0;
  const totalPages = data?.totalpages ?? 1;
  const offset = (filters.page - 1) * filters.limit;

  const exportRows = useMemo(
    () =>
      candidatos.map((item) => ({
        numeroInscricao: item.numero_inscricao,
        nome: item.nome,
        numeroBilhete: item.bilhete_identidade,
        curso: item.curso,
        faculdade: item.faculdade,

        sala: item.sala,
        dataRealizacao: item.data_realizacao,
        nota: item.nota,
        resultado: item.resultado === 1 ? "Admitido" : "Reprovado",
      })),
    [candidatos]
  );

  const pdfData = exportRows.length
    ? {
      filtros: [
        filters.codigoAnoLetivo ? `Ano Letivo: ${filters.codigoAnoLetivo}` : null,
        filters.codigoCurso ? `Curso: ${filters.codigoCurso}` : null,
        filters.codigoTurno ? `Período: ${filters.codigoTurno}` : null,

        filters.dataInicio ? `Data Início: ${filters.dataInicio}` : null,
        filters.dataFim ? `Data Fim: ${filters.dataFim}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      total: exportRows.length,
      rows: exportRows,
    }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Resultado Final"
      subtitle="Classificação geral dos candidatos"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        { title: "Resumo", content: [`Total de registos: ${total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: "12%" },
          { key: "nome", label: "Nome", width: "22%" },
          { key: "numeroBilhete", label: "BI", width: "14%" },
          { key: "curso", label: "Curso", width: "18%" },
          { key: "sala", label: "Sala", width: "10%" },
          { key: "dataRealizacao", label: "Data", width: "12%" },
          { key: "nota", label: "Nota", width: "8%" },
          { key: "resultado", label: "Resultado", width: "8%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
      documentTitle: "Resultado Final",
      subtitle: "Classificação geral dos candidatos",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        { title: "Resumo", content: [`Total de registos: ${total}`] },
      ],
      mainTable: {
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: 18 },
          { key: "nome", label: "Nome", width: 35 },
          { key: "numeroBilhete", label: "BI", width: 20 },
          { key: "curso", label: "Curso", width: 30 },
          { key: "faculdade", label: "Faculdade", width: 30 },
          { key: "sala", label: "Sala", width: 15 },
          { key: "dataRealizacao", label: "Data Realização", width: 18 },
          { key: "nota", label: "Nota", width: 10 },
          { key: "resultado", label: "Resultado", width: 15 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
    : null;

  const baseFileName = `Pauta_Geral_Exame_${new Date().toISOString().slice(0, 10)}`;

  function limparFiltros() {
    setFilters({ ...FILTERS_INITIAL, limit: filters.limit });
  }

  // ==================== FUNÇÕES  ====================
  function handleDataInicio(val: string) {
    if (val) {
      const [yyyy, mm, dd] = val.split("-");
      const dataFormatada = `${dd}/${mm}/${yyyy}`;

      setFilters((prev) => ({
        ...prev,
        dataInicioInput: val,        // para o input
        dataInicio: dataFormatada,   // para a API
        page: 1,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        dataInicioInput: "",
        dataInicio: "",
        page: 1,
      }));
    }
  }

  function handleDataFim(val: string) {
    if (val) {
      const [yyyy, mm, dd] = val.split("-");
      const dataFormatada = `${dd}/${mm}/${yyyy}`;

      setFilters((prev) => ({
        ...prev,
        dataFimInput: val,
        dataFim: dataFormatada,
        page: 1,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        dataFimInput: "",
        dataFim: "",
        page: 1,
      }));
    }
  }
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Pauta Geral</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resultado Final</h1>
          <p className="text-muted-foreground mt-1">Pauta geral com a classificação de todos os candidatos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>

          {candidatos.length > 0
            && (
              <Button onClick={() => corrigirProvas()} disabled={isPending} className="gap-2">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                {isPending ? "Corrigindo provas..." : "Corrigir Provas Agora"}
              </Button>

            )

          }


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
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <FormSelect
              label="Ano Letivo"
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              value={filters.codigoAnoLetivo}
              onChange={(v) => setFilters((p) => ({ ...p, codigoAnoLetivo: v, page: 1 }))}
              options={academicYear}
              map={(a) => ({
                key: a.codigo.toString(),
                label: a.designacao,
                value: a.codigo.toString(),
              })}
            />
          </div>

          <div className="space-y-2">
            <CourseSelect
              value={filters.codigoCurso}
              onChangeValue={(v) => setFilters((p) => ({ ...p, codigoCurso: v, page: 1 }))}
            />
          </div>
          <div className="space-y-2">
            <FacultySelect
              allOption
              value={filters.codigoFaculdade}
              onChangeValue={(v) => setFilters({ ...filters, codigoFaculdade: v, codigoCurso: undefined })}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              disabled={isLoadingPeriodos || isLoadingAcademicYear || filters.codigoAnoLetivo === ""}
              loading={isLoadingPeriodos}
              label="Período"
              value={filters.codigoTurno?.toString() ?? "all"}
              onChange={(v) => setFilters((p) => ({ ...p, codigoTurno: v === "all" ? "" : v, page: 1 }))}
              options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
              map={(p) => ({ key: p.codigo.toString(), label: p.designacao, value: p.codigo.toString() })}
            />
          </div>

          <div className="space-y-2">
            <FormCommandSelect
              label="Sala"
              value={filters.codigoSala}
              width="full"
              placeholder="Selecionar sala"
              options={salas}
              map={(sala) => ({
                key: sala.pk,
                value: sala.pk,
                label: sala.descricao,
              })}
              onChange={(v) => setFilters((p) => ({ ...p, codigoSala: v, page: 1 }))}
            />
          </div>



          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={filters.dataInicioInput}
              onChange={(e) => handleDataInicio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={filters.dataFimInput}
              onChange={(e) => handleDataFim(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Pesquisar por nome ou BI"
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Inscrição</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>BI</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Faculdade</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Data Realização</TableHead>
              <TableHead className="text-center">Nota</TableHead>
              <TableHead>Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {Array.from({ length: 9 }).map((_, j) => (
                  <TableCell key={`skeleton-${i}-${j}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {!isLoading && candidatos.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            )}

            {!isLoading && candidatos.map((item) => (
              <TableRow key={item.numero_inscricao}>
                <TableCell className="font-mono font-semibold">{item.numero_inscricao}</TableCell>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="font-mono text-sm">{item.bilhete_identidade}</TableCell>
                <TableCell className="text-sm">{item.curso}</TableCell>
                <TableCell className="text-sm">{item.faculdade}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.sala}</Badge>
                </TableCell>
                <TableCell className="text-sm">{item.data_realizacao}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      item.nota >= 14
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : item.nota >= 10
                          ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          : "bg-red-500/10 text-red-600 border-red-500/20"
                    }
                  >
                    {item.nota}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.resultado === 1
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }
                  >
                    {item.resultado === 1 ? "Admitido" : "Reprovado"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar</span>
          <Select
            value={filters.limit.toString()}
            onValueChange={(v) => setFilters((p) => ({ ...p, limit: Number(v), page: 1 }))}
          >
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground ml-2">
            Mostrando {total === 0 ? 0 : offset + 1} a {Math.min(offset + filters.limit, total)} de {total} registos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
            disabled={filters.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm">Página {filters.page} de {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
            disabled={filters.page === totalPages}
          >
            Seguinte
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}