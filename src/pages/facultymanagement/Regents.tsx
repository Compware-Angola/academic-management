import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Regents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [curso, setCurso] = useState("all");
  const [semestre, setSemestre] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, uc: "Algoritmos e Estruturas de Dados", codigo: "ENG101", curso: "Eng. Informática", ano: "2º", semestre: "1º", regente: "Prof. Dr. João Silva", departamento: "Engenharia", cargaHoraria: "60h", estado: "Ativo" },
    { id: 2, uc: "Anatomia Humana I", codigo: "MED101", curso: "Medicina", ano: "1º", semestre: "1º", regente: "Prof.ª Dra. Maria Santos", departamento: "Medicina", cargaHoraria: "80h", estado: "Ativo" },
    { id: 3, uc: "Direito Constitucional", codigo: "DIR201", curso: "Direito", ano: "2º", semestre: "2º", regente: "Prof. Dr. Carlos Manuel", departamento: "Direito", cargaHoraria: "45h", estado: "Ativo" },
    { id: 4, uc: "Microeconomia", codigo: "ECO101", curso: "Economia", ano: "1º", semestre: "1º", regente: "Prof. MSc. Ana Paula", departamento: "Economia", cargaHoraria: "60h", estado: "Pendente" },
    { id: 5, uc: "Cálculo Diferencial e Integral I", codigo: "MAT101", curso: "Eng. Civil", ano: "1º", semestre: "1º", regente: "Prof. Dr. Pedro Costa", departamento: "Matemática", cargaHoraria: "75h", estado: "Ativo" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Ativo": "default",
      "Pendente": "secondary",
      "Inativo": "destructive",
    };
    return <Badge variant={variants[estado as keyof typeof variants] as any}>{estado}</Badge>;
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
            <BreadcrumbPage>Regents</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Regents de Unidades Curriculares</h1>

      <PageHeader title="Regents" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por UC ou regente..."
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
              <SelectItem value="medicina">Medicina</SelectItem>
              <SelectItem value="direito">Direito</SelectItem>
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
              <TableHead>Código UC</TableHead>
              <TableHead>Unidade Curricular</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Ano/Semestre</TableHead>
              <TableHead>Regente</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Carga Horária</TableHead>
              <TableHead>Estado</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum regente encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.uc}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.ano} Ano / {item.semestre} Sem.</TableCell>
                  <TableCell>{item.regente}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{item.cargaHoraria}</TableCell>
                  <TableCell>{getEstadoBadge(item.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </div>
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

export default Regents;
