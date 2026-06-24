import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CalendarioAulas = () => {
  const [mes, setMes] = useState("janeiro");
  const [ano, setAno] = useState("2025");

  const aulas = [
    { data: "2025-01-15", hora: "08:00-10:00", uc: "Algoritmos", turma: "EI-1A", tipo: "Teórica", sala: "A101", estado: "Realizada" },
    { data: "2025-01-15", hora: "10:15-12:15", uc: "Programação I", turma: "EI-2A", tipo: "Lab", sala: "Lab 1", estado: "Realizada" },
    { data: "2025-01-17", hora: "08:00-10:00", uc: "Algoritmos", turma: "EI-1B", tipo: "PL", sala: "Lab 2", estado: "Agendada" },
    { data: "2025-01-17", hora: "14:00-16:00", uc: "Estruturas de Dados", turma: "EI-2B", tipo: "Teórica", sala: "A102", estado: "Agendada" },
    { data: "2025-01-22", hora: "08:00-10:00", uc: "Algoritmos", turma: "EI-1A", tipo: "Teórica", sala: "A101", estado: "Agendada" },
    { data: "2025-01-22", hora: "10:15-12:15", uc: "Programação I", turma: "EI-2A", tipo: "Lab", sala: "Lab 1", estado: "Agendada" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Realizada": "default",
      "Agendada": "secondary",
      "Cancelada": "destructive",
    };
    return <Badge variant={variants[estado as keyof typeof variants] as any}>{estado}</Badge>;
  };

  const getTipoBadge = (tipo: string) => {
    const variants = {
      "Teórica": "default",
      "PL": "secondary",
      "Lab": "outline",
    };
    return <Badge variant={variants[tipo as keyof typeof variants] as any}>{tipo}</Badge>;
  };

  const groupedAulas = aulas.reduce((acc, aula) => {
    if (!acc[aula.data]) acc[aula.data] = [];
    acc[aula.data].push(aula);
    return acc;
  }, {} as Record<string, typeof aulas>);

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docente">Docente</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Calendário de Aulas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Calendário de Aulas</h1>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="janeiro">Janeiro</SelectItem>
              <SelectItem value="fevereiro">Fevereiro</SelectItem>
              <SelectItem value="marco">Março</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedAulas).map(([data, aulasNoDia]) => (
          <Card key={data} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                {new Date(data).toLocaleDateString('pt-AO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
            </div>
            <div className="space-y-3">
              {aulasNoDia.map((aula, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm font-medium text-muted-foreground min-w-[100px]">{aula.hora}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{aula.uc}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Turma {aula.turma} • Sala {aula.sala}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTipoBadge(aula.tipo)}
                    {getEstadoBadge(aula.estado)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CalendarioAulas;
