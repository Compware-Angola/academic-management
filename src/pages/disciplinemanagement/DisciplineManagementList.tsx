// src/pages/DisciplineManagementList.tsx (ou onde estiver)
import { useMemo } from "react";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";


import { useState } from "react";
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
  Plus,
  Edit,
  Trash2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";
import { CreateDisciplineModal } from "./components/CreateDisciplineModal";
import { useTiposUnidade } from "@/hooks/study_plan/use-type-unidade";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutationDeleteDiscipline } from "@/hooks/study_plan/use-mutation-delete-discipline";
import { Discipline } from "@/services/study_plan/fect-discipline.serice";
type NormalizeDiscipline = Discipline & {
  tipo_descricao: string;
  natureza: string;
};
export default function DisciplineManagementList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [naturezaFilter, setNaturezaFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all"); // ← NOVO FILTRO
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<Discipline | null>(null);

  const deleteMutation = useMutationDeleteDiscipline();
  const {
    data: disciplines = [],
    isLoading,
    isError,
    refetch,
  } = useDisciplines();
  const { data: tiposUnidade = [], isLoading: loadingTipos } =
    useTiposUnidade();

  // Funções auxiliares
  const getDescricaoTipo = (sigla: string) => {
    const tipo = tiposUnidade.find((t) => t.sigla === sigla);
    return tipo ? tipo.descricao : sigla || "Não definido";
  };

  const getNaturezaLabel = (sigla: string) => {
    switch (sigla) {
      case "TP":
        return "Teórico-Prática";
      case "T":
        return "Teórica";
      case "P":
        return "Prática";
      default:
        return "Não definida";
    }
  };
  const handleOpenDelete = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setOpenDeleteDialog(true);
  };

  const normalizedDisciplines: NormalizeDiscipline[] = disciplines.map((d) => ({
    tipo_descricao: getDescricaoTipo(d.tipo_unidade_curricular),
    natureza: getNaturezaLabel(d.natureza_unidade_curricular),
    ...d,
  }));

  // Filtros combinados
  const filteredData = normalizedDisciplines.filter((item) => {
    const matchesSearch =
      item.desginacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toString().includes(searchTerm);

    const matchesNatureza =
      naturezaFilter === "all" ||
      (naturezaFilter === "TP" && item.natureza === "Teórico-Prática") ||
      (naturezaFilter === "T" && item.natureza === "Teórica") ||
      (naturezaFilter === "P" && item.natureza === "Prática");

    const matchesTipo =
      tipoFilter === "all" || item.tipo_unidade_curricular === tipoFilter;

    return matchesSearch && matchesNatureza && matchesTipo;
  });

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

  const pdfData = useMemo(() => {
  if (!filteredData.length) return null;

  return {
    filtros: [
      searchTerm && `Pesquisa: ${searchTerm}`,
      naturezaFilter !== "all" &&
        `Natureza: ${
          naturezaFilter === "TP"
            ? "Teórico-Prática"
            : naturezaFilter === "T"
            ? "Teórica"
            : "Prática"
        }`,
      tipoFilter !== "all" && `Tipo UC: ${tipoFilter}`,
    ]
      .filter(Boolean)
      .join(" | ") || "Sem filtros",

    total: filteredData.length,

    rows: filteredData.map((d) => ({
      codigo: d.codigo,
      nome: d.desginacao,
      tipo: d.tipo_descricao,
      natureza: d.natureza,
    })),
  };
}, [filteredData, searchTerm, naturezaFilter, tipoFilter]);


const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Gestão de Disciplinas"
    subtitle="Lista de disciplinas e unidades curriculares"
    infoSections={[
      { title: "Filtros Aplicados", content: pdfData.filtros },
      { title: "Resumo", content: [`Total de disciplinas: ${pdfData.total}`] },
    ]}
    mainTable={{
      headers: [
        { key: "codigo", label: "Código", width: "10%" },
        { key: "nome", label: "Nome da Disciplina", width: "45%" },
        { key: "tipo", label: "Tipo", width: "25%" },
        { key: "natureza", label: "Natureza", width: "20%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;


const excelProps = pdfData
  ? {
      documentTitle: "Gestão de Disciplinas",
      subtitle: "Lista de disciplinas e unidades curriculares",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de disciplinas: ${pdfData.total}`] },
      ],
      mainTable: {
        headers: [
          { key: "codigo", label: "Código", width: 10 },
          { key: "nome", label: "Nome da Disciplina", width: 40 },
          { key: "tipo", label: "Tipo", width: 25 },
          { key: "natureza", label: "Natureza", width: 20 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#1e40af",
    }
  : null;

const baseFileName = `Disciplinas_${new Date()
  .toISOString()
  .slice(0, 10)}`;


  const handleFilterChange = () => setCurrentPage(1);
  const handleConfirmDelete = () => {
    if (!selectedDiscipline) return;

    deleteMutation.mutate(selectedDiscipline.codigo);

    setOpenDeleteDialog(false);
    setSelectedDiscipline(null);
  };
  const handleOpenEdit = (item: Discipline) => {
    setSelectedDiscipline({
      codigo: item.codigo,
      codigo_disciplina: item.codigo_disciplina,
      desginacao: item.desginacao,
      natureza_unidade_curricular: item.natureza_unidade_curricular,
      tipo_unidade_curricular: item.tipo_unidade_curricular,
      sigla: item.sigla,
    });
    setCreateModalOpen(true);
  };

  return (
    <div className="space-y-6 p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Plano de Estudo</span>
        <span>/</span>
        <span className="text-foreground">Gestão de disciplinas</span>
      </nav>

      {/* Cabeçalho */}
      
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
  {/* Título */}
  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Gestão de disciplinas
    </h1>
    <p className="text-muted-foreground mt-1">
      Gestão completa de disciplinas e unidades curriculares
    </p>
  </div>

  {/* Ações (em coluna) */}
  <div className="flex flex-col items-end gap-2">
    {/* Exportações */}
    {pdfData && excelProps && (
      <div className="flex flex-wrap gap-2">
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

    {/* Botão principal mantém posição */}
    <Button size="sm" onClick={() => setCreateModalOpen(true)}>
      <Plus className="h-4 w-4 mr-2" />
      Nova disciplina
    </Button>
  </div>
</div>


      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Total Disciplinas
          </p>
          <p className="text-3xl font-bold">{normalizedDisciplines.length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Ativas</p>
          <p className="text-3xl font-bold text-green-600">
            {normalizedDisciplines.length}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Disciplina do Curso (S)
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {
              normalizedDisciplines.filter(
                (d) => d.tipo_unidade_curricular === "S"
              ).length
            }
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Tronco em Comum (MIC)
          </p>
          <p className="text-3xl font-bold text-purple-600">
            {
              normalizedDisciplines.filter(
                (d) => d.tipo_unidade_curricular === "MIC"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pesquisa */}
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Código ou nome..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          {/* Filtro por Natureza */}
          <div className="space-y-2">
            <Label htmlFor="natureza">Natureza da UC</Label>
            <Select
              value={naturezaFilter}
              onValueChange={(v) => {
                setNaturezaFilter(v);
                handleFilterChange();
              }}
            >
              <SelectTrigger id="natureza">
                <SelectValue placeholder="Todas as naturezas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as naturezas</SelectItem>
                <SelectItem value="TP">Teórico-Prática (TP)</SelectItem>
                <SelectItem value="T">Teórica (T)</SelectItem>
                <SelectItem value="P">Prática (P)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NOVO FILTRO POR TIPO (dinâmico da API) */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Unidade Curricular</Label>
            {loadingTipos ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={tipoFilter}
                onValueChange={(v) => {
                  setTipoFilter(v);
                  handleFilterChange();
                }}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {tiposUnidade.map((tipo) => (
                    <SelectItem key={tipo.codigo} value={tipo.sigla}>
                      {tipo.sigla} — {tipo.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-card border rounded-lg">
          <BookOpen className="h-16 w-16 mx-auto text-destructive mb-4" />
          <p className="text-lg font-medium text-destructive mb-2">
            Erro ao carregar as disciplinas
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-lg">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma disciplina encontrada
          </p>
          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar nova disciplina
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-24">Código</TableHead>
                    <TableHead className="min-w-96">
                      Nome da Disciplina
                    </TableHead>
                    <TableHead className="w-48">Tipo</TableHead>
                    <TableHead className="w-40">Natureza</TableHead>
                    <TableHead className="text-right w-36">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.codigo} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-semibold">
                        {item.codigo}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.desginacao}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.tipo_descricao}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.natureza === "Teórico-Prática"
                              ? "default"
                              : item.natureza === "Teórica"
                              ? "secondary"
                              : item.natureza === "Prática"
                              ? "outline"
                              : "outline"
                          }
                        >
                          {item.natureza}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              handleOpenEdit(item);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleOpenDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Label>Itens por página:</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-9">
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
              <span>
                Mostrando {startItem}–{endItem} de {filteredData.length}{" "}
                disciplinas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Seguinte <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <CreateDisciplineModal
        open={createModalOpen}
        onOpenChange={(b) => {
          setSelectedDiscipline(null);
          return setCreateModalOpen(b);
        }}
        discipline={selectedDiscipline}
      />
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja eliminar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              A disciplina <strong>{selectedDiscipline?.desginacao}</strong>{" "}
              será removida permanentemente.
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "A eliminar..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
