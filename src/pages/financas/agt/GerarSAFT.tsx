import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function GerarSAFT() {
  const mockData = [
    { id: 1, periodo: "Janeiro/2024", dataGeracao: "2024-02-01", status: "Gerado", ficheiro: "SAFT_202401.xml" },
    { id: 2, periodo: "Dezembro/2023", dataGeracao: "2024-01-02", status: "Enviado AGT", ficheiro: "SAFT_202312.xml" },
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
          <BreadcrumbItem><BreadcrumbPage>Gerar SAFT</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Gerar Ficheiro SAFT</h1>
      <p className="text-muted-foreground">Geração do ficheiro SAFT para submissão à AGT.</p>

      <Card>
        <CardHeader><CardTitle>Gerar Novo SAFT</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select><SelectTrigger><SelectValue placeholder="Mês" /></SelectTrigger><SelectContent><SelectItem value="01">Janeiro</SelectItem><SelectItem value="02">Fevereiro</SelectItem></SelectContent></Select>
            <Select><SelectTrigger><SelectValue placeholder="Ano" /></SelectTrigger><SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent></Select>
            <Button className="gap-2"><FileText className="h-4 w-4" />Gerar SAFT</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Histórico de SAFT</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead>Data Geração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ficheiro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.periodo}</TableCell>
                  <TableCell>{item.dataGeracao}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="font-mono text-sm">{item.ficheiro}</TableCell>
                  <TableCell><Button size="sm" variant="outline" className="gap-1"><Download className="h-3 w-3" />Download</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
