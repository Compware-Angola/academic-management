import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ListarDescontos() {
  const mockData = [
    { id: 1, codigo: "DESC001", descricao: "Desconto Funcionário", percentagem: "25%", status: "Activo" },
    { id: 2, codigo: "DESC002", descricao: "Desconto Irmãos", percentagem: "15%", status: "Activo" },
    { id: 3, codigo: "DESC003", descricao: "Desconto Mérito", percentagem: "20%", status: "Activo" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Gestão de Descontos</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Listar Descontos</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Listar Descontos</h1>
      <p className="text-muted-foreground">Tipos de descontos disponíveis no sistema.</p>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Novo Desconto</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Descontos Disponíveis</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Percentagem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.percentagem}</TableCell>
                  <TableCell>{item.status}</TableCell>
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
