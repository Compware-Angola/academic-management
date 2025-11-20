import { ChevronDown, Home } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { menuStructure } from "@/config/menuStructure";
import { useState } from "react";

export function AppSidebar() {
  const { state } = useSidebar();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground text-lg font-semibold px-4 py-4">
            Portal Académico
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Home Link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className="text-sidebar-foreground hover:bg-sidebar-accent"
                    activeClassName="bg-sidebar-accent"
                  >
                    <Home className="h-4 w-4" />
                    <span>Início</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Menu Items */}
              {menuStructure.map((item) => {
                const Icon = item.icon;
                const isOpen = openMenus.includes(item.title);

                if (item.children) {
                  return (
                    <Collapsible
                      key={item.title}
                      open={isOpen}
                      onOpenChange={() => toggleMenu(item.title)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent">
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown 
                              className={`ml-auto h-4 w-4 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`} 
                            />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => {
                              const ChildIcon = child.icon;
                              return (
                                <SidebarMenuSubItem key={child.path}>
                                  <SidebarMenuSubButton asChild>
                                    <NavLink
                                      to={child.path || "#"}
                                      className="text-sidebar-foreground hover:bg-sidebar-accent"
                                      activeClassName="bg-sidebar-accent font-medium"
                                    >
                                      <ChildIcon className="h-3 w-3" />
                                      <span className="text-sm">{child.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path || "#"}
                        className="text-sidebar-foreground hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
