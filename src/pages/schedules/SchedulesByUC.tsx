import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download, RefreshCw, Printer, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SchedulesByUC() {
  const [isLoading, setIsLoading] = useState(false);

  const mockData = [
    { id: 1, uc: "Programação I", codigo: "INF101", curso: "Eng. Informática", turma: "T1", docente: "Prof. João Silva", sala: "Lab 1", dia: "Segunda", horario: "08:00 - 10:00", tipo: "Teórica" },
    { id: 2, uc: "Programação I", codigo: "INF101", curso: "Eng. Informática", turma: "T1", docente: "Prof. João Silva", sala: "Lab 2", dia: "Quarta", horario: "10:00 - 12:00", tipo: "Prática" },
    { id: 3, uc: "Base de Dados", codigo: "INF201", curso: "Eng. Informática", turma: "T2", docente: "Prof. Maria Santos", sala: "Sala 105", dia: "Terça", horario: "14:00 - 16:00", tipo: "Teórica" },
    { id: 4, uc: "Cálculo I", codigo: "MAT101", curso: "Eng. Civil", turma: "T1", docente: "Prof. Carlos Dias", sala: "Sala 201", dia: "Segunda", horario: "10:00 - 12:00", tipo: "Teórica" },
    { id: 5, uc: "Física I", codigo: "FIS101", curso: "Eng. Mecânica", turma: "T1", docente: "Prof. Ana Costa", sala: "Lab Física", dia: "Quinta", horario: "08:00 - 10:00", tipo: "Laboratório" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Horários</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Horários por UC</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Horários por Unidade Curricular</h1>
          <p className="text-muted-foreground">Consultar horários organizados por UC/disciplina.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros de Pesquisa</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Nome ou código da UC" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cursos</SelectItem>
                <SelectItem value="eng-info">Eng. Informática</SelectItem>
                <SelectItem value="eng-civil">Eng. Civil</SelectItem>
                <SelectItem value="direito">Direito</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Ano Lectivo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024/2025</SelectItem>
                <SelectItem value="2023">2023/2024</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Semestre" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="1">1º Semestre</SelectItem>
                <SelectItem value="2">2º Semestre</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Atualizar Lista</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar Excel</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar PDF</Button>
        <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Imprimir</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Horários por UC</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}
            </div>
          ) : mockData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum registo encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UC</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Dia</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.uc}</TableCell>
                    <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                    <TableCell>{item.curso}</TableCell>
                    <TableCell>{item.turma}</TableCell>
                    <TableCell>{item.docente}</TableCell>
                    <TableCell>{item.sala}</TableCell>
                    <TableCell>{item.dia}</TableCell>
                    <TableCell>{item.horario}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.tipo === "Teórica" ? "bg-blue-100 text-blue-700" :
                        item.tipo === "Prática" ? "bg-green-100 text-green-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {item.tipo}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">A mostrar {mockData.length} registos</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
