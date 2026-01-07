import { useState } from "react";
import {  Eye, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQueryLogsAccesses } from "@/hooks/acess/use-query-logs-accesses";

type FiltersLogs = {
  dataInicio: string,
  dataFim: string
}

export default function LogsAcessos() {
  const [filters, setFilters] = useState<FiltersLogs>({
    dataInicio: "",
    dataFim: ""
  })

   const [paramsPesquisa, setParamsPesquisa] = useState<typeof filters | null>(null);

 
  const {data:logs, isLoading} = useQueryLogsAccesses(paramsPesquisa)

  const handlePesquisar = () => {

     if (!filters.dataInicio || !filters.dataFim) return;

      setParamsPesquisa(filters); 
      
  }

  const handleInputChange = (field: keyof FiltersLogs, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  //console.log("Logs accesses: ", logs) 

  const logsFilters = logs ?? [];


  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Logs de Acessos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Logs de Acessos</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="DataInicio">Data Inicio</Label>
          <Input 
            type="date" 
            id="dataInicio"
            value={filters.dataInicio}
            onChange={(e) => handleInputChange("dataInicio", e.target.value)}
            className="bg-background" 
            />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="DataFim">Data Fim</Label>
          <Input 
            type="date" 
            id="dataFim"
            onChange={(e) => handleInputChange("dataFim", e.target.value)} 
            value={filters.dataFim}
            className="bg-background" />
        </div>

        <div>
          <Button onClick={handlePesquisar}>
              <SearchX className="mr-2 h-4 w-4" />
              Pesquisar
          </Button>
        </div>

      </div>


      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Descrição</TableHead>
              <TableHead>FkAcesso</TableHead>
              <TableHead>FkFuncionalidade</TableHead>
              <TableHead>FkGrupoAfetado</TableHead>
              <TableHead>FkOperaçãoLog</TableHead>
              <TableHead>FkUtilizadorResponsável</TableHead>
              <TableHead>Ip</TableHead>
              <TableHead className="text-right">PkLogAcesso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : logsFilters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              logsFilters.map((item) => (
                <TableRow key={item.pkLogAcesso}>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.fkAcesso}</TableCell>
                  <TableCell>{item.fkFuncionalidade}</TableCell>
                  <TableCell>{item.fkGrupoAfetado}</TableCell>
                  <TableCell>{item.fkOperacaoLog}</TableCell>
                  <TableCell>{item.fkUtilizadorResponsavel}</TableCell>
                  <TableCell className="font-mono text-sm">{item.ip}</TableCell>
                  <TableCell>{item.pkLogAcesso}</TableCell>
                  
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
