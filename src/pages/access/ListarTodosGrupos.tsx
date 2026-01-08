import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {  ChevronLeft, ChevronRight, Key } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryGrupos } from "@/hooks/acess/use-query-grupos";

const estadosAtivo = [
  { codigo: "true", designacao: "Ativo" },
  { codigo: "false", designacao: "Inativo" },
  { codigo: "all", designacao: "Todos" }
];

type FiltroUsuario = {
  ativo?: "true" | "false";
};



export default function ListarGrupos() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState<FiltroUsuario>({
    ativo: "true"
  })
  
  //console.log("Filtro: ", filtro)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const {data: grupos} = useQueryGrupos(filtro)
  
  //console.log("Grupos: ", grupos)

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isGruposEmpty = grupos ?? [];

  const totalPages =  Math.ceil(isGruposEmpty.length / itemsPerPage);

  const paginatedData = isGruposEmpty.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  return (
    <div className="space-y-6">


      <PageHeader
        title="Listar grupos"
        subtitle="Visualize e gerencie grupos do sistema"
      />

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <FormSelect label="Estado"
              options={estadosAtivo}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo
              })}
              
                value={filtro.ativo ?? "all"}

              onChange={(value) =>
  setFiltro({
    ativo: value === "all" ? undefined : value as "true" | "false",

  })
}

              />
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Grupo</TableHead>
                <TableHead className="font-semibold">Designação</TableHead>
                <TableHead className="font-semibold">Sigla</TableHead>
                <TableHead className="font-semibold">Tipo de grupo</TableHead>
                <TableHead className="font-semibold">Stado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((grupo) => (
                  <TableRow 
                    key={grupo.pkGrupo}
                    className={`hover:cursor-pointer ${
                    selectedGroupId === grupo.pkGrupo ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedGroupId(grupo.pkGrupo)}
                  >
                    <TableCell>{grupo.pkGrupo}</TableCell>
                    <TableCell className="font-medium">{grupo.designacao}</TableCell>
                    <TableCell>{grupo.sigla}</TableCell>
                    <TableCell>{grupo.fkTipoDeGrupo}</TableCell>
                     <TableCell>
                          <Button
                            variant="link"
                            onClick={() => navigate(`/grupo/${grupo.pkGrupo}/acessos`)}
                            >
                            Ver Acessos
                          </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
