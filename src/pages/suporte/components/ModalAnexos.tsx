// components/suporte/ModalAnexos.tsx
import { Download, Image as ImageIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalAnexosProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    solicitacao: any; // use o tipo real
    onDownload: (fileName: string) => void;
}

export function ModalAnexos({ open, onOpenChange, solicitacao, onDownload }: ModalAnexosProps) {
    if (!solicitacao) return null;

    const temAnexo = (n: 1 | 2 | 3) => {
        const key = `file_name${n}` as keyof typeof solicitacao;
        return !!solicitacao[key];
    };

    const getNomeArquivo = (n: 1 | 2 | 3) => {
        const key = `file_name${n}` as keyof typeof solicitacao;
        return solicitacao[key] as string | undefined;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Anexos da Solicitação #{solicitacao?.contactos_id || "—"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-4">
                    {[1, 2, 3].map((n) => {
                        const nomeArquivo = getNomeArquivo(n as 1 | 2 | 3);
                        if (!nomeArquivo) return null;
                        return (
                            <div
                                key={n}
                                className="flex items-center justify-between gap-3 p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <ImageIcon className="h-5 w-5 text-primary shrink-0" />
                                    <p className="text-sm font-medium truncate">{nomeArquivo}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => onDownload(nomeArquivo)}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    })}
                    {![1, 2, 3].some((n) => temAnexo(n as 1 | 2 | 3)) && (
                        <p className="text-center text-muted-foreground py-6">Nenhum anexo encontrado</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}