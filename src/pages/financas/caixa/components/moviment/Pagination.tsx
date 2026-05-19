import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Componente de paginação
export const Pagination = ({
    currentPage,
    totalPages,
    total,
    limit,
    onPreviousPage,
    onNextPage,
}: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
    onPreviousPage: () => void;
    onNextPage: () => void;
}) => {
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, total);

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Mostrando {start} - {end} de {total} resultados
            </p>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};