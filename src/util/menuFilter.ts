
import { AuthStorage } from "@/util/auth-storage";

export const filterMenuByGroups = (items: any[]) => {
  const { groups } = AuthStorage.getUser() || { groups: [] };
  const userGroups = groups?.map(g => g.sigla) || [];
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
