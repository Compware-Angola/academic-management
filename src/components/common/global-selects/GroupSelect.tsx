import { useQueryGrupos } from "@/hooks/acess/use-query-grupos";
import { FormCommandSelect } from "../FormCommandSelect";
import { UserGroup } from "@/services/access/fetch-user-group.service";

interface GroupSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  labelMode?: "inside" | "outside";
  excludeGroups?: UserGroup[]; // 👈 grupos já associados
}

export function GroupSelect({
  value,
  onChangeValue,
  excludeGroups = [],
  labelMode = "outside",
}: GroupSelectProps) {
  const { data: grupos = [], isPending } = useQueryGrupos({ ativo: "true" });

  const filteredGrupos = grupos.filter(
    g => !excludeGroups.some(ug => ug.codigo === g.pkGrupo)
  );

  return (
    <FormCommandSelect
      disabled={isPending}
      value={value}
      label="Grupo"
      labelMode={labelMode}
      isLoading={isPending}
      width="full"
      options={filteredGrupos}
      map={(g) => ({
        key: g.pkGrupo.toString(),
        value: g.pkGrupo.toString(),
        label: g.designacao,
      })}
      onChange={onChangeValue}
    />
  );
}
