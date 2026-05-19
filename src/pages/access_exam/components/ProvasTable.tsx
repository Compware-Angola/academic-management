import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProvaResumo } from "@/services/access_exam/provas.service";
import { plainTextFromHtml } from "@/util/prova-text-format";

function statusLabel(status?: number) {
  return status === 1 ? "Activo" : "Inactivo";
}

function statusVariant(status?: number): "default" | "secondary" {
  return status === 1 ? "default" : "secondary";
}

type ProvasTableProps = {
  provas: ProvaResumo[];
  isLoading: boolean;
  onView: (id: number) => void;
  onEdit: (prova: ProvaResumo) => void;
  onDelete: (prova: ProvaResumo) => void;
};

export function ProvasTable({
  provas,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: ProvasTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ano Letivo</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="py-12 text-center">
                <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  A carregar provas...
                </span>
              </TableCell>
            </TableRow>
          ) : provas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-12 text-center text-muted-foreground"
              >
                Nenhuma prova encontrada.
              </TableCell>
            </TableRow>
          ) : (
            provas.map((prova) => (
              <TableRow key={prova.id}>
                <TableCell className="font-mono font-semibold">
                  {prova.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {plainTextFromHtml(prova.descricao)}
                  </div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {plainTextFromHtml(prova.texto) || "Sem texto/instruções"}
                  </div>
                </TableCell>
                <TableCell>{prova.ano_letivo}</TableCell>
                <TableCell>{prova.duracao} min</TableCell>
                <TableCell>{prova.usuario}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline">
                      {prova.perguntas?.length ?? 0} perguntas
                    </Badge>
                    <Badge variant="outline">
                      {prova.cursos?.length ?? 0} cursos
                    </Badge>
                    <Badge variant="outline">
                      {prova.disciplinas?.length ?? 0} disciplinas
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(prova.status_)}>
                    {statusLabel(prova.status_)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Ver detalhes"
                      onClick={() => onView(prova.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Editar"
                      onClick={() => onEdit(prova)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Eliminar"
                      onClick={() => onDelete(prova)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
