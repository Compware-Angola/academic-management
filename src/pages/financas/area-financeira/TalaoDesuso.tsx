import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function TalaoDesuso() {
  const mockData = [
    { id: 1, numeroTalao: "T2024001", dataEmissao: "2024-01-10", motivo: "Cancelamento", usuario: "Admin" },
    { id: 2, numeroTalao: "T2024002", dataEmissao: "2024-01-08", motivo: "Erro de emissão", usuario: "Tesouraria" },
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
          <BreadcrumbItem><BreadcrumbPage>Talão em Desuso</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Talão em Desuso</h1>
      <p className="text-muted-foreground">Gestão de talões cancelados ou em desuso.</p>

      <Card>
        <CardHeader><CardTitle>Pesquisar Talão</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input placeholder="Número do talão" className="max-w-md" />
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lista de Talões em Desuso</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Talão</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Utilizador</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.numeroTalao}</TableCell>
                  <TableCell>{item.dataEmissao}</TableCell>
                  <TableCell>{item.motivo}</TableCell>
                  <TableCell>{item.usuario}</TableCell>
                  <TableCell><Button size="sm" variant="destructive" className="gap-1"><Trash2 className="h-3 w-3" />Remover</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
