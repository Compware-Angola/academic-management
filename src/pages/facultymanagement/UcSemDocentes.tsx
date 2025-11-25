import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, AlertTriangle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const UcSemDocentes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [curso, setCurso] = useState("all");
  const [semestre, setSemestre] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, codigo: "MAT201", uc: "Álgebra Linear", curso: "Eng. Informática", ano: "2º", semestre: "1º", cargaHoraria: "60h", creditos: 6, departamento: "Matemática", prioridade: "Alta" },
    { id: 2, codigo: "FIS102", uc: "Física II", curso: "Eng. Civil", ano: "1º", semestre: "2º", cargaHoraria: "75h", creditos: 7, departamento: "Física", prioridade: "Alta" },
    { id: 3, codigo: "QUI201", uc: "Química Orgânica", curso: "Farmácia", ano: "2º", semestre: "1º", cargaHoraria: "60h", creditos: 6, departamento: "Química", prioridade: "Média" },
    { id: 4, codigo: "BIO301", uc: "Microbiologia", curso: "Medicina", ano: "3º", semestre: "1º", cargaHoraria: "45h", creditos: 5, departamento: "Biologia", prioridade: "Alta" },
    { id: 5, codigo: "ECO202", uc: "Economia Internacional", curso: "Economia", ano: "2º", semestre: "2º", cargaHoraria: "45h", creditos: 5, departamento: "Economia", prioridade: "Média" },
  ];

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      "Alta": "destructive",
      "Média": "secondary",
      "Baixa": "default",
    };
    return <Badge variant={variants[prioridade as keyof typeof variants] as any}>{prioridade}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gestao-docentes">Gestão de Docentes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>UC sem Docentes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Unidades Curriculares sem Docentes</h1>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
        <div>
          <h3 className="font-semibold text-destructive mb-1">Atenção: {mockData.length} UCs sem docente atribuído</h3>
          <p className="text-sm text-muted-foreground">É necessário afetar docentes urgentemente para garantir o funcionamento do período letivo.</p>
        </div>
      </div>

      <PageHeader title="UC sem Docentes" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por código ou UC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={curso} onValueChange={setCurso}>
            <SelectTrigger>
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Cursos</SelectItem>
              <SelectItem value="informatica">Eng. Informática</SelectItem>
              <SelectItem value="civil">Eng. Civil</SelectItem>
              <SelectItem value="medicina">Medicina</SelectItem>
              <SelectItem value="economia">Economia</SelectItem>
            </SelectContent>
          </Select>
          <Select value={semestre} onValueChange={setSemestre}>
            <SelectTrigger>
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Semestres</SelectItem>
              <SelectItem value="1">1º Semestre</SelectItem>
              <SelectItem value="2">2º Semestre</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">Filtrar</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Unidade Curricular</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Ano/Semestre</TableHead>
              <TableHead>Carga Horária</TableHead>
              <TableHead>Créditos</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhuma UC sem docente encontrada
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.uc}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.ano} Ano / {item.semestre} Sem.</TableCell>
                  <TableCell>{item.cargaHoraria}</TableCell>
                  <TableCell>{item.creditos}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{getPrioridadeBadge(item.prioridade)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="default" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Afetar Docente
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar</span>
          <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
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
          <span className="text-sm text-muted-foreground">registos por página</span>
        </div>
      </div>
    </div>
  );
};

export default UcSemDocentes;
