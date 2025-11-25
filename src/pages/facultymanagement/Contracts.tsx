import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Pencil, Trash2, FileText } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Contracts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoContrato, setTipoContrato] = useState("all");
  const [estado, setEstado] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, codigo: "CONT-2025-001", docente: "Prof. Dr. João Silva", departamento: "Engenharia", tipoContrato: "Tempo Integral", dataInicio: "2025-02-01", dataFim: "2026-02-01", salario: "350.000,00 Kz", estado: "Ativo" },
    { id: 2, codigo: "CONT-2025-002", docente: "Prof.ª Dra. Maria Santos", departamento: "Medicina", tipoContrato: "Tempo Parcial", dataInicio: "2025-01-15", dataFim: "2025-07-15", salario: "200.000,00 Kz", estado: "Ativo" },
    { id: 3, codigo: "CONT-2024-089", docente: "Prof. Dr. Carlos Manuel", departamento: "Economia", tipoContrato: "Tempo Integral", dataInicio: "2024-03-01", dataFim: "2025-03-01", salario: "380.000,00 Kz", estado: "Por Renovar" },
    { id: 4, codigo: "CONT-2024-056", docente: "Prof. MSc. Ana Paula", departamento: "Direito", tipoContrato: "Prestação Serviços", dataInicio: "2024-09-01", dataFim: "2024-12-31", salario: "150.000,00 Kz", estado: "Expirado" },
    { id: 5, codigo: "CONT-2025-003", docente: "Prof. Dr. Pedro Costa", departamento: "Engenharia", tipoContrato: "Tempo Integral", dataInicio: "2025-01-10", dataFim: "2026-01-10", salario: "400.000,00 Kz", estado: "Ativo" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Ativo": "default",
      "Por Renovar": "secondary",
      "Expirado": "destructive",
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
            <BreadcrumbPage>Contracts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Contracts Docentes</h1>

      <PageHeader title="Contracts" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por código ou docente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={tipoContrato} onValueChange={setTipoContrato}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Contrato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="integral">Tempo Integral</SelectItem>
              <SelectItem value="parcial">Tempo Parcial</SelectItem>
              <SelectItem value="servicos">Prestação de Serviços</SelectItem>
            </SelectContent>
          </Select>
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Estados</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="renovar">Por Renovar</SelectItem>
              <SelectItem value="expirado">Expirado</SelectItem>
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
              <TableHead>Docente</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Tipo de Contrato</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead>Salário</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum contrato encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.docente}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{item.tipoContrato}</TableCell>
                  <TableCell>{item.dataInicio}</TableCell>
                  <TableCell>{item.dataFim}</TableCell>
                  <TableCell>{item.salario}</TableCell>
                  <TableCell>{getEstadoBadge(item.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
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

export default Contracts;
