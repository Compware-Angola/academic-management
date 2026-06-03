// components/suporte/Paginacao.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginacaoProps {
    currentPage: number;
    totalPages: number;
    total: number;
    itemsCount: number;
    onPageChange: (page: number) => void;
}

export function Paginacao({
    currentPage,
    totalPages,
    total,
    itemsCount,
    onPageChange,
}: PaginacaoProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
                Mostrando {itemsCount} de {total} • Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Próxima <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}