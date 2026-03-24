import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Download, Printer, ChevronLeft, ChevronRight, ArrowUpDown, RefreshCw, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useQueryEstatisticaAssiduidadeDocente } from "@/hooks/assiduidade/use-fetch-EstatisticaAssiduidadeDocente";

type SortField = "n_mecanografico" | "nome" | "grau_academico" | "escalao";

const SEMESTRE = [
  { key: "1", label: "1º Semestre", value: "1" },
  { key: "2", label: "2º Semestre", value: "2" },
];

export default function SalarioDocente() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("n_mecanografico");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState({
    docente: "",
    naoCobrarFaltas: false,
    exigirPresencasConfirmadas: false,
    exigirSumariosValidos: false,
    exigirSumariosInseridos: false,
    dataInicio: "",
    dataFim: "",
    anoLectivo: "",
    semestre: "",
    curso: "",
    search:"",
    page: 1,
    limit: 10,
  });

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: teachersData = [] } = useQueryTeacther();

  const { data: response, isLoading, refetch } = useQueryEstatisticaAssiduidadeDocente({
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : 0,
    semestre: filters.semestre ? Number(filters.semestre) : 0,
    curso: filters.curso ? Number(filters.curso) : 0,
    docente: filters.docente ? Number(filters.docente) : 0,
    dataInicial: filters.dataInicio || undefined,
    dataFinal: filters.dataFim || undefined,
    naoCobrarFaltas: filters.naoCobrarFaltas,
    exigirPresencasConfirmadas: filters.exigirPresencasConfirmadas,
    exigirSumariosInseridos: filters.exigirSumariosInseridos,
    exigirSumariosValidos: filters.exigirSumariosValidos,
     search: filters.search || undefined,
    page: filters.page,
    limit: filters.limit,
  });

  const data = response?.data ?? [];
  const total = response?.total ?? 0;
  const totalPages = response?.totalPages ?? 1;

  const updateFilters = (newValues: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newValues, page: 1 }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDirection("asc"); }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      return dir * String(a[sortField] ?? "").localeCompare(String(b[sortField] ?? ""));
    });
  }, [data, sortField, sortDirection]);

  const resumo = useMemo(() => ({
    totalDocentes: total,
    totalHorasEfetivas: data.reduce((s, d) => s + (Number(d.total_horas_efetivas) || 0), 0),
    totalFaltas: data.reduce((s, d) => s + (Number(d.total_faltas_geral) || 0), 0),
    totalGeral: data.reduce((s, d) => s + (Number(d.total_geral) || 0), 0),
  }), [data, total]);

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  const n = (val: any) => Number(val) || 0;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/gestao-docentes">Gestão de Docentes</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Salário</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestão de Salários</h1>
          <p className="text-muted-foreground mt-1">Controle de horas, assiduidade e cálculo salarial dos docentes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
           {/*
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Excel</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />PDF</Button>
          */}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setFilters({
                docente: "", anoLectivo: "", semestre: "",
                exigirPresencasConfirmadas: false, exigirSumariosInseridos: false,
                exigirSumariosValidos: false, naoCobrarFaltas: false,search:"",
                dataInicio: "", dataFim: "", curso: "", page: 1, limit: itemsPerPage,
              });
              setCurrentPage(1);
            }}
          >
            Limpar filtros
          </Button>
        </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    <Label>Curso</Label>
    <FormCommandSelect
      value={filters.curso}
      options={[]}
      map={(c) => ({ key: c.codigo, value: c.codigo, label: c.designacao })}
      onChange={(v) => updateFilters({ curso: v })}
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

  <div className="space-y-1.5 lg:col-span-2">
    <Label>Pesquisar</Label>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder="Pesquisar por nome ou Nº Mec..."
        value={filters.search}
        onChange={(e) => updateFilters({ search: e.target.value })}
      />
    </div>
  </div>
</div>

        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Opções de Cálculo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Não Cobrar Faltas</Label>
                <p className="text-xs text-muted-foreground">Ignora faltas no cálculo salarial</p>
              </div>
              <Switch checked={filters.naoCobrarFaltas} onCheckedChange={(c) => updateFilters({ naoCobrarFaltas: c })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Exigir Presenças Confirmadas Pelos Sumaristas</Label>
                <p className="text-xs text-muted-foreground">Só conta presenças confirmadas por sumaristas</p>
              </div>
              <Switch checked={filters.exigirPresencasConfirmadas} onCheckedChange={(c) => updateFilters({ exigirPresencasConfirmadas: c })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Exigir Sumários Inseridos</Label>
                <p className="text-xs text-muted-foreground">Requer sumários inseridos para contabilizar</p>
              </div>
              <Switch checked={filters.exigirSumariosInseridos} onCheckedChange={(c) => updateFilters({ exigirSumariosInseridos: c })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Exigir Sumários Válidos</Label>
                <p className="text-xs text-muted-foreground">Apenas sumários validados são contabilizados</p>
              </div>
              <Switch checked={filters.exigirSumariosValidos} onCheckedChange={(c) => updateFilters({ exigirSumariosValidos: c })} />
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Docentes</p>
          <p className="text-2xl font-bold">{resumo.totalDocentes}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Horas Efectivas</p>
          <p className="text-2xl font-bold text-emerald-600">{resumo.totalHorasEfetivas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Faltas</p>
          <p className="text-2xl font-bold text-red-600">{resumo.totalFaltas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Geral</p>
          <p className="text-2xl font-bold text-primary">{resumo.totalGeral}</p>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>

                {/* ── LINHA 1: grupos principais ── */}
                <TableRow>
                  {/* Identificação — rowSpan=3 */}
                  <TableHead rowSpan={3} className="border border-border align-middle whitespace-nowrap text-xs px-2">
                    <SortHeader field="n_mecanografico">Nº Mec</SortHeader>
                  </TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle whitespace-nowrap text-xs px-2">
                    <SortHeader field="nome">Nome</SortHeader>
                  </TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle whitespace-nowrap text-xs px-2">
                    <SortHeader field="grau_academico">Grau Académico</SortHeader>
                  </TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2">
                    <SortHeader field="escalao">Escalão</SortHeader>
                  </TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2">Categoria</TableHead>

                  {/* Aulas — rowSpan=3 */}
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2">Aulas Semanais</TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2">Aulas Mensais</TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2">Total Previstas</TableHead>

                  {/* Totais Período — rowSpan=3 */}
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-blue-50 dark:bg-blue-950/30">TM</TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-blue-50 dark:bg-blue-950/30">TS</TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-blue-50 dark:bg-blue-950/30">TA</TableHead>

                  {/* Horas — rowSpan=3 */}
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-emerald-50 dark:bg-emerald-950/20">Total Horas Efectivas</TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-emerald-50 dark:bg-emerald-950/20">Total Horas Salarial</TableHead>

                  {/* Faltas — rowSpan=3 */}
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-red-50 dark:bg-red-950/20">Total Faltas</TableHead>

                  {/* AP grupo — colSpan=3 */}
                  <TableHead colSpan={3} className="border border-border text-center text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40">
                    AP — Aulas Presenciais
                  </TableHead>

                  {/* AV grupo — colSpan=3 */}
                  <TableHead colSpan={3} className="border border-border text-center text-xs font-semibold bg-teal-100 dark:bg-teal-900/40">
                    AV — Aulas Virtuais
                  </TableHead>

                  {/* Totais Gerais — rowSpan=3 */}
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-purple-50 dark:bg-purple-950/20">Total Presenças</TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-purple-50 dark:bg-purple-950/20">Total Faltas Geral</TableHead>
                  <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs px-2 bg-purple-50 dark:bg-purple-950/20 font-bold">Total Geral</TableHead>
                </TableRow>

                {/* ── LINHA 2: sub-colunas AP e AV ── */}
                <TableRow>
                  {/* AP: P, F, Total */}
                  <TableHead className="border border-border text-center text-xs bg-emerald-100/70 dark:bg-emerald-900/30 whitespace-nowrap px-2">P — Presença</TableHead>
                  <TableHead className="border border-border text-center text-xs bg-emerald-100/70 dark:bg-emerald-900/30 whitespace-nowrap px-2">F — Falta</TableHead>
                  <TableHead className="border border-border text-center text-xs bg-emerald-100/70 dark:bg-emerald-900/30 font-semibold whitespace-nowrap px-2">Total</TableHead>
                  {/* AV: P, F, Total */}
                  <TableHead className="border border-border text-center text-xs bg-teal-100/70 dark:bg-teal-900/30 whitespace-nowrap px-2">P — Presença</TableHead>
                  <TableHead className="border border-border text-center text-xs bg-teal-100/70 dark:bg-teal-900/30 whitespace-nowrap px-2">F — Falta</TableHead>
                  <TableHead className="border border-border text-center text-xs bg-teal-100/70 dark:bg-teal-900/30 font-semibold whitespace-nowrap px-2">Total</TableHead>
                </TableRow>

              </TableHeader>

              <TableBody>
                {sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={24} className="text-center py-10 text-muted-foreground">
                      Nenhum registo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/50">
                      {/* Identificação */}
                      <TableCell className="border border-border font-mono text-xs whitespace-nowrap px-2">{item.n_mecanografico}</TableCell>
                      <TableCell className="border border-border text-xs font-medium whitespace-nowrap px-2">{item.nome}</TableCell>
                      <TableCell className="border border-border text-xs whitespace-nowrap px-2">{item.grau_academico}</TableCell>
                      <TableCell className="border border-border text-xs text-center px-2">{item.escalao}</TableCell>
                      <TableCell className="border border-border text-xs text-center px-2">{item.categoria}</TableCell>

                      {/* Aulas */}
                      <TableCell className="border border-border text-center text-xs px-2">{n(item.aulas_semanais)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2">{n(item.aulas_mensais)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2">{n(item.total_aulas_previstas)}</TableCell>

                      {/* TM, TS, TA */}
                      <TableCell className="border border-border text-center text-xs px-2 bg-blue-50/50 dark:bg-blue-950/10">{n(item.tm)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-blue-50/50 dark:bg-blue-950/10">{n(item.ts)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-blue-50/50 dark:bg-blue-950/10">{n(item.ta)}</TableCell>

                      {/* Horas */}
                      <TableCell className="border border-border text-center text-xs px-2 bg-emerald-50/50 dark:bg-emerald-950/10 font-semibold text-emerald-700">
                        {n(item.total_horas_efetivas)}
                      </TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-emerald-50/50 dark:bg-emerald-950/10">
                        {n(item.total_horas_salarial)}
                      </TableCell>

                      {/* Total Faltas */}
                      <TableCell className="border border-border text-center text-xs px-2 bg-red-50/50 dark:bg-red-950/10">
                        <span className={n(item.total_faltas) > 0 ? "text-red-600 font-semibold" : "text-muted-foreground"}>
                          {n(item.total_faltas)}
                        </span>
                      </TableCell>

                      {/* AP */}
                      <TableCell className="border border-border text-center text-xs px-2 bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-700">{n(item.ap_presenca)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-emerald-50/40 dark:bg-emerald-950/10 text-red-600">{n(item.ap_falta)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-emerald-50/40 dark:bg-emerald-950/10 font-semibold">{n(item.ap_total)}</TableCell>

                      {/* AV */}
                      <TableCell className="border border-border text-center text-xs px-2 bg-teal-50/40 dark:bg-teal-950/10 text-teal-700">{n(item.av_presenca)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-teal-50/40 dark:bg-teal-950/10 text-red-600">{n(item.av_falta)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-teal-50/40 dark:bg-teal-950/10 font-semibold">{n(item.av_total)}</TableCell>

                      {/* Totais Gerais */}
                      <TableCell className="border border-border text-center text-xs px-2 bg-purple-50/50 dark:bg-purple-950/10 text-emerald-700 font-semibold">{n(item.total_presencas)}</TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-purple-50/50 dark:bg-purple-950/10 text-red-600">
                        {n(item.total_faltas_geral)}
                      </TableCell>
                      <TableCell className="border border-border text-center text-xs px-2 bg-purple-50/50 dark:bg-purple-950/10 font-bold text-primary">
                        {n(item.total_geral)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Paginação */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mostrar</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => {
                const newLimit = Number(v);
                setItemsPerPage(newLimit);
                updateFilters({ limit: newLimit, page: 1 });
              }}
            >
              <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <span>de {total} registos</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">{currentPage} / {totalPages || 1}</span>
            <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}