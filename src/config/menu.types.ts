import { LucideIcon } from "lucide-react";

// Cada item do menu pode ter filhos (submenu) e permissões
export interface MenuItem {
  title: string;               // Título que aparece no menu
  url?: string;                // URL do menu (opcional, porque pode ser apenas um pai)
  icon?: LucideIcon;           // Ícone do item
  isActive?: boolean;          // Se está ativo (selecionado)
  permission?: string | string[]; // 🔥 substitui roles: sigla ou array de siglas de permissões
  items?: MenuItem[];          // Submenus opcionais
}

// Estrutura principal do menu
export interface MenuStructure {
  items: MenuItem[];
}
