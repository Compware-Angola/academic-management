import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function EstudantesDiplomados() {
  const mockData = [
    { id: 1, numero: "2020001", nome: "Carlos Dias", curso: "Engenharia Civil", anoConclusao: "2024", media: "15.5" },
    { id: 2, numero: "2019002", nome: "Lucia Fernandes", curso: "Administração", anoConclusao: "2023", media: "16.2" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Confirmações e Matrículas</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Listar Estudantes Diplomados</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Estudantes Diplomados</h1>
      <p className="text-muted-foreground">Lista de estudantes que concluíram o curso.</p>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Nome do estudante" />
            <Select><SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Ano Conclusão" /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select>
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Diplomados</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Ano Conclusão</TableHead>
                <TableHead>Média Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.numero}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.curso}</TableCell>
                  <TableCell>{item.anoConclusao}</TableCell>
                  <TableCell>{item.media}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
