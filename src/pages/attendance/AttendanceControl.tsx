import { useState } from "react";
import { RefreshCw, FileDown, Printer, Eye, FileText } from "lucide-react";
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

export default function AttendanceControl() {
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    anoLetivo: "2024/2025",
    semestre: "todos",
    curso: "todos",
    turma: "todos",
    uc: "todos",
    busca: "",
  });

  const anosLetivos = ["2024/2025", "2023/2024", "2022/2023"];
  const semestres = ["1º Semestre", "2º Semestre"];
  const cursos = ["Engenharia Informática", "Engenharia Civil", "Arquitetura"];
  const turmas = ["Turma A", "Turma B", "Turma C"];
  const ucs = ["Algoritmos", "Base de Dados", "Programação Web"];

  const mockData = [
    { id: 1, curso: "Eng. Informática", turma: "A", uc: "Algoritmos", docente: "Prof. João Silva", totalAulas: 45, aulasDadas: 38, percentagem: "84%", status: "Em dia" },
    { id: 2, curso: "Eng. Civil", turma: "B", uc: "Estruturas", docente: "Prof. Maria Santos", totalAulas: 50, aulasDadas: 42, percentagem: "84%", status: "Em dia" },
    { id: 3, curso: "Arquitetura", turma: "A", uc: "Desenho Técnico", docente: "Prof. Pedro Costa", totalAulas: 40, aulasDadas: 30, percentagem: "75%", status: "Atrasado" },
    { id: 4, curso: "Eng. Informática", turma: "B", uc: "Base de Dados", docente: "Prof. Ana Gomes", totalAulas: 48, aulasDadas: 44, percentagem: "92%", status: "Em dia" },
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
                <BreadcrumbLink href="/assiduidade">Assiduidade</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Controle de Assiduidade</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Controle de Assiduidade</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Ano Letivo</label>
          <Select value={filtros.anoLetivo} onValueChange={(v) => setFiltros({ ...filtros, anoLetivo: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anosLetivos.map(ano => <SelectItem key={ano} value={ano}>{ano}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Semestre</label>
          <Select value={filtros.semestre} onValueChange={(v) => setFiltros({ ...filtros, semestre: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {semestres.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Curso</label>
          <Select value={filtros.curso} onValueChange={(v) => setFiltros({ ...filtros, curso: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Cursos</SelectItem>
              {cursos.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Turma</label>
          <Select value={filtros.turma} onValueChange={(v) => setFiltros({ ...filtros, turma: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Turmas</SelectItem>
              {turmas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Unidade Curricular</label>
          <Select value={filtros.uc} onValueChange={(v) => setFiltros({ ...filtros, uc: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as UCs</SelectItem>
              {ucs.map(uc => <SelectItem key={uc} value={uc}>{uc}</SelectItem>)}
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
              <TableHead>Curso</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Unidade Curricular</TableHead>
              <TableHead>Docente</TableHead>
              <TableHead>Total Aulas</TableHead>
              <TableHead>Aulas Dadas</TableHead>
              <TableHead>Percentagem</TableHead>
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
                  <TableCell className="font-medium">{item.curso}</TableCell>
                  <TableCell>{item.turma}</TableCell>
                  <TableCell>{item.uc}</TableCell>
                  <TableCell>{item.docente}</TableCell>
                  <TableCell>{item.totalAulas}</TableCell>
                  <TableCell>{item.aulasDadas}</TableCell>
                  <TableCell>
                    <Badge variant={parseInt(item.percentagem) >= 80 ? "default" : "destructive"}>{item.percentagem}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Em dia" ? "default" : "destructive"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button>
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
