import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: MenuItem[]; 
}

export interface MenuStructure {
  items: MenuItem[];
}
