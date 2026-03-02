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
import { DocenteCursoSelect } from "@/components/common/global-selects/DocenteCursoSelect";
import { DocenteCadeiraSelect } from "@/components/common/global-selects/DocenteCadeiraSelect";
import { useDocenteFetchPauta } from "@/hooks/docentes/use-docente-fetch-pauta";

export default function DocenteLancamentoProgramaUC() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user: userData } = useAuth();

  // Modal de submissão
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal de aprovação/rejeição
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [acaoTipo, setAcaoTipo] = useState<"aprovar" | "rejeitar" | null>(null);
  const [pautaIdSelecionada, setPautaIdSelecionada] = useState<number | null>(
    null,
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
  });

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
  const { data: teacherInfoData } = useQueryTeacherProfile(
    userData?.user?.pk_utilizador,
  );
  const {
    data: response,
    isLoading: isLoadingPautas,
    error: errorPautas,
    refetch,
  } = useDocenteFetchPauta({
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    anoCurricular: filters.anoCurricular
      ? Number(filters.anoCurricular)
      : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    codigoCurso: filters.curso ? Number(filters.curso) : undefined,
    page: currentPage,
    limit: limit,
    docenteId: teacherInfoData?.codigo_docente,
  });

  const pautas = response?.data ?? [];
  const pagination = {
    page: response?.page ?? 1,
    limit: response?.limit ?? limit,
    total: response?.total ?? 0,
    totalPages: response?.totalPages ?? 1,
  };

  const clearFileInput = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo PDF.",
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      toast({
        title: "Arquivo selecionado",
        description: `${file.name} pronto para submissão.`,
      });
    }
  };

  const handleOpenSubmitModal = () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um PDF.",
        variant: "destructive",
      });
      return;
    }
    console.log(filters);
    if (!filters.anoLectivo || !filters.unidadeCurricular) {
      toast({
        title: "Campos obrigatórios",
        description:
          "Ano letivo, unidade curricular e tipo de avaliação são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);

    try {
      const uploadResponse = await uploadMutation.mutateAsync(selectedFile!);

      if (!uploadResponse.file?.path) {
        toast({
          title: "Erro ao fazer upload",
          description: "Não foi possível fazer upload do ficheiro.",
          variant: "destructive",
        });
        return;
      }

      const docenteId = teacherInfoData?.codigo_docente;
      if (!docenteId) {
        toast({
          title: "Erro ao fazer upload",
          description: "Somente professor devem submeter a pauta",
          variant: "destructive",
        });

        return;
      }
      // createMutation.mutate(
      //   {
      //     anoLectivoId: Number(filters.anoLectivo),
      //     docenteId: Number(docenteId),
      //     gradeCurricularId: Number(filters.unidadeCurricular),
      //     fkEstadoLancamentoPauta: 1,
      //     fkTipoAvaliacao: Number(filters.tipoAvaliacao),
      //     ficheiroName: uploadResponse.file.filename,
      //   },
      //   {
      //     onSuccess: (data) => {
      //       toast({
      //         title: "Sucesso!",
      //         description: data.message || "Pauta submetida com sucesso.",
      //       });
      //       clearFileInput();
      //       setCurrentPage(1);
      //       refetch();
      //     },
      //     onError: (error: any) => {
      //       toast({
      //         title: "Erro ao submeter",
      //         description: error.message || "Tente novamente.",
      //         variant: "destructive",
      //       });
      //     },
      //   },
      // );
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar o upload.",
        variant: "destructive",
      });
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
      },
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
      (u) => u.pk === Number(filters.unidadeCurricular),
    )?.descricao || "";
  // const getTipoAvaliacaoLabel = () =>
  //   tipoAvaliacao?.find((t) => t.codigo === Number(filters.tipoAvaliacao))
  //     ?.designacao || "";
  const isFiltersComplete =
    !!filters.anoLectivo &&
    !!filters.semestre &&
    !!filters.curso &&
    !!filters.anoCurricular &&
    !!filters.unidadeCurricular;

  const isDocente = !!teacherInfoData?.codigo_docente;

  const canSelectFile = isFiltersComplete && isDocente;

  const canSubmit =
    selectedFile &&
    isFiltersComplete &&
    !createMutation.isPending &&
    !uploadMutation.isPending;
  return (
    <div className="space-y-6">
      {/* Breadcrumb e Cabeçalho */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Docentes</span>
        <span>/</span>
        <span className="text-foreground">Lançamento do Programa da UC</span>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lançamento do Programa da UC
          </h1>
          <p className="text-muted-foreground mt-1">
            Submeta o programa da UC em formato PDF
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoadingPautas}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoadingPautas ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormSelect
            disabled={isLoadingAcademicYear || !teacherInfoData?.codigo_docente}
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
            disabled={isLoadingSemestres || !teacherInfoData?.codigo_docente}
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
          <DocenteCursoSelect
            docenteId={teacherInfoData?.codigo_docente}
            value={filters.curso}
            onChangeValue={(v) => {
              setFilters({
                ...filters,
                curso: v,
                unidadeCurricular: "",
              });
              setCurrentPage(1);
            }}
          />
          <FormSelect
            label="Ano Curricular"
            value={filters.anoCurricular}
            disabled={
              isLoadingClasses ||
              !filters.curso ||
              !teacherInfoData.codigo_categoria
            }
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

          <DocenteCadeiraSelect
            disabled={isLoadingClasses || !teacherInfoData?.codigo_docente}
            loading={isLoadingClasses}
            docenteId={teacherInfoData?.codigo_docente}
            cursoId={Number(filters.curso)}
            classId={Number(filters.anoCurricular)}
            value={filters.unidadeCurricular}
            onChangeValue={(v) => {
              setFilters({ ...filters, unidadeCurricular: v });
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Upload */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          Submeter Novo Programa da UC
        </h3>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="file-upload">Arquivo PDF da Pauta</Label>
            <Input
              disabled={!canSelectFile}
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {selectedFile.name}
                <Button variant="ghost" size="sm" onClick={clearFileInput}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </p>
            )}
          </div>
          <Button
            onClick={handleOpenSubmitModal}
            disabled={
              !canSubmit || createMutation.isPending || uploadMutation.isPending
            }
          >
            <Upload className="h-4 w-4 mr-2" />
            {createMutation.isPending || uploadMutation.isPending
              ? "Submetendo..."
              : "Submeter Pauta"}
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md!">
          <DialogHeader>
            <DialogTitle>Confirmar Submissão de Pauta</DialogTitle>
            <DialogDescription>
              Verifique os dados antes de submeter a pauta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Arquivo:</Label>
              <span className="col-span-3 truncate">{selectedFile?.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">Ano Letivo:</Label>
              <span className="col-span-3">{getAnoLetivoLabel()}</span>
            </div>
            {filters.curso && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Curso:</Label>
                <span className="col-span-3">{getCursoLabel()}</span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">
                Unidade Curricular:
              </Label>
              <span className="col-span-3">{getUnidadeCurricularLabel()}</span>
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">
                Tipo de Avaliação:
              </Label>
              <span className="col-span-3">{getTipoAvaliacaoLabel()}</span>
            </div>
          */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={createMutation.isPending || uploadMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={createMutation.isPending || uploadMutation.isPending}
            >
              {createMutation.isPending || uploadMutation.isPending
                ? "Submetendo..."
                : "Confirmar Submissão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md!">
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
                    <TableHead>Codigo</TableHead>
                    <TableHead>Ano-Lectivo</TableHead>
                    <TableHead>UC</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pautas.map((pauta) => (
                    <TableRow key={pauta.codigo}>
                      <TableCell>{pauta.codigo}</TableCell>
                      <TableCell>{pauta.anolectivo}</TableCell>
                      <TableCell>{pauta.gradecurricular}</TableCell>
                      <TableCell>
                        {new Date(pauta.datacriacao).toLocaleDateString(
                          "pt-AO",
                        )}
                      </TableCell>
                      <TableCell>{getEstadoBadge(pauta.estado)}</TableCell>
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
                      Math.min(pagination.totalPages, prev + 1),
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
