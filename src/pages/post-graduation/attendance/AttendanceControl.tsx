import { useMemo, useState } from "react";

import { FormSelect } from "@/components/common/FormSelect";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import ControleAssiduidade from "@/pages/assiduidade/ControleAssiduidade";

const DEFAULT_POST_GRADUATION_DEGREE_ID = "2";

export default function PostGraduationAttendanceControl() {
  const [degreeId, setDegreeId] = useState(DEFAULT_POST_GRADUATION_DEGREE_ID);
  const { data: degreesResponse, isLoading: isLoadingDegrees } =
    useQueryPostGraduationDegrees();
  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree) => degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
  );

  return (
    <ControleAssiduidade
      key={degreeId}
      isPostGraduationAttendance
      degreeId={degreeId}
      topFiltersSlot={
        <FormSelect
          label="Tipo de Candidatura"
          value={degreeId}
          loading={isLoadingDegrees}
          disabled={isLoadingDegrees}
          options={degrees}
          map={(degree) => ({
            key: degree.id,
            value: degree.id,
            label: degree.designation,
          })}
          onChange={setDegreeId}
        />
      }
    />
  );
}
