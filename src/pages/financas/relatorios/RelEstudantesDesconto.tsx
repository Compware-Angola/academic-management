import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function RelEstudantesDesconto() {
  const mockData = [
    { estudante: "Ana Silva", curso: "Eng. Informática", tipoDesconto: "Funcionário", percentagem: "25%", valorDesconto: "11.250 Kz" },
    { estudante: "Pedro Santos", curso: "Direito", tipoDesconto: "Irmãos", percentagem: "15%", valorDesconto: "6.300 Kz" },
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
          <BreadcrumbItem><BreadcrumbPage>Listar Estudantes com Desconto</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Relatório - Estudantes com Desconto</h1>
      <p className="text-muted-foreground">Estudantes com descontos activos.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select><SelectTrigger className="w-48"><SelectValue placeholder="Tipo Desconto" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-48"><SelectValue placeholder="Curso" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Estudantes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudante</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tipo Desconto</TableHead>
                <TableHead>Percentagem</TableHead>
                <TableHead>Valor Desconto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.tipoDesconto}</TableCell>
                  <TableCell>{item.percentagem}</TableCell>
                  <TableCell className="text-green-600 font-semibold">{item.valorDesconto}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
