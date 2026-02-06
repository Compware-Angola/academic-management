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
import { finaceStructure, menuStructure, academicStructure, healpStructure } from "@/config/menuStructure";
import { NavFinance } from "./nav-finance";
import { NavAcademic } from "./nav-academic";
import { filterMenuByPermission } from "@/util/menuFilter";
import { NavHealp } from "./nav-healp";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const mainItems = filterMenuByPermission(menuStructure?.items ?? []);
  const academicItems = filterMenuByPermission(academicStructure?.items ?? []);
  const financeItems = filterMenuByPermission(finaceStructure?.items ?? []);
 const helpItems = filterMenuByPermission(healpStructure?.items ?? []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainItems} />
        <NavAcademic items={academicItems} />
       <NavFinance items={financeItems} />
       <NavHealp items={helpItems} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

