import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GuardsCard } from "./GuardsCard";

type MarkingDetailsGuardModalProps = {
  item: string[];
  isOpen: boolean;
  onClose: () => void;
};

export default function MarkingDetailsGuardModal({
  item,
  isOpen,
  onClose,
}: MarkingDetailsGuardModalProps) {
  const closeModal = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl">Vigilantes</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {/* <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar por aluno"
              className="pl-8 w-full bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}
        </DialogDescription>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          <div className="grid grid-cols-2 gap-5">
            {item.map((name, i) => (
              <GuardsCard key={i} item={name} />
            ))}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={closeModal} size="lg">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
