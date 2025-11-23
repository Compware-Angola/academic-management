import { useState } from "react";
import { RefreshCw, FileDown, Printer, Plus, Edit, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function UserFunctionality() {
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    utilizador: "",
    funcionalidade: "todos",
    modulo: "todos",
    status: "todos",
  });

  const modulos = ["Horários", "Avaliações", "Inscrições", "Gestão Docentes", "Acessos", "Bolsas"];

  const mockData = [
    { id: 1, codigo: "USR001", nome: "João Silva", email: "joao@universidade.ao", funcionalidade: "Criar Horário", modulo: "Horários", permissao: "Total", dataAtrib: "01/02/2024", status: "Ativo" },
    { id: 2, codigo: "USR002", nome: "Maria Santos", email: "maria@universidade.ao", funcionalidade: "Lançar Notas", modulo: "Avaliações", permissao: "Escrita", dataAtrib: "15/01/2024", status: "Ativo" },
    { id: 3, codigo: "USR003", nome: "Pedro Costa", email: "pedro@universidade.ao", funcionalidade: "Aprovar Bolsas", modulo: "Bolsas", permissao: "Total", dataAtrib: "10/03/2024", status: "Ativo" },
    { id: 4, codigo: "USR004", nome: "Ana Gomes", email: "ana@universidade.ao", funcionalidade: "Consultar Pautas", modulo: "Avaliações", permissao: "Leitura", dataAtrib: "20/02/2024", status: "Ativo" },
  ];

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Funcionalidade por Utilizador</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Funcionalidade por Utilizador</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Utilizador</label>
          <Input
            placeholder="Nome ou código do utilizador..."
            value={filtros.utilizador}
            onChange={(e) => setFiltros({ ...filtros, utilizador: e.target.value })}
            className="bg-background"
          />
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Módulo</label>
          <Select value={filtros.modulo} onValueChange={(v) => setFiltros({ ...filtros, modulo: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Módulos</SelectItem>
              {modulos.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Status</label>
          <Select value={filtros.status} onValueChange={(v) => setFiltros({ ...filtros, status: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="default" size="sm"><Plus className="mr-2 h-4 w-4" />Atribuir Funcionalidade</Button>
        <Button variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" />Atualizar lista</Button>
        <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar Excel</Button>
        <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar PDF</Button>
        <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Funcionalidade</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Data Atribuição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.funcionalidade}</TableCell>
                  <TableCell>{item.modulo}</TableCell>
                  <TableCell>
                    <Badge variant={item.permissao === "Total" ? "default" : "secondary"}>{item.permissao}</Badge>
                  </TableCell>
                  <TableCell>{item.dataAtrib}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Ativo" ? "default" : "secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm"><Shield className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
