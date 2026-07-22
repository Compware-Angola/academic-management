import { FormSelect } from "../FormSelect";
import { useEffect, useId, useMemo, useRef } from "react";
import { useAcademicYears } from "@/hooks/academiccalendar/use-query-academic-years";

type EstadoAno =
  | "RASCUNHO"
  | "CONFIGURAVEL"
  | "USAVEL"
  | "ACTIVO"
  | "ENCERRADO";

const ESTADOS_DISPONIVEIS: EstadoAno[] = ["CONFIGURAVEL", "USAVEL", "ACTIVO"];

interface AcademicYearsAvailableForOperationSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  onlyActive?: boolean;
  onlyConfigurable?: boolean;
  enableDefaultActiveYear?: boolean;
  tipoCandidaturaId?: number;
  label?: string;
}

const AcademicYearsAvailableForOperationSelect = ({
  onChangeValue,
  value,
  disabled,
  enableDefaultSelectItem = false,
  onlyConfigurable = true,
  onlyActive = false,
  enableDefaultActiveYear = false,
  tipoCandidaturaId = 1,
  label,
}: AcademicYearsAvailableForOperationSelectProps) => {
  const {
    data: academicYearResponse,
    isLoading: isLoadingAcademicYear,
    isError,
  } = useAcademicYears({
    tipoCandidatura: tipoCandidaturaId,
  });
  const id = useId();
  const hasSetDefault = useRef(false);
  const academicYear = academicYearResponse?.data ?? [];
  const defaultSelectItem = enableDefaultSelectItem
    ? [
        {
          label: "Todos os anos letivos",
          value: "all",
          key: id,
        },
      ]
    : undefined;

  const filteredYears = useMemo(() => {
    if (!academicYear) return academicYear;

    if (onlyActive) {
      return academicYear.filter(
        (a) =>
          (a.fase_anolectivo.toLocaleUpperCase() as EstadoAno) === "ACTIVO",
      );
    }
    if (onlyConfigurable) {
      return academicYear.filter((a) =>
        ESTADOS_DISPONIVEIS.includes(a.fase_anolectivo as EstadoAno),
      );
    }
  }, [academicYear, onlyActive, onlyConfigurable]);

  useEffect(() => {
    if (
      enableDefaultActiveYear &&
      !hasSetDefault.current &&
      filteredYears?.length
    ) {
      const activeYear = filteredYears.find(
        (a) => a.fase_anolectivo.toLocaleUpperCase() === "ACTIVO",
      );
      if (activeYear) {
        hasSetDefault.current = true;
        onChangeValue(activeYear.codigo.toString());
      }
    }
  }, [enableDefaultActiveYear, filteredYears, onChangeValue]);

  return (
    <FormSelect
      disabled={isLoadingAcademicYear || disabled}
      loading={isLoadingAcademicYear}
      label={label ? label : "Ano Letivo"}
      value={value}
      defaultSelectItem={defaultSelectItem}
      onChange={(v) => onChangeValue(v)}
      options={filteredYears}
      map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
    />
  );
};

export { AcademicYearsAvailableForOperationSelect };
