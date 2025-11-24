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

export default function ExemptDays() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockData = [
    { id: 1, data: "2024-12-25", tipo: "Feriado Nacional", descricao: "Natal", anoLetivo: "2024/2025", aplicaA: "Todos" },
    { id: 2, data: "2025-01-01", tipo: "Feriado Nacional", descricao: "Ano Novo", anoLetivo: "2024/2025", aplicaA: "Todos" },
    { id: 3, data: "2025-02-04", tipo: "Feriado Nacional", descricao: "Dia do Início da Luta Armada", anoLetivo: "2024/2025", aplicaA: "Todos" },
    { id: 4, data: "2025-03-08", tipo: "Feriado Nacional", descricao: "Dia Internacional da Mulher", anoLetivo: "2024/2025", aplicaA: "Todos" },
    { id: 5, data: "2025-04-04", tipo: "Feriado Nacional", descricao: "Dia da Paz", anoLetivo: "2024/2025", aplicaA: "Todos" },
    { id: 6, data: "2025-09-17", tipo: "Feriado Nacional", descricao: "Dia do Herói Nacional", anoLetivo: "2024/2025", aplicaA: "Todos" },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Lista atualizada com sucesso" });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dias Isentos"
        subtitle="Home / Calendário Académico (Lic.) / Dias Isentos"
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
              Novo Dia Isento
            </Button>
          </>
        }
      />

      <div className="bg-card rounded-lg border p-4 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Label htmlFor="tipo">Tipo</Label>
            <Select>
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="feriado">Feriado Nacional</SelectItem>
                <SelectItem value="evento">Evento Institucional</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mes">Mês</Label>
            <Select>
              <SelectTrigger id="mes">
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos os meses</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2024, i).toLocaleString('pt-PT', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input id="search" placeholder="Descrição..." />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ano Letivo</TableHead>
              <TableHead>Aplica-se a</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum dia isento registado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.tipo}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.anoLetivo}</TableCell>
                  <TableCell>{item.aplicaA}</TableCell>
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
