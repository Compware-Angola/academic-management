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

export default function ActivitiesLecturesPos() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockData = [
    { id: 1, programa: "MBA em Gestão", tipo: "Início das Aulas", dataInicio: "2024-10-01", dataFim: "2025-02-28", anoLetivo: "2024/2025", observacoes: "Período letivo intensivo" },
    { id: 2, programa: "Mestrado em Eng. Civil", tipo: "Período de Avaliação", dataInicio: "2025-03-01", dataFim: "2025-03-20", anoLetivo: "2024/2025", observacoes: "Defesas de tese" },
    { id: 3, programa: "Pós-Graduação em Direito", tipo: "Início das Aulas", dataInicio: "2024-11-15", dataFim: "2025-04-30", anoLetivo: "2024/2025", observacoes: "Módulos semanais" },
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
        title="Atividades Letivas - Pós-Graduação"
        subtitle="Home / Calendário Académico (Pós) / Atividades Letivas"
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
              Nova Atividade
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
            <Label htmlFor="tipoAtividade">Tipo de Atividade</Label>
            <Select>
              <SelectTrigger id="tipoAtividade">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="aulas">Início das Aulas</SelectItem>
                <SelectItem value="avaliacao">Período de Avaliação</SelectItem>
                <SelectItem value="defesa">Defesas de Tese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input id="search" placeholder="Buscar..." />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Tipo de Atividade</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead>Ano Letivo</TableHead>
              <TableHead>Observações</TableHead>
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
                  Nenhuma atividade letiva encontrada
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.programa}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.tipo}</Badge>
                  </TableCell>
                  <TableCell>{item.dataInicio}</TableCell>
                  <TableCell>{item.dataFim}</TableCell>
                  <TableCell>{item.anoLetivo}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.observacoes}</TableCell>
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
