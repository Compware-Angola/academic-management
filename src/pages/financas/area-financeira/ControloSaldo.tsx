import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function ControloSaldo() {
  const mockData = [
    { id: 1, estudante: "Miguel Sousa", saldoAnterior: "50.000 Kz", creditos: "45.000 Kz", debitos: "45.000 Kz", saldoAtual: "50.000 Kz" },
    { id: 2, estudante: "Carla Oliveira", saldoAnterior: "0 Kz", creditos: "90.000 Kz", debitos: "45.000 Kz", saldoAtual: "45.000 Kz" },
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
          <BreadcrumbItem><BreadcrumbPage>Controlo Actual. Saldo</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Controlo de Atualização de Saldo</h1>
      <p className="text-muted-foreground">Monitorar movimentações e saldos de estudantes.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Nome do estudante" />
            <Select><SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger><SelectContent><SelectItem value="mes">Este Mês</SelectItem><SelectItem value="trimestre">Trimestre</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Atualizar</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Movimentações de Saldo</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudante</TableHead>
                <TableHead>Saldo Anterior</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead>Débitos</TableHead>
                <TableHead>Reserva</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell>{item.saldoAnterior}</TableCell>
                  <TableCell className="text-green-600">{item.creditos}</TableCell>
                  <TableCell className="text-red-600">{item.debitos}</TableCell>
                  <TableCell className="font-semibold">{item.saldoAtual}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
