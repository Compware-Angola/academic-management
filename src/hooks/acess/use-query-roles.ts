import { listarRolesService } from "@/services/access/solicitacao/fetch-roles.service";
import { useQuery } from "@tanstack/react-query";


export const useQueryListarRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: listarRolesService,
  });
};