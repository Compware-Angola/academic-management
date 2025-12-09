import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";

export default function TaxaIVA() {
  const mockData = [
    { id: 1, codigo: "IVA14", descricao: "Taxa Normal", percentagem: "14%", status: "Activa" },
    { id: 2, codigo: "IVA0", descricao: "Isento", percentagem: "0%", status: "Activa" },
    { id: 3, codigo: "IVA5", descricao: "Taxa Reduzida", percentagem: "5%", status: "Activa" },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Serv. Tributários (AGT)</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Taxa do IVA</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Configuração de Taxas de IVA</h1>
      <p className="text-muted-foreground">Gestão das taxas de IVA aplicáveis.</p>

      <div className="flex gap-2">
        <Button className="gap-2"><Plus className="h-4 w-4" />Nova Taxa</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Taxas Configuradas</CardTitle></CardHeader>
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
                  <TableCell className="font-semibold">{item.percentagem}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell><Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
