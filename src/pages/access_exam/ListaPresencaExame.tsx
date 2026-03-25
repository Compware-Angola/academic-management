import { useMemo, useState } from "react";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCandidatosComProva } from "@/hooks/access_exam/use-candidatos-com-prova";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, Printer, Save, Check, X, ChevronLeft, ChevronRight, Home, Link } from "lucide-react";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";
import { parseFilter } from "@/util/parse-filter";

type Filters = {
    codigoAnoLetivo: string;
    codigoCurso: string;
    dataRealizacao: string;
    dataRealizacaoInput: string;
    horaInicio: string;
    horaInicioInput: string;
    codigoSala: string
    page: number;
    limit: number;
};

const INITIAL: Filters = {
    codigoAnoLetivo: "",
    codigoCurso: "",
    dataRealizacao: "",
    dataRealizacaoInput: "",
    horaInicio: "",
    horaInicioInput: "",
    codigoSala: "",
    page: 1,
    limit: 10,
};


export function ListaPresencaExame() {
    const [filters, setFilters] = useState<Filters>(INITIAL);

    const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
    const { data: salas = [] } = useQuerySalas();
    const { data, isLoading } = useCandidatosComProva({
        codigoAnoLetivo: filters.codigoAnoLetivo ? Number(filters.codigoAnoLetivo) : undefined,
        codigoCurso: filters.codigoCurso ? Number(filters.codigoCurso) : undefined,
        codigoSala: parseFilter(filters.codigoSala),
        dataRealizacao: filters.dataRealizacao || undefined,
        horaInicio: filters.horaInicio || undefined,

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
      numeroInscricao: item.numero_inscricao,
      nome: item.nome,
      numeroBilhete: item.numero_bilhete,
      curso: item.curso,
      sala: item.sala,
      anoLectivo: item.ano_lectivo,
      dataRealizacao: item.data_realizacao,
      horaInicio: item.hora_inicio,
    })),
  [candidatos]
);

const pdfData = exportRows.length
  ? {
      filtros: [
        filters.codigoAnoLetivo ? `Ano Letivo: ${filters.codigoAnoLetivo}` : null,
        filters.codigoCurso ? `Curso: ${filters.codigoCurso}` : null,
        filters.codigoSala ? `Sala: ${filters.codigoSala}` : null,
        filters.dataRealizacao ? `Data: ${filters.dataRealizacao}` : null,
        filters.horaInicio ? `Hora: ${filters.horaInicio}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      rows: exportRows,
    }
  : null;

const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Lista de Presença — Exame de Acesso"
    subtitle="Registo de presenças dos candidatos"
    infoSections={[
      { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
      { title: "Resumo", content: [`Total de registos: ${total}`] },
    ]}
    mainTable={{
      headers: [
        { key: "numeroInscricao", label: "Nº Inscrição", width: "14%" },
        { key: "nome", label: "Nome", width: "24%" },
        { key: "numeroBilhete", label: "BI", width: "16%" },
        { key: "curso", label: "Curso", width: "16%" },
        { key: "sala", label: "Sala", width: "10%" },
        { key: "anoLectivo", label: "Ano Lectivo", width: "12%" },
        { key: "dataRealizacao", label: "Data", width: "12%" },
        { key: "horaInicio", label: "Hora", width: "10%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;

const excelProps = pdfData
  ? {
      documentTitle: "Lista de Presença — Exame de Acesso",
      subtitle: "Registo de presenças dos candidatos",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        { title: "Resumo", content: [`Total de registos: ${total}`] },
      ],
      mainTable: {
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: 18 },
          { key: "nome", label: "Nome", width: 30 },
          { key: "numeroBilhete", label: "BI", width: 20 },
          { key: "curso", label: "Curso", width: 25 },
          { key: "sala", label: "Sala", width: 15 },
          { key: "anoLectivo", label: "Ano Lectivo", width: 18 },
          { key: "dataRealizacao", label: "Data", width: 18 },
          { key: "horaInicio", label: "Hora", width: 15 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#1e40af",
    }
  : null;

const baseFileName = `Lista_Presenca_Exame_${new Date().toISOString().slice(0, 10)}`;

    function handleData(val: string) {
        if (val) {
            const [yyyy, mm, dd] = val.split("-");
            setFilters((p) => ({
                ...p,
                dataRealizacaoInput: val,
                dataRealizacao: `${dd}/${mm}/${yyyy}`,
                page: 1,
            }));
        } else {
            setFilters((p) => ({ ...p, dataRealizacaoInput: "", dataRealizacao: "", page: 1 }));
        }
    }

    function handleHora(val: string) {
        setFilters((p) => ({
            ...p,
            horaInicioInput: val,
            horaInicio: val ? `${val}:00` : "",
            page: 1,
        }));
    }

    return (
        <div className="space-y-6">

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Lista de Presença</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lista de Presença — Exame de Acesso</h1>
                    <p className="text-muted-foreground mt-1">Registo de presenças dos candidatos no exame de acesso.</p>
                </div>
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
            <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    <Button variant="ghost" size="sm" onClick={() => setFilters(INITIAL)}>
                        <X className="h-4 w-4 mr-2" />Limpar filtros
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
                            onChange={(v) => setFilters({ ...filters, codigoSala: v })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Data de Realização</Label>
                        <Input
                            type="date"
                            value={filters.dataRealizacaoInput}
                            onChange={(e) => handleData(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Hora Início</Label>
                        <Input
                            type="time"
                            value={filters.horaInicioInput}
                            onChange={(e) => handleHora(e.target.value)}
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
                            <TableHead>BI</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Sala</TableHead>
                            <TableHead>Ano Lectivo</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Hora</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={`sk-${i}`}>
                                {Array.from({ length: 8 }).map((_, j) => (
                                    <TableCell key={`sk-${i}-${j}`}><Skeleton className="h-4 w-full" /></TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {!isLoading && candidatos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    Nenhum registo encontrado
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && candidatos.map((item) => (
                            <TableRow key={item.numero_inscricao}>
                                <TableCell className="font-mono font-semibold">{item.numero_inscricao}</TableCell>
                                <TableCell className="font-medium">{item.nome}</TableCell>
                                <TableCell className="font-mono text-sm">{item.numero_bilhete}</TableCell>
                                <TableCell className="text-sm">{item.curso}</TableCell>
                                <TableCell><Badge variant="outline">{item.sala}</Badge></TableCell>
                                <TableCell className="text-sm">{item.ano_lectivo}</TableCell>
                                <TableCell className="text-sm">{item.data_realizacao}</TableCell>
                                <TableCell className="text-sm">{item.hora_inicio}</TableCell>
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
                        <ChevronLeft className="h-4 w-4" />Anterior
                    </Button>
                    <span className="text-sm">Página {filters.page} de {totalPages}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                        disabled={filters.page === totalPages}
                    >
                        Seguinte<ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}