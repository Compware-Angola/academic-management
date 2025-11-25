import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Eye } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const HorasVigilancia = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mes, setMes] = useState("janeiro");
  const [ano, setAno] = useState("2025");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, data: "2025-01-15", horaInicio: "08:00", horaFim: "12:00", tipoProva: "Exame Normal", uc: "Algoritmos", sala: "A101", totalHoras: 4, estado: "Concluída" },
    { id: 2, data: "2025-01-17", horaInicio: "14:00", horaFim: "17:00", tipoProva: "Exame Recurso", uc: "Matemática I", sala: "B203", totalHoras: 3, estado: "Concluída" },
    { id: 3, data: "2025-01-22", horaInicio: "08:00", horaFim: "11:00", tipoProva: "Exame Normal", uc: "Programação I", sala: "Lab 1", totalHoras: 3, estado: "Agendada" },
    { id: 4, data: "2025-01-24", horaInicio: "14:00", horaFim: "18:00", tipoProva: "Exame Normal", uc: "Física I", sala: "A102", totalHoras: 4, estado: "Agendada" },
    { id: 5, data: "2025-01-29", horaInicio: "10:00", horaFim: "13:00", tipoProva: "Exame Especial", uc: "Cálculo I", sala: "B204", totalHoras: 3, estado: "Agendada" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Concluída": "default",
      "Agendada": "secondary",
      "Cancelada": "destructive",
    };
    return <Badge variant={variants[estado as keyof typeof variants] as any}>{estado}</Badge>;
  };

  const totalHoras = mockData.reduce((acc, item) => acc + item.totalHoras, 0);

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
            <BreadcrumbPage>Horas de Vigilância</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Horas de Vigilância</h1>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-primary">Total de Horas no Mês</h3>
            <p className="text-sm text-muted-foreground">Vigilância de exames e provas</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-primary">{totalHoras}h</div>
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
              <TableHead>Hora Início</TableHead>
              <TableHead>Hora Fim</TableHead>
              <TableHead>Tipo de Prova</TableHead>
              <TableHead>UC</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Total Horas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhuma vigilância registada
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.data}</TableCell>
                  <TableCell>{item.horaInicio}</TableCell>
                  <TableCell>{item.horaFim}</TableCell>
                  <TableCell>{item.tipoProva}</TableCell>
                  <TableCell>{item.uc}</TableCell>
                  <TableCell>{item.sala}</TableCell>
                  <TableCell className="font-semibold">{item.totalHoras}h</TableCell>
                  <TableCell>{getEstadoBadge(item.estado)}</TableCell>
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

export default HorasVigilancia;
