import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function ConsultaOperacao() {
  const mockData = [
    { id: 1, numeroOp: "OP2024001", estudante: "Ana Martins", valor: "45.000 Kz", data: "2024-01-15", status: "Confirmado" },
    { id: 2, numeroOp: "OP2024002", estudante: "Pedro Neto", valor: "42.000 Kz", data: "2024-01-14", status: "Pendente" },
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
          <BreadcrumbItem><BreadcrumbPage>Consult. Nº Operação</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Consultar Número de Operação</h1>
      <p className="text-muted-foreground">Pesquisa de operações financeiras por número.</p>

      <Card>
        <CardHeader><CardTitle>Pesquisar Operação</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Número da operação (ex: OP2024001)" className="max-w-md" />
            <Button className="gap-2"><Search className="h-4 w-4" />Consultar</Button>
            <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Limpar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Resultados</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Operação</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.numeroOp}</TableCell>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>{item.data}</TableCell>
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
