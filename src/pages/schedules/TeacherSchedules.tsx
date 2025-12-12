import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download, RefreshCw, Printer, GraduationCap, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";

export default function TeacherSchedules() {
  const [isLoading, setIsLoading] = useState(false);
    // === Dados base ===
    const { data: anosAcademicos } = useQueryAnoAcademico();
    const { data: semestres } = useQuerySemestres();
    const { data: periodos } = useQueryPeriod();
  
    // filtros
    const [filters, setFilters] = useState({
      anoLetivo: "",
      semestre: "",
      periodo: "",
      curso: "",
      anoCurricular: "",
      unidadeCurricular: "",
    });

  const mockData = [
    { id: 1, docente: "Prof. João Silva", departamento: "Informática", uc: "Programação I", curso: "Eng. Informática", turma: "T1", sala: "Lab 1", dia: "Segunda", horario: "08:00 - 10:00", tipo: "Teórica", cargaHoraria: "4h/semana" },
    { id: 2, docente: "Prof. João Silva", departamento: "Informática", uc: "Programação I", curso: "Eng. Informática", turma: "T1", sala: "Lab 2", dia: "Quarta", horario: "10:00 - 12:00", tipo: "Prática", cargaHoraria: "4h/semana" },
    { id: 3, docente: "Prof. Maria Santos", departamento: "Informática", uc: "Base de Dados", curso: "Eng. Informática", turma: "T2", sala: "Sala 105", dia: "Terça", horario: "14:00 - 16:00", tipo: "Teórica", cargaHoraria: "6h/semana" },
    { id: 4, docente: "Prof. Carlos Dias", departamento: "Matemática", uc: "Cálculo I", curso: "Eng. Civil", turma: "T1", sala: "Sala 201", dia: "Segunda", horario: "10:00 - 12:00", tipo: "Teórica", cargaHoraria: "4h/semana" },
    { id: 5, docente: "Prof. Ana Costa", departamento: "Física", uc: "Física I", curso: "Eng. Mecânica", turma: "T1", sala: "Lab Física", dia: "Quinta", horario: "08:00 - 10:00", tipo: "Laboratório", cargaHoraria: "6h/semana" },
  ];

  const resumoDocentes = [
    { docente: "Prof. João Silva", totalHoras: 8, totalUCs: 1, totalTurmas: 1 },
    { docente: "Prof. Maria Santos", totalHoras: 6, totalUCs: 1, totalTurmas: 1 },
    { docente: "Prof. Carlos Dias", totalHoras: 4, totalUCs: 1, totalTurmas: 1 },
    { docente: "Prof. Ana Costa", totalHoras: 6, totalUCs: 1, totalTurmas: 1 },
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
          <BreadcrumbItem><BreadcrumbPage>Horários por Docente</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Horários por Docente</h1>
          <p className="text-muted-foreground">Consultar horários organizados por docente/professor.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros de Pesquisa</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Nome do docente" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Departamento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                <SelectItem value="info">Informática</SelectItem>
                <SelectItem value="mat">Matemática</SelectItem>
                <SelectItem value="fis">Física</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {resumoDocentes.map((doc, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{doc.docente}</p>
                  <p className="text-xs text-muted-foreground">{doc.totalHoras}h/semana • {doc.totalUCs} UC(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



      <Card>
        <CardHeader><CardTitle>Lista de Horários por Docente</CardTitle></CardHeader>
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
                  <TableHead>Docente</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>UC</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Dia</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.docente}</TableCell>
                    <TableCell>{item.departamento}</TableCell>
                    <TableCell>{item.uc}</TableCell>
                    <TableCell>{item.curso}</TableCell>
                    <TableCell>{item.turma}</TableCell>
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
