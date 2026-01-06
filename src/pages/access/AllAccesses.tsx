import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQueryAcessos } from "@/hooks/acess/use-query-all-accesses";


export  function ListarAcessos() {
  const { id } = useParams();
  const grupoId =  id ? Number(id) : undefined;

  //console.log("Utilizador Id: ", utilizadorId)
  //console.log("Grupo Id", grupoId)

  const { data: acessos, isLoading } = useQueryAcessos({
    grupoId,
    apenasAtivos: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Todos Acessos"  
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Designação</TableHead>
              <TableHead>Sigla</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  A carregar...
                </TableCell>
              </TableRow>
            ) : acessos && acessos.length > 0 ? (
              acessos.map((acesso) => (
                <TableRow key={acesso.id}>
                  <TableCell>{acesso.id}</TableCell>
                  <TableCell>{acesso.designacao}</TableCell>
                  <TableCell>{acesso.sigla}</TableCell>
                  <TableCell>{acesso.moduloNome}</TableCell>
                  <TableCell>{acesso.tipoAcesso}</TableCell>
                  <TableCell>
                    <Badge variant={acesso.ativo ? "default" : "secondary"}>
                      {acesso.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum acesso encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
