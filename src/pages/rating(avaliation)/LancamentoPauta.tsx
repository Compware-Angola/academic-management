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
  Eye,
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
import { useLancamentosPauta } from "@/hooks/avaliacao/use-query-lancamento-pauta";
import { useCreateLancamentoPauta } from "@/hooks/avaliacao/use-mutation-create-lancamento-pauta copy";
import { useAuth } from "@/hooks/use-auth";
import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { viewFile } from "@/services/upload/upload-single.service";
import { ApiError } from "@/error";

export default function LancamentoPauta() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const {user}=useAuth()

  const uploadMutation = useUploadSingle()
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; 
  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    tipoAvaliacao: "",
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


  const {
    data: response,
    isLoading: isLoadingPautas,
    error: errorPautas,
    refetch,
  } = useLancamentosPauta({
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    tipoAvaliacao: filters.tipoAvaliacao ? Number(filters.tipoAvaliacao) : undefined,
    codigoGrade: filters.unidadeCurricular ? Number(filters.unidadeCurricular) : undefined,
    curso: filters.curso ? Number(filters.curso) : undefined,
    anoCurricular: filters.anoCurricular ? Number(filters.anoCurricular) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,

    page: currentPage,
    limit: limit,
  });
 const { data: teacherInfoData, isLoading: teacherInfoDataLoading } =
    useQueryTeacherProfile(user?.user_id);
  const pautas = response?.data ?? [];
  const pagination = {
    page: response?.page ?? 1,
    limit: response?.limit ?? limit,
    total: response?.total ?? 0,
    totalPages: response?.totalPages ?? 1,
  };
  const createMutation = useCreateLancamentoPauta();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo PDF.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "Arquivo selecionado",
        description: `${file.name} pronto para submissão.`,
      });
    }
  };
// aqui vou  fazer upload !
  const handleSubmitPauta = async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione um PDF.",
        variant: "destructive",
      });
      return;
    }
       const response = await uploadMutation.mutateAsync(selectedFile)
       if(!response.file.path){
           toast({
        title: "Erro ao fazer upload",
        description: "Selecione um PDF.",
        variant: "destructive",
      });
      return;
       }

    if (!filters.anoLectivo || !filters.unidadeCurricular || !filters.tipoAvaliacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Ano letivo, unidade curricular e tipo de avaliação são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const docenteId = teacherInfoData.codigo_docente; 

    createMutation.mutate(
      {
        anoLectivoId: Number(filters.anoLectivo),
        docenteId: docenteId,
        gradeCurricularId: Number(filters.unidadeCurricular),
        fkEstadoLancamentoPauta: 1,
        fkTipoAvaliacao: Number(filters.tipoAvaliacao),
        ficheiroName: response.file.filename,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Sucesso!",
            description: data.message,
          });
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          setCurrentPage(1); // volta para página 1 após criar
          refetch();
        },
        onError: (error: any) => {
          toast({
            title: "Erro ao submeter",
            description: error.message || "Tente novamente.",
            variant: "destructive",
          });
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
    if (error instanceof ApiError) {
      console.error(error.message);
      alert(error.message);
    } else {
      console.error("Erro ao abrir o ficheiro", error);
    }
  }
};


  const getEstadoBadge = (activeState: number) => {
    switch (activeState) {
      case 1:
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Ativa</Badge>;
      case 0:
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Inativa</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Avaliações</span>
        <span>/</span>
        <span className="text-foreground">Lançamento de Pauta</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamento de Pauta</h1>
          <p className="text-muted-foreground mt-1">Submeta pautas de avaliação em formato PDF</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoadingPautas}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingPautas ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
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
              setCurrentPage(1); // reset página ao mudar filtro
            }}
            options={academicYear}
            map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
           
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
            map={(s) => ({ key: s.codigo, label: s.designacao, value: s.codigo })}
          />

          <FormSelect
            disabled={isLoadingCurso}
            loading={isLoadingCurso}
            label="Curso"
            value={filters.curso}
            onChange={(v) => {
              setFilters({ ...filters, curso: v, anoCurricular: "", unidadeCurricular: "" });
              setCurrentPage(1);
            }}
            options={cursos}
            map={(c) => ({ key: c.codigo, label: c.designacao, value: c.codigo })}
          />

          <FormSelect
            label="Ano Curricular"
            value={filters.anoCurricular}
            disabled={isLoadingClasses || !filters.curso}
            loading={isLoadingClasses}
            onChange={(v) => {
              setFilters({ ...filters, anoCurricular: v, unidadeCurricular: "" });
              setCurrentPage(1);
            }}
            options={classes}
            map={(c) => ({ key: c.codigo, label: c.designacao, value: c.codigo })}
          />

          <FormSelect
            label="Unidade Curricular"
            value={filters.unidadeCurricular}
            disabled={isLoadingUC || !filters.semestre || !filters.curso || !filters.anoCurricular}
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
            map={(u) => ({ key: u.codigo, label: u.designacao, value: u.codigo })}
          />
        </div>
      </div>

      {/* Upload */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Submeter Nova Pauta</h3>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="file-upload">Arquivo PDF da Pauta</Label>
            <Input
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
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </p>
            )}
          </div>
          <Button
            onClick={handleSubmitPauta}
            disabled={!selectedFile || createMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {createMutation.isPending ? "Submetendo..." : "Submeter Pauta"}
          </Button>
        </div>
      </div>

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
                              {pauta.ficheiro_name.split('/').pop()}
                            </span>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(pauta.created_at).toLocaleDateString("pt-AO")}</TableCell>
                      <TableCell>{pauta.curso}</TableCell>
                      <TableCell>{pauta.unidade_curricular}</TableCell>
                      <TableCell>{pauta.classe}</TableCell>
                      <TableCell>{pauta.docente_nome}</TableCell>
                      <TableCell>{pauta.designacao_av}</TableCell>
                      <TableCell>{getEstadoBadge(pauta.active_state)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {pauta.ficheiro_name && (
                            <>
                             
                              <Button variant="outline" size="sm" onClick={() => handleDownload(pauta.ficheiro_name!)}>
                                <Download className="h-4 w-4" />
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
                {Math.min(currentPage * limit, pagination.total)} de {pagination.total} registos
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoadingPautas}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <span className="text-sm px-3">
                  Página {currentPage} de {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages || isLoadingPautas}
                >
                  Seguinte
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}