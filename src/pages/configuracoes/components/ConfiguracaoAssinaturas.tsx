import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, PenTool, Plus, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { DOCUMENT_TYPES, DocumentSignatureMap, Signature, SignatureInput } from "@/lib/settingsApi";
import {
  useCreateSignature, useDeleteSignature, useToggleSignature, useUpdateSignature,
} from "@/hooks/useSettings";
import { AssinaturaFormDialog } from "./AssinaturaFormDialog";

interface Props {
  signatures: Signature[];
  isLoading?: boolean;
  documentSignatures: DocumentSignatureMap;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });

export function ConfiguracaoAssinaturas({ signatures, isLoading, documentSignatures }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Signature | null>(null);
  const [toDelete, setToDelete] = useState<Signature | null>(null);

  const create = useCreateSignature();
  const update = useUpdateSignature();
  const toggle = useToggleSignature();
  const remove = useDeleteSignature();

  const usedIn = (id: string) =>
    DOCUMENT_TYPES.filter((d) => documentSignatures[d.id] === id).map((d) => d.label);

  const handleSubmit = async (data: SignatureInput) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data });
        toast.success("Assinatura actualizada com sucesso.");
      } else {
        await create.mutateAsync(data);
        toast.success("Assinatura adicionada com sucesso.");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch {
      toast.error("Não foi possível guardar a assinatura.");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success("Assinatura removida.");
    } catch {
      toast.error("Não foi possível remover a assinatura.");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <PenTool className="h-4 w-4 text-primary" />
            Assinaturas dos documentos
          </CardTitle>
          <CardDescription>
            Configure as assinaturas que poderão ser utilizadas nos documentos gerados pelo sistema.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar assinatura
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Responsável</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Assinatura</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead>Criada</TableHead>
                <TableHead>Actualizada</TableHead>
                <TableHead className="text-right">Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : signatures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <PenTool className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">Nenhuma assinatura cadastrada</p>
                    <p className="text-sm text-muted-foreground">
                      Adicione a primeira assinatura para a utilizar nos documentos.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                signatures.map((s) => (
                  <TableRow key={s.id} className={s.isActive ? "" : "opacity-60"}>
                    <TableCell>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </TableCell>
                    <TableCell>{s.position}</TableCell>
                    <TableCell>{s.department}</TableCell>
                    <TableCell>
                      <img src={s.imageUrl} alt={`Assinatura de ${s.name}`} className="h-10 object-contain" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Switch
                          checked={s.isActive}
                          onCheckedChange={(v) => {
                            toggle.mutate({ id: s.id, isActive: v });
                            toast.success(`Assinatura ${v ? "activada" : "desactivada"}.`);
                          }}
                        />
                        <Badge variant={s.isActive ? "default" : "secondary"} className="text-[10px]">
                          {s.isActive ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(s.createdAt)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fmt(s.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon"
                          onClick={() => { setEditing(s); setDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setToDelete(s)}>
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
      </CardContent>

      <AssinaturaFormDialog
        open={dialogOpen}
        onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}
        signature={editing}
        onSubmit={handleSubmit}
        isSaving={create.isPending || update.isPending}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover assinatura?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  A assinatura de <strong>{toDelete?.name}</strong> será removida permanentemente.
                </p>
                {toDelete && usedIn(toDelete.id).length > 0 && (
                  <p className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2 text-destructive">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      Esta assinatura está associada a: {usedIn(toDelete.id).join(", ")}. Estes
                      documentos ficarão sem assinatura configurada.
                    </span>
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}