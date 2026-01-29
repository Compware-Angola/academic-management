import { can } from "@/auth/can";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";

export const filterMenuByPermission = (items: any[]) => {
  const { data: user, isError } = useCurrentUser("GA");
  if (isError || !user) {
    return [];
  }

  const userPermissions = user?.permissions || [];

  const filterItems = (menuItems: any[]): any[] => {
    return menuItems
      .map(item => {
        // Filtra os submenus recursivamente
        const filteredSubItems = item.items ? filterItems(item.items) : undefined;

        // Verifica se o item atual tem permissão
        const hasPermission = !item.permission || can(userPermissions, item.permission);

        // Retorna o item apenas se tiver permissão ou algum submenu visível
        if (!hasPermission && (!filteredSubItems || filteredSubItems.length === 0)) {
          return null;
        }

        return {
          ...item,
          items: filteredSubItems,
        };
      })
      .filter(Boolean) as any[]; 
  };

  return filterItems(items);
};
