import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  roles?: string[];
  items?: MenuItem[]; 
}

export interface MenuStructure {
  items: MenuItem[];
}
