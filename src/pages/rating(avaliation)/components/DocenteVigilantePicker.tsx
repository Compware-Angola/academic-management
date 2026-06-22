import { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";

export type DocenteSelected = {
  id: number;
  nome: string;
};

type Props = {
  values: DocenteSelected[];
  onChange: (values: DocenteSelected[]) => void;
  max?: number;
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

function shortName(nome: string) {
  return nome.replace(/^(Prof\.|Dra?\.|Dr\.)\s/, "");
}

export function DocenteVigilantePicker({ values, onChange, max = 2 }: Props) {
  const [query, setQuery] = useState("");
  const { data: docentes = [], isLoading: loading } = useQueryTeacther();

  const filtered = docentes.filter((d) =>
    d.nome.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = (id: number, nome: string) => {
    if (values.some((v) => v.id === id)) {
      onChange(values.filter((v) => v.id !== id));
    } else if (values.length < max) {
      onChange([...values, { id, nome }]);
    }
  };

  return (
    <div className="col-span-full space-y-2">
      <div className="flex items-center justify-between">
        <Label>Vigilantes</Label>
        <span className="text-xs text-muted-foreground">
          Máximo de {max} docentes
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
            placeholder="Pesquisar por nome ou departamento..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="text-xs text-muted-foreground shrink-0">
            <span className="text-primary font-medium">{values.length}</span>
            {" / "}
            {max} selecionados
          </span>
        </div>

        {/* Grelha de docentes */}
        <div className="grid grid-cols-3 max-h-52 overflow-y-auto">
          {loading && (
            <div className="col-span-3 py-6 text-center text-sm text-muted-foreground">
              A carregar docentes...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="col-span-3 py-6 text-center text-sm text-muted-foreground">
              Nenhum docente encontrado
            </div>
          )}

          {!loading &&
            filtered.map((d) => {
              const isSelected = values.some(
                (v) => v.id === d.codigo_utilizador,
              );
              const isDisabled = !isSelected && values.length >= max;

              return (
                <div
                  key={d.codigo_utilizador}
                  onClick={() =>
                    !isDisabled && toggle(d.codigo_utilizador, d.nome)
                  }
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5",
                    "border-b border-r border-border",
                    "[&:nth-child(3n)]:border-r-0",
                    "transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted",
                    isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer",
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      "text-[10px] font-semibold border",
                      isSelected
                        ? "bg-primary/15 border-primary/30 text-primary"
                        : "bg-muted border-border text-muted-foreground",
                    )}
                  >
                    {getInitials(d.nome)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{d.nome}</p>
                    {d.descricao_grau_academico && (
                      <p className="text-[11px] text-muted-foreground truncate">
                        {d.descricao_grau_academico}
                      </p>
                    )}
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

        {/* Rodapé com chips dos selecionados */}
        <div className="flex items-center gap-2 flex-wrap px-3 py-2 border-t border-border bg-muted min-h-[42px]">
          {values.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              Nenhum vigilante selecionado
            </span>
          ) : (
            values.map(({ id, nome }) => (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium bg-primary/10 border border-primary/25 text-primary"
              >
                <span className="w-[15px] h-[15px] rounded-full bg-primary/20 text-primary text-[8px] font-bold flex items-center justify-center shrink-0">
                  {getInitials(nome)}
                </span>
                {shortName(nome)}
                <button
                  type="button"
                  onClick={() => toggle(id, nome)}
                  className="opacity-60 hover:opacity-100 transition-opacity flex items-center"
                  aria-label={`Remover ${nome}`}
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
