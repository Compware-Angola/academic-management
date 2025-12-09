import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function FechoCaixaGeral() {
  const mockData = [
    { id: 1, periodo: "Janeiro/2024", totalEntradas: "45.000.000 Kz", totalSaidas: "2.500.000 Kz", saldoFinal: "42.500.000 Kz" },
    { id: 2, periodo: "Dezembro/2023", totalEntradas: "38.000.000 Kz", totalSaidas: "1.800.000 Kz", saldoFinal: "36.200.000 Kz" },
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
          <BreadcrumbItem><BreadcrumbPage>Fecho Caixa Geral</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Fecho de Caixa Geral</h1>
      <p className="text-muted-foreground">Visão consolidada de todos os fechos de caixa.</p>

      <Card>
        <CardHeader><CardTitle>Filtrar Período</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input type="month" className="max-w-xs" />
            <Button className="gap-2"><Search className="h-4 w-4" />Consultar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar Relatório</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Resumo Geral</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Total Entradas</TableHead>
                <TableHead>Total Saídas</TableHead>
                <TableHead>Saldo Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.periodo}</TableCell>
                  <TableCell className="text-green-600">{item.totalEntradas}</TableCell>
                  <TableCell className="text-red-600">{item.totalSaidas}</TableCell>
                  <TableCell className="font-semibold">{item.saldoFinal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
