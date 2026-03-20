import { useQueryFetchFaculdades } from "@/hooks/faculdade/use-query-fetch-faculdades";
import { FormCommandSelect } from "../FormCommandSelect";
import { useEffect, useState } from "react";
import { Faculdade } from "@/services/faculdades/fetch-faculdades.service";

interface FacultySelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  allOption?: boolean;
}
const FacultySelect = ({
  onChangeValue,
  value,
  allOption = false,
}: FacultySelectProps) => {
  const { data: faculdades = [], isLoading: isLoadingFaculdades } =
    useQueryFetchFaculdades();

  const [allfaculdades, setAllFaculdades] = useState<Faculdade[]>([]);

  useEffect(() => {
    if (allOption) {
      setAllFaculdades([
        {
          codigo: "all",
          designacao: "Todos",
        } as unknown as Faculdade,
        ...faculdades,
      ]);
    } else {
      setAllFaculdades(faculdades);
    }
  }, [allOption, faculdades]);

  return (
    <>
      <FormCommandSelect
        disabled={isLoadingFaculdades}
        value={value}
        label="Faculdade"
        width="full"
        options={allfaculdades}
        map={(f) => ({
          key: f.codigo.toString(),
          value: f.codigo.toString(),
          label: f.designacao,
        })}
        onChange={(value) => onChangeValue(value)}
      />
    </>
  );
};

export { FacultySelect };
