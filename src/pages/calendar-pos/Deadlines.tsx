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

export default function DeadlinesPos() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockData = [
    { 
      id: 1, 
      tipo: "Inscrição em Módulos", 
      programa: "MBA em Gestão",
      dataInicio: "2024-09-01", 
      dataFim: "2024-09-30", 
      anoLetivo: "2024/2025",
      estado: "Encerrado"
    },
    { 
      id: 2, 
      tipo: "Submissão de Tese", 
      programa: "Mestrado em Eng. Civil",
      dataInicio: "2025-02-01", 
      dataFim: "2025-02-28", 
      anoLetivo: "2024/2025",
      estado: "Ativo"
    },
    { 
      id: 3, 
      tipo: "Lançamento de Notas", 
      programa: "Pós-Graduação em Direito",
      dataInicio: "2025-04-20", 
      dataFim: "2025-05-10", 
      anoLetivo: "2024/2025",
      estado: "Pendente"
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Prazos atualizados com sucesso" });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prazos - Pós-Graduação"
        subtitle="Home / Calendário Académico (Pós) / Prazos"
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
              Novo Prazo
            </Button>
          </>
        }
      />

      <div className="bg-card rounded-lg border p-4 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Label htmlFor="anoLetivo">Ano Letivo</Label>
            <Select>
              <SelectTrigger id="anoLetivo">
                <SelectValue placeholder="Todos os anos" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos os anos</SelectItem>
                <SelectItem value="2024-2025">2024/2025</SelectItem>
                <SelectItem value="2023-2024">2023/2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input id="search" placeholder="Tipo de prazo..." />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo de Prazo</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead>Ano Letivo</TableHead>
              <TableHead>Estado</TableHead>
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
                  Nenhum prazo configurado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.tipo}</TableCell>
                  <TableCell>{item.programa}</TableCell>
                  <TableCell>{item.dataInicio}</TableCell>
                  <TableCell>{item.dataFim}</TableCell>
                  <TableCell>{item.anoLetivo}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.estado === "Ativo" ? "default" : 
                      item.estado === "Pendente" ? "secondary" : 
                      "outline"
                    }>
                      {item.estado}
                    </Badge>
                  </TableCell>
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
