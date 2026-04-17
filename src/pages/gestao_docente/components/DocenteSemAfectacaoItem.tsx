import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { parseFilter } from "@/util/parse-filter";
import { Loader2 } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useMutationUpdateAfectacaoStatus } from "@/hooks/gestao_docente/use-mutation-update-afectacao-status";
import { Input } from "@/components/ui/input";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryDocentesAfectacao } from "@/hooks/gestao_docente/use-query-docentes-afectacao";
import { FormInput } from "@/components/common/FormInput";
import { buildExport } from "@/components/common/exports/docExport";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

const DocenteSemAfectacaoItem = () => {
  const id = useId();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { mutateAsync, isPending } = useMutationUpdateAfectacaoStatus();
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    semestre: "",
    docente: "",
    tipoAfectacao: "",
  });

  const { data: teachersData = [] } = useQueryTeacther();
  const { data: afectacoesResponse, isLoading } = useQueryDocentesAfectacao({
    anoLectivo: parseFilter(filters.anoLectivo),
    docente: parseFilter(filters.docente),
    tipoAfectacao: 2,
    semestre: parseFilter(filters.semestre),
    search,
    limit,
    page,
  });

  const afectacoes = afectacoesResponse?.data ?? [];
  const total = afectacoesResponse?.total;
  const totalPages = afectacoesResponse?.totalPages;
  const exportData = useMemo(
    () =>
      buildExport({
        data: afectacoes,
        title: "Docentes Afectados",
        subtitle: "Lista de Docentes Afectados (s)",
        content: [`Total de Docentes Afectados (s): ${afectacoes.length}`],
        headers: [
          { key: "codigo", label: "Código", pdfWidth: 30, excelWidth: 30 },
          { key: "docente", label: "Docente", pdfWidth: 30, excelWidth: 30 },
          {
            key: "mecanografico",
            label: "Nº Mecanográfico",
            pdfWidth: 40,
            excelWidth: 40,
          },
        ],

        mapRow: (afectacao) => ({
          codigo: afectacao.codigo_docente,
          docente: afectacao.docente,
          mecanografico: afectacao.mecanografico,
        }),
      }),
    [afectacoes],
  );
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-3">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <SemestreSelect
              enableDefaultSelectItem
              value={filters.semestre}
              onChangeValue={(v) => setFilters({ ...filters, semestre: v })}
            />
            <div className="space-y-1.5">
              <Label>Docente</Label>
              <FormCommandSelect
                width="full"
                value={filters.docente}
                options={teachersData}
                map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
                onChange={(codigo) =>
                  setFilters({ ...filters, docente: codigo })
                }
              />
            </div>
            <div>
              <Label>Data Inicio</Label>
              <Input placeholder="Data inicial" type="date" />
            </div>
            <div>
              <Label>Data Fim</Label>
              <Input placeholder="Data inicial" type="date" />
            </div>
          </div>
        </CardContent>
      </Card>
      {exportData?.excelProps &&
        exportData?.excelProps &&
        exportData?.fileName && (
          <div className="flex justify-end gap-2 mb-2">
            <PDFActions
              document={<GenericPDFDocument {...exportData?.pdfProps} />}
              fileName={`${exportData.fileName}.pdf`}
              showDownload
              showPrint
            />

            <ExcelActions
              excelProps={exportData?.excelProps}
              fileName={`${exportData.fileName}.xlsx`}
              showDownload
            />
          </div>
        )}
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Lista de Afectação</CardTitle>
            <FormInput
              placeholder="Pesquisa por Docente, Nº Mecanográfico, Nº de Docente"
              value={searchValue}
              onValueChange={(v) => setSearchValue(v)}
              onDebounce={(v) => setSearch(v)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Afectação...</p>
            </div>
          ) : afectacoes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum Afectação encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>Nº Mecanográfico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {afectacoes.map((item) => (
                      <TableRow key={item.codigo_docente}>
                        <TableCell>{item.codigo_docente}</TableCell>
                        <TableCell>{item.docente}</TableCell>
                        <TableCell>{item.mecanografico}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {afectacoes.length} de {total} registos
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
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
export { DocenteSemAfectacaoItem };
