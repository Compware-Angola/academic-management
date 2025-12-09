import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServicosEmolumentos() {
  const mockData = [
    { id: 1, codigo: "SRV001", descricao: "Taxa de Matrícula", valor: "25.000 Kz", categoria: "Matrícula" },
    { id: 2, codigo: "SRV002", descricao: "Certificado de Frequência", valor: "5.000 Kz", categoria: "Documentos" },
    { id: 3, codigo: "SRV003", descricao: "Declaração de Notas", valor: "3.500 Kz", categoria: "Documentos" },
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
          <BreadcrumbItem><BreadcrumbPage>Serviços e Emolumentos</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Serviços e Emolumentos</h1>
      <p className="text-muted-foreground">Gestão de serviços e respectivos valores.</p>

      <Card>
        <CardHeader><CardTitle>Pesquisar</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Descrição do serviço" className="max-w-md" />
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Novo Serviço</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Serviços</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
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
