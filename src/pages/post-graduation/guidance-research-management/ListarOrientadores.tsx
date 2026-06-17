import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import {
  Home,
  Search,
  Loader2,
  RefreshCcw,
  Plus,
  Eye,
  Trash,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { parseFilter } from "@/util/parse-filter";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryOrientadoresTFC } from "@/hooks/defesa-tfc/use-query-orientadores-tfc";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { OrientadorModal } from "./components/orientador-modal";
import OrientandoModal from "./components/orientando-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { ApagarOrientadorAlert } from "./components/apagar-orientador-alert";
import ExcelActions, {
  GenericExcelProps,
} from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
const statusConfig = {
  activo: {
    label: "Activo",
    variant: "default" as const,
    className: "bg-primary hover:bg-primary/80",
  },
  inactivo: {
    label: "Inactivo",
    variant: "destructive" as const,
    className: "bg-slate-500 hover:bg-slate-600",
  },
  pendente: {
    label: "Pendente",
    variant: "outline" as const,
    className: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
};
export default function ListarOrientadores() {
  const [page, setPage] = useState(1);
  const [docenteId, setDocenteId] = useState("");
  const [limit, setLimit] = useState(10);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    estado: "",
  });
  const [orientandoModal, setOrientandoModal] = useState(false);
  const [apagarOrientadorModal, setApagarOrientadorModal] = useState(false);
  const {
    data: orientadoresResponse,
    refetch,
    isFetching,
  } = useQueryOrientadoresTFC({
    anoLectivoId:
      filters.anoLectivo === "all"
        ? undefined
        : parseFilter(filters.anoLectivo),
    cursoId: parseFilter(filters.curso),
    estado: filters.estado === "all" ? undefined : filters.estado,
    search: debouncedSearch,
    page,
    limit,
  });

  const pdfData = useMemo(() => {
    if (!orientadoresResponse?.data) return null;
    return {
      rows: orientadoresResponse.data.map((u) => ({
        nome: u.nome_orientador,
        curso: u.curso,
        anoLectivo: u.ano_lectivo,
      })),
    };
  }, [orientadoresResponse]);

  const excelProps: GenericExcelProps | null = pdfData
    ? {
        documentTitle: "Orientadores",
        mainTable: {
          headers: [
            { key: "nome", label: "Nome", width: 50 },
            { key: "curso", label: "Curso", width: 35 },
            { key: "anoLectivo", label: "Ano Letivo", width: 15 },
          ],
          rows: pdfData.rows,
        },
      }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Orientadores"
      mainTable={{
        headers: [
          { key: "nome", label: "Nome", width: "50%" },
          { key: "curso", label: "Curso", width: "35%" },
          { key: "anoLectivo", label: "Ano Letivo", width: "15%" },
        ],
        rows: pdfData.rows,
      }}
    />
  ) : null;

  const handleRefetch = () => {
    setFilters({
      anoLectivo: "23",
      curso: "",
      estado: "",
    });
    setPage(1);
    setLimit(10);
    refetch();
  };
  const tableData = orientadoresResponse?.data || [];
  const total = orientadoresResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const baseFileName = `orientadores-${filters.anoLectivo}-${filters.curso}`;

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
            <BreadcrumbLink> Gestão de Defesa e TFC</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Orientadores</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Orientadores</h1>
          <p className="text-muted-foreground">Consultar orientadores.</p>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleRefetch}
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          {pdfData && excelProps && (
            <>
              {pdfContent && (
                <PDFActions
                  document={pdfContent}
                  fileName={`${baseFileName}.pdf`}
                  showDownload
                  showPrint
                />
              )}

              <ExcelActions
                excelProps={excelProps}
                fileName={`${baseFileName}.xlsx`}
                showDownload
              />
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AcademicYearSelect
              value={filters.anoLectivo}
              enableDefaultSelectItem
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />

            <CourseSelect
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
              value={filters.curso}
            />
            {/* <div className="flex flex-col gap-2">
              <Label>Estado</Label>
              <Select
                value={filters.estado}
                onValueChange={(v) => setFilters({ ...filters, estado: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="flex flex-col gap-2">
              <Label>Pesquisar</Label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                aria-label="Actualizar"
                className="cursor-pointer"
                onClick={handleRefetch}
              >
                Atualizar
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-2">
          {/* Exportações */}

          <CardTitle>Orientadores</CardTitle>
        </CardHeader>

        <CardContent>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Carregando Orientadores...
              </p>
            </div>
          ) : tableData.length == 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Orientador encontrado.
            </div>
          ) : (
            <>
              {/* 1. Envolva em uma div com scroll lateral */}
              <div className="w-full overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {/* Adicione whitespace-nowrap em todos os cabeçalhos */}
                      <TableHead className="w-[80px] whitespace-nowrap">
                        Código
                      </TableHead>
                      <TableHead className="min-w-[250px] whitespace-nowrap text-left">
                        Nome
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Ano Lectivo
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Curso</TableHead>
                      <TableHead className="w-[120px] whitespace-nowrap">
                        Estado
                      </TableHead>
                      <TableHead className="w-[150px] whitespace-nowrap text-center">
                        Nº Orientados
                      </TableHead>
                      <TableHead className="w-[150px] whitespace-nowrap">
                        Data Cadastro
                      </TableHead>
                      <TableHead className="w-[200px] whitespace-nowrap">
                        Criado por
                      </TableHead>
                      <TableHead className="w-[200px] whitespace-nowrap">
                        Acções
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item, i) => {
                      const status = (item.estado?.toLowerCase() ||
                        "pendente") as keyof typeof statusConfig;
                      const config =
                        statusConfig[status] || statusConfig.pendente;

                      return (
                        <TableRow
                          key={item.codigo || i}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {item.codigo}
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">
                            {item.nome_orientador}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.ano_lectivo}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {item.curso}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge
                              variant={config.variant}
                              className={config.className}
                            >
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold whitespace-nowrap">
                            {item.numero_orientados}
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {item.data_cadastro}
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {item.criado_por}
                          </TableCell>
                          <TableCell className="flex items-center gap-2 whitespace-nowrap">
                            <Button
                              size={"icon"}
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => {
                                setDocenteId(item.codigo.toString());
                                setOrientandoModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size={"icon"}
                              variant="destructive"
                              className="cursor-pointer"
                              onClick={() => {
                                setDocenteId(item.codigo.toString());
                                setApagarOrientadorModal(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              A mostrar {tableData.length} de {total} registos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span>
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>

              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <OrientadorModal open={open} setOpen={setOpen} />
      <OrientandoModal
        open={orientandoModal}
        setOpen={setOrientandoModal}
        docenteId={parseFilter(docenteId)}
        anoLectivoId={parseFilter(filters.anoLectivo)}
      />
      <ApagarOrientadorAlert
        open={apagarOrientadorModal}
        onOpenChange={setApagarOrientadorModal}
        orientadorId={parseFilter(docenteId)}
        anoLectivoId={parseFilter(filters.anoLectivo)}
      />
    </div>
  );
}
