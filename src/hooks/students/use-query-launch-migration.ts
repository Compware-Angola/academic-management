import {
  getLaunchMigrationService,
  LaunchMigrationResponse,
} from "@/services/students/fetch-launch-migration.service";
import {
  ResultPlanResponse,
  getResultPlanService,
} from "@/services/students/fetch-result-plan.service";
import { useQuery } from "@tanstack/react-query";

interface QueryLaunchMigration {
  enabled?: boolean;
}

export function useQueryLaunchMigration(
  codigoMatricula: number,
  options?: QueryLaunchMigration,
) {
  const defaultEnabled = !!codigoMatricula;

  return useQuery<LaunchMigrationResponse>({
    queryKey: ["launch-migration", codigoMatricula],
    queryFn: () => getLaunchMigrationService(codigoMatricula),
    enabled: options?.enabled ?? defaultEnabled,
  });
}
