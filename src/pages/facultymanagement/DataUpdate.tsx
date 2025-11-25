import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Pencil, CheckCircle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const DataUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departamento, setDepartamento] = useState("all");
  const [situacao, setSituacao] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, codigo: "DOC001", nome: "Prof. Dr. João Silva", departamento: "Engenharia", email: "joao.silva@univ.ao", telefone: "+244 923 456 789", ultimaAtualizacao: "2025-01-15", situacao: "Pendente" },
    { id: 2, codigo: "DOC002", nome: "Prof.ª Dra. Maria Santos", departamento: "Medicina", email: "maria.santos@univ.ao", telefone: "+244 923 456 790", ultimaAtualizacao: "2025-01-20", situacao: "Atualizado" },
    { id: 3, codigo: "DOC003", nome: "Prof. Dr. Carlos Manuel", departamento: "Economia", email: "carlos.manuel@univ.ao", telefone: "+244 923 456 791", ultimaAtualizacao: "2024-12-10", situacao: "Desatualizado" },
    { id: 4, codigo: "DOC004", nome: "Prof. MSc. Ana Paula", departamento: "Direito", email: "ana.paula@univ.ao", telefone: "+244 923 456 792", ultimaAtualizacao: "2025-01-18", situacao: "Pendente" },
    { id: 5, codigo: "DOC005", nome: "Prof. Dr. Pedro Costa", departamento: "Engenharia", email: "pedro.costa@univ.ao", telefone: "+244 923 456 793", ultimaAtualizacao: "2025-01-22", situacao: "Atualizado" },
  ];

  const getSituacaoBadge = (situacao: string) => {
    const variants = {
      "Atualizado": "default",
      "Pendente": "secondary",
      "Desatualizado": "destructive",
    };
    return <Badge variant={variants[situacao as keyof typeof variants] as any}>{situacao}</Badge>;
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
            <BreadcrumbPage>Atualização de Dados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Atualização de Dados Docentes</h1>

      <PageHeader title="Atualização de Dados" />

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
          <Select value={situacao} onValueChange={setSituacao}>
            <SelectTrigger>
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Situações</SelectItem>
              <SelectItem value="atualizado">Atualizado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="desatualizado">Desatualizado</SelectItem>
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
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.telefone}</TableCell>
                  <TableCell>{item.ultimaAtualizacao}</TableCell>
                  <TableCell>{getSituacaoBadge(item.situacao)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
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
          Mostrando 1 a {mockData.length} de {mockData.length} registos
        </div>
      </div>
    </div>
  );
};

export default DataUpdate;
