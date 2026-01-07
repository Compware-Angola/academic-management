import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAcessosUtilizador } from "@/hooks/acess/use-acessos-utilizador"


export  function UtilizadorAcessos() {
  const { data: acessos = [], isLoading } = useAcessosUtilizador()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(acessos.length / itemsPerPage)

  const paginatedData = acessos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Acessos do utilizador"      
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Designação</TableHead>
              <TableHead>Sigla</TableHead>
              <TableCell>Modulo nome</TableCell>
              <TableHead>Módulo id</TableHead>
              
              <TableHead>Tipo de Acesso</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum acesso encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((acesso) => (
                <TableRow key={acesso.id}>
                  <TableCell>{acesso.id}</TableCell>
                  <TableCell className="font-medium">
                    {acesso.designacao}
                  </TableCell>
                  <TableCell>{acesso.sigla}</TableCell>
                  <TableCell>{acesso.moduloNome}</TableCell>
                  <TableCell>{acesso.moduloId}</TableCell>
                  <TableCell>{acesso.tipoAcessO}</TableCell>
                  <TableCell>
                    <Badge variant={acesso.ativo ? "default" : "secondary"}>
                      {acesso.ativo ? "Ativo" : "Inativo"}
                    </Badge>
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
  )
}
