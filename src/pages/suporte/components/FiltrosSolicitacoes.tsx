// components/suporte/FiltrosSolicitacoes.tsx
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FiltrosSolicitacoesProps {
    enableSearch?: boolean;
    searchTerm?: string;
    setSearchTerm?: (value: string) => void;
    tipoSuporte: number | undefined;
    setTipoSuporte: (value: number | undefined) => void;
    status: string | undefined;
    setStatus: (value: string | undefined) => void;
    tiposSuporte: Array<{ id: number; descricao: string }>;
    onFiltrar: () => void;
    onLimpar: () => void;
}

export function FiltrosSolicitacoes({
    enableSearch = true,
    searchTerm = "",
    setSearchTerm,
    tipoSuporte,
    setTipoSuporte,
    status,
    setStatus,
    tiposSuporte,
    onFiltrar,
    onLimpar,
}: FiltrosSolicitacoesProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col gap-4">

                    {/* ===================== FILTROS ===================== */}
                    <div className={cn("grid gap-4", enableSearch ? "md:grid-cols-3" : "md:grid-cols-2")}>

                        {/* SEARCH (OPCIONAL) */}
                        {enableSearch && setSearchTerm && (
                            <div className="space-y-1.5 md:col-span-1">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Pesquisa
                                </label>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

                                    <Input
                                        placeholder="Estudante, BI, assunto..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-9"
                                    />

                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TIPO SUPORTE */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">
                                Tipo de Serviço
                            </label>

                            <Select
                                value={tipoSuporte?.toString() ?? "all"}
                                onValueChange={(v) =>
                                    setTipoSuporte(v === "all" ? undefined : Number(v))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os tipos" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">Todos os tipos</SelectItem>
                                    {tiposSuporte.map((t) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.descricao}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* STATUS */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-muted-foreground">
                                Estado
                            </label>

                            <Select
                                value={status ?? "all"}
                                onValueChange={(v) =>
                                    setStatus(v === "all" ? undefined : v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos os estados" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>

                                    <SelectItem value="a responder">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                                            A Responder
                                        </div>
                                    </SelectItem>

                                    <SelectItem value="aguarda resposta">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            Aguarda Resposta
                                        </div>
                                    </SelectItem>

                                    <SelectItem value="respondido">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                            Respondido
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ===================== BADGES + ACTIONS ===================== */}
                    <div className="flex items-center justify-between gap-3">

                        <div className="flex items-center gap-2 flex-wrap">

                            {enableSearch && searchTerm && setSearchTerm && (
                                <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                                    Pesquisa: "{searchTerm}"
                                    <button onClick={() => setSearchTerm("")}>
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </span>
                            )}

                            {tipoSuporte !== undefined && (
                                <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                                    Tipo:{" "}
                                    {tiposSuporte.find((t) => t.id === tipoSuporte)?.descricao}
                                    <button onClick={() => setTipoSuporte(undefined)}>
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </span>
                            )}

                            {status && (
                                <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                                    Estado: {status}
                                    <button onClick={() => setStatus(undefined)}>
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" onClick={onLimpar} size="sm">
                                <X className="mr-2 h-4 w-4" />
                                Limpar
                            </Button>

                            <Button onClick={onFiltrar} size="sm">
                                <Search className="mr-2 h-4 w-4" />
                                Filtrar
                            </Button>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}