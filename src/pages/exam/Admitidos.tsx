import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FileText, CheckCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Admitidos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [curso, setCurso] = useState("all");
  const [estado, setEstado] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, codigo: "EXAM-2025-001", nome: "João Manuel Silva", bi: "004567890LA042", curso: "Eng. Informática", notaPreparatorio: 14.5, notaExame: 15.2, notaFinal: 14.85, classificacao: "Admitido", dataAdmissao: "2025-01-20" },
    { id: 2, codigo: "EXAM-2025-002", nome: "Maria Santos Costa", bi: "004567891LA042", curso: "Medicina", notaPreparatorio: 16.3, notaExame: 17.1, notaFinal: 16.7, classificacao: "Admitido", dataAdmissao: "2025-01-20" },
    { id: 3, codigo: "EXAM-2025-003", nome: "Carlos Alberto", bi: "004567892LA042", curso: "Direito", notaPreparatorio: 13.8, notaExame: 14.6, notaFinal: 14.2, classificacao: "Admitido", dataAdmissao: "2025-01-21" },
    { id: 4, codigo: "EXAM-2025-004", nome: "Ana Paula Ferreira", bi: "004567893LA042", curso: "Economia", notaPreparatorio: 15.2, notaExame: 15.8, notaFinal: 15.5, classificacao: "Admitido", dataAdmissao: "2025-01-21" },
    { id: 5, codigo: "EXAM-2025-005", nome: "Pedro José Manuel", bi: "004567894LA042", curso: "Eng. Civil", notaPreparatorio: 14.1, notaExame: 14.9, notaFinal: 14.5, classificacao: "Admitido", dataAdmissao: "2025-01-22" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/exame">Exame de Acesso</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admitidos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Candidatos Admitidos</h1>

      <PageHeader title="Admitidos" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por nome ou código..."
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
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Estados</SelectItem>
              <SelectItem value="admitido">Admitido</SelectItem>
              <SelectItem value="matriculado">Matriculado</SelectItem>
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
              <TableHead>Nome</TableHead>
              <TableHead>BI</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Nota Prep.</TableHead>
              <TableHead>Nota Exame</TableHead>
              <TableHead>Nota Final</TableHead>
              <TableHead>Data Admissão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum candidato admitido encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.bi}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.notaPreparatorio.toFixed(2)}</TableCell>
                  <TableCell>{item.notaExame.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">{item.notaFinal.toFixed(2)}</TableCell>
                  <TableCell>{item.dataAdmissao}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><CheckCircle className="h-4 w-4" /></Button>
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
        <div className="text-sm text-muted-foreground">
          Total de candidatos admitidos: {mockData.length}
        </div>
      </div>
    </div>
  );
};

export default Admitidos;
