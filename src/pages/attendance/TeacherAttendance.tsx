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

export default function TeacherAttendance() {
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    anoLetivo: "2024/2025",
    semestre: "todos",
    departamento: "todos",
    busca: "",
  });

  const anosLetivos = ["2024/2025", "2023/2024", "2022/2023"];
  const semestres = ["1º Semestre", "2º Semestre"];
  const departamentos = ["Engenharia", "Ciências", "Direito", "Economia"];

  const mockData = [
    { id: 1, codigo: "DOC001", nome: "Prof. João Silva", departamento: "Engenharia", totalAulas: 120, aulasDadas: 110, faltasJustif: 8, faltasInjustif: 2, percentagem: "92%", status: "Excelente" },
    { id: 2, codigo: "DOC002", nome: "Prof. Maria Santos", departamento: "Ciências", totalAulas: 100, aulasDadas: 95, faltasJustif: 5, faltasInjustif: 0, percentagem: "95%", status: "Excelente" },
    { id: 3, codigo: "DOC003", nome: "Prof. Pedro Costa", departamento: "Engenharia", totalAulas: 110, aulasDadas: 90, faltasJustif: 12, faltasInjustif: 8, percentagem: "82%", status: "Regular" },
    { id: 4, codigo: "DOC004", nome: "Prof. Ana Gomes", departamento: "Direito", totalAulas: 90, aulasDadas: 85, faltasJustif: 5, faltasInjustif: 0, percentagem: "94%", status: "Excelente" },
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
                <BreadcrumbPage>Assiduidade por Docente</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Assiduidade por Docente</h1>
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
          <label className="text-sm font-medium text-foreground">Departamento</label>
          <Select value={filtros.departamento} onValueChange={(v) => setFiltros({ ...filtros, departamento: v })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Departamentos</SelectItem>
              {departamentos.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Pesquisar</label>
          <Input
            placeholder="Nome ou código..."
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
              <TableHead>Departamento</TableHead>
              <TableHead>Total Aulas</TableHead>
              <TableHead>Aulas Dadas</TableHead>
              <TableHead>Faltas Justif.</TableHead>
              <TableHead>Faltas Injustif.</TableHead>
              <TableHead>Percentagem</TableHead>
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
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{item.totalAulas}</TableCell>
                  <TableCell>{item.aulasDadas}</TableCell>
                  <TableCell>{item.faltasJustif}</TableCell>
                  <TableCell>{item.faltasInjustif}</TableCell>
                  <TableCell>
                    <Badge variant={parseInt(item.percentagem) >= 90 ? "default" : "secondary"}>{item.percentagem}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Excelente" ? "default" : "secondary"}>{item.status}</Badge>
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
