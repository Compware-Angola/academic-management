
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Printer, FileCheck, ChevronLeft, ChevronRight, FileText, Eye, X, User, BookOpen, Phone, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Candidato, Documento } from "@/services/access_exam/fetch-candidatos.service";
import { useCandidatos } from "@/hooks/access_exam/use-candidatos";
import { useUpdateCandidato } from "@/hooks/access_exam/use-update-candidato";
import { UpdateCandidatoPayload } from "@/services/access_exam/update-candidato.service";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { viewFile } from "@/services/upload/upload-single.service";
import { ApiError } from "@/error";
import { useToast } from "@/hooks/use-toast";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { parseFilter } from "@/util/parse-filter";

export default function ListaCandidatos() {
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { toast } = useToast();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const [filters, setFilters] = useState({
    search: undefined,
    page: 1,
    limit: 10,
    codigoAnoLetivo: undefined,
    codigoCurso: undefined,
    codigoTurno: undefined,
    codigoFaculdade: undefined,
    codigoCandidato: undefined,
  });

  const [modal, setModal] = useState<{ open: boolean; candidato: Candidato | null }>({
    open: false,
    candidato: null,
  });

  const [editForm, setEditForm] = useState<UpdateCandidatoPayload>({
    nomePai: "",
    nomeMae: "",
    codigoProfissaoPai: 0,
    codigoProfissaoMae: 0,
    codigoCurso: 0,
    codigoCursoOpcional1: 0,
    codigoCursoOpcional2: 0,
    mediaFinal: 0,
    telefone: "",
    telefoneEmergencia: "",
    email: "",
    morada: "",
    codigoTurno: 0,
    codigoTurnoOpcional: 0,
    codigoTipoCandidatura: 0,
  });

  const { data, isLoading, refetch } = useCandidatos({
    search: filters.search || undefined,
    page: filters.page,
    limit: filters.limit,
    codigoAnoLetivo: parseFilter(filters.codigoAnoLetivo),
    codigoCurso: parseFilter(filters.codigoCurso),
    codigoTurno: parseFilter(filters.codigoTurno),


  });
  const { mutate: updateCandidato, isPending: isSaving } = useUpdateCandidato();

  const candidatos = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalpages ?? 1;
  const offset = ((filters.page ?? 1) - 1) * (filters.limit ?? 10);

  const exportRows = useMemo(
    () =>
      candidatos.map((candidato) => ({
        numeroInscricao: candidato.numero_inscricao,
        nome: candidato.nome,
        numeroBilhete: candidato.numero_bilhete,
        curso: candidato.curso,
        periodo: candidato.periodo,
        mediaFinal: candidato.media_final ?? "N/A",
        anoLectivo: candidato.ano_lectivo,
        tipoCandidatura: candidato.tipo_candidatura,
      })),
    [candidatos]
  );

  const pdfData = exportRows.length
    ? {
      filtros: [
        filters.search ? `Pesquisa: ${filters.search}` : null,
        filters.codigoAnoLetivo ? `Ano Letivo: ${filters.codigoAnoLetivo}` : null,
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
      documentTitle="Lista de Candidatos"
      subtitle="Gestão de candidatos ao exame de acesso"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        // { title: "Resumo", content: [`Total de registos: ${total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: "12%" },
          { key: "nome", label: "Nome", width: "24%" },
          { key: "numeroBilhete", label: "BI", width: "14%" },
          { key: "curso", label: "Curso", width: "16%" },
          { key: "periodo", label: "Período", width: "10%" },
          { key: "mediaFinal", label: "Média Final", width: "10%" },
          { key: "anoLectivo", label: "Ano Letivo", width: "14%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
      documentTitle: "Lista de Candidatos",
      subtitle: "Gestão de candidatos ao exame de acesso",
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
          { key: "periodo", label: "Período", width: 18 },
          { key: "mediaFinal", label: "Média Final", width: 15 },
          { key: "anoLectivo", label: "Ano Letivo", width: 18 },
          { key: "tipoCandidatura", label: "Tipo Candidatura", width: 25 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
    : null;

  const baseFileName = `Lista_Candidatos_${new Date().toISOString().slice(0, 10)}`;

  function handleSearchChange(value: string) {
    setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }));
  }

  function handleLimitChange(value: string) {
    setFilters((prev) => ({ ...prev, limit: Number(value), page: 1 }));
  }

  function handlePageChange(newPage: number) {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }

  function abrirModal(candidato: Candidato) {
    setEditForm({
      nomePai: candidato.nome_pai ?? "",
      nomeMae: candidato.nome_mae ?? "",
      codigoProfissaoPai: candidato.codigo_profissao_pai ?? 0,
      codigoProfissaoMae: candidato.codigo_profissao_mae ?? 0,
      codigoCurso: candidato.codigo_curso ?? 0,
      codigoCursoOpcional1: candidato.codigo_curso_opcional_1 ?? 0,
      codigoCursoOpcional2: candidato.codigo_curso_opcional_2 ?? 0,
      mediaFinal: candidato.media_final ?? 0,
      telefone: candidato.contato ?? "",
      telefoneEmergencia: candidato.contato_emergencia ?? "",
      email: candidato.email ?? "",
      morada: candidato.morada_completa ?? "",
      codigoTurno: candidato.codigo_periodo ?? 0,
      codigoTurnoOpcional: candidato.codigo_periodo_opcional ?? 0,
      codigoTipoCandidatura: candidato.codigo_tipo_candidatura ?? 0,
    });
    setModal({ open: true, candidato });
  }

  function handleEditField<K extends keyof UpdateCandidatoPayload>(field: K, value: UpdateCandidatoPayload[K]) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!modal.candidato) return;
    updateCandidato(
      { id: modal.candidato.numero_inscricao, payload: editForm },
      { onSuccess: () => setModal({ open: false, candidato: null }) }
    );
  }

  const handleDownload = async (ficheiroName: string) => {
    if (!ficheiroName) return;
    try {
      const blob = await viewFile(ficheiroName);
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof ApiError ? error.message : "Erro ao abrir o ficheiro.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Exame de Acesso</span>
        <span>/</span>
        <span className="text-foreground">Lista de candidatos</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de candidatos</h1>
          <p className="text-muted-foreground mt-1">Gestão de candidatos ao exame de acesso</p>
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
                codigoAnoLetivo: undefined,
                codigoCurso: undefined,
                codigoTurno: undefined,
                codigoCandidato: undefined,
                codigoFaculdade: undefined,
                page: 1,
                limit: filters.limit,
              })
            }
          >
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Nome ou BI..."
              value={filters.search ?? ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <FormSelect
              label="Ano Letivo"
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              value={filters.codigoAnoLetivo}
              onChange={(v) => setFilters({ ...filters, codigoAnoLetivo: v })}
              options={academicYear}
              map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
            />
          </div>
          <div className="space-y-2">
            <FacultySelect
              allOption
              value={filters.codigoFaculdade}
              onChangeValue={(v) => setFilters({ ...filters, codigoFaculdade: v, codigoCurso: undefined })}
            />
          </div>
          <div className="space-y-2">
            <CourseSelect
              value={filters.codigoCurso}
              params={{ tipoCandidaturaId: 1 }}
              onChangeValue={(v) => setFilters({ ...filters, codigoCurso: v })}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              disabled={isLoadingPeriodos || isLoadingAcademicYear || filters.codigoAnoLetivo === ""}
              loading={isLoadingPeriodos}
              label="Período"
              value={filters.codigoTurno?.toString() ?? "all"}
              onChange={(v) => setFilters((p) => ({ ...p, codigoTurno: v === "all" ? undefined : v, page: 1 }))}
              options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
              map={(p) => ({ key: p.codigo.toString(), label: p.designacao, value: p.codigo.toString() })}
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
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
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
                    <TableHead>BI</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-center">Média Final</TableHead>
                    <TableHead>Ano Lectivo</TableHead>
                    <TableHead>Tipo Candidatura</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidatos.map((candidato) => (
                    <TableRow key={candidato.numero_inscricao}>
                      <TableCell className="font-mono text-sm font-semibold">{candidato.numero_inscricao}</TableCell>
                      <TableCell className="font-medium">{candidato.nome}</TableCell>
                      <TableCell className="font-mono text-sm">{candidato.numero_bilhete}</TableCell>
                      <TableCell className="text-sm">{candidato.curso}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidato.periodo}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            candidato.media_final >= 14
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : candidato.media_final >= 10
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                          }
                        >
                          {candidato.media_final ?? "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{candidato.ano_lectivo}</TableCell>
                      <TableCell className="text-sm">{candidato.tipo_candidatura}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirModal(candidato)}
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
              <Label htmlFor="items-per-page" className="text-sm">Itens por página:</Label>
              <Select value={(filters.limit ?? 10).toString()} onValueChange={handleLimitChange}>
                <SelectTrigger id="items-per-page" className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Mostrando {offset + 1} a {Math.min(offset + (filters.limit ?? 10), total)} de {total} registos
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
              <span className="text-sm">Página {filters.page ?? 1} de {totalPages}</span>
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

      {/* Modal */}
      <Dialog open={modal.open} onOpenChange={(open) => setModal({ open, candidato: null })}>
        <DialogContent className="max-w-4xl! p-0! gap-0! overflow-hidden flex flex-col max-h-[90vh]!">

          {/* Topo fixo — resumo */}
          <div className="shrink-0 bg-muted/40 border-b px-6 py-5">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl">{modal.candidato?.nome}</DialogTitle>
            </DialogHeader>

            <div className="flex gap-8 items-start">
              {/* Ícone Animado do Estudante - Versão Otimizada */}
              <div className="relative shrink-0">
                {/* Ondas de fundo (ping) - mais suaves */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className="absolute h-40 w-40 rounded-full border-2 border-primary/10 animate-ping"
                    style={{ animationDuration: "2.2s" }}
                  />
                  <span
                    className="absolute h-56 w-56 rounded-full border border-primary/5 animate-ping"
                    style={{ animationDuration: "2.8s", animationDelay: "0.4s" }}
                  />
                  <span
                    className="absolute h-72 w-72 rounded-full border border-primary/5 animate-ping"
                    style={{ animationDuration: "3.5s", animationDelay: "0.8s" }}
                  />
                </div>

                {/* SVG do estudante */}
                <svg
                  width="160"
                  height="200"
                  viewBox="0 0 160 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10 drop-shadow-md will-change-transform"
                  style={{
                    animation: "float 3s ease-in-out infinite",
                    transform: "translateZ(0)",
                  }}
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

                  {/* Corpo */}
                  <rect x="52" y="95" width="56" height="70" rx="10" fill="hsl(var(--primary))" opacity="0.9" />

                  {/* Cabeça */}
                  <circle cx="80" cy="72" r="26" fill="#FBBF8A" />

                  {/* Cabelo */}
                  <ellipse cx="80" cy="50" rx="26" ry="12" fill="#3B1A08" />
                  <rect x="54" y="48" width="8" height="20" rx="4" fill="#3B1A08" />
                  <rect x="98" y="48" width="8" height="20" rx="4" fill="#3B1A08" />

                  {/* Olhos */}
                  <circle cx="72" cy="72" r="3.5" fill="#1e293b" />
                  <circle cx="88" cy="72" r="3.5" fill="#1e293b" />
                  <circle cx="73" cy="71" r="1" fill="white" />
                  <circle cx="89" cy="71" r="1" fill="white" />

                  {/* Sorriso */}
                  <path d="M73 80 Q80 87 87 80" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />

                  {/* Braço esquerdo */}
                  <rect x="30" y="98" width="24" height="12" rx="6" fill="hsl(var(--primary))" opacity="0.9" />

                  {/* Braço direito — acenando */}
                  <g style={{
                    transformOrigin: "108px 104px",
                    animation: "wave 1.6s ease-in-out infinite"
                  }}>
                    <rect x="108" y="98" width="24" height="12" rx="6" fill="hsl(var(--primary))" opacity="0.9" />
                    <circle cx="134" cy="104" r="7" fill="#FBBF8A" />
                  </g>

                  {/* Mão esquerda */}
                  <circle cx="28" cy="104" r="7" fill="#FBBF8A" />

                  {/* Pernas */}
                  <rect x="58" y="158" width="18" height="36" rx="8" fill="hsl(var(--primary))" opacity="0.7" />
                  <rect x="84" y="158" width="18" height="36" rx="8" fill="hsl(var(--primary))" opacity="0.7" />

                  {/* Sapatos */}
                  <ellipse cx="67" cy="193" rx="13" ry="6" fill="#1e293b" />
                  <ellipse cx="93" cy="193" rx="13" ry="6" fill="#1e293b" />

                  {/* Livro */}
                  <rect x="10" y="96" width="20" height="26" rx="3" fill="#f8fafc" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <line x1="20" y1="96" x2="20" y2="122" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <line x1="13" y1="104" x2="18" y2="104" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="13" y1="108" x2="18" y2="108" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="13" y1="112" x2="18" y2="112" stroke="#94a3b8" strokeWidth="1" />

                  {/* Chapéu de formatura */}
                  <rect x="58" y="42" width="44" height="8" rx="2" fill="#1e293b" />
                  <polygon points="80,20 58,42 102,42" fill="#1e293b" />
                  <line x1="102" y1="42" x2="110" y2="56" stroke="#FCD34D" strokeWidth="2" />
                  <circle cx="110" cy="58" r="4" fill="#FCD34D" />
                </svg>
              </div>

              {/* Dados do Candidato (mesmo de antes) */}
              <div className="flex-1 space-y-3 text-sm pt-3 overflow-y-auto max-h-[60vh] pr-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome</span>
                  <span className="font-semibold font-mono">{modal.candidato?.nome ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nº Inscrição</span>
                  <span className="font-semibold font-mono">{modal.candidato?.numero_inscricao ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bilhete de Identidade</span>
                  <span className="font-semibold font-mono">{modal.candidato?.numero_bilhete ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sexo</span>
                  <span className="font-semibold font-mono">{modal.candidato?.sexo ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nacionalidade</span>
                  <span className="font-semibold font-mono">{modal.candidato?.nacionalidade ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Curso</span>
                  <span className="font-semibold truncate max-w-[260px] text-right">{modal.candidato?.curso ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média Final</span>
                  <span className="font-semibold">
                    <span className={
                      (modal.candidato?.media_final ?? 0) >= 14 ? "text-green-600" :
                        (modal.candidato?.media_final ?? 0) >= 10 ? "text-yellow-600" : "text-red-600"
                    }>
                      {modal.candidato?.media_final ?? "N/A"}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Período</span>
                  <span className="font-semibold">{modal.candidato?.periodo ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ano Lectivo</span>
                  <span className="font-semibold">{modal.candidato?.ano_lectivo ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo Candidatura</span>
                  <span className="font-semibold truncate max-w-[260px] text-right">{modal.candidato?.tipo_candidatura ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Pre-Inscrição</span>
                  <span className="font-semibold truncate max-w-[260px] text-right">{modal.candidato?.data_preescrincao ?? "—"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs + conteúdo scrollável */}
          <Tabs defaultValue="pais" className="flex flex-col flex-1 overflow-hidden">
            <div className="shrink-0 px-6 pt-4 border-b">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="pais" className="flex items-center gap-1.5 text-xs">
                  <User className="h-3.5 w-3.5" /> Pais
                </TabsTrigger>
                <TabsTrigger value="academico" className="flex items-center gap-1.5 text-xs">
                  <BookOpen className="h-3.5 w-3.5" /> Académico
                </TabsTrigger>
                <TabsTrigger value="contactos" className="flex items-center gap-1.5 text-xs">
                  <Phone className="h-3.5 w-3.5" /> Contactos
                </TabsTrigger>
                <TabsTrigger value="turno" className="flex items-center gap-1.5 text-xs">
                  <Clock className="h-3.5 w-3.5" /> Turno
                </TabsTrigger>
                <TabsTrigger value="documentos" className="flex items-center gap-1.5 text-xs">
                  <FileText className="h-3.5 w-3.5" /> Documentos
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Área scrollável */}
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {/* 1. Dados dos Pais */}
              <TabsContent value="pais" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Pai</Label>
                    <Input
                      value={editForm.nomePai}
                      onChange={(e) => handleEditField("nomePai", e.target.value)}
                      placeholder="Nome do pai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome da Mãe</Label>
                    <Input
                      value={editForm.nomeMae}
                      onChange={(e) => handleEditField("nomeMae", e.target.value)}
                      placeholder="Nome da mãe"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 2. Dados Académicos */}
              <TabsContent value="academico" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <CourseSelect
                      label="Curso Principal"
                      value={editForm.codigoCurso?.toString() ?? ""}
                      onChangeValue={(v) => handleEditField("codigoCurso", Number(v))}
                    />
                  </div>
                  <div className="space-y-2">
                    <CourseSelect
                      label="Curso Opcional 1"
                      value={editForm.codigoCursoOpcional1?.toString() ?? ""}
                      onChangeValue={(v) => handleEditField("codigoCursoOpcional1", Number(v))}
                    />
                  </div>
                  <div className="space-y-2">
                    <CourseSelect
                      label="Curso Opcional 2"
                      value={editForm.codigoCursoOpcional2?.toString() ?? ""}
                      onChangeValue={(v) => handleEditField("codigoCursoOpcional2", Number(v))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Média Final</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={editForm.mediaFinal}
                      onChange={(e) => handleEditField("mediaFinal", Number(e.target.value))}
                      placeholder="0 - 20"
                    />
                  </div>
                  <div className="space-y-2">
                    <TipoCandidaturaSelect
                      value={editForm.codigoTipoCandidatura?.toString() ?? ""}
                      onChangeValue={(v) => handleEditField("codigoTipoCandidatura", Number(v))}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 3. Contactos */}
              <TabsContent value="contactos" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleEditField("email", e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={editForm.telefone}
                      onChange={(e) => handleEditField("telefone", e.target.value)}
                      placeholder="+244 9XX XXX XXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone de Emergência</Label>
                    <Input
                      value={editForm.telefoneEmergencia}
                      onChange={(e) => handleEditField("telefoneEmergencia", e.target.value)}
                      placeholder="+244 9XX XXX XXX"
                    />
                  </div>
                  <div className="space-y-2 ">
                    <Label>Morada</Label>
                    <Input
                      value={editForm.morada}
                      onChange={(e) => handleEditField("morada", e.target.value)}
                      placeholder="Rua, nº, Bairro, Município"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 4. Turno */}
              <TabsContent value="turno" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormSelect
                      label="Turno"
                      loading={isLoadingPeriodos}
                      value={editForm.codigoTurno?.toString() ?? ""}
                      onChange={(v) => handleEditField("codigoTurno", Number(v))}
                      options={periodos}
                      map={(p) => ({ key: p.codigo, label: p.designacao, value: p.codigo })}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormSelect
                      label="Turno Opcional"
                      loading={isLoadingPeriodos}
                      value={editForm.codigoTurnoOpcional?.toString() ?? ""}
                      onChange={(v) => handleEditField("codigoTurnoOpcional", Number(v))}
                      options={periodos}
                      map={(p) => ({ key: p.codigo, label: p.designacao, value: p.codigo })}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 5. Documentos */}
              <TabsContent value="documentos" className="mt-0">
                {!modal.candidato?.documentos?.length ? (
                  <div className="text-center py-10">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Nenhum documento disponível.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {modal.candidato.documentos.map((doc: Documento) => (
                      <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{doc.tipo_documento}</p>
                            <p className="text-xs text-muted-foreground">{doc.link}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc.link)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>

            {/* Rodapé fixo — só nas tabs editáveis */}
            <div className="shrink-0 border-t px-6 py-4 bg-background flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setModal({ open: false, candidato: null })}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "A guardar..." : "Guardar alterações"}
              </Button>
            </div>
          </Tabs>

        </DialogContent>
      </Dialog>
    </div>
  );
}