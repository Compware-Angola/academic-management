
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";

export const filterMenuByGroups = (items: any[]) => {
  const { data: user, isError } = useCurrentUser('GA');
  if (isError) {
    return [];
  }

  const userGroups = user?.groups?.map(g => g.sigla) || [];
  const filterItems = (menuItems: any[]): any[] => {
    return menuItems
      .filter(item => {
      
        if (!item.roles) return true;
        return item.roles.some((role: string) => userGroups.includes(role));
      })
      .map(item => ({
        ...item,
   
        items: item.items ? filterItems(item.items) : undefined,
      }));
  };

  return filterItems(items);
};
