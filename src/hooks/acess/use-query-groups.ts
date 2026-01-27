// src/hooks/queries/use-groups.ts
import { fetchAllGroupsDropDown, Group } from "@/services/access/fetch-group.service";
import { useQuery } from "@tanstack/react-query";


export function useGroups() {
  return useQuery<Group[], Error>({
    queryKey: ["groups-all-dropdown"],         
    queryFn: fetchAllGroupsDropDown,
  
  });
}