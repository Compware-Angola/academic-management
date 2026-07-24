import { Download, Loader2, X, FileText, GraduationCap, Camera, Receipt, File, CircleCheck, Clock, CircleX } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { PosGraduationCandidate } from "@/services/post-graduation/candidates.service";
import { useQueryCandidateDocuments } from "@/hooks/post-graduation/use-query-candidates";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { viewFile } from "@/services/upload/upload-single.service";
import { toast } from "sonner";
import { ApiError } from "@/error";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidate: PosGraduationCandidate | null;
};

const DOC_ICONS: Record<string, React.ReactNode> = {
    bilhete: <FileText className="h-4 w-4" />,
    certificado: <GraduationCap className="h-4 w-4" />,
    foto: <Camera className="h-4 w-4" />,
    comprovativo: <Receipt className="h-4 w-4" />,
};

function getDocIcon(descricao: string) {
    const key = Object.keys(DOC_ICONS).find((k) =>
        descricao.toLowerCase().includes(k),
    );
    return key ? DOC_ICONS[key] : <File className="h-4 w-4" />;
}

const META_FIELDS = [
    { label: "Nº inscrição", key: "codigo_preinscricao" },
    { label: "Telefone", key: "contactos_telefonicos" },
    { label: "Gênero", key: "sexo" },
    { label: "Natureza", key: "candidatura" },
    { label: "Curso", key: "curso_candidatura" },
    { label: "Ano lectivo", key: "ano_lectivo" },
] as const;

export function CandidateDetailsDialog({
    open,
    onOpenChange,
    candidate,
}: Props) {
    const { data: documents, isLoading } = useQueryCandidateDocuments(
        candidate?.codigo_preinscricao,
    );
    const handleDownload = async (ficheiroName: string) => {
        if (!ficheiroName) return;
        try {
            const blob = await viewFile(ficheiroName);
            const fileUrl = URL.createObjectURL(blob);
            window.open(fileUrl, "_blank");
            setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
        } catch (error) {
            toast.error(
                error instanceof ApiError ? error.message : "Erro ao abrir o ficheiro.",
            );
        }
    };
    const canApprove =
        candidate?.estado === "Pendente" &&
        candidate?.pagamento_realizado === 1;

    const isPaid = Boolean(candidate?.pagamento_realizado);


    function handleApproveCandidate() {
        if (!candidate) return;

    }

    function handleRejectCandidate() {
        if (!candidate) return;

    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl! gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-6 py-5 border-b">
                    <DialogTitle className="text-sm font-medium">
                        Detalhes do candidato
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                        {candidate?.nome_completo}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div className="grid grid-cols-3 border rounded-md overflow-hidden text-sm">
                        {META_FIELDS.map(({ label, key }, i) => (
                            <div
                                key={key}
                                className={cn(
                                    "px-4 py-3 border-b",
                                    i % 3 !== 2 && "border-r",
                                    i >= META_FIELDS.length - 3 && "border-b-0",
                                )}
                            >
                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                                    {label}
                                </p>
                                <p className="font-medium truncate">
                                    {candidate?.[key] ?? "—"}
                                </p>
                            </div>
                        ))}

                        {/* Estado */}
                        <div className="px-4 py-3 border-r">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                                Estado
                            </p>
                            <Badge
                                variant="outline"
                                className="gap-1 text-yellow-600 border-yellow-300 bg-yellow-50 text-xs font-medium"
                            >
                                <Clock className="h-3 w-3" />
                                {candidate?.estado ?? "—"}
                            </Badge>
                        </div>

                        {/* Pagamento */}
                        <div className="px-4 py-3 col-span-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                                Pagamento
                            </p>
                            <span
                                className={cn(
                                    "inline-flex items-center gap-1 text-sm font-medium",
                                    isPaid ? "text-green-600" : "text-destructive",
                                )}
                            >
                                <CircleCheck className="h-3.5 w-3.5" />
                                {isPaid ? "Pago" : "Não pago"}
                            </span>
                        </div>
                    </div>

                    {/* Documents list */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                            Documentos enviados
                        </p>

                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        ) : documents?.length ? (
                            documents.map((document) => (
                                <div
                                    key={document.nome_arquivo}
                                    className="flex items-center gap-3 px-4 py-3 rounded-md border hover:bg-muted/40 transition-colors"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 shrink-0">
                                        {getDocIcon(document.descricao)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {document.descricao}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {document.nome_arquivo}
                                        </p>
                                    </div>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                aria-label="Baixar documento"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-foreground shrink-0"
                                                onClick={() =>
                                                    handleDownload(document.nome_arquivo)
                                                }
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                            </Button>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            <p>Baixar documento</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-sm text-muted-foreground border rounded-md">
                                Nenhum documento encontrado.
                            </div>
                        )}
                    </div>
                </div>
                {canApprove && (
                    <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
                        <p className="text-xs text-muted-foreground">
                            {documents?.length ?? 0} documento
                            {documents?.length !== 1 ? "s" : ""} · pagamento confirmado
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                onClick={handleRejectCandidate}
                            >
                                <CircleX className="h-4 w-4" />
                                Reprovar
                            </Button>
                            <Button
                                size="sm"
                                className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleApproveCandidate}
                            >
                                <CircleCheck className="h-4 w-4" />
                                Aprovar
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}