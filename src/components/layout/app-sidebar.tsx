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
import { filterMenuByGroups } from "@/util/menuFilter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const mainItems = filterMenuByGroups(menuStructure?.items ?? []);
  const academicItems = filterMenuByGroups(academicStructure?.items ?? []);
  const financeItems = filterMenuByGroups(finaceStructure?.items ?? []);
 // const helpItems = filterMenuByGroups(healpStructure?.items ?? []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainItems} />
        <NavAcademic items={academicItems} />
       <NavFinance items={financeItems} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

