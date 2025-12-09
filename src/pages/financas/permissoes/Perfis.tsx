import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Perfis() {
  const mockData = [
    { id: 1, codigo: "ADMIN", nome: "Administrador", descricao: "Acesso total ao sistema", numUtilizadores: 3 },
    { id: 2, codigo: "TESOUR", nome: "Tesouraria", descricao: "Gestão de pagamentos", numUtilizadores: 8 },
    { id: 3, codigo: "CONSULT", nome: "Consulta", descricao: "Apenas visualização", numUtilizadores: 15 },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Gestão Permissões</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Perfis</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Perfis de Acesso</h1>
      <p className="text-muted-foreground">Gestão de perfis de utilizador do módulo financeiro.</p>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Novo Perfil</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Perfis Disponíveis</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Utilizadores</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.numUtilizadores}</TableCell>
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
