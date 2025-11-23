import { useState } from "react";
import { RefreshCw, FileDown, Printer, Eye, Power } from "lucide-react";
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

export default function LoggedInUsers() {
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    perfil: "todos",
    modulo: "todos",
    busca: "",
  });

  const perfis = ["Administrador", "Docente", "Coordenador", "Secretaria", "Estudante"];
  const modulos = ["Horários", "Avaliações", "Inscrições", "Gestão Docentes", "Bolsas"];

  const mockData = [
    { id: 1, codigo: "USR001", nome: "João Silva", email: "joao@universidade.ao", perfil: "Administrador", moduloAtual: "Horários", ip: "197.149.81.23", horaLogin: "10:15:32", tempoAtivo: "1h 30m", status: "Ativo" },
    { id: 2, codigo: "USR002", nome: "Maria Santos", email: "maria@universidade.ao", perfil: "Docente", moduloAtual: "Avaliações", ip: "197.149.81.45", horaLogin: "09:45:10", tempoAtivo: "2h 00m", status: "Ativo" },
    { id: 3, codigo: "USR003", nome: "Pedro Costa", email: "pedro@universidade.ao", perfil: "Coordenador", moduloAtual: "Inscrições", ip: "197.149.81.67", horaLogin: "08:30:22", tempoAtivo: "3h 15m", status: "Ativo" },
    { id: 4, codigo: "USR004", nome: "Ana Gomes", email: "ana@universidade.ao", perfil: "Secretaria", moduloAtual: "Gestão Docentes", ip: "197.149.81.89", horaLogin: "08:00:05", tempoAtivo: "3h 45m", status: "Ativo" },
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
                <BreadcrumbPage>Utilizadores Logados</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Utilizadores Logados</h1>
          <p className="text-muted-foreground">Total de utilizadores online: {mockData.length}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Perfil</label>
          <Select value={filtros.perfil} onValueChange={(v) => setFiltros({ ...filtros, perfil: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Perfis</SelectItem>
              {perfis.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Módulo Atual</label>
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
          <label className="text-sm font-medium text-foreground">Pesquisar</label>
          <Input
            placeholder="Nome, código ou email..."
            value={filtros.busca}
            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
            className="bg-background"
          />
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
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Módulo Atual</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Hora Login</TableHead>
              <TableHead>Tempo Ativo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                  Nenhum utilizador logado no momento
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.perfil}</TableCell>
                  <TableCell>{item.moduloAtual}</TableCell>
                  <TableCell className="font-mono text-sm">{item.ip}</TableCell>
                  <TableCell>{item.horaLogin}</TableCell>
                  <TableCell>{item.tempoAtivo}</TableCell>
                  <TableCell>
                    <Badge variant="default">{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Power className="h-4 w-4" /></Button>
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
