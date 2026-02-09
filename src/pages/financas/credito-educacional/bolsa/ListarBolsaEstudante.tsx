import { useEffect, useMemo, useState } from "react";
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
import { ChevronLeft, ChevronRight, FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

import { useDebounce } from "@/hooks/use-debounce";
import { useQueryFetchBolsaEstudante } from "@/hooks/financas/bolsa/use-query-fetch-bolsa-estudante";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { useCursos } from "@/hooks/use-cursos";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

export default function ListarBolsaEstudante() {
  const [resetKey, setResetKey] = useState(0);

  // ================= INPUTS COM DEBOUNCE =================
  const [nomeInput, setNomeInput] = useState("");
  const [cursoInput, setCursoInput] = useState("");
  const debouncedNome = useDebounce(nomeInput, 500);
  const debouncedCurso = useDebounce(cursoInput, 500);

  // ================= FILTROS DA API =================
  const [filters, setFilters] = useState({
    nome: undefined as string | undefined,
    curso: undefined as string | undefined,
    codigoAnoLectivo: undefined as number | undefined,
    codigoMatricula: undefined as number | undefined,
    codigoInstituicao: undefined as number | undefined,
    codigoBolsa: undefined as number | undefined,
    codigoTipoCredito: undefined as number | undefined,
  });

  const [pageUrl, setPageUrl] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQueryFetchBolsaEstudante(filters, pageUrl);
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const estudantes = data?.items ?? [];

  // ================= SEMESTRES =================
  const { data: semestres } = useQuerySemestres();
  const semestreMap = useMemo(
    () => new Map(semestres?.map((s) => [s.codigo, s.designacao]) ?? []),
    [semestres],
  );

  // Atualiza filtros quando digitação para
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      nome: debouncedNome || undefined,
      curso: debouncedCurso || undefined,
    }));
    setPageUrl(undefined);
  }, [debouncedNome, debouncedCurso]);

  // ================= LIMPAR FILTROS =================
  const handleClearFilters = () => {
    setNomeInput("");
    setCursoInput("");
    setFilters({
      nome: undefined,
      curso: undefined,
      codigoAnoLectivo: undefined,
      codigoMatricula: undefined,
      codigoInstituicao: undefined,
      codigoBolsa: undefined,
      codigoTipoCredito: undefined,
    });
    setResetKey((k) => k + 1);
    setPageUrl(undefined);
  };

  // ================= PAGINAÇÃO =================
  const nextPage = () => data?.next?.$ref && setPageUrl(data.next.$ref);
  const prevPage = () => data?.prev?.$ref && setPageUrl(data.prev.$ref);

  // ================= FORMATADORES =================
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);

  const formatDesconto = (valor: number, tipo: string) =>
    tipo === "PERCENTUAL" ? `${valor}%` : formatCurrency(valor);

  const cellStyle = "whitespace-nowrap truncate max-w-[220px] font-medium";

  return (
    <div className="p-6 space-y-6">
      {/* BREADCRUMB */}
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

      <h1 className="text-2xl font-bold">Estudantes com Bolsa</h1>
      <p className="text-muted-foreground">
        Lista completa de estudantes com créditos ou bolsas aplicadas.
      </p>

      {/* ================= FILTROS ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="">
                <Label>Nome do Estudante</Label>
                <Input
                  placeholder="Pesquisar por nome"
                  value={nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                />
              </div>

              <div className="">
                <CourseSelect
                            value={filters.curso}
                            onChangeValue={(v) =>
                              setFilters({ ...filters, curso: v})
                            }
                          />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AcademicYearSelect
                value={filters.codigoAnoLectivo?.toString() ?? ""}
                onChangeValue={(v) =>
                  setFilters((f) => ({
                    ...f,
                    codigoAnoLectivo: v ? Number(v) : undefined,
                  }))
                }
              />

              <InstituicaoSelect
                key={`instituicao-${resetKey}`}
                value={filters.codigoInstituicao?.toString() ?? ""}
                onChangeValue={(v) =>
                  setFilters((f) => ({
                    ...f,
                    codigoInstituicao: v ? Number(v) : undefined,
                  }))
                }
              />

              <BolsaSelect
                key={`bolsa-${resetKey}`}
                value={filters.codigoBolsa?.toString() ?? ""}
                onChangeValue={(v) =>
                  setFilters((f) => ({
                    ...f,
                    codigoBolsa: v ? Number(v) : undefined,
                  }))
                }
              />
            </div>
            <div className="flex items-end justify-end">
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= TABELA ================= */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : estudantes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum estudante encontrado</p>
          </div>
        ) : (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudantes.map((e) => (
                  <TableRow key={e.codigo}>
                    <TableCell className={cellStyle}>
                      {e.codigo_matricula}
                    </TableCell>
                    <TableCell className={cellStyle} title={e.nome_completo}>
                      {e.nome_completo}
                    </TableCell>
                    <TableCell className={cellStyle}>
                      {e.bilhete_identidade}
                    </TableCell>
                    <TableCell className={cellStyle}>{e.curso}</TableCell>
                    <TableCell className={cellStyle}>{e.instituicao}</TableCell>
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
                    <TableCell className={cellStyle}>{e.bolsa}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* PAGINAÇÃO */}
            <div className="flex items-center justify-end gap-2 p-4">
              <Button
                variant="outline"
                size="sm"
                disabled={!data?.prev?.$ref}
                onClick={prevPage}
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!data?.next?.$ref}
                onClick={nextPage}
              >
                Próxima <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
