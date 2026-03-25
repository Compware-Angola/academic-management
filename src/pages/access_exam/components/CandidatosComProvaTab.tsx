import { useMemo, useState } from "react";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCandidatosSemProva } from "@/hooks/access_exam/use-candidatos-sem-prova";
import { parseFilter } from "@/util/parse-filter";

type Filters = {
  codigoAnoLetivo: string;
  codigoCurso: string;
  codigoTurno: string;
  statusProva: string;
  page: number;
  limit: number;
};

const INITIAL: Filters = {
  codigoAnoLetivo: "",
  codigoCurso: "",
  codigoTurno: "",
  statusProva: "",
  page: 1,
  limit: 10,
};

export function CandidatosComProvaTab() {
  const [filters, setFilters] = useState<Filters>(INITIAL);

  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const { data, isLoading } = useCandidatosSemProva({
    codigoAnoLetivo: filters.codigoAnoLetivo ? Number(filters.codigoAnoLetivo) : undefined,
    codigoCurso: filters.codigoCurso ? Number(filters.codigoCurso) : undefined,
    codigoTurno: filters.codigoTurno ? Number(filters.codigoTurno) : undefined,
    filtroProva: "com_prova",
    statusProva: parseFilter(filters.statusProva),
    page: filters.page,
    limit: filters.limit,
  });

  const candidatos = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalpages ?? 1;
  const offset = (filters.page - 1) * filters.limit;

  const exportRows = useMemo(
  () =>
    candidatos.map((item) => ({
      numeroInscricao: item.codigo,
      nome: item.nome,
      contacto: item.contato,
      sexo: item.sexo,
      curso: item.curso,
      periodo: item.periodo,
      horario: `${item.hora_inicio} - ${item.hora_fim}`,
      anoLectivo: item.ano_lectivo,
      tipoCandidatura: item.tipo_candidatura,
      estadoProva: Number(item.status_prova) === 1 ? "Aprovado" : "Reprovado",
    })),
  [candidatos]
);

const pdfData = exportRows.length
  ? {
      filtros: [
        filters.codigoAnoLetivo ? `Ano Letivo: ${filters.codigoAnoLetivo}` : null,
        filters.codigoCurso ? `Curso: ${filters.codigoCurso}` : null,
        filters.codigoTurno ? `Período: ${filters.codigoTurno}` : null,
        filters.statusProva !== "" ? `Estado Prova: ${filters.statusProva === "1" ? "Aprovado" : "Reprovado"}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      rows: exportRows,
    }
  : null;

const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Candidatos com Prova"
    subtitle="Lista de candidatos com prova atribuída"
    infoSections={[
      { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
      { title: "Resumo", content: [`Total de registos: ${total}`] },
    ]}
    mainTable={{
      headers: [
        { key: "numeroInscricao", label: "Nº Inscrição", width: "12%" },
        { key: "nome", label: "Nome", width: "20%" },
        { key: "contacto", label: "Contacto", width: "12%" },
        { key: "sexo", label: "Sexo", width: "8%" },
        { key: "curso", label: "Curso", width: "16%" },
        { key: "periodo", label: "Período", width: "10%" },
        { key: "horario", label: "Horário", width: "12%" },
        { key: "estadoProva", label: "Estado", width: "10%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;

const excelProps = pdfData
  ? {
      documentTitle: "Candidatos com Prova",
      subtitle: "Lista de candidatos com prova atribuída",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        { title: "Resumo", content: [`Total de registos: ${total}`] },
      ],
      mainTable: {
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: 18 },
          { key: "nome", label: "Nome", width: 30 },
          { key: "contacto", label: "Contacto", width: 20 },
          { key: "sexo", label: "Sexo", width: 10 },
          { key: "curso", label: "Curso", width: 25 },
          { key: "periodo", label: "Período", width: 18 },
          { key: "horario", label: "Horário", width: 20 },
          { key: "anoLectivo", label: "Ano Lectivo", width: 18 },
          { key: "tipoCandidatura", label: "Tipo Candidatura", width: 25 },
          { key: "estadoProva", label: "Estado Prova", width: 18 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#1e40af",
    }
  : null;

const baseFileName = `Candidatos_Com_Prova_${new Date().toISOString().slice(0, 10)}`;

  return (
    <div className="space-y-4">

      <div className="flex justify-end gap-2">
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
      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={() => setFilters(INITIAL)}>
            <X className="h-4 w-4 mr-2" />Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <FormSelect
              label="Ano Letivo"
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              value={filters.codigoAnoLetivo}
              onChange={(v) => setFilters((p) => ({ ...p, codigoAnoLetivo: v, page: 1 }))}
              options={academicYear}
              map={(a) => ({ key: a.codigo.toString(), label: a.designacao, value: a.codigo.toString() })}
            />
          </div>
          <div className="space-y-2">
            <CourseSelect
              value={filters.codigoCurso}
              onChangeValue={(v) => setFilters((p) => ({ ...p, codigoCurso: v, page: 1 }))}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              disabled={isLoadingPeriodos}
              loading={isLoadingPeriodos}
              label="Período"
              value={filters.codigoTurno}
              onChange={(v) => setFilters((p) => ({ ...p, codigoTurno: v, page: 1 }))}
              options={periodos}
              map={(p) => ({ key: p.codigo.toString(), label: p.designacao, value: p.codigo.toString() })}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              label="Estado Prova"
              value={filters.statusProva?.toString() ?? ""}
              onChange={(v) =>
                setFilters((p) => ({ ...p, statusProva: v, page: 1 }))
              }
              options={[
                { key: "0", label: "Reprovado", value: "0" },
                { key: "1", label: "Aprovado", value: "1" },
              ]}
              map={(item) => item}
            />
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
              <TableHead>Contacto</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Ano Lectivo</TableHead>
              <TableHead>Tipo Candidatura</TableHead>

              <TableHead>Estado da Prova</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <TableCell key={`sk-${i}-${j}`}><Skeleton className="h-4 w-full" /></TableCell>
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
              <TableRow key={item.codigo}>
                <TableCell className="font-mono font-semibold">{item.codigo}</TableCell>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="text-sm">{item.contato}</TableCell>
                <TableCell className="text-sm">{item.sexo}</TableCell>
                <TableCell className="text-sm">{item.curso}</TableCell>
                <TableCell><Badge variant="outline">{item.periodo}</Badge></TableCell>

                <TableCell className="font-medium">{item.hora_inicio}- {item.hora_fim}</TableCell>
                <TableCell className="text-sm">{item.ano_lectivo}</TableCell>
                <TableCell className="text-sm">{item.tipo_candidatura}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      Number(item.status_prova) == 1
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }
                  >
                    {Number(item.status_prova) == 1 ? "Aprovado" : "Reprovado"}
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
          <Select value={filters.limit.toString()} onValueChange={(v) => setFilters((p) => ({ ...p, limit: Number(v), page: 1 }))}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground ml-2">
            Mostrando {total === 0 ? 0 : offset + 1} a {Math.min(offset + filters.limit, total)} de {total} registos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))} disabled={filters.page === 1}>
            <ChevronLeft className="h-4 w-4" />Anterior
          </Button>
          <span className="text-sm">Página {filters.page} de {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))} disabled={filters.page === totalPages}>
            Seguinte<ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}