import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Users, Pencil } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AtribuicaoTurma = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [curso, setCurso] = useState("all");
  const [ano, setAno] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, numeroEstudante: "20240001", nome: "João Manuel da Silva", curso: "Eng. Informática", anoIngresso: "2024", turmaAtual: "EI-1A", capacidade: "35/40", estado: "Atribuída" },
    { id: 2, numeroEstudante: "20240002", nome: "Maria Santos Costa", curso: "Medicina", anoIngresso: "2024", turmaAtual: "MED-1B", capacidade: "42/45", estado: "Atribuída" },
    { id: 3, numeroEstudante: "20240003", nome: "Carlos Alberto", curso: "Direito", anoIngresso: "2024", turmaAtual: "-", capacidade: "-", estado: "Pendente" },
    { id: 4, numeroEstudante: "20230045", nome: "Ana Paula Ferreira", curso: "Economia", anoIngresso: "2023", turmaAtual: "ECO-2A", capacidade: "30/35", estado: "Atribuída" },
    { id: 5, numeroEstudante: "20240005", nome: "Pedro José Manuel", curso: "Eng. Civil", anoIngresso: "2024", turmaAtual: "-", capacidade: "-", estado: "Pendente" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Atribuída": "default",
      "Pendente": "secondary",
      "Sem Vaga": "destructive",
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
            <BreadcrumbLink href="/inscricoes">Inscrições e Matrícula</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Atribuição de Turma</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Atribuição de Turma</h1>

      <PageHeader title="Atribuição de Turma" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por nome ou número..."
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
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger>
              <SelectValue placeholder="Ano de Ingresso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Anos</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">Filtrar</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Estudante</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Ano Ingresso</TableHead>
              <TableHead>Turma Atual</TableHead>
              <TableHead>Capacidade</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.numeroEstudante}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.anoIngresso}</TableCell>
                  <TableCell>{item.turmaAtual}</TableCell>
                  <TableCell>{item.capacidade}</TableCell>
                  <TableCell>{getEstadoBadge(item.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Users className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
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

export default AtribuicaoTurma;
