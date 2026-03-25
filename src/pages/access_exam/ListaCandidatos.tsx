// pages/lista-candidatos.tsx
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { useState , useMemo} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RefreshCw, Download, Printer, FileCheck, ChevronLeft, ChevronRight, FileText, Edit, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Candidato, Documento, FilterCandidatoParams } from "@/services/access_exam/fetch-candidatos.service";
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

export default function ListaCandidatos() {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
    const { toast } = useToast();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
  const [filters, setFilters] = useState({
    search: undefined,
    page: 1,
    limit: 10,
    codigoAnoLetivo: undefined,
    codigoCurso: undefined,
    codigoTurno: undefined,
    codigoCandidato: undefined,
  });
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
        description:
          error instanceof ApiError
            ? error.message
            : "Erro ao abrir o ficheiro.",
        variant: "destructive",
      });
    }
  };

  const [documentosModal, setDocumentosModal] = useState<{
    open: boolean;
    candidato: Candidato | null;
  }>({ open: false, candidato: null });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    candidato: Candidato | null;
  }>({ open: false, candidato: null });

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

  const { data, isLoading, refetch } = useCandidatos(filters);
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
      { title: "Resumo", content: [`Total de registos: ${total}`] },
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
      headerBackground: "#1e40af",
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
      primaryColor: "#1e40af",
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

  function abrirDocumentos(candidato: Candidato) {
    setDocumentosModal({ open: true, candidato });
  }

  function abrirEdicao(candidato: Candidato) {
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
    setEditModal({ open: true, candidato });
  }

  function handleEditField<K extends keyof UpdateCandidatoPayload>(
    field: K,
    value: UpdateCandidatoPayload[K]
  ) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (!editModal.candidato) return;
    updateCandidato(
      { id: editModal.candidato.numero_inscricao, payload: editForm },
      { onSuccess: () => setEditModal({ open: false, candidato: null }) }
    );
  }

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
          codigoAnoLetivo: "",
          codigoCurso: undefined,
          codigoTurno: "",
          codigoCandidato:undefined,
          page: 1,
          limit: filters.limit,
        })
      }
    >
      <X className="h-4 w-4 mr-2" />
      Limpar filtros
    </Button>
  </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Nome ou BI..."
              value={filters.search ?? ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              label="Ano Letivo"
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              value={filters.codigoAnoLetivo}
              onChange={(v) =>
                setFilters({ ...filters, codigoAnoLetivo: v })
              }
              options={academicYear}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
          </div>
          <div className="space-y-2">
            <CourseSelect
              value={filters.codigoCurso}
              onChangeValue={(v) => {
                setFilters({
                  ...filters,
                  codigoCurso: v,

                });
              }}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              disabled={
                isLoadingPeriodos ||
                isLoadingAcademicYear ||
                filters.codigoAnoLetivo === ""

              }
              loading={isLoadingPeriodos}
              label="Período"
              value={filters.codigoTurno}
              onChange={(v) => setFilters({ ...filters, codigoTurno: v })}
              options={periodos}
              map={(p) => ({
                key: p.codigo,
                label: p.designacao,
                value: p.codigo,
              })}
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
          <p className="text-sm text-muted-foreground mb-4">
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
                      <TableCell className="font-mono text-sm font-semibold">
                        {candidato.numero_inscricao}
                      </TableCell>
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
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => abrirEdicao(candidato)}
                            title="Editar candidato"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => abrirDocumentos(candidato)}
                            title="Ver documentos"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
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

      {/* Modal de Documentos */}
      <Dialog
        open={documentosModal.open}
        onOpenChange={(open) => setDocumentosModal({ open, candidato: null })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Documentos — {documentosModal.candidato?.nome}</DialogTitle>
          </DialogHeader>
          {!documentosModal.candidato?.documentos.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum documento disponível.
            </p>
          ) : (
            <div className="space-y-3 mt-2">
              {documentosModal.candidato.documentos.map((doc: Documento) => (
                <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{doc.tipo_documento}</p>
                      <p className="text-xs text-muted-foreground">{doc.link}</p>
                    </div>
                  </div>
                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownload(doc.link)}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                 
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
   <Dialog
  open={editModal.open}
  onOpenChange={(open) => setEditModal({ open, candidato: null })}
>
  <DialogContent className="max-w-2xl! max-h-[90vh]! overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Editar candidato — {editModal.candidato?.nome}</DialogTitle>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">

      {/* Nome Pai */}
      <div className="space-y-2">
        <Label>Nome do Pai</Label>
        <Input
          value={editForm.nomePai}
          onChange={(e) => handleEditField("nomePai", e.target.value)}
          placeholder="Nome do pai"
        />
      </div>

      {/* Nome Mãe */}
      <div className="space-y-2">
        <Label>Nome da Mãe</Label>
        <Input
          value={editForm.nomeMae}
          onChange={(e) => handleEditField("nomeMae", e.target.value)}
          placeholder="Nome da mãe"
        />
      </div>

   

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={editForm.email}
          onChange={(e) => handleEditField("email", e.target.value)}
          placeholder="email@exemplo.com"
        />
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label>Telefone</Label>
        <Input
          value={editForm.telefone}
          onChange={(e) => handleEditField("telefone", e.target.value)}
          placeholder="+244 9XX XXX XXX"
        />
      </div>

      {/* Telefone de Emergência */}
      <div className="space-y-2">
        <Label>Telefone de Emergência</Label>
        <Input
          value={editForm.telefoneEmergencia}
          onChange={(e) => handleEditField("telefoneEmergencia", e.target.value)}
          placeholder="+244 9XX XXX XXX"
        />
      </div>

      {/* Média Final */}
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

      {/* Morada */}
      <div className="space-y-2 md:col-span-2">
        <Label>Morada</Label>
        <Input
          value={editForm.morada}
          onChange={(e) => handleEditField("morada", e.target.value)}
          placeholder="Rua, nº, Bairro, Município"
        />
      </div>

{/* Curso Principal */}
<div className="space-y-2 md:col-span-2">
  <CourseSelect
  label="Curso Principal"
    value={editForm.codigoCurso?.toString() ?? ""}
    onChangeValue={(v) => handleEditField("codigoCurso", Number(v))}
  />
</div>

{/* Curso Opcional 1 */}
<div className="space-y-2">
  <CourseSelect
  
    label="Curso Opcional 1"
    value={editForm.codigoCursoOpcional1?.toString() ?? ""}
    onChangeValue={(v) => handleEditField("codigoCursoOpcional1", Number(v))}
  />
</div>

{/* Curso Opcional 2 */}
<div className="space-y-2">
  <CourseSelect
    label="Curso Opcional 2"
    value={editForm.codigoCursoOpcional2?.toString() ?? ""}
    onChangeValue={(v) => handleEditField("codigoCursoOpcional2", Number(v))}
  />
</div>

      {/* Turno */}
      <div className="space-y-2">
        <FormSelect
          label="Turno"
          loading={isLoadingPeriodos}
          value={editForm.codigoTurno?.toString() ?? ""}
          onChange={(v) => handleEditField("codigoTurno", Number(v))}
          options={periodos}
          map={(p) => ({
            key: p.codigo,
            label: p.designacao,
            value: p.codigo,
          })}
        />
      </div>

      {/* Turno Opcional */}
      <div className="space-y-2">
        <FormSelect
          label="Turno Opcional"
          loading={isLoadingPeriodos}
          value={editForm.codigoTurnoOpcional?.toString() ?? ""}
          onChange={(v) => handleEditField("codigoTurnoOpcional", Number(v))}
          options={periodos}
          map={(p) => ({
            key: p.codigo,
            label: p.designacao,
            value: p.codigo,
          })}
        />
      </div>

      {/* Tipo Candidatura */}
      <div className="space-y-2 md:col-span-2">
     <div className="space-y-2">
  <TipoCandidaturaSelect
    value={editForm.codigoTipoCandidatura?.toString() ?? ""}
    onChangeValue={(v) => handleEditField("codigoTipoCandidatura", Number(v))}
  />
</div>
      </div>

    </div>

    <DialogFooter className="mt-4">
      <Button
        variant="outline"
        onClick={() => setEditModal({ open: false, candidato: null })}
        disabled={isSaving}
      >
        Cancelar
      </Button>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "A guardar..." : "Guardar alterações"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}