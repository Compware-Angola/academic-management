import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Download,
  Printer,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
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

import { useQueryListDocentes } from "@/hooks/gestao_docente/use-query-list-teachers";
import { useQueryAreaFormacaoDocentes } from "@/hooks/gestao_docente/use-query-area-formacao-teachers";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

interface AreaFormacao {
  codigo: number;
  designacao: string;
}

interface DocenteApi {
  codigo: number;
  numero_mec: string | null;
  nome: string | null;
  email: unknown;
  escalao: string | null;
  categoria: string | null;
  grau_academico: string | null;
  area_formacao_id: number | null;
}

interface DocenteTabela {
  id: string;
  numeroMec: string;
  nome: string;
  email: string;
  escalao: string;
  categoria: string;
  grauAcademico: string;
  areaFormacaoId: number | null;
  areaFormacaoNome: string;
}

interface FiltersState {
  page: number;
  limit: number;
  area: number;
  search: string;
}

export default function ListagemDocentes() {
  const [areaFormacaoOpen, setAreaFormacaoOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    page: 1,
    limit: 25,
    area: 0,
    search: "",
  });

  const {
    data: formacaoResponse,
    isLoading: formacaoLoading,
  } = useQueryAreaFormacaoDocentes();

  const {
    data: docentesResponse,
    isLoading: docenteLoading,
    isFetching: isFetchingDocentes,
    refetch: refetchDocentes,
  } = useQueryListDocentes(filters);


  const areasFormacao: AreaFormacao[] = useMemo(() => {
    if (!Array.isArray(formacaoResponse)) return [];
    return formacaoResponse;
  }, [formacaoResponse]);

  const areaMap = useMemo(() => {
    return new Map<number, string>(
      areasFormacao.map((area) => [area.codigo, area.designacao])
    );
  }, [areasFormacao]);

  const normalizeEmail = (email: unknown): string => {
  if (!email) return "—";
  if (typeof email === "string") return email.trim() || "—";
  return "—";
};

  const docentes: DocenteTabela[] = useMemo(() => {
    const raw = docentesResponse?.data;

    if (!Array.isArray(raw)) return [];

    return raw.map((item: DocenteApi, index: number) => ({
      id: `${item.codigo}-${index}`,
      numeroMec: item.numero_mec ?? "—",
      nome: item.nome ?? "—",
      email: normalizeEmail(item.email),
      escalao: item.escalao ?? "—",
      categoria: item.categoria ?? "—",
      grauAcademico: item.grau_academico ?? "—",
      areaFormacaoId: item.area_formacao_id,
      areaFormacaoNome:
        item.area_formacao_id != null
          ? areaMap.get(item.area_formacao_id) ?? "—"
          : "—",
    }));
  }, [docentesResponse, areaMap]);

  const totalRegistos = docentesResponse?.total ?? 0;
  const totalPages = docentesResponse?.totalPages ?? 1;
  const currentPage = docentesResponse?.page ?? filters.page;
  const itemsPerPage = docentesResponse?.limit ?? filters.limit;

  const selectedAreaLabel =
    filters.area === 0
      ? "Todas"
      : areasFormacao.find((area) => area.codigo === filters.area)?.designacao ??
        "Selecionar";

  const exportRows = docentes.map((item) => ({
  numeroMec: item.numeroMec,
  nome: item.nome,
  escalao: item.escalao,
  categoria: item.categoria,
  grauAcademico: item.grauAcademico,
  email: item.email,
  areaFormacao: item.areaFormacaoNome,
}));

const pdfData = exportRows.length
  ? {
      filtros: [
        `Área de Formação: ${selectedAreaLabel}`,
        filters.search ? `Pesquisa: ${filters.search}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      total: exportRows.length,
      rows: exportRows,
    }
  : null;

const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Lista de Docentes"
    subtitle="Gestão completa do corpo docente"
    infoSections={[
      { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
      { title: "Resumo", content: [`Total de registos: ${totalRegistos}`] },
    ]}
    mainTable={{
      headers: [
        { key: "numeroMec", label: "Nº Mec", width: "12%" },
        { key: "nome", label: "Nome", width: "24%" },
        { key: "escalao", label: "Escalão", width: "12%" },
        { key: "categoria", label: "Categoria", width: "16%" },
        { key: "grauAcademico", label: "Grau", width: "16%" },
        { key: "email", label: "Email", width: "20%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;

const excelProps = pdfData
  ? {
      documentTitle: "Lista de Docentes",
      subtitle: "Gestão completa do corpo docente",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        { title: "Resumo", content: [`Total de registos: ${totalRegistos}`] },
      ],
      mainTable: {
        headers: [
          { key: "numeroMec", label: "Nº Mec", width: 15 },
          { key: "nome", label: "Nome", width: 30 },
          { key: "escalao", label: "Escalão", width: 18 },
          { key: "categoria", label: "Categoria", width: 22 },
          { key: "grauAcademico", label: "Grau", width: 20 },
          { key: "email", label: "Email", width: 32 },
          { key: "areaFormacao", label: "Área de Formação", width: 28 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#1e40af",
    }
  : null;

const baseFileName = `Lista_Docentes_${new Date().toISOString().slice(0, 10)}`;


  const handleFilterChange = <K extends keyof FiltersState>(
    field: K,
    value: FiltersState[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field === "page" ? Number(value) : 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 25,
      area: 0,
      search: "",
    });
  };

  const handleRefresh = async () => {
    await refetchDocentes();
  };

  const isLoading = docenteLoading || formacaoLoading;

  const inicio = totalRegistos === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const fim = Math.min(currentPage * itemsPerPage, totalRegistos);

  

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Gestão de Docentes</span>
        <span>/</span>
        <span className="text-foreground">Lista de docentes</span>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LISTA DE DOCENTES</h1>
          <p className="mt-1 text-muted-foreground">
            Gestão completa do corpo docente
          </p>
        </div>

          <div className="flex flex-wrap gap-2">
  <Button
    variant="outline"
    size="sm"
    onClick={handleRefresh}
    disabled={isFetchingDocentes}
  >
    <RefreshCw
      className={cn("mr-2 h-4 w-4", isFetchingDocentes && "animate-spin")}
    />
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

      <div className="rounded-lg border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr_auto_auto] lg:items-end">
          
            <div className="space-y-1.5">
                <Label>Área de Formação</Label>
                <FormCommandSelect
                    value={String(filters.area)}
                    options={[{ codigo: 0, designacao: "Todas" }, ...areasFormacao]}
                    map={(area) => ({
                    key: area.codigo,
                    value: String(area.codigo),
                    label: area.designacao,
                    })}
                    onChange={(value) => {
                    handleFilterChange("area", Number(value));
                    }}
                />
            </div>

          <div className="space-y-2">
            <Label>Pesquisa geral</Label>
            <Input
              placeholder="Pesquisar por nome, email, categoria, escalão, grau ou Nº Mec"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <Button onClick={handleRefresh} disabled={isFetchingDocentes}>
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isFetchingDocentes && "animate-spin")}
            />
            Listar
          </Button>

          <Button variant="outline" onClick={handleResetFilters}>
            Limpar filtros
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : docentes.length === 0 ? (
        <div className="rounded-lg border bg-card py-12 text-center">
          <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 font-medium">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground">
            Ajusta os filtros para encontrar docentes.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="border-b px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Total de registos:{" "}
                <span className="font-semibold text-foreground">
                  {totalRegistos}
                </span>
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Mec</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Escalão</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Grau</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {docentes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.numeroMec}
                      </TableCell>

                      <TableCell>{item.nome}</TableCell>

                      <TableCell>{item.escalao}</TableCell>

                      <TableCell>
                        <Badge variant="outline">{item.categoria}</Badge>
                      </TableCell>

                      <TableCell>{item.grauAcademico}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{item.email}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm">Itens por página:</Label>

              <Select
                value={String(filters.limit)}
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    limit: Number(value),
                    page: 1,
                  }));
                }}
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>

              <span className="ml-0 text-sm text-muted-foreground md:ml-4">
                Mostrando {inicio} a {fim} de {totalRegistos} registos
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleFilterChange("page", Math.max(1, filters.page - 1))
                }
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleFilterChange(
                    "page",
                    Math.min(totalPages, filters.page + 1)
                  )
                }
                disabled={filters.page === totalPages}
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