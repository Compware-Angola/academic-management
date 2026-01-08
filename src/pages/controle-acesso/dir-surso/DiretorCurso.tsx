import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/DataTable";
import { Plus, Search, Trash2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { useCursos } from "@/hooks/use-cursos";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface DiretorCurso {
  id: number;
  nomeCompleto: string;
  email: string;
  curso: string;
  faculdade: string;
  dataInicio: string;
}

const mockCursos = [
  { id: "1", nome: "Engenharia Informática", faculdade: "Faculdade de Engenharia" },
  { id: "2", nome: "Direito", faculdade: "Faculdade de Direito" },
  { id: "3", nome: "Medicina", faculdade: "Faculdade de Medicina" },
  { id: "4", nome: "Arquitetura", faculdade: "Faculdade de Arquitetura" },
  { id: "5", nome: "Economia", faculdade: "Faculdade de Economia" },
];

const mockDocentes = [
  { id: "1", nome: "Dr. António Manuel Ferreira", email: "antonio.ferreira@univ.ao" },
  { id: "2", nome: "Dra. Maria José Santos", email: "maria.santos@univ.ao" },
  { id: "3", nome: "Dr. Pedro Miguel Costa", email: "pedro.costa@univ.ao" },
  { id: "4", nome: "Dra. Ana Paula Rodrigues", email: "ana.rodrigues@univ.ao" },
];

const mockDiretores: DiretorCurso[] = [
  {
    id: 1,
    nomeCompleto: "Dr. António Manuel Ferreira",
    email: "antonio.ferreira@univ.ao",
    curso: "Engenharia Informática",
    faculdade: "Faculdade de Engenharia",
    dataInicio: "2023-01-15",
  },
  {
    id: 2,
    nomeCompleto: "Dra. Maria José Santos",
    email: "maria.santos@univ.ao",
    curso: "Direito",
    faculdade: "Faculdade de Direito",
    dataInicio: "2022-09-01",
  },
  {
    id: 3,
    nomeCompleto: "Dr. Pedro Miguel Costa",
    email: "pedro.costa@univ.ao",
    curso: "Medicina",
    faculdade: "Faculdade de Medicina",
    dataInicio: "2023-03-20",
  },
];

export default function DirectorCourseAccess() {
  const { toast } = useToast();
  const [diretores, setDiretores] = useState<DiretorCurso[]>(mockDiretores);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedDiretor, setSelectedDiretor] = useState<DiretorCurso | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [novoDocente, setNovoDocente] = useState("");
  const [novoCurso, setNovoCurso] = useState("");
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
  });

    const { data: cursos } = useCursos();

  const handleAdicionarDiretor = () => {
    if (!novoDocente || !novoCurso) {
      toast({
        title: "Erro",
        description: "Selecione o docente e o curso",
        variant: "destructive",
      });
      return;
    }

    const docente = mockDocentes.find(d => d.id === novoDocente);
    const curso = mockCursos.find(c => c.id === novoCurso);

    if (!docente || !curso) return;

    // Check if course already has a director
    const cursoTemDiretor = diretores.some(d => d.curso === curso.nome);
    if (cursoTemDiretor) {
      toast({
        title: "Erro",
        description: "Este curso já possui um diretor atribuído",
        variant: "destructive",
      });
      return;
    }

    const novoDiretor: DiretorCurso = {
      id: diretores.length + 1,
      nomeCompleto: docente.nome,
      email: docente.email,
      curso: curso.nome,
      faculdade: curso.faculdade,
      dataInicio: new Date().toISOString().split("T")[0],
    };

    setDiretores([...diretores, novoDiretor]);
    setShowAddDialog(false);
    setNovoDocente("");
    setNovoCurso("");

    toast({
      title: "Sucesso",
      description: "Diretor adicionado com sucesso",
    });
  };

  const handleRemoverDiretor = () => {
    if (!selectedDiretor) return;

    setDiretores(diretores.filter(d => d.id !== selectedDiretor.id));
    setShowRemoveDialog(false);
    setSelectedDiretor(null);

    toast({
      title: "Sucesso",
      description: "Diretor removido com sucesso",
    });
  };

  const columns = [
    { header: "Nome Completo", accessor: "nomeCompleto" },
    { header: "Email", accessor: "email" },
    { header: "Curso", accessor: "curso" },
    { header: "Faculdade", accessor: "faculdade" },
    { header: "Data Início", accessor: "dataInicio" },
    {
      header: "Ações",
      accessor: "acoes",
      cell: (row: DiretorCurso) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => {
            setSelectedDiretor(row);
            setShowRemoveDialog(true);
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remover
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
    
          <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/horarios">Diretores</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Listar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
           Diretor do Curso
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os Diretores criados por curso e ano curricular.
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Diretor
            </Button>
      </div>

     
         <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          
          

            <FormCommandSelect
              value={filters.curso}
              label="Curso"
              options={cursos}
              map={(c) => ({
                key: c.codigo.toString(),
                value: c.codigo.toString(),
                label: c.designacao,
              })}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  curso: v,

                  unidadeCurricular: "",
                })
              }
            />
            
            </div>
       
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={diretores}
        currentPage={currentPage}
        totalPages={Math.ceil(diretores.length / 10)}
        onPageChange={setCurrentPage}
      />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Diretor ao Curso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Docente</label>
              <Select value={novoDocente} onValueChange={setNovoDocente}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o docente" />
                </SelectTrigger>
                <SelectContent>
                  {mockDocentes.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Curso</label>
              <Select value={novoCurso} onValueChange={setNovoCurso}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {mockCursos.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdicionarDiretor}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Diretor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{selectedDiretor?.nomeCompleto}</strong> como
              diretor do curso <strong>{selectedDiretor?.curso}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoverDiretor}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
