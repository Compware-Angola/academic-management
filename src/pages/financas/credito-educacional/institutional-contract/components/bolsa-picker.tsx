import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useDropDownBolsas } from "@/hooks/dropdown-filters";
import { parseFilter } from "@/util/parse-filter";

export type BolsaSelected = {
    codigo: string;
    designacao: string;
};

type Props = {
    values: BolsaSelected[];
    onChange: (values: BolsaSelected[]) => void;
    max?: number;
    codigoInstituicao?: string;
    disabled?: boolean;
};

function getInitials(nome: string) {
    return nome
        .split(" ")
        .filter((w) => w.length > 2)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
}

export function BolsaPicker({
    values,
    onChange,
    max = 8,
    codigoInstituicao,
    disabled = false,
}: Props) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 400);
    const canFetchBolsas = !disabled && !!codigoInstituicao;
    const { data: bolsas = [], isLoading } = useDropDownBolsas({
        codigoInstituicao: parseFilter(codigoInstituicao),
        designacao: debouncedQuery,

    }, canFetchBolsas);

    const toggle = (codigo: string, designacao: string) => {
        if (values.some((v) => v.codigo === codigo)) {
            onChange(values.filter((v) => v.codigo !== codigo));
        } else if (values.length < max) {
            onChange([...values, { codigo, designacao }]);
        }
    };

    const filteredBolsas = bolsas; // já vem filtrado pelo hook

    return (
        <div className="col-span-full space-y-2">
            <div className="flex items-center justify-between">
                <Label>Bolsas</Label>
                <span className="text-xs text-muted-foreground">
                    Máximo de {max} bolsas
                </span>
            </div>

            <div className="rounded-md border border-border bg-card overflow-hidden">
                {/* Barra de pesquisa */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted">
                    <Search size={14} className="text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Pesquisar bolsas..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        disabled={disabled}
                    />
                    <span className="text-xs text-muted-foreground shrink-0">
                        <span className="text-primary font-medium">{values.length}</span>
                        {" / "}
                        {max} seleccionadas
                    </span>
                </div>

                {/* Grelha de Bolsas */}
                <div className="grid grid-cols-3 max-h-52 overflow-y-auto">
                    {isLoading && (
                        <div className="col-span-3 py-6 text-center text-sm text-muted-foreground">
                            A carregar bolsas...
                        </div>
                    )}

                    {!isLoading && filteredBolsas.length === 0 && (
                        <div className="col-span-3 py-6 text-center text-sm text-muted-foreground">
                            Nenhuma bolsa encontrada
                        </div>
                    )}

                    {!isLoading &&
                        filteredBolsas.map((bolsa) => {
                            const isSelected = values.some((v) => v.codigo === bolsa.codigo.toString());
                            const isDisabled = !isSelected && values.length >= max;

                            return (
                                <div
                                    key={bolsa.codigo}
                                    onClick={() => !isDisabled && toggle(bolsa.codigo.toString(), bolsa.designacao)}
                                    className={cn(
                                        "flex items-center gap-2.5 px-3 py-2.5",
                                        "border-b border-r border-border",
                                        "[&:nth-child(3n)]:border-r-0",
                                        "transition-colors",
                                        isSelected ? "bg-primary/5" : "hover:bg-muted",
                                        isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                                    )}
                                >



                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{bolsa.designacao}</p>
                                        <p className="text-[11px] text-muted-foreground">
                                            Código: {bolsa.codigo}
                                        </p>
                                    </div>

                                    {/* Checkbox */}
                                    <div
                                        className={cn(
                                            "w-4 h-4 rounded shrink-0 flex items-center justify-center",
                                            "border-[1.5px] transition-colors",
                                            isSelected ? "bg-primary border-primary" : "border-border",
                                        )}
                                    >
                                        <Check
                                            size={10}
                                            className={cn(
                                                "text-primary-foreground transition-opacity",
                                                isSelected ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* Chips dos seleccionados */}
                <div className="flex items-center gap-2 flex-wrap px-3 py-2 border-t border-border bg-muted min-h-[42px]">
                    {values.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                            Nenhuma bolsa seleccionada
                        </span>
                    ) : (
                        values.map(({ codigo, designacao }) => (
                            <span
                                key={codigo}
                                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium bg-primary/10 border border-primary/25 text-primary"
                            >
                                <span className="w-[15px] h-[15px] rounded-full bg-primary/20 text-primary text-[8px] font-bold flex items-center justify-center shrink-0">
                                    {getInitials(designacao)}
                                </span>
                                {designacao}
                                <button
                                    type="button"
                                    onClick={() => toggle(codigo, designacao)}
                                    className="opacity-60 hover:opacity-100 transition-opacity flex items-center"
                                    aria-label={`Remover ${designacao}`}
                                >
                                    <X size={10} />
                                </button>
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}