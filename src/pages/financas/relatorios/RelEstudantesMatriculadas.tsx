import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function RelEstudantesMatriculadas() {
  const mockData = [
    { curso: "Engenharia Informática", totalFeminino: 130, percentagem: "28.9%" },
    { curso: "Direito", totalFeminino: 200, percentagem: "52.6%" },
    { curso: "Medicina", totalFeminino: 65, percentagem: "54.2%" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Relatórios</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Estudantes Matriculadas</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Relatório - Estudantes Matriculadas (Feminino)</h1>
      <p className="text-muted-foreground">Estatísticas de matrículas do género feminino.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select><SelectTrigger className="w-48"><SelectValue placeholder="Ano Lectivo" /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem></SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Dados</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Total Feminino</TableHead>
                <TableHead>Percentagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell className="font-semibold">{item.totalFeminino}</TableCell>
                  <TableCell>{item.percentagem}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
