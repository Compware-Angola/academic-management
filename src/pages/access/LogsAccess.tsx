import { useState } from "react";
import { RefreshCw, FileDown, Printer, Eye, Search } from "lucide-react";
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

export default function LogsAcessos() {
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    tipo: "todos",
    periodo: "hoje",
    busca: "",
  });

  

  const tiposAcesso = ["Login", "Logout", "Acesso Negado", "Alteração Dados", "Exportação"];
  const periodos = ["Hoje", "Última semana", "Último mês", "Personalizado"];

  const mockData = [
    { id: 1, usuario: "João Silva", email: "joao@universidade.ao", acao: "Login", modulo: "Horários", ip: "197.149.81.23", dataHora: "20/03/2024 10:15:32", status: "Sucesso" },
    { id: 2, usuario: "Maria Santos", email: "maria@universidade.ao", acao: "Exportação", modulo: "Avaliações", ip: "197.149.81.45", dataHora: "20/03/2024 10:10:15", status: "Sucesso" },
    { id: 3, usuario: "Pedro Costa", email: "pedro@universidade.ao", acao: "Acesso Negado", modulo: "Gestão Docentes", ip: "197.149.81.67", dataHora: "20/03/2024 10:05:42", status: "Falha" },
    { id: 4, usuario: "Ana Gomes", email: "ana@universidade.ao", acao: "Alteração Dados", modulo: "Inscrições", ip: "197.149.81.89", dataHora: "20/03/2024 09:58:21", status: "Sucesso" },
    { id: 5, usuario: "Carlos Dias", email: "carlos@universidade.ao", acao: "Logout", modulo: "Sistema", ip: "197.149.81.34", dataHora: "20/03/2024 09:50:10", status: "Sucesso" },
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
                <BreadcrumbPage>Logs de Acessos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Logs de Acessos</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Data Início</label>
          <Select value={filtros.tipo} onValueChange={(v) => setFiltros({ ...filtros, tipo: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Tipos</SelectItem>
              {tiposAcesso.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Período</label>
          <Select value={filtros.periodo} onValueChange={(v) => setFiltros({ ...filtros, periodo: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodos.map(p => <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4" />Atualizar lista</Button>
        <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar Excel</Button>
        <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Exportar PDF</Button>
        <Button variant="outline" size="sm"><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.usuario}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.acao}</TableCell>
                  <TableCell>{item.modulo}</TableCell>
                  <TableCell className="font-mono text-sm">{item.ip}</TableCell>
                  <TableCell>{item.dataHora}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Sucesso" ? "default" : "destructive"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
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
