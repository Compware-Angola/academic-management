import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AssiduidadeDocente = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mes, setMes] = useState("janeiro");
  const [ano, setAno] = useState("2025");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, data: "2025-01-15", diaSemana: "Segunda", horaInicio: "08:00", horaFim: "10:00", uc: "Algoritmos", turma: "EI-2A", sala: "A101", presenca: "Presente" },
    { id: 2, data: "2025-01-15", diaSemana: "Segunda", horaInicio: "10:15", horaFim: "12:15", uc: "Programação I", turma: "EI-1A", sala: "Lab 1", presenca: "Presente" },
    { id: 3, data: "2025-01-17", diaSemana: "Quarta", horaInicio: "08:00", horaFim: "10:00", uc: "Algoritmos", turma: "EI-2B", sala: "A102", presenca: "Falta" },
    { id: 4, data: "2025-01-17", diaSemana: "Quarta", horaInicio: "14:00", horaFim: "16:00", uc: "Estruturas de Dados", turma: "EI-3A", sala: "Lab 2", presenca: "Presente" },
    { id: 5, data: "2025-01-22", diaSemana: "Segunda", horaInicio: "08:00", horaFim: "10:00", uc: "Algoritmos", turma: "EI-2A", sala: "A101", presenca: "Falta Justificada" },
  ];

  const getPresencaBadge = (presenca: string) => {
    const variants = {
      "Presente": "default",
      "Falta": "destructive",
      "Falta Justificada": "secondary",
    };
    const icons = {
      "Presente": <CheckCircle className="h-4 w-4" />,
      "Falta": <XCircle className="h-4 w-4" />,
      "Falta Justificada": <XCircle className="h-4 w-4" />,
    };
    return (
      <div className="flex items-center gap-2">
        {icons[presenca as keyof typeof icons]}
        <Badge variant={variants[presenca as keyof typeof variants] as any}>{presenca}</Badge>
      </div>
    );
  };

  const presencas = mockData.filter(d => d.presenca === "Presente").length;
  const faltas = mockData.filter(d => d.presenca === "Falta").length;
  const faltasJustificadas = mockData.filter(d => d.presenca === "Falta Justificada").length;

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
            <BreadcrumbPage>Assiduidade</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Assiduidade do Docente</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">Presenças</div>
          <div className="text-2xl font-bold text-green-600">{presencas}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">Faltas</div>
          <div className="text-2xl font-bold text-red-600">{faltas}</div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="text-sm text-muted-foreground mb-1">Faltas Justificadas</div>
          <div className="text-2xl font-bold text-orange-600">{faltasJustificadas}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
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
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Dia da Semana</TableHead>
              <TableHead>Hora Início</TableHead>
              <TableHead>Hora Fim</TableHead>
              <TableHead>UC</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Presença</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum registo de assiduidade encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.data}</TableCell>
                  <TableCell>{item.diaSemana}</TableCell>
                  <TableCell>{item.horaInicio}</TableCell>
                  <TableCell>{item.horaFim}</TableCell>
                  <TableCell>{item.uc}</TableCell>
                  <TableCell>{item.turma}</TableCell>
                  <TableCell>{item.sala}</TableCell>
                  <TableCell>{getPresencaBadge(item.presenca)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar</span>
          <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">registos por página</span>
        </div>
      </div>
    </div>
  );
};

export default AssiduidadeDocente;
