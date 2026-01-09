import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { useQueryListarCargosAdministrativo } from "@/hooks/controle-acesso/use-query-listar-cargos-administrativos";

const tiposCargo = [
  { id: 1, descricao: "Reitor" },
  { id: 2, descricao: "Vice-Reitor" },
  { id: 3, descricao: "Decano" },
  { id: 4, descricao: "Vice-Decano" },
  { id: 5, descricao: "Diretor de Curso" },
];
export function TabContentAll() {
  const { data: cargos = [], isLoading: isLoadingCargos } =
    useQueryListarCargosAdministrativo({});
  const [filtroCargo, setFiltroCargo] = useState("todos");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <TabsContent value="todos" className="mt-4">
      <div className="space-y-4">
        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
          <div className="w-full space-y-2 lg:w-64">
            <label className="text-sm font-medium text-foreground">Cargo</label>
            <Select value={filtroCargo} onValueChange={setFiltroCargo}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Cargos</SelectItem>
                {tiposCargo.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Utilizador</TableHead>
                <TableHead>Faculdade</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCargos ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : cargos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Nenhum registo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                cargos.map((item) => (
                  <TableRow key={item.pkCargo}>
                    <TableCell className="font-mono text-sm">
                      {item.pkCargo}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{item.tipoCargoDescricao}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.utilizadorNome}
                    </TableCell>
                    <TableCell>{item.faculdadeNome || "-"}</TableCell>
                    <TableCell>{item.cursoNome || "-"}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"}>
                        {item.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TabsContent>
  );
}
