import { useState } from "react";
import { RefreshCw, FileDown, Printer, Plus, Edit, Trash2, Settings } from "lucide-react";
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

export default function AcessGrup() {
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    grupo: "todos",
    funcionalidade: "todos",
    modulo: "todos",
    status: "todos",
    busca: "",
  });

  const grupos = ["Administradores", "Docentes", "Coordenadores", "Secretaria", "Estudantes"];
  const modulos = ["Horários", "Avaliações", "Inscrições", "Gestão Docentes", "Bolsas"];

  const mockData = [
    { id: 1, grupo: "Administradores", funcionalidade: "Criar Horário", modulo: "Horários", permissao: "Total", status: "Ativo" },
    { id: 2, grupo: "Docentes", funcionalidade: "Lançar Notas", modulo: "Avaliações", permissao: "Leitura/Escrita", status: "Ativo" },
    { id: 3, grupo: "Coordenadores", funcionalidade: "Aprovar Matrícula", modulo: "Inscrições", permissao: "Leitura/Escrita", status: "Ativo" },
    { id: 4, grupo: "Secretaria", funcionalidade: "Visualizar Pautas", modulo: "Avaliações", permissao: "Leitura", status: "Ativo" },
    { id: 5, grupo: "Estudantes", funcionalidade: "Consultar Notas", modulo: "Avaliações", permissao: "Leitura", status: "Ativo" },
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
                <BreadcrumbPage>Acesso Funcionalidade por Grupo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Acesso Funcionalidade por Grupo</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Grupo</label>
          <Select value={filtros.grupo} onValueChange={(v) => setFiltros({ ...filtros, grupo: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Grupos</SelectItem>
              {grupos.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
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

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Pesquisar</label>
          <Input
            placeholder="Buscar funcionalidade..."
            value={filtros.busca}
            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
            className="bg-background"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="default" size="sm"><Plus className="mr-2 h-4 w-4" />Atribuir Permissão</Button>
        <Button variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" />Atualizar lista</Button>
        <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar Excel</Button>
        <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar PDF</Button>
        <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Grupo</TableHead>
              <TableHead>Funcionalidade</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.grupo}</TableCell>
                  <TableCell>{item.funcionalidade}</TableCell>
                  <TableCell>{item.modulo}</TableCell>
                  <TableCell>
                    <Badge variant={item.permissao === "Total" ? "default" : "secondary"}>{item.permissao}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Ativo" ? "default" : "secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm"><Settings className="h-4 w-4" /></Button>
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
