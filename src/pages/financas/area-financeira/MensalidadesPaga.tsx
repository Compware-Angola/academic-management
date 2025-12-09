import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download, RefreshCw, Printer } from "lucide-react";
import { Link } from "react-router-dom";

export default function MensalidadesPaga() {
  const mockData = [
    { id: 1, estudante: "Ana Silva", curso: "Engenharia Informática", valor: "45.000 Kz", data: "2024-01-15", referencia: "REF001" },
    { id: 2, estudante: "Pedro Santos", curso: "Direito", valor: "42.000 Kz", data: "2024-01-14", referencia: "REF002" },
    { id: 3, estudante: "Maria Costa", curso: "Medicina", valor: "65.000 Kz", data: "2024-01-13", referencia: "REF003" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Área Financeira</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Estud. Mensalidades Paga</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Estudantes com Mensalidades Pagas</h1>
      <p className="text-muted-foreground">Consultar estudantes com mensalidades regularizadas.</p>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Nome do estudante" />
            <Select><SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Ano Lectivo" /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem></SelectContent></Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Atualizar</Button>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Excel</Button>
        <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Imprimir</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de Estudantes</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudante</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead>Referência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.estudante}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.valor}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.referencia}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
