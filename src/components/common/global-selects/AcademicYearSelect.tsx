import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "../FormSelect";
import { useEffect, useId, useRef } from "react";

interface AcademicYearSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  onlyActive?: boolean;
  enableDefaultActiveYear?: boolean;
  tipoCandidaturaId?: number;
}

const AcademicYearSelect = ({
  onChangeValue,
  value,
  disabled,
  enableDefaultSelectItem = false,
  onlyActive = false,
  enableDefaultActiveYear = false,
  tipoCandidaturaId = 1,
}: AcademicYearSelectProps) => {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico({ tipo_candidatura: tipoCandidaturaId });
  const id = useId();
  const hasSetDefault = useRef(false);

  const defaultSelectItem = enableDefaultSelectItem
    ? [
      {
        label: "Todos os anos letivos",
        value: "all",
        key: id,
      },
    ]
    : undefined;

  useEffect(() => {
    if (enableDefaultActiveYear && !hasSetDefault.current && academicYear?.length) {
      const activeYear = academicYear.find(
        (a) => a.estado.toLocaleLowerCase() === "activo",
      );
      if (activeYear) {
        hasSetDefault.current = true;
        onChangeValue(activeYear.codigo.toString());
      }
    }
  }, [enableDefaultActiveYear, academicYear, onChangeValue]);

  return (
    <>
      <FormSelect
        disabled={isLoadingAcademicYear || disabled}
        loading={isLoadingAcademicYear}
        label="Ano Letivo"
        value={value}
        defaultSelectItem={defaultSelectItem}
        onChange={(v) => onChangeValue(v)}
        options={
          onlyActive
            ? academicYear?.filter(
              (a) => a.estado.toLocaleLowerCase() === "activo",
            )
            : academicYear
        }
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { AcademicYearSelect };