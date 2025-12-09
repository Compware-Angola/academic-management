import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function PagamentosReferencia() {
  const mockData = [
    { id: 1, referencia: "REF2024001", estudante: "Ana Costa", valor: "45.000 Kz", dataPagamento: "2024-01-15", banco: "BAI" },
    { id: 2, referencia: "REF2024002", estudante: "Bruno Lima", valor: "42.000 Kz", dataPagamento: "2024-01-14", banco: "BFA" },
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
          <BreadcrumbItem><BreadcrumbPage>Pagamentos por Referência</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Pagamentos por Referência</h1>
      <p className="text-muted-foreground">Consultar pagamentos realizados por referência bancária.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Referência" />
            <Input placeholder="Nome do estudante" />
            <Select><SelectTrigger><SelectValue placeholder="Banco" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="bai">BAI</SelectItem><SelectItem value="bfa">BFA</SelectItem></SelectContent></Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Atualizar</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Pagamentos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead>Banco</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.referencia}</TableCell>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>{item.dataPagamento}</TableCell>
                  <TableCell>{item.banco}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
