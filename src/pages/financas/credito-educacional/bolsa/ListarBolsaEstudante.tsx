import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryFetchBolsaEstudante } from "@/hooks/financas/bolsa/use-query-fetch-bolsa-estudante";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import {
  BolsaEstudante,
  FetchBolsaEstudanteParams,
} from "@/services/financas/bolsa/fetch-bolsa-estudante.service";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import useMutationEstadoCreditoEducacional from "@/hooks/financas/credito-educacional/useMutationEstadoCreditoEducacional";
import { EditAttributionModal } from "../AtribuirCredito/components/EditAttributionModal";

export default function ListarBolsaEstudante() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [filters, setFilters] = useState<FetchBolsaEstudanteParams>({
    page: 1,
    limit: 10,
    codigoInstituicao: undefined,
    codigoBolsa: undefined,
    codigoTipoCredito: undefined,
    nome: undefined,
    codigoAnoLectivo: undefined,
    codigoMatricula: undefined,
    cursoId: undefined,
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<BolsaEstudante | null>(
    null,
  );

  const debouncedNome = useDebounce(filters.nome, 500);
  const debouncedMatricula = useDebounce(filters.codigoMatricula, 500);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      nome: debouncedNome || undefined,
      codigoMatricula: debouncedMatricula || undefined,
      page,
      limit: Number(limit),
    }));
  }, [debouncedNome, debouncedMatricula, page, limit]);

  const { data, isLoading } = useQueryFetchBolsaEstudante(filters);
  const { data: semestres } = useQuerySemestres();
  const [selectedBolsa, setSelectedBolsa] = useState<BolsaEstudante | null>(
    null,
  );
  const estudantes = useMemo(() => data?.data ?? [], [data]);
  const meta = useMemo(() => data?.meta, [data]);
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? 1;
  const totalItems = meta?.total ?? 0;
  const { mutateAsync: switchEstadoBolsa, isPending: isPendingActiveBolsa } =
    useMutationEstadoCreditoEducacional();
  const semestreMap = useMemo(
    () => new Map(semestres?.map((s) => [s.codigo, s.designacao]) ?? []),
    [semestres],
  );

  // Limpar todos os filtros
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: Number(limit),
      codigoInstituicao: undefined,
      codigoBolsa: undefined,
      codigoTipoCredito: undefined,
      nome: undefined,
      codigoAnoLectivo: undefined,
      codigoMatricula: undefined,
      cursoId: undefined,
    });
    setPage(1);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);

  const formatDesconto = useCallback(
    (valor: number, tipo: string) =>
      tipo === "PERCENTUAL" ? `${valor}%` : formatCurrency(valor),
    [],
  );
  const handleChangeEstado = async (bolsa: BolsaEstudante) => {
    setSelectedBolsa(bolsa);
    await switchEstadoBolsa({ codigo: bolsa.codigo });
    setSelectedBolsa(null);
  };
  const pdfData = useMemo(() => {
    if (!estudantes.length) return null;

    const filtrosAplicados =
      [
        filters.nome && `Nome: ${filters.nome}`,
        filters.codigoMatricula && `Matrícula: ${filters.codigoMatricula}`,
        filters.cursoId && `Curso ID: ${filters.cursoId}`,
        filters.codigoAnoLectivo && `Ano Letivo: ${filters.codigoAnoLectivo}`,
        filters.codigoInstituicao &&
          `Instituição ID: ${filters.codigoInstituicao}`,
        filters.codigoBolsa && `Bolsa ID: ${filters.codigoBolsa}`,
      ]
        .filter(Boolean)
        .join(" | ") || "Sem filtros";

    return {
      filtros: filtrosAplicados,
      total: estudantes.length,
      rows: estudantes.map((e) => ({
        matricula: e.codigo_matricula,
        nome: e.nome_completo,
        bi: e.bilhete_identidade,
        curso: e.curso,
        instituicao: e.instituicao,
        anoLetivo: e.ano_lectivo,
        semestre: semestreMap.get(e.semestre) ?? "-",
        desconto: formatDesconto(e.valor_desconto, e.tipo_desconto),
        tipoCredito: e.tipo_credito,
        bolsa: e.bolsa,
      })),
    };
  }, [
    estudantes,
    filters.codigoAnoLectivo,
    filters.codigoBolsa,
    filters.codigoInstituicao,
    filters.codigoMatricula,
    filters.cursoId,
    filters.nome,
    formatDesconto,
    semestreMap,
  ]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Estudantes com Bolsa"
      subtitle="Lista de estudantes com créditos ou bolsas aplicadas"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de estudantes: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "matricula", label: "Matrícula", width: "10%" },
          { key: "nome", label: "Nome", width: "20%" },
          { key: "bi", label: "BI", width: "10%" },
          { key: "curso", label: "Curso", width: "15%" },
          { key: "instituicao", label: "Instituição", width: "15%" },
          { key: "anoLetivo", label: "Ano Letivo", width: "8%" },
          { key: "semestre", label: "Semestre", width: "8%" },
          { key: "desconto", label: "Desconto", width: "8%" },
          { key: "tipoCredito", label: "Tipo Crédito", width: "10%" },
          { key: "bolsa", label: "Bolsa", width: "10%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Estudantes com Bolsa",
        subtitle: "Lista de estudantes com créditos ou bolsas aplicadas",
        infoSections: [
          { title: "Filtros Aplicados", content: pdfData.filtros },
          {
            title: "Resumo",
            content: [`Total de estudantes: ${pdfData.total}`],
          },
        ],
        mainTable: {
          headers: [
            { key: "matricula", label: "Matrícula", width: 18 },
            { key: "nome", label: "Nome", width: 35 },
            { key: "bi", label: "BI", width: 20 },
            { key: "curso", label: "Curso", width: 25 },
            { key: "instituicao", label: "Instituição", width: 25 },
            { key: "anoLetivo", label: "Ano Letivo", width: 15 },
            { key: "semestre", label: "Semestre", width: 18 },
            { key: "desconto", label: "Desconto", width: 20 },
            { key: "tipoCredito", label: "Tipo Crédito", width: 22 },
            { key: "bolsa", label: "Bolsa", width: 25 },
          ],
          rows: pdfData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Estudantes_Bolsa_${new Date().toISOString().slice(0, 10)}`;

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
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Estudantes com Bolsa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Estudantes com Bolsa</h1>
        <p className="text-muted-foreground">
          Lista completa de estudantes com créditos ou bolsas aplicadas.
        </p>
      </div>

      {/* Filtros - mesmo padrão do ListarBolsa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Estudante</Label>
              <Input
                id="nome"
                placeholder="Digite o nome"
                value={filters.nome || ""}
                onChange={(e) => {
                  setPage(1);
                  setFilters((prev) => ({ ...prev, nome: e.target.value }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                placeholder="Código da matrícula"
                value={filters.codigoMatricula?.toString() || ""}
                onChange={(e) => {
                  setPage(1);
                  setFilters((prev) => ({
                    ...prev,
                    codigoMatricula: Number(e.target.value),
                  }));
                }}
              />
            </div>

            <CourseSelect
              value={filters.cursoId?.toString() || ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  cursoId: v ? Number(v) : undefined,
                }));
              }}
            />

            <AcademicYearSelect
              value={filters.codigoAnoLectivo?.toString() ?? ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  codigoAnoLectivo: v ? Number(v) : undefined,
                }));
              }}
            />

            <InstituicaoSelect
              value={filters.codigoInstituicao?.toString() ?? ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  codigoInstituicao: v ? Number(v) : undefined,
                }));
              }}
            />

            <BolsaSelect
              value={filters.codigoBolsa?.toString() ?? ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  codigoBolsa: v ? Number(v) : undefined,
                }));
              }}
            />
          </div>
        </CardContent>
      </Card>

      {pdfData && excelProps && (
        <div className="flex justify-end gap-2">
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
        </div>
      )}

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: Number(limit) }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : estudantes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize os filtros acima para pesquisar
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>BI</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Ano Letivo</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Tipo Crédito</TableHead>
                    <TableHead>Bolsa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudantes.map((e) => (
                    <TableRow key={e.codigo}>
                      <TableCell className="whitespace-nowrap">
                        {e.codigo_matricula}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[200px]"
                        title={e.nome_completo}
                      >
                        {e.nome_completo}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {e.bilhete_identidade}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[150px]"
                        title={e.curso}
                      >
                        {e.curso}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[150px]"
                        title={e.instituicao}
                      >
                        {e.instituicao}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {e.ano_lectivo}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {semestreMap.get(e.semestre) ?? "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDesconto(e.valor_desconto, e.tipo_desconto)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {e.tipo_credito}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[150px]"
                        title={e.bolsa}
                      >
                        {e.bolsa}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Switch
                            checked={e.status_ === 1}
                            onCheckedChange={() => handleChangeEstado(e)}
                            disabled={isPendingActiveBolsa}
                          />
                          <Loader2
                            className={cn(
                              "h-4 w-4 animate-spin",
                              selectedBolsa?.codigo === e.codigo &&
                                isPendingActiveBolsa
                                ? "block"
                                : "hidden",
                            )}
                          />
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Editar"
                          onClick={() => {
                            setSelectedStudent(e);
                            setEditModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando página <strong>{currentPage}</strong> de{" "}
                <strong>{totalPages}</strong> • Total de{" "}
                <strong>{totalItems}</strong> registos
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Label>Itens por página</Label>
                  <Select
                    value={limit}
                    onValueChange={(value) => {
                      setLimit(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <div className="text-sm font-medium px-4">{currentPage}</div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <EditAttributionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialValues={selectedStudent!}
      />
    </div>
  );
}
