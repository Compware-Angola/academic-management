import { useDropDownEstadoSituacao, useDropDownMotivoSituacao } from "@/hooks/dropdown-filters";
import { FormSelect } from "../FormSelect";

type Props = {
    value: string;
    onChangeValue: (v: string) => void;
    disabled?: boolean;
    estado?: number
}
export function MotivoSituacaoSelect({ estado, value, onChangeValue, disabled }: Props) {
    const { data: situacao = [], isLoading, } = useDropDownMotivoSituacao(estado);
    return (
        <FormSelect
            disabled={isLoading || disabled}
            loading={isLoading}
            label="Motivo de Situação"
            value={value}
            onChange={(v) => onChangeValue(v)}
            options={situacao}
            map={(a) => ({ key: a.value, label: a.label, value: a.value })}
        />
    )
}

export function EstadoSituacaoSelect({ value, onChangeValue, disabled }: Omit<Props, "estado">) {
    const { data: situacao = [], isLoading, } = useDropDownEstadoSituacao();
    return (
        <FormSelect
            disabled={isLoading || disabled}
            loading={isLoading}
            label="Situação"
            value={value}
            onChange={(v) => onChangeValue(v)}
            options={situacao}
            map={(a) => ({ key: a.value, label: a.label, value: a.value })}
        />
    )
}