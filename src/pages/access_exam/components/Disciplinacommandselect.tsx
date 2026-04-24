import { useId, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import { useDisciplinas } from "@/hooks/access_exam/use-tipos-disciplinas.hooks";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";


export function DisciplinaCommandSelect({
  value,
  onChangeValue,
  disabled,
  label = "Disciplina",
  labelMode = "outside",
  enableDefaultSelectItem,
}: {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  label?: string;
  labelMode?: "inside" | "outside";
  enableDefaultSelectItem?: boolean;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: disciplinasResponse, isLoading: loadingDisciplinas } =
    useDisciplinas({ page: 1, limit: 1000 });

  const id = useId();

  const defaultSelectItem = enableDefaultSelectItem
    ? [{ label: "Todos", value: "all", key: id }]
    : undefined;

  // filtro local por search (a API não filtra por designação nesta rota)
  const filtered = (disciplinasResponse?.data ?? []).filter((d) =>
    d.designacao.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <FormCommandSelect
      disabled={disabled || loadingDisciplinas}
      value={value}
      label={label}
      labelMode={labelMode}
      isLoading={loadingDisciplinas}
      onSearchChange={(val) => setSearch(val)}
      defaultSelectItem={defaultSelectItem}
      width="full"
      options={filtered}
      map={(d) => ({
        key: d.id.toString(),
        value: d.id.toString(),
        label: d.designacao,
      })}
      onChange={(val) => {
        onChangeValue(val);
        setSearch("");
      }}
    />
  );
}