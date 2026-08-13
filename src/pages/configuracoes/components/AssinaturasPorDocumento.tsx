import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FileSignature } from "lucide-react";
import { DOCUMENT_TYPES, DocumentSignatureMap, Signature } from "@/lib/settingsApi";

interface Props {
  signatures: Signature[];
  value: DocumentSignatureMap;
  onChange: (value: DocumentSignatureMap) => void;
  isLoading?: boolean;
  previewDocument: string;
  onPreviewDocumentChange: (id: string) => void;
}

const NONE = "__none__";

export function AssinaturasPorDocumento({
  signatures, value, onChange, isLoading, previewDocument, onPreviewDocumentChange,
}: Props) {
  const active = signatures.filter((s) => s.isActive);

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-5 w-64" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileSignature className="h-4 w-4 text-primary" />
          Assinaturas por tipo de documento
        </CardTitle>
        <CardDescription>
          Apenas assinaturas activas podem ser seleccionadas. Clique numa linha para pré-visualizar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de documento</TableHead>
                <TableHead>Assinatura</TableHead>
                <TableHead className="w-[280px]">Configurar assinatura</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOCUMENT_TYPES.map((doc) => {
                const sig = signatures.find((s) => s.id === value[doc.id]);
                return (
                  <TableRow
                    key={doc.id}
                    className={previewDocument === doc.id ? "bg-muted/50" : "cursor-pointer"}
                    onClick={() => onPreviewDocumentChange(doc.id)}
                  >
                    <TableCell className="font-medium">{doc.label}</TableCell>
                    <TableCell>
                      {sig ? (
                        <div className="flex items-center gap-3">
                          <img src={sig.imageUrl} alt={`Assinatura de ${sig.name}`} className="h-8 object-contain" />
                          <div>
                            <p className="text-sm font-medium">{sig.name}</p>
                            <p className="text-xs text-muted-foreground">{sig.position}</p>
                          </div>
                        </div>
                      ) : (
                        <Badge variant="secondary">Sem assinatura</Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={value[doc.id] ?? NONE}
                        onValueChange={(v) => onChange({ ...value, [doc.id]: v === NONE ? null : v })}
                      >
                        <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>Sem assinatura</SelectItem>
                          {active.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name} — {s.position}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {active.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            Não existem assinaturas activas. Active ou adicione uma assinatura para a associar a documentos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}