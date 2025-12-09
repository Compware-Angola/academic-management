import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";

export default function BloquearUtilizador() {
  const mockData = [
    { id: 1, username: "tesouraria2", nome: "Pedro Costa", dataBloqueio: "2024-01-10", motivo: "Inactividade" },
    { id: 2, username: "consulta3", nome: "Ana Ferreira", dataBloqueio: "2024-01-05", motivo: "Solicitação" },
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
          <BreadcrumbItem><BreadcrumbPage>Bloquear Utilizador</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Bloquear/Desbloquear Utilizadores</h1>
      <p className="text-muted-foreground">Gestão de bloqueios de acesso ao sistema.</p>

      <Card>
        <CardHeader><CardTitle>Pesquisar Utilizador</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Username ou nome" className="max-w-md" />
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Utilizadores Bloqueados</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Data Bloqueio</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.username}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.dataBloqueio}</TableCell>
                  <TableCell>{item.motivo}</TableCell>
                  <TableCell><Button size="sm" variant="outline" className="gap-1"><Unlock className="h-3 w-3" />Desbloquear</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
