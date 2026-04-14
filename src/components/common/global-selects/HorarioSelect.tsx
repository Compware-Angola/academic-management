import { useState } from "react";
import { useQueryHorariosExistentes } from "@/hooks/horario/use-query-horarios-existentes";
import { FormCommandSelect, LabelMode } from "../FormCommandSelect";
import { parseFilter } from "@/util/parse-filter";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScheduleDetailsModal from "@/pages/schedules/components/ScheduleDetailsModal";

type Props = {
  value: string;
  onChangeValue: (v: string) => void;
  showDetails?: boolean;
  anoLectivo: string;
  curso: string;
  periodo: string;
  semestre: string;
  unidadeCurricular?: string;
  estado?: string;
  labelMode?: LabelMode;
};

export function HorarioSelect({
  value,
  onChangeValue,
  showDetails = false,
  anoLectivo,
  curso,
  periodo,
  semestre,
  unidadeCurricular,
  estado,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: horarios } = useQueryHorariosExistentes({
    page: 1,
    limit: 100,
    anoLectivo: parseFilter(anoLectivo),
    curso: parseFilter(curso),
    periodo: parseFilter(periodo),
    semestre: parseFilter(semestre),
    unidadeCurricular: parseFilter(unidadeCurricular),
    estado: parseFilter(estado),
  });

  return (
    <>
      <div className="flex items-center gap-1">
        <div className="flex-1">
          <FormCommandSelect
            options={horarios?.data ?? []}
            label="Horário"
            labelMode="inside"
            map={(h) => ({
              key: h.codigo,
              label: h.designacao,
              value: h.codigo,
            })}
            onChange={onChangeValue}
            value={value}
          />
        </div>

        {/* {showDetails && value && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="h-9 w-9 shrink-0"
            onClick={() => setIsModalOpen(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )} */}
      </div>

      {/* {showDetails && (
        <ScheduleDetailsModal
          horarioId={Number(value)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )} */}
    </>
  );
}
