"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavProjects } from "@/components/layout/nav-projects";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
