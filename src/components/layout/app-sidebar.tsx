"use client";

import * as React from "react";

import { Administration } from "@/components/layout/nav-adm";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  finaceStructure,
  administracaoStructure,
  ingressoStructure,
  academicStructure,

  suporteStructure,
  operacionalStructure,
  comunicationStructure,
  documentStructure
} from "@/config/menuStructure";
import { NavFinance } from "./nav-finance";
import { NavAcademic } from "./nav-academic";

import { NavSuporte } from "./nav-suporte";
import { NavOperacional } from "./nav-operacional";
import { NavIngresso } from "./nav-ingresso";
import { useFilterMenuByPermission } from "@/util/menuFilter";
import { NavCommunication } from "./nav-comunication";
import { NavDocs } from "./nav-documentos";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const adminItems = useFilterMenuByPermission(administracaoStructure?.items ?? []);
  const ingressoItems = useFilterMenuByPermission(ingressoStructure?.items ?? []);
  const academicItems = useFilterMenuByPermission(academicStructure?.items ?? []);
  const financeItems = useFilterMenuByPermission(finaceStructure?.items ?? []);
  const operacionalItems = useFilterMenuByPermission(operacionalStructure?.items ?? []);
  const comunicationItems = useFilterMenuByPermission(comunicationStructure?.items ?? []);
  const docsItems = useFilterMenuByPermission(documentStructure?.items ?? []);

  const suporteItems = useFilterMenuByPermission(suporteStructure?.items ?? []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <Administration items={adminItems} />
        <NavIngresso items={ingressoItems} />
        <NavAcademic items={academicItems} />
        <NavOperacional items={operacionalItems} />


        <NavCommunication items={comunicationItems} />


        <NavSuporte items={suporteItems} />

        <NavFinance items={financeItems} />
        <NavDocs items={docsItems} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
