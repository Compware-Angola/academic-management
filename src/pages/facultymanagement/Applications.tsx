import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FileCheck, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Applications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departamento, setDepartamento] = useState("all");
  const [estado, setEstado] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, codigo: "CAND-2025-001", nome: "Dr. António Silva", departamento: "Engenharia", cargo: "Professor Auxiliar", dataCandidatura: "2025-01-10", curriculum: "CV_Antonio.pdf", estado: "Em Análise" },
    { id: 2, codigo: "CAND-2025-002", nome: "MSc. Beatriz Costa", departamento: "Medicina", cargo: "Assistente", dataCandidatura: "2025-01-12", curriculum: "CV_Beatriz.pdf", estado: "Pendente" },
    { id: 3, codigo: "CAND-2025-003", nome: "Dr. Carlos Manuel", departamento: "Direito", cargo: "Professor Auxiliar", dataCandidatura: "2025-01-15", curriculum: "CV_Carlos.pdf", estado: "Aprovado" },
    { id: 4, codigo: "CAND-2025-004", nome: "Lic. Diana Ferreira", departamento: "Economia", cargo: "Monitor", dataCandidatura: "2025-01-18", curriculum: "CV_Diana.pdf", estado: "Em Análise" },
    { id: 5, codigo: "CAND-2024-089", nome: "Dr. Eduardo Santos", departamento: "Matemática", cargo: "Professor Auxiliar", dataCandidatura: "2024-12-20", curriculum: "CV_Eduardo.pdf", estado: "Rejeitado" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Em Análise": "secondary",
      "Pendente": "outline",
      "Aprovado": "default",
      "Rejeitado": "destructive",
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
            <BreadcrumbPage>Applications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Applications de Docentes</h1>

      <PageHeader title="Applications" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por nome ou código..."
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
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Estados</SelectItem>
              <SelectItem value="analise">Em Análise</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
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
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo Pretendido</TableHead>
              <TableHead>Data Candidatura</TableHead>
              <TableHead>Curriculum</TableHead>
              <TableHead>Estado</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhuma candidatura encontrada
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{item.cargo}</TableCell>
                  <TableCell>{item.dataCandidatura}</TableCell>
                  <TableCell className="text-primary underline cursor-pointer">{item.curriculum}</TableCell>
                  <TableCell>{getEstadoBadge(item.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><FileCheck className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
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

export default Applications;
