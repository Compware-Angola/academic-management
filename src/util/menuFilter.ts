import { usePermission } from "@/auth/permission.helper";

export const useFilterMenuByPermission = (items: any[]) => {
  const { hasPermission } = usePermission();

  const filterItems = (menuItems: any[]): any[] => {
    return menuItems
      .map(item => {
        // Filtra os submenus recursivamente
        const filteredSubItems = item.items ? filterItems(item.items) : undefined;

        // Verifica se o item atual tem permissão
        const isAllowed = !item.permission || hasPermission(item.permission);

        // Retorna o item apenas se tiver permissão ou algum submenu visível
        if (!isAllowed && (!filteredSubItems || filteredSubItems.length === 0)) {
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