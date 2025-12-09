import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function RelEstudantesFinalista() {
  const mockData = [
    { numero: "2020001", nome: "Carlos Dias", curso: "Engenharia Civil", media: "15.5", situacaoTFC: "Aprovado" },
    { numero: "2019002", nome: "Lucia Fernandes", curso: "Administração", media: "16.2", situacaoTFC: "Pendente" },
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
          <BreadcrumbItem><BreadcrumbPage>Estudantes Finalista</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Relatório - Estudantes Finalistas</h1>
      <p className="text-muted-foreground">Lista de estudantes em fase final do curso.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select><SelectTrigger className="w-48"><SelectValue placeholder="Curso" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-48"><SelectValue placeholder="Situação TFC" /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Finalistas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Média</TableHead>
                <TableHead>Situação TFC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono">{item.numero}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.media}</TableCell>
                  <TableCell>{item.situacaoTFC}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
