import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  RefreshCw,
  Download,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";

import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useCursos } from "@/hooks/use-cursos";
import { useLancamentosPauta } from "@/hooks/avaliacao/use-query-lancamento-pauta";
import { useCreateLancamentoPauta } from "@/hooks/avaliacao/use-mutation-create-lancamento-pauta copy";
import { useAuth } from "@/hooks/use-auth";
import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { viewFile } from "@/services/upload/upload-single.service";
import { ApiError } from "@/error";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutationAtualizarEstadoPauta } from "@/hooks/avaliacao/use-mutation-update-estado-lancamento-pauta";
import { useQueryEstadoPauta } from "@/hooks/avaliacao/use-query-estado-pauta";
import { number } from "framer-motion";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

export default function ValidationTeacherAgenda() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();

  // Modal de submissão
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal de aprovação/rejeição
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [acaoTipo, setAcaoTipo] = useState<"aprovar" | "rejeitar" | null>(null);
  const [pautaIdSelecionada, setPautaIdSelecionada] = useState<number | null>(
    null
  );
  const [pautaInfo, setPautaInfo] = useState<any>(null); // Para mostrar detalhes na modal

  const uploadMutation = useUploadSingle();
  const createMutation = useCreateLancamentoPauta();
  const atualizarEstadoMutation = useMutationAtualizarEstadoPauta();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    tipoAvaliacao: "",
    estadoPauta: "",
  });

  // Queries
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: filters.curso });
  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: filters.anoCurricular,
      curso: filters.curso,
      semestre: filters.semestre,
    });
  const { data: estadoPauta = [], isLoading: isLoadingPautaEstado } =
    useQueryEstadoPauta();
  const {
    data: response,
    isLoading: isLoadingPautas,
    error: errorPautas,
  } = useLancamentosPauta({
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    tipoAvaliacao: filters.tipoAvaliacao
      ? Number(filters.tipoAvaliacao)
      : undefined,
    codigoGrade: filters.unidadeCurricular
      ? Number(filters.unidadeCurricular)
      : undefined,
    curso: filters.curso ? Number(filters.curso) : undefined,
    anoCurricular: filters.anoCurricular
      ? Number(filters.anoCurricular)
      : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    estadoPauta: filters.estadoPauta ? Number(filters.estadoPauta) : undefined,
    page: currentPage,
    limit: limit,
  });

  const pautas = response?.data ?? [];
  const pagination = {
    page: response?.page ?? 1,
    limit: response?.limit ?? limit,
    total: response?.total ?? 0,
    totalPages: response?.totalPages ?? 1,
  };

  // Função para limpar input de arquivo
  const clearFileInput = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Funções para Aprovar / Rejeitar
  const abrirConfirmacao = (pauta: any, acao: "aprovar" | "rejeitar") => {
    setPautaIdSelecionada(pauta.codigo);
    setPautaInfo(pauta);
    setAcaoTipo(acao);
    setIsConfirmModalOpen(true);
  };
  const confirmarAcao = () => {
    if (!pautaIdSelecionada || !acaoTipo) return;

    const novoEstado = acaoTipo === "aprovar" ? 2 : 3;

    atualizarEstadoMutation.mutate(
      {
        codigo: pautaIdSelecionada,
        fkEstadoLancamentoPauta: novoEstado as 2 | 3,
      },
      {
        onSettled: () => {
          // Fecha a modal após sucesso ou erro
          setIsConfirmModalOpen(false);
          setAcaoTipo(null);
          setPautaIdSelecionada(null);
          setPautaInfo(null);
        },
      }
    );
  };

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

  const getEstadoBadge = (estado: number) => {
    switch (estado) {
      case 1:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
            Pendente
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            Aprovado
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getAnoLetivoLabel = () =>
    academicYear?.find((a) => a.codigo === Number(filters.anoLectivo))
      ?.designacao || "";
  const getCursoLabel = () =>
    cursos?.find((c) => c.codigo === Number(filters.curso))?.designacao || "";
  const getUnidadeCurricularLabel = () =>
    unidadesCurriculares?.find(
      (u) => u.pk === Number(filters.unidadeCurricular)
    )?.descricao || "";
  const getTipoAvaliacaoLabel = () =>
    tipoAvaliacao?.find((t) => t.codigo === Number(filters.tipoAvaliacao))
      ?.designacao || "";

  return (
    <div className="space-y-6">
      {/* Breadcrumb e Cabeçalho */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Avaliações</span>
        <span>/</span>
        <span className="text-foreground">Validação da pauta do docente</span>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Validação da pauta do docente
          </h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormSelect
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            label="Ano Letivo"
            value={filters.anoLectivo}
            onChange={(v) => {
              setFilters({ ...filters, anoLectivo: v });
              setCurrentPage(1);
            }}
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />
          <FormSelect
            disabled={isLoadingSemestres}
            loading={isLoadingSemestres}
            label="Semestre"
            value={filters.semestre}
            onChange={(v) => {
              setFilters({ ...filters, semestre: v });
              setCurrentPage(1);
            }}
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />



              <CourseSelect
                value={filters.curso}
                onChangeValue={(v) => {
                  setFilters({
                    ...filters,
                    curso: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  });
                  setCurrentPage(1);
                }}
              />

          <FormSelect
            label="Ano Curricular"
            value={filters.anoCurricular}
            disabled={isLoadingClasses || !filters.curso}
            loading={isLoadingClasses}
            onChange={(v) => {
              setFilters({
                ...filters,
                anoCurricular: v,
                unidadeCurricular: "",
              });
              setCurrentPage(1);
            }}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
          />
          <FormSelect
            label="Unidade Curricular"
            value={filters.unidadeCurricular}
            disabled={
              isLoadingUC ||
              !filters.semestre ||
              !filters.curso ||
              !filters.anoCurricular
            }
            loading={isLoadingUC}
            onChange={(v) => {
              setFilters({ ...filters, unidadeCurricular: v });
              setCurrentPage(1);
            }}
            options={unidadesCurriculares}
            map={(u) => ({ key: u.pk, label: u.descricao, value: u.pk })}
          />
          <FormSelect
            label="Tipo de Avaliação"
            value={filters.tipoAvaliacao}
            disabled={isLoadingTipoAvaliacao}
            loading={isLoadingTipoAvaliacao}
            onChange={(v) => {
              setFilters({ ...filters, tipoAvaliacao: v });
              setCurrentPage(1);
            }}
            options={tipoAvaliacao}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
          />
          <FormSelect
            label="Estado da Pauta"
            value={filters.estadoPauta}
            disabled={isLoadingPautaEstado}
            loading={isLoadingPautaEstado}
            onChange={(v) => {
              setFilters({ ...filters, estadoPauta: v });
              setCurrentPage(1);
            }}
            options={estadoPauta}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
          />
        </div>
      </div>

      {/* Modal Confirmação Aprovar/Rejeitar */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {acaoTipo === "aprovar" ? "Aprovar" : "Rejeitar"} Pauta
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja{" "}
              <strong>{acaoTipo === "aprovar" ? "aprovar" : "rejeitar"}</strong>{" "}
              esta pauta?
              <br />
              {pautaInfo && (
                <>
                  <strong>Unidade Curricular:</strong>{" "}
                  {pautaInfo.unidade_curricular}
                  <br />
                  <strong>Docente:</strong> {pautaInfo.docente_nome}
                </>
              )}
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant={acaoTipo === "aprovar" ? "default" : "destructive"}
              onClick={confirmarAcao}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabela */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Pautas Submetidas</h3>

        {isLoadingPautas ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : errorPautas ? (
          <div className="text-center py-8 text-destructive">
            Erro ao carregar pautas: {(errorPautas as Error).message}
          </div>
        ) : pautas.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma pauta encontrada</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Unidade Curricular</TableHead>
                    <TableHead>Ano Curricular</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Tipo Avaliação</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pautas.map((pauta) => (
                    <TableRow key={pauta.codigo}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          {pauta.ficheiro_name ? (
                            <span className="truncate max-w-[200px]">
                              {pauta.ficheiro_name.split("/").pop()}
                            </span>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(pauta.created_at).toLocaleDateString("pt-AO")}
                      </TableCell>
                      <TableCell>{pauta.curso}</TableCell>
                      <TableCell>{pauta.unidade_curricular}</TableCell>
                      <TableCell>{pauta.classe}</TableCell>
                      <TableCell>{pauta.docente_nome}</TableCell>
                      <TableCell>{pauta.designacao_av}</TableCell>
                      <TableCell>
                        {getEstadoBadge(pauta.estado_pauta)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {pauta.ficheiro_name && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDownload(pauta.ficheiro_name!)
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Botões apenas se pendente */}
                          {pauta.estado_pauta === 1 && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:bg-green-50"
                                title="Aprovar"
                                onClick={() =>
                                  abrirConfirmacao(pauta, "aprovar")
                                }
                              >
                                <CircleCheck className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                title="Rejeitar"
                                onClick={() =>
                                  abrirConfirmacao(pauta, "rejeitar")
                                }
                              >
                                <CircleX className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * limit + 1} a{" "}
                {Math.min(currentPage * limit, pagination.total)} de{" "}
                {pagination.total} registos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1 || isLoadingPautas}
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <span className="text-sm px-3">
                  Página {currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1)
                    )
                  }
                  disabled={
                    currentPage === pagination.totalPages || isLoadingPautas
                  }
                >
                  Seguinte <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
