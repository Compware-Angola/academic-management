import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Link } from "react-router-dom";
import { Book, Home, Banknote, CircleDollarSign } from "lucide-react";

import { useState } from "react";
import { useQueryFetchIsencaoServico } from "@/hooks/financas/isencao-servico/use-query-isencao-sevico.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { formatarData } from "@/util/date-formate.ts";
import {
  EditIsencaoServicoDialog,
  EditIsencaoServicoFormData,
} from "@/pages/financas/isencao-servico/EditIsencaoServicoDialog.tsx";
import { useMutationUpdateIsencaoServico } from "@/hooks/financas/isencao-servico/use-mutation-update-isencao-servico.ts";
import { Pencil } from "lucide-react";
import type {
  IsencaoServico,
  UpdateIsencaoServicoBody,
} from "@/services/financas/isencao-servicos/isencao-servico.service.ts";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { parseFilter } from "@/util/parse-filter";
import { CreateIsencaoDialog } from "./CreateIsencaoDialog";
import { CreateIsencaoMesDialog } from "./CreateIsencaoMesDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IsencaoServicoItem from "./IsencaoServicoItem";
import IsencaoServicoMultaItem from "./IsencaoServicoMultaItem";

export default function Isencao() {
  const [activeTab, setActiveTab] = useState<"docente" | "uc">("docente");
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Finanças</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Isenção de serviços</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-2xl font-bold tracking-tight">
            Isenção de serviços
          </h1>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-3xl grid-cols-3 mb-6">
          <TabsTrigger value="docente" className="gap-2">
            <Banknote className="h-4 w-4" />
            Isenção de Serviço
          </TabsTrigger>
          <TabsTrigger value="uc" className="gap-2">
            <CircleDollarSign className="h-4 w-4" />
            Isenção de Multa
          </TabsTrigger>
        </TabsList>
        <TabsContent value="docente">
          <IsencaoServicoItem />
        </TabsContent>
        <TabsContent value="uc">
          <IsencaoServicoMultaItem />
        </TabsContent>
      </Tabs>
    </div>
  );
}
