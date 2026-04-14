import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCandidatosAdmitidos } from "@/hooks/access_exam/use-candidatos-admitidos";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CandidatoAdmitido } from "@/services/access_exam/fetch-admitidos.service";
import { parseFilter } from "@/util/parse-filter";

export default function CandidatosAdmitidos() {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const [filters, setFilters] = useState({
    search: undefined as string | undefined,
    page: 1,
    limit: 10,
    codigoAnoLetivo: "23",
    codigoCurso: undefined,
    codigoTurno: undefined,
    codigoFaculdade: undefined,
    matriculado: undefined,
    localAdmissao: undefined,
  });

  const [modal, setModal] = useState<{
    open: boolean;
    candidato: CandidatoAdmitido | null;
  }>({
    open: false,
    candidato: null,
  });

  const { data, isLoading, refetch } = useCandidatosAdmitidos({

    search: filters.search,
    codigoAnoLetivo: parseFilter(filters.codigoAnoLetivo),
    codigoCurso: parseFilter(filters.codigoCurso),
    codigoTurno: parseFilter(filters.codigoTurno),
    codigoFaculdade: parseFilter(filters.codigoFaculdade),
    matriculado: parseFilter(filters.matriculado),
    localAdmissao: parseFilter(filters.localAdmissao),


  });

  const candidatos = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalpages ?? 1;
  const offset = ((filters.page ?? 1) - 1) * (filters.limit ?? 10);

  const exportRows = useMemo(
    () =>
      candidatos.map((c) => ({
        numeroInscricao: c.numero_inscricao,
        nome: c.nome,
        bilheteIdentidade: c.bilhete_identidade,
        contato: c.contato,
        email: c.email,
        curso: c.curso,
        idade: c.idade,
        matriculado: c.matriculado,
        localAdmissao: c.local_admissao,
        dataNascimento: c.data_nascimento,
        dataPreinscricao: c.data_preescrincao,
      })),
    [candidatos]
  );

  const pdfData = exportRows.length
    ? {
      filtros: [
        filters.search ? `Pesquisa: ${filters.search}` : null,
        filters.codigoAnoLetivo
          ? `Ano Letivo: ${filters.codigoAnoLetivo}`
          : null,
        filters.codigoCurso ? `Curso: ${filters.codigoCurso}` : null,
        filters.codigoTurno ? `Período: ${filters.codigoTurno}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      total: exportRows.length,
      rows: exportRows,
    }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Candidatos Admitidos"
      subtitle="Lista de candidatos admitidos"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros || "Sem filtros",
        },
      ]}
      mainTable={{
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: "12%" },
          { key: "nome", label: "Nome", width: "24%" },
          { key: "bilheteIdentidade", label: "BI", width: "16%" },
          { key: "curso", label: "Curso", width: "20%" },
          { key: "matriculado", label: "Matriculado", width: "12%" },
          { key: "localAdmissao", label: "Local Admissão", width: "16%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
      documentTitle: "Candidatos Admitidos",
      subtitle: "Lista de candidatos admitidos",
      infoSections: [
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros || "Sem filtros",
        },
        { title: "Resumo", content: [`Total de registos: ${total}`] },
      ],
      mainTable: {
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: 18 },
          { key: "nome", label: "Nome", width: 30 },
          { key: "bilheteIdentidade", label: "BI", width: 20 },
          { key: "contato", label: "Contacto", width: 18 },
          { key: "email", label: "Email", width: 28 },
          { key: "curso", label: "Curso", width: 25 },
          { key: "idade", label: "Idade", width: 10 },
          { key: "matriculado", label: "Matriculado", width: 15 },
          { key: "localAdmissao", label: "Local Admissão", width: 20 },
          { key: "dataNascimento", label: "Data Nascimento", width: 20 },
          { key: "dataPreinscricao", label: "Data Pré-Inscrição", width: 22 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
    : null;

  const baseFileName = `Candidatos_Admitidos_${new Date()
    .toISOString()
    .slice(0, 10)}`;

  function handleSearchChange(value: string) {
    setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }));
  }

  function handleLimitChange(value: string) {
    setFilters((prev) => ({ ...prev, limit: Number(value), page: 1 }));
  }

  function handlePageChange(newPage: number) {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Exame de Acesso</span>
        <span>/</span>
        <span className="text-foreground">Candidatos Admitidos</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Candidatos Admitidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão de candidatos admitidos 
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({
                search: undefined,
                codigoAnoLetivo: "23",
                codigoCurso: undefined,
                codigoTurno: undefined,
                codigoFaculdade: undefined,
                matriculado: undefined,
                localAdmissao: undefined,
                page: 1,
                limit: filters.limit,
              })
            }
          >
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


          <FormSelect
            label="Ano Letivo"
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            value={filters.codigoAnoLetivo?.toString() ?? "all"}
            onChange={(v) =>
              setFilters({ ...filters, codigoAnoLetivo: v, page: 1 })
            }
            options={academicYear}
            map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
          />

          <FacultySelect
            allOption
            value={filters.codigoFaculdade}
            onChangeValue={(v) =>
              setFilters({
                ...filters,
                codigoFaculdade: v,
                codigoCurso: undefined,
                page: 1,
              })
            }
          />

          <CourseSelect
            value={filters.codigoCurso}
            onChangeValue={(v) =>
              setFilters({ ...filters, codigoCurso: v, page: 1 })
            }
          />

          <FormSelect
            disabled={isLoadingPeriodos}
            loading={isLoadingPeriodos}
            label="Período"
            value={filters.codigoTurno?.toString() ?? "all"}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                codigoTurno: v === "all" ? undefined : Number(v),
                page: 1,
              }))
            }
            options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
            map={(p) => ({
              key: p.codigo.toString(),
              label: p.designacao,
              value: p.codigo.toString(),
            })}
          />

          <div className="space-y-2">
            <Label>Matriculado</Label>
            <Select
              value={filters.matriculado?.toString() ?? "all"}
              onValueChange={(v) =>
                setFilters((p) => ({
                  ...p,
                  matriculado: v === "all" ? undefined : Number(v),
                  page: 1,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1">Sim</SelectItem>
                <SelectItem value="0">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Local Admissão</Label>
            <Select
              value={filters.localAdmissao?.toString() ?? "all"}
              onValueChange={(v) =>
                setFilters((p) => ({
                  ...p,
                  localAdmissao: v === "all" ? undefined : Number(v),
                  page: 1,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1">Universidade Pública</SelectItem>
                <SelectItem value="0">Universidade Metodista de Angola</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Nome ou BI..."
              value={filters.search ?? ""}
              onChange={(e) => handleSearchChange(e.target.value)}
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
          <p className="text-muted-foreground mb-4">
            Nenhum registo encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Não foram encontrados candidatos admitidos com os critérios
            selecionados
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
                    <TableHead>BI</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Contacto</TableHead>
                  
                    <TableHead className="text-center">Matriculado</TableHead>
                    <TableHead>Local Admissão</TableHead>
                    <TableHead>Data de Candidatura</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidatos.map((candidato) => (
                    <TableRow key={candidato.numero_inscricao}>
                      <TableCell className="font-mono text-sm font-semibold">
                        {candidato.numero_inscricao}
                      </TableCell>
                      <TableCell className="font-medium">
                        {candidato.nome}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {candidato.bilhete_identidade}
                      </TableCell>
                      <TableCell className="text-sm">
                        {candidato.curso}
                      </TableCell>
                      <TableCell className="text-sm">
                        {candidato.contato}
                      </TableCell>
                    
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            candidato.matriculado === "SIM"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                          }
                        >
                          {candidato.matriculado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {candidato.local_admissao}
                      </TableCell>
                      <TableCell className="text-sm">
                        {candidato.data_preescrincao
                          ? new Date(
                            candidato.data_preescrincao
                          ).toLocaleDateString("pt-AO")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModal({ open: true, candidato })
                          }
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
              <Label htmlFor="items-per-page" className="text-sm">
                Itens por página:
              </Label>
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
                Mostrando {offset + 1} a{" "}
                {Math.min(offset + (filters.limit ?? 10), total)} de {total}{" "}
                registos
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
                disabled={(filters.page ?? 1) === totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal de detalhe — apenas leitura */}
      <Dialog
        open={modal.open}
        onOpenChange={(open) => setModal({ open, candidato: null })}
      >
        <DialogContent className="max-w-2xl! p-0! gap-0! overflow-hidden flex flex-col max-h-[90vh]!">
          {/* Topo */}
          <div className="shrink-0 bg-muted/40 border-b px-6 py-5">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl">
                {modal.candidato?.nome}
              </DialogTitle>
            </DialogHeader>

            <div className="flex gap-8 items-start">
              {/* SVG estudante (reutilizado do modelo) */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className="absolute h-40 w-40 rounded-full border-2 border-primary/10 animate-ping"
                    style={{ animationDuration: "2.2s" }}
                  />
                  <span
                    className="absolute h-56 w-56 rounded-full border border-primary/5 animate-ping"
                    style={{
                      animationDuration: "2.8s",
                      animationDelay: "0.4s",
                    }}
                  />
                </div>
                <svg
                  width="130"
                  height="160"
                  viewBox="0 0 160 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 drop-shadow-md"
                  style={{ animation: "float 3s ease-in-out infinite" }}
                >
                  <style>{`
                    @keyframes float {
                      0%, 100% { transform: translateY(0px); }
                      50% { transform: translateY(-12px); }
                    }
                    @keyframes wave {
                      0%, 100% { transform: rotate(0deg); }
                      25% { transform: rotate(20deg); }
                      75% { transform: rotate(-10deg); }
                    }
                  `}</style>
                  <rect x="52" y="95" width="56" height="70" rx="10" fill="hsl(var(--primary))" opacity="0.9" />
                  <circle cx="80" cy="72" r="26" fill="#FBBF8A" />
                  <ellipse cx="80" cy="50" rx="26" ry="12" fill="#3B1A08" />
                  <rect x="54" y="48" width="8" height="20" rx="4" fill="#3B1A08" />
                  <rect x="98" y="48" width="8" height="20" rx="4" fill="#3B1A08" />
                  <circle cx="72" cy="72" r="3.5" fill="#1e293b" />
                  <circle cx="88" cy="72" r="3.5" fill="#1e293b" />
                  <circle cx="73" cy="71" r="1" fill="white" />
                  <circle cx="89" cy="71" r="1" fill="white" />
                  <path d="M73 80 Q80 87 87 80" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <rect x="30" y="98" width="24" height="12" rx="6" fill="hsl(var(--primary))" opacity="0.9" />
                  <g style={{ transformOrigin: "108px 104px", animation: "wave 1.6s ease-in-out infinite" }}>
                    <rect x="108" y="98" width="24" height="12" rx="6" fill="hsl(var(--primary))" opacity="0.9" />
                    <circle cx="134" cy="104" r="7" fill="#FBBF8A" />
                  </g>
                  <circle cx="28" cy="104" r="7" fill="#FBBF8A" />
                  <rect x="58" y="158" width="18" height="36" rx="8" fill="hsl(var(--primary))" opacity="0.7" />
                  <rect x="84" y="158" width="18" height="36" rx="8" fill="hsl(var(--primary))" opacity="0.7" />
                  <ellipse cx="67" cy="193" rx="13" ry="6" fill="#1e293b" />
                  <ellipse cx="93" cy="193" rx="13" ry="6" fill="#1e293b" />
                  <rect x="58" y="42" width="44" height="8" rx="2" fill="#1e293b" />
                  <polygon points="80,20 58,42 102,42" fill="#1e293b" />
                  <line x1="102" y1="42" x2="110" y2="56" stroke="#FCD34D" strokeWidth="2" />
                  <circle cx="110" cy="58" r="4" fill="#FCD34D" />
                </svg>
              </div>

              {/* Dados */}
              <div className="flex-1 space-y-3 text-sm pt-2 overflow-y-auto max-h-[55vh] pr-1">
                {[
                  ["Nº Inscrição", modal.candidato?.numero_inscricao],
                  ["Nome", modal.candidato?.nome],
                  ["Bilhete de Identidade", modal.candidato?.bilhete_identidade],
                  ["Contacto", modal.candidato?.contato],
                  ["Email", modal.candidato?.email],
                  ["Curso", modal.candidato?.curso],
                  ["Idade", modal.candidato?.idade],
                  [
                    "Data de Nascimento",
                    modal.candidato?.data_nascimento
                      ? new Date(modal.candidato.data_nascimento).toLocaleDateString("pt-AO")
                      : "—",
                  ],
              
                  ["Local Admissão", modal.candidato?.local_admissao],
                  ["Matriculado", modal.candidato?.matriculado],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold font-mono text-right max-w-[260px] truncate">
                      {value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="shrink-0 border-t px-6 py-4 bg-background flex justify-end">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, candidato: null })}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}