import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { FilterCandidatoProvaParams } from "@/services/access_exam/fetch-prova-candidatos.service";
import { useListProvaPorCandidato } from "@/hooks/access_exam/use-prova-por-candidato";

export default function ListaProvaPorCandidatos() {
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const [filters, setFilters] = useState({
    search: undefined,
    page: 1,
    limit: 10,
    codigoAnoLetivo: undefined,
    codigoCurso: undefined,
    codigoTurno: undefined,
    codigoFaculdade: undefined,
  });

  const { data, isLoading, refetch } = useListProvaPorCandidato(filters);

  const candidatos = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / (filters.limit ?? 10));
  const offset = ((filters.page ?? 1) - 1) * (filters.limit ?? 10);

  // ── Export ────────────────────────────────────────────────────────────────
  const exportRows = useMemo(
    () =>
      candidatos.map((c) => ({
        numeroInscricao: c.numero_inscricao,
        nome: c.nome,
        curso: c.curso,
        periodo: c.periodo,
        faculdade: c.faculdade,
        anoLectivo: c.ano_lectivo,
        listaDeProvas: c.lista_de_provas.join(", "),
      })),
    [candidatos]
  );

  const filtrosLabel = [
    filters.search ? `Pesquisa: ${filters.search}` : null,
    filters.codigoAnoLetivo ? `Ano Letivo: ${filters.codigoAnoLetivo}` : null,
    filters.codigoCurso ? `Curso: ${filters.codigoCurso}` : null,
    filters.codigoTurno ? `Turno: ${filters.codigoTurno}` : null,
    filters.codigoFaculdade ? `Faculdade: ${filters.codigoFaculdade}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Lista de Provas por Candidato"
        subtitle="Candidatos e respectivas provas de acesso"
        infoSections={[
          { title: "Filtros Aplicados", content: filtrosLabel || "Sem filtros" },
        ]}
        mainTable={{
          headers: [
            { key: "numeroInscricao", label: "Nº Inscrição", width: "12%" },
            { key: "nome", label: "Nome", width: "22%" },
            { key: "curso", label: "Curso", width: "18%" },
            { key: "periodo", label: "Período", width: "10%" },
            { key: "faculdade", label: "Faculdade", width: "20%" },
            { key: "anoLectivo", label: "Ano Letivo", width: "10%" },
            { key: "listaDeProvas", label: "Provas", width: "18%" },
          ],
          rows: exportRows,
          headerBackground: "#0D1B48",
        }}
        footerNotice="Documento gerado automaticamente pelo sistema."
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Lista de Provas por Candidato",
          subtitle: "Candidatos e respectivas provas de acesso",
          infoSections: [
            { title: "Filtros Aplicados", content: filtrosLabel || "Sem filtros" },
            { title: "Resumo", content: [`Total de registos: ${total}`] },
          ],
          mainTable: {
            headers: [
              { key: "numeroInscricao", label: "Nº Inscrição", width: 18 },
              { key: "nome", label: "Nome", width: 30 },
              { key: "curso", label: "Curso", width: 25 },
              { key: "periodo", label: "Período", width: 15 },
              { key: "faculdade", label: "Faculdade", width: 35 },
              { key: "anoLectivo", label: "Ano Letivo", width: 18 },
              { key: "listaDeProvas", label: "Provas", width: 40 },
            ],
            rows: exportRows,
          },
          footerNotice: "Documento gerado automaticamente pelo sistema.",
          primaryColor: "#0D1B48",
        }
      : null;

  const baseFileName = `Lista_Provas_Candidatos_${new Date().toISOString().slice(0, 10)}`;

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleLimitChange(value: string) {
    setFilters((prev) => ({ ...prev, limit: Number(value), page: 1 }));
  }

  function handlePageChange(newPage: number) {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }

  function clearFilters() {
    setFilters({
      search: undefined,
      page: 1,
      limit: filters.limit,
      codigoAnoLetivo: undefined,
      codigoCurso: undefined,
      codigoTurno: undefined,
      codigoFaculdade: undefined,
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Exame de Acesso</span>
        <span>/</span>
        <span className="text-foreground">Lista de provas por candidato</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de provas por candidato</h1>
          <p className="text-muted-foreground mt-1">
            Consulta das provas associadas a cada candidato ao exame de acesso
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar lista
          </Button>

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
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        

          <FormSelect
            label="Ano Letivo"
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            value={filters.codigoAnoLetivo}
            onChange={(v) => setFilters((prev) => ({ ...prev, codigoAnoLetivo: v, page: 1 }))}
            options={academicYear}
            map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
          />

          <FacultySelect
            allOption
            value={filters.codigoFaculdade}
            onChangeValue={(v) =>
              setFilters((prev) => ({ ...prev, codigoFaculdade: v, codigoCurso: undefined, page: 1 }))
            }
          />

          <CourseSelect
            value={filters.codigoCurso}
            onChangeValue={(v) => setFilters((prev) => ({ ...prev, codigoCurso: v, page: 1 }))}
          />

          <FormSelect
            disabled={isLoadingPeriodos}
            loading={isLoadingPeriodos}
            label="Turno"
            value={filters.codigoTurno?.toString() ?? "all"}
            onChange={(v) =>
              setFilters((prev) => ({ ...prev, codigoTurno: v === "all" ? undefined : Number(v), page: 1 }))
            }
            options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
            map={(p) => ({ key: p.codigo.toString(), label: p.designacao, value: p.codigo.toString() })}
          />
            <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Nome do candidato..."
              value={filters.search ?? ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value || undefined, page: 1 }))
              }
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : candidatos.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground">
            Não foram encontrados candidatos com os critérios selecionados
          </p>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Inscrição</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Faculdade</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Ano Letivo</TableHead>
                    <TableHead>Provas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidatos.map((candidato) => (
                    <TableRow key={candidato.numero_inscricao}>
                      <TableCell className="font-mono text-sm font-semibold">
                        {candidato.numero_inscricao}
                      </TableCell>
                      <TableCell className="font-medium">{candidato.nome}</TableCell>
                      <TableCell className="text-sm">{candidato.curso}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {candidato.faculdade}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidato.periodo}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{candidato.ano_lectivo}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {candidato.lista_de_provas.length > 0 ? (
                            candidato.lista_de_provas.map((prova, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="flex items-center gap-1 text-xs"
                              >
                                <ClipboardList className="h-3 w-3 shrink-0" />
                                {prova}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">Sem provas</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">Itens por página:</Label>
              <Select
                value={(filters.limit ?? 10).toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger id="items-per-page" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Mostrando {offset + 1} a {Math.min(offset + (filters.limit ?? 10), total)} de{" "}
                {total} registos
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange((filters.page ?? 1) - 1)}
                disabled={(filters.page ?? 1) === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {filters.page ?? 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange((filters.page ?? 1) + 1)}
                disabled={(filters.page ?? 1) >= totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}