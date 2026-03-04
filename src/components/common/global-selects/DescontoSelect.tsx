import {useQueryFetchDescontos} from "@/hooks/financas/descontos/use-query-descontos.ts";
import {FormCommandSelect} from "@/components/common/FormCommandSelect.tsx";
import {useDebounce} from "@/hooks/use-debounce.ts";
import {useState} from "react";

interface DescontoSelectProps {
    value: string;
    onChangeValue: (v: string) => void;
    disabled?: boolean;
}

export function DescontoSelect({
                                   value,
                                   onChangeValue,
                                   disabled,
                               }: DescontoSelectProps) {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data: response, isLoading } = useQueryFetchDescontos({
        designacao: debouncedSearch,
        page: 1,
        limit: 50,
    });

    return (
        <FormCommandSelect
            label="Desconto"
            value={value}
            disabled={disabled || isLoading}
            isLoading={isLoading}
            options={response?.data ?? []}
            onSearchChange={setSearch}
            width="full"
            onChange={onChangeValue}
            map={(d) => ({
                key: d.id.toString(),
                value: d.id.toString(),
                label: d.descricao,
            })}
        />
    );
}