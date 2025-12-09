import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function FechoCaixaDiario() {
  const mockData = [
    { id: 1, data: "2024-01-15", totalEntradas: "2.500.000 Kz", totalSaidas: "150.000 Kz", saldoFinal: "2.350.000 Kz", status: "Aberto" },
    { id: 2, data: "2024-01-14", totalEntradas: "1.800.000 Kz", totalSaidas: "100.000 Kz", saldoFinal: "1.700.000 Kz", status: "Fechado" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Fecho de Caixa</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Fecho Caixa Diário</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Fecho de Caixa Diário</h1>
      <p className="text-muted-foreground">Resumo e fecho de operações diárias.</p>

      <Card>
        <CardHeader><CardTitle>Seleccionar Data</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input type="date" className="max-w-xs" />
            <Button className="gap-2"><Search className="h-4 w-4" />Consultar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2"><Check className="h-4 w-4" />Fechar Caixa</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Resumo Diário</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Total Entradas</TableHead>
                <TableHead>Total Saídas</TableHead>
                <TableHead>Saldo Final</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.data}</TableCell>
                  <TableCell className="text-green-600">{item.totalEntradas}</TableCell>
                  <TableCell className="text-red-600">{item.totalSaidas}</TableCell>
                  <TableCell className="font-semibold">{item.saldoFinal}</TableCell>
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
