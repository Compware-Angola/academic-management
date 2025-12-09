import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Plus, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function NegociacaoDivida() {
  const mockData = [
    { id: 1, estudante: "João Dias", dividaTotal: "180.000 Kz", parcelas: 6, valorParcela: "30.000 Kz", status: "Em andamento" },
    { id: 2, estudante: "Maria Santos", dividaTotal: "90.000 Kz", parcelas: 3, valorParcela: "30.000 Kz", status: "Aprovado" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Área Financeira</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Negociação de Dívida</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Negociação de Dívida</h1>
      <p className="text-muted-foreground">Gerir acordos de pagamento e parcelamento de dívidas.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Nome do estudante" />
            <Select><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="andamento">Em Andamento</SelectItem><SelectItem value="aprovado">Aprovado</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Nova Negociação</Button>
        <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" />Gerar Contrato</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Negociações</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudante</TableHead>
                <TableHead>Dívida Total</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Valor Parcela</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell className="text-destructive">{item.dividaTotal}</TableCell>
                  <TableCell>{item.parcelas}x</TableCell>
                  <TableCell>{item.valorParcela}</TableCell>
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
