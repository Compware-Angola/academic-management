import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Download, Printer, RefreshCw, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ExamCalendarPos() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockData = [
    { id: 1, modulo: "Gestão Estratégica", programa: "MBA em Gestão", tipo: "Prova Escrita", data: "2025-03-05", horaInicio: "14:00", horaFim: "17:00", sala: "Auditório A" },
    { id: 2, modulo: "Estruturas Avançadas", programa: "Mestrado em Eng. Civil", tipo: "Defesa de Tese", data: "2025-03-10", horaInicio: "09:00", horaFim: "11:00", sala: "Sala de Defesas" },
    { id: 3, modulo: "Direito Comercial", programa: "Pós-Graduação em Direito", tipo: "Prova Oral", data: "2025-04-15", horaInicio: "10:00", horaFim: "12:00", sala: "Sala 201" },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Calendário atualizado com sucesso" });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendário de Provas - Pós-Graduação"
        subtitle="Home / Calendário Académico (Pós) / Calendário de Provas"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agendar Prova
            </Button>
          </>
        }
      />

      <div className="bg-card rounded-lg border p-4 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="programa">Programa</Label>
            <Select>
              <SelectTrigger id="programa">
                <SelectValue placeholder="Todos os programas" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos os programas</SelectItem>
                <SelectItem value="mba">MBA em Gestão</SelectItem>
                <SelectItem value="mec">Mestrado em Eng. Civil</SelectItem>
                <SelectItem value="pgd">Pós-Graduação em Direito</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipoProva">Tipo de Prova</Label>
            <Select>
              <SelectTrigger id="tipoProva">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="escrita">Prova Escrita</SelectItem>
                <SelectItem value="oral">Prova Oral</SelectItem>
                <SelectItem value="defesa">Defesa de Tese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input id="dataInicio" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input id="dataFim" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar Módulo</Label>
            <Input id="search" placeholder="Nome do módulo..." />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Módulo</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Tipo de Prova</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora Início</TableHead>
              <TableHead>Hora Fim</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhuma prova agendada
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.modulo}</TableCell>
                  <TableCell>{item.programa}</TableCell>
                  <TableCell>
                    <Badge variant={item.tipo === "Defesa de Tese" ? "default" : "secondary"}>
                      {item.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.horaInicio}</TableCell>
                  <TableCell>{item.horaFim}</TableCell>
                  <TableCell>{item.sala}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="perPage">Itens por página:</Label>
          <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
            <SelectTrigger id="perPage" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1}>Anterior</Button>
          <span className="text-sm">Página {currentPage} de 1</span>
          <Button variant="outline" size="sm" disabled>Próxima</Button>
        </div>
      </div>
    </div>
  );
}
