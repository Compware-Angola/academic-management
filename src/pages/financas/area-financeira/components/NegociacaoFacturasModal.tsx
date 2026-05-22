import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { NegociacaoItem } from "@/services/financas/area-financeira/fetch-negociacao-dividas.service";
import { formatNumber } from "@/util/format-number";
import { formatarData } from "@/util/date-formate";
import { NegociacaoDividaModal } from "./NegociacaoDividaModal";
import { useState } from "react";

interface NegociacaoFacturasModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNegociacao: NegociacaoItem | null;
}

export const NegociacaoFacturasModal = ({
  isOpen,
  onClose,
  selectedNegociacao,
}: NegociacaoFacturasModalProps) => {
  const [selectedFacturaCodigo, setSelectedFacturaCodigo] = useState<
    number | null
  >(null);

  if (!selectedNegociacao) return null;

  const facturas =
    selectedNegociacao.facturas && selectedNegociacao.facturas.length > 0
      ? selectedNegociacao.facturas
      : selectedNegociacao.codigo_factura
        ? [{ codigo: selectedNegociacao.codigo_factura }]
        : [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Facturas
            </DialogTitle>
          </DialogHeader>

          {facturas.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              Nenhuma factura encontrada.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Código Factura</TableHead>
                  <TableHead className="text-right">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facturas.map((f, i) => (
                  <TableRow key={f.codigo}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-mono">{f.codigo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedFacturaCodigo(f.codigo)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <NegociacaoDividaModal
        isModalOpen={!!selectedFacturaCodigo}
        setIsModalOpen={() => setSelectedFacturaCodigo(null)}
        selectedNegociacao={
          selectedFacturaCodigo
            ? { ...selectedNegociacao, codigo_factura: selectedFacturaCodigo }
            : null
        }
      />
    </>
  );
};
