import { useId, useMemo } from "react";
import { FormCommandSelect } from "../FormCommandSelect";

interface CourseSelectProps {
    value: string;
    labelMode?: "inside" | "outside";
    onChangeValue: (v: string) => void;
    showLabel?: boolean;
    disabled?: boolean;
    placeholder?: string;
    width?: string;
    label?: string;
    enableDefaultSelectItem?: boolean;
    allowedIds?: string[];
    isLoading?: boolean;
    cursos?: { codigo: number; designacao: string }[];
}

const CourseSelectTestIsaac = ({
    disabled,
    onChangeValue,
    value,
    enableDefaultSelectItem,
    label = "Cursos",
    placeholder,
    width = "full",
    labelMode = "outside",
    showLabel = true,
    allowedIds,
    isLoading: loadingCursos = false,
    cursos = [],
}: CourseSelectProps) => {
    const id = useId();

    const filteredCursos = useMemo(() => {
        if (!allowedIds) return cursos;
        return cursos.filter((c) => allowedIds.includes(c.codigo.toString()));
    }, [cursos, allowedIds]);

    const defaultSelectItem = enableDefaultSelectItem
        ? [{ label: "Todos", value: "all", key: id }]
        : undefined;

    return (
        <FormCommandSelect
            disabled={disabled || loadingCursos}
            value={value}
            label={showLabel ? label : undefined}
            labelMode={labelMode}
            isLoading={loadingCursos}
            placeholder={placeholder}
            defaultSelectItem={defaultSelectItem}
            width={width}
            options={filteredCursos}
            map={(f) => ({
                key: f.codigo.toString(),
                value: f.codigo.toString(),
                label: f.designacao,
            })}
            onChange={onChangeValue}
        />
    );
};

export { CourseSelectTestIsaac };