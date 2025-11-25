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

const Affected = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departamento, setDepartamento] = useState("all");
  const [periodo, setPeriodo] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, docente: "Prof. Dr. João Silva", departamento: "Engenharia", uc: "Algoritmos e Estruturas de Dados", curso: "Eng. Informática", turma: "EI-2A", tipoAula: "Teórica", horasSemanais: 4, periodoLetivo: "2024/2025 - 1º Sem", estado: "Ativo" },
    { id: 2, docente: "Prof.ª Dra. Maria Santos", departamento: "Medicina", uc: "Anatomia Humana I", curso: "Medicina", turma: "MED-1B", tipoAula: "PL", horasSemanais: 6, periodoLetivo: "2024/2025 - 1º Sem", estado: "Ativo" },
    { id: 3, docente: "Prof. Dr. Carlos Manuel", departamento: "Economia", uc: "Microeconomia", curso: "Economia", turma: "ECO-1A", tipoAula: "Teórica", horasSemanais: 3, periodoLetivo: "2024/2025 - 2º Sem", estado: "Pendente" },
    { id: 4, docente: "Prof. MSc. Ana Paula", departamento: "Direito", uc: "Direito Constitucional", curso: "Direito", turma: "DIR-2A", tipoAula: "Teórico-Prática", horasSemanais: 4, periodoLetivo: "2024/2025 - 1º Sem", estado: "Ativo" },
    { id: 5, docente: "Prof. Dr. Pedro Costa", departamento: "Engenharia", uc: "Cálculo I", curso: "Eng. Civil", turma: "EC-1A", tipoAula: "Teórica", horasSemanais: 5, periodoLetivo: "2024/2025 - 1º Sem", estado: "Ativo" },
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
            <BreadcrumbPage>Affected</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Docentes Affected</h1>

      <PageHeader title="Affected" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por docente ou UC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={departamento} onValueChange={setDepartamento}>
            <SelectTrigger>
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Departamentos</SelectItem>
              <SelectItem value="engenharia">Engenharia</SelectItem>
              <SelectItem value="medicina">Medicina</SelectItem>
              <SelectItem value="direito">Direito</SelectItem>
              <SelectItem value="economia">Economia</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger>
              <SelectValue placeholder="Período Letivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Períodos</SelectItem>
              <SelectItem value="2024-1">2024/2025 - 1º Sem</SelectItem>
              <SelectItem value="2024-2">2024/2025 - 2º Sem</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">Filtrar</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Docente</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>UC</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Tipo Aula</TableHead>
              <TableHead>Horas/Semana</TableHead>
              <TableHead>Período Letivo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  Nenhuma afetação encontrada
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.docente}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{item.uc}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.turma}</TableCell>
                  <TableCell>{item.tipoAula}</TableCell>
                  <TableCell>{item.horasSemanais}h</TableCell>
                  <TableCell>{item.periodoLetivo}</TableCell>
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

export default Affected;
