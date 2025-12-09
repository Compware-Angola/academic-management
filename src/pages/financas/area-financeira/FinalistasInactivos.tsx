import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinalistasInactivos() {
  const mockData = [
    { id: 1, estudante: "Carlos Dias", curso: "Engenharia Civil", anoFinal: "2023", pendencia: "TFC não entregue" },
    { id: 2, estudante: "Lucia Fernandes", curso: "Administração", anoFinal: "2022", pendencia: "Propinas em atraso" },
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
          <BreadcrumbItem><BreadcrumbPage>Estud. Finalistas Inactivos</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Estudantes Finalistas Inactivos</h1>
      <p className="text-muted-foreground">Finalistas com situação pendente ou inactiva.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Nome do estudante" />
            <Select><SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Ano Final" /></SelectTrigger><SelectContent><SelectItem value="2023">2023</SelectItem><SelectItem value="2022">2022</SelectItem></SelectContent></Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Atualizar</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Finalistas Inactivos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudante</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Ano Final</TableHead>
                <TableHead>Pendência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.anoFinal}</TableCell>
                  <TableCell>{item.pendencia}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
