import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotaCredito() {
  const mockData = [
    { id: 1, numero: "NC2024001", estudante: "Ana Silva", valorOriginal: "45.000 Kz", valorCredito: "45.000 Kz", data: "2024-01-15" },
    { id: 2, numero: "NC2024002", estudante: "Pedro Santos", valorOriginal: "42.000 Kz", valorCredito: "21.000 Kz", data: "2024-01-14" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Serv. Tributários (AGT)</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Nota de Crédito</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Notas de Crédito</h1>
      <p className="text-muted-foreground">Emissão e gestão de notas de crédito fiscais.</p>

      <Card>
        <CardHeader><CardTitle>Pesquisar</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Número da nota ou estudante" className="max-w-md" />
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Emitir Nota de Crédito</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Notas Emitidas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Valor Original</TableHead>
                <TableHead>Valor Crédito</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.numero}</TableCell>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell>{item.valorOriginal}</TableCell>
                  <TableCell className="text-green-600">{item.valorCredito}</TableCell>
                  <TableCell>{item.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
