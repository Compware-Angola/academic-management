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
import {
  finaceStructure,
  menuStructure,
  academicStructure,
  healpStructure,
  suporteStructure,
  defenseTFC,
  assiduidade,
} from "@/config/menuStructure";
import { NavFinance } from "./nav-finance";
import { NavAcademic } from "./nav-academic";

import { NavHealp } from "./nav-healp";
import { NavSuporte } from "./nav-suporte";
import { NavDefenseTFC } from "./nav-defense-tfc";
import { NavAssiduidade } from "./nav-assiduidade";
import { useFilterMenuByPermission } from "@/util/menuFilter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const mainItems = useFilterMenuByPermission(menuStructure?.items ?? []);
  const academicItems = useFilterMenuByPermission(academicStructure?.items ?? []);
  const financeItems = useFilterMenuByPermission(finaceStructure?.items ?? []);
  const helpItems = useFilterMenuByPermission(healpStructure?.items ?? []);
  const suporteItems = useFilterMenuByPermission(suporteStructure?.items ?? []);
  const defenseTFCItems = useFilterMenuByPermission(defenseTFC?.items ?? []);
const assiduidadeItems = useFilterMenuByPermission(assiduidade?.items ??[])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainItems} />
        <NavAssiduidade items={assiduidadeItems} />
        <NavDefenseTFC items={defenseTFCItems} />
        <NavAcademic items={academicItems} />
        <NavFinance items={financeItems} />
        <NavHealp items={helpItems} />
        <NavSuporte items={suporteItems} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
