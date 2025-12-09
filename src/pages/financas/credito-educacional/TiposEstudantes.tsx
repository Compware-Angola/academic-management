import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function TiposEstudantes() {
  const mockData = [
    { id: 1, codigo: "TE001", descricao: "Estudante Regular", elegivel: "Sim", observacao: "Bolsa padrão" },
    { id: 2, codigo: "TE002", descricao: "Estudante Trabalhador", elegivel: "Sim", observacao: "Horário pós-laboral" },
    { id: 3, codigo: "TE003", descricao: "Estudante Internacional", elegivel: "Não", observacao: "Bolsa específica" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Gestão de Crédito Educacional</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Tipos de Estudantes</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Tipos de Estudantes</h1>
      <p className="text-muted-foreground">Classificação de estudantes para efeitos de bolsa.</p>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Novo Tipo</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Tipos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Elegível</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.elegivel}</TableCell>
                  <TableCell>{item.observacao}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
