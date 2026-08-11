import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQueryDropdownDisciplines } from "@/hooks/study_plan/use-query-dropdown-disciplines";

export type DisciplinaSelected = {
  id: number;
  designacao: string;
  sigla?: string;
};

type Props = {
  values: DisciplinaSelected[];
  onChange: (values: DisciplinaSelected[]) => void;
  max?: number;
};

export function DisciplinaMultiSelectPicker({ values, onChange, max }: Props) {
  const [query, setQuery] = useState("");
  const { data: disciplines = [], isLoading: loading } =
    useQueryDropdownDisciplines();

  const filtered = disciplines.filter((d) => {
    const term = query.toLowerCase();
    return (
      d.desginacao.toLowerCase().includes(term) ||
      d.sigla?.toLowerCase().includes(term)
    );
  });

  const isMaxReached = max !== undefined && values.length >= max;

  const toggle = (id: number, designacao: string, sigla?: string) => {
    if (values.some((v) => v.id === id)) {
      onChange(values.filter((v) => v.id !== id));
    } else if (!isMaxReached) {
      onChange([...values, { id, designacao, sigla }]);
    }
  };

  return (
    <div className="col-span-full space-y-2">
      <div className="flex items-center justify-between">
        <Label>Disciplinas</Label>
        <span className="text-xs text-muted-foreground">
          {max ? `Máximo de ${max} disciplinas` : "Selecção múltipla"}
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
            placeholder="Pesquisar por nome ou sigla..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground shrink-0">
            <span className="text-primary font-medium">{values.length}</span>
            {max ? ` / ${max}` : ""} selecionadas
          </span>
        </div>

        {/* Lista de disciplinas */}
        <div className="flex flex-col max-h-64 overflow-y-auto">
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              A carregar disciplinas...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nenhuma disciplina encontrada
            </div>
          )}

          {!loading &&
            filtered.map((d) => {
              const isSelected = values.some((v) => v.id === d.codigo);
              const isDisabled = !isSelected && isMaxReached;

              return (
                <div
                  key={d.codigo}
                  onClick={() =>
                    !isDisabled && toggle(d.codigo, d.desginacao, d.sigla)
                  }
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5",
                    "border-b border-border last:border-b-0",
                    "transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted",
                    isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer",
                  )}
                >
                  {/* Sigla como badge */}
                  <div
                    className={cn(
                      "w-11 h-8 rounded flex items-center justify-center shrink-0",
                      "text-[10px] font-semibold border px-1",
                      isSelected
                        ? "bg-primary/15 border-primary/30 text-primary"
                        : "bg-muted border-border text-muted-foreground",
                    )}
                  >
                    {d.sigla || "—"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {d.desginacao}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {d.tipo_unidade_curricular}
                      {d.natureza_unidade_curricular
                        ? ` · ${d.natureza_unidade_curricular}`
                        : ""}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={cn(
                      "w-4 h-4 rounded shrink-0 flex items-center justify-center",
                      "border-[1.5px] transition-colors",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border",
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

        {/* Rodapé com chips das seleccionadas */}
        <div className="flex items-center gap-2 flex-wrap px-3 py-2 border-t border-border bg-muted min-h-[42px]">
          {values.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              Nenhuma disciplina selecionada
            </span>
          ) : (
            values.map(({ id, designacao, sigla }) => (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium bg-primary/10 border border-primary/25 text-primary"
              >
                {sigla && (
                  <span className="text-[9px] font-bold opacity-70">
                    {sigla}
                  </span>
                )}
                {designacao}
                <button
                  type="button"
                  onClick={() => toggle(id, designacao, sigla)}
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
