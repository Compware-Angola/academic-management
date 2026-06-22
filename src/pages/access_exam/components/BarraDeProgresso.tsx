
import { Loader2 } from "lucide-react";


export function BarraDeProgresso() {
    return (
        <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-sm text-amber-800 font-medium">
                A prova está a ser corrigida — aguarde até ao término do evento.
            </p>
            <Loader2 className="h-4 w-4 animate-spin" />
        </div>
    );
}