import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Download, Printer, RefreshCw, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ExamCalendarLic() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockData = [
    { id: 1, uc: "Algoritmos e Estruturas de Dados", curso: "Eng. Informática", epoca: "Normal", data: "2024-12-21", horaInicio: "09:00", horaFim: "12:00", sala: "A201", vigilantes: "Prof. João Silva, Prof. Maria Santos" },
    { id: 2, uc: "Cálculo I", curso: "Eng. Informática", epoca: "Normal", data: "2024-12-22", horaInicio: "14:00", horaFim: "17:00", sala: "B105", vigilantes: "Prof. Pedro Costa" },
    { id: 3, uc: "Gestão de Projetos", curso: "Gestão de Empresas", epoca: "Recurso", data: "2025-01-10", horaInicio: "09:00", horaFim: "11:00", sala: "C302", vigilantes: "Prof. Ana Ferreira" },
    { id: 4, uc: "Arquitetura de Computadores", curso: "Eng. Informática", epoca: "Normal", data: "2024-12-23", horaInicio: "09:00", horaFim: "12:00", sala: "A202", vigilantes: "Prof. Carlos Mendes, Prof. Rita Alves" },
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
        title="Calendário de Provas"
        subtitle="Home / Calendário Académico (Lic.) / Calendário de Provas"
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
            <Label htmlFor="curso">Curso</Label>
            <Select>
              <SelectTrigger id="curso">
                <SelectValue placeholder="Todos os cursos" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos os cursos</SelectItem>
                <SelectItem value="eng">Eng. Informática</SelectItem>
                <SelectItem value="ges">Gestão de Empresas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="epoca">Época</Label>
            <Select>
              <SelectTrigger id="epoca">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="recurso">Recurso</SelectItem>
                <SelectItem value="especial">Especial</SelectItem>
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
            <Label htmlFor="search">Pesquisar UC</Label>
            <Input id="search" placeholder="Nome da UC..." />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UC</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Época</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora Início</TableHead>
              <TableHead>Hora Fim</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Vigilantes</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhuma prova agendada
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.uc}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>
                    <Badge variant={item.epoca === "Normal" ? "default" : "secondary"}>
                      {item.epoca}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.horaInicio}</TableCell>
                  <TableCell>{item.horaFim}</TableCell>
                  <TableCell>{item.sala}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.vigilantes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
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
