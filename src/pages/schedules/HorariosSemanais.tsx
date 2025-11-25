import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Calendar } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const HorariosSemanais = () => {
  const [curso, setCurso] = useState("informatica");
  const [turma, setTurma] = useState("ei-1a");
  const [semana, setSemana] = useState("current");

  const horarios = {
    "Segunda": [
      { hora: "08:00-10:00", uc: "Algoritmos", tipo: "Teórica", docente: "Prof. João Silva", sala: "A101" },
      { hora: "10:15-12:15", uc: "Matemática I", tipo: "PL", docente: "Prof.ª Maria Costa", sala: "B203" },
      { hora: "14:00-16:00", uc: "Programação I", tipo: "Lab", docente: "Prof. Carlos Manuel", sala: "Lab 1" },
    ],
    "Terça": [
      { hora: "08:00-10:00", uc: "Física I", tipo: "Teórica", docente: "Prof. Pedro Santos", sala: "A102" },
      { hora: "10:15-12:15", uc: "Algoritmos", tipo: "PL", docente: "Prof. João Silva", sala: "Lab 2" },
    ],
    "Quarta": [
      { hora: "08:00-10:00", uc: "Inglês Técnico", tipo: "Teórico-Prática", docente: "Prof.ª Ana Paula", sala: "C105" },
      { hora: "10:15-12:15", uc: "Matemática I", tipo: "Teórica", docente: "Prof.ª Maria Costa", sala: "A101" },
      { hora: "14:00-16:00", uc: "Programação I", tipo: "Lab", docente: "Prof. Carlos Manuel", sala: "Lab 1" },
    ],
    "Quinta": [
      { hora: "08:00-10:00", uc: "Física I", tipo: "PL", docente: "Prof. Pedro Santos", sala: "Lab 3" },
      { hora: "10:15-12:15", uc: "Algoritmos", tipo: "Teórica", docente: "Prof. João Silva", sala: "A103" },
    ],
    "Sexta": [
      { hora: "08:00-10:00", uc: "Matemática I", tipo: "PL", docente: "Prof.ª Maria Costa", sala: "B204" },
      { hora: "10:15-12:15", uc: "Programação I", tipo: "Teórica", docente: "Prof. Carlos Manuel", sala: "A101" },
    ],
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      "Teórica": "default",
      "PL": "secondary",
      "Lab": "outline",
      "Teórico-Prática": "secondary",
    };
    return <Badge variant={variants[tipo as keyof typeof variants] as any}>{tipo}</Badge>;
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
            <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Horários Semanais</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Horários Semanais</h1>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <Select value={curso} onValueChange={setCurso}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informatica">Eng. Informática</SelectItem>
              <SelectItem value="civil">Eng. Civil</SelectItem>
              <SelectItem value="medicina">Medicina</SelectItem>
            </SelectContent>
          </Select>
          <Select value={turma} onValueChange={setTurma}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ei-1a">EI-1A</SelectItem>
              <SelectItem value="ei-1b">EI-1B</SelectItem>
              <SelectItem value="ei-2a">EI-2A</SelectItem>
            </SelectContent>
          </Select>
          <Select value={semana} onValueChange={setSemana}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Semana Atual</SelectItem>
              <SelectItem value="next">Próxima Semana</SelectItem>
              <SelectItem value="previous">Semana Anterior</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {Object.entries(horarios).map(([dia, aulas]) => (
          <Card key={dia} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">{dia}-feira</h3>
            </div>
            <div className="space-y-3">
              {aulas.map((aula, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-muted-foreground min-w-[100px]">{aula.hora}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{aula.uc}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {aula.docente} • Sala {aula.sala}
                      </div>
                    </div>
                  </div>
                  {getTipoBadge(aula.tipo)}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HorariosSemanais;
