import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home} from "lucide-react";
import { Link } from "react-router-dom";

export function FormaPagamentoPage() {


  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Forma de Pagamento</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Forma de Pagamento</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Forma de Pagamento</h1>
      <Card>
        <CardHeader><CardTitle>Forma de Pagamento</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Total Entradas</TableHead>
                <TableHead>Total Saídas</TableHead>
                <TableHead>Saldo Final</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            {/* <TableBody>
              {mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.data}</TableCell>
                  <TableCell className="text-green-600">{item.totalEntradas}</TableCell>
                  <TableCell className="text-red-600">{item.totalSaidas}</TableCell>
                  <TableCell className="font-semibold">{item.saldoFinal}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody> */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
