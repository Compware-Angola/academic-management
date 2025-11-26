import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { Button } from "@/components/ui/button";
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
import {
  RefreshCw,
  FileDown,
  Printer,
  Plus,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import { useClasses } from "@/hooks/use-classes";

interface UnidadeCurricular {
  id: number;
  sigla: string;
  nome: string;
  departamento: string;
  coordenador: string;
  creditos: number;
  semestre: string;
  cargaHoraria: number;
  docentesAlocados: number;
  capacidade: number;
  status: "Ativa" | "Inativa" | "Em Revisão";
}

export default function UcDepartmentManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
    const [anoLetivoId, setAnoLetivoId] = useState<string>("");
    const [cursoId, setCursoId] = useState<string>("");
    const [classeId, setClasseId] = useState<string>("");
  const { data: anosLetivos = [], isLoading: loadingAnos } = useQueryAnoAcademico();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: loadingClasses } = useClasses();
  // Mock data - unidades curriculares organizadas por departamento
  const mockData: UnidadeCurricular[] = [
    {
      id: 1,
      sigla: "PROG1",
      nome: "Programação I",
      departamento: "Ciências da Computação",
      coordenador: "Prof. Dr. João Silva",
      creditos: 6,
      semestre: "1º Semestre",
      cargaHoraria: 90,
      docentesAlocados: 3,
      capacidade: 60,
      status: "Ativa",
    },
    {
      id: 2,
      sigla: "CALC1",
      nome: "Cálculo Diferencial e Integral I",
      departamento: "Matemática",
      coordenador: "Prof. Dr. Maria Santos",
      creditos: 8,
      semestre: "1º Semestre",
      cargaHoraria: 120,
      docentesAlocados: 4,
      capacidade: 80,
      status: "Ativa",
    },
    {
      id: 3,
      sigla: "GEST1",
      nome: "Fundamentos de Gestão",
      departamento: "Gestão",
      coordenador: "Prof. Dr. Carlos Mendes",
      creditos: 4,
      semestre: "2º Semestre",
      cargaHoraria: 60,
      docentesAlocados: 2,
      capacidade: 50,
      status: "Em Revisão",
    },
    {
      id: 4,
      sigla: "QUIM1",
      nome: "Química Geral",
      departamento: "Química",
      coordenador: "Prof. Dra. Ana Costa",
      creditos: 7,
      semestre: "1º Semestre",
      cargaHoraria: 105,
      docentesAlocados: 3,
      capacidade: 45,
      status: "Ativa",
    },
    {
      id: 5,
      sigla: "DIR1",
      nome: "Introdução ao Direito",
      departamento: "Direito",
      coordenador: "Prof. Dr. Pedro Alves",
      creditos: 5,
      semestre: "1º Semestre",
      cargaHoraria: 75,
      docentesAlocados: 2,
      capacidade: 70,
      status: "Ativa",
    },
    {
      id: 6,
      sigla: "BD1",
      nome: "Bases de Dados",
      departamento: "Ciências da Computação",
      coordenador: "Prof. Dra. Luísa Fernandes",
      creditos: 6,
      semestre: "2º Semestre",
      cargaHoraria: 90,
      docentesAlocados: 0,
      capacidade: 55,
      status: "Inativa",
    },
  ];

  const [filters, setFilters] = useState({
    departamento: "all",
    semestre: "all",
    status: "all",
  });


  const handleCreate = () => {
    toast.info("A abrir formulário de criação...");
  };

  const handleEdit = (id: number) => {
    toast.info(`A editar UC com ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    toast.error(`A eliminar UC com ID: ${id}`);
  };

  const handleViewDocentes = (id: number) => {
    toast.info(`A visualizar docentes da UC com ID: ${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "default";
      case "Inativa":
        return "destructive";
      case "Em Revisão":
        return "secondary";
      default:
        return "outline";
    }
  };

  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/plano">Plano de Estudo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gestão de UC por Departamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Gestão de UC por Departamento"
        subtitle="Gerir unidades curriculares organizadas por departamento académico"
        actions={
          <>
            <Button variant="default" size="sm" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nova UC
            </Button>
          
          </>
        }
      />

      <FilterBar>
        <div>
         
                <label className="text-sm font-medium text-foreground">Ano Letivo</label>
                    {loadingAnos ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Select value={anoLetivoId} onValueChange={setAnoLetivoId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o ano letivo..." />
                        </SelectTrigger>
                        <SelectContent>
                          {anosLetivos.map((ano) => (
                            <SelectItem key={ano.codigo} value={String(ano.codigo)}>
                              {ano.designacao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
        </div>
         

        <div>
          <label className="text-sm font-medium mb-2 block">Semestre</label>
           {loadingClasses ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select
                value={classeId}
                onValueChange={setClasseId}
                disabled={!anoLetivoId || !cursoId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a classe..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classe) => (
                    <SelectItem key={classe.codigo} value={String(classe.codigo)}>
                      {classe.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="inativa">Inativa</SelectItem>
              <SelectItem value="revisao">Em Revisão</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : currentData.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm">
              Não existem unidades curriculares registadas para os filtros selecionados.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sigla</TableHead>
                <TableHead>Nome da UC</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Coordenador</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead>Docentes</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((uc) => (
                <TableRow key={uc.id}>
                  <TableCell className="font-medium">{uc.sigla}</TableCell>
                  <TableCell>{uc.nome}</TableCell>
                  <TableCell>{uc.departamento}</TableCell>
                  <TableCell>{uc.coordenador}</TableCell>
                  <TableCell>{uc.creditos} ECTS</TableCell>
                  <TableCell>{uc.semestre}</TableCell>
                  <TableCell>{uc.cargaHoraria}h</TableCell>
                  <TableCell>
                    <Badge variant={uc.docentesAlocados > 0 ? "default" : "destructive"}>
                      {uc.docentesAlocados}
                    </Badge>
                  </TableCell>
                  <TableCell>{uc.capacidade}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(uc.status)}>
                      {uc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocentes(uc.id)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(uc.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(uc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!isLoading && currentData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Mostrar
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
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
            <span className="text-sm text-muted-foreground">
              registos por página
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
