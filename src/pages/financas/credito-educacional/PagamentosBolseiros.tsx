import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function PagamentosBolseiros() {
  const mockData = [
    { id: 1, bolseiro: "Ana Silva", instituicao: "INAGBE", valor: "45.000 Kz", mes: "Janeiro/2024", status: "Pago" },
    { id: 2, bolseiro: "Pedro Santos", instituicao: "Sonangol", valor: "42.000 Kz", mes: "Janeiro/2024", status: "Pendente" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Gestão de Crédito Educacional</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Pagamentos Bolseiros</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Pagamentos de Bolseiros</h1>
      <p className="text-muted-foreground">Registar e gerir pagamentos de bolseiros.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Nome do bolseiro" />
            <Select><SelectTrigger><SelectValue placeholder="Instituição" /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Novo Pagamento</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Pagamentos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bolseiro</TableHead>
                <TableHead>Instituição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Mês/Ano</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.bolseiro}</TableCell>
                  <TableCell>{item.instituicao}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>{item.mes}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
