"use client";

import * as React from "react";


import { NavMain } from "@/components/layout/nav-main";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,

  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { finaceStructure, menuStructure,healpStructure, academicStructure } from "@/config/menuStructure";
import { NavFinance } from "./nav-finance";
import { NavHealp } from "./nav-healp";
import { NavAcademic } from "./nav-academic";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuStructure.items} />
         <NavAcademic items={academicStructure.items} />
        <NavFinance items={finaceStructure.items} />
       
        <NavHealp items={healpStructure.items} />

      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
