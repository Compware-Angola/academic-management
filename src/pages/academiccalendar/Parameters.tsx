
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doutoramento } from "./components/doutoramento";
import { Licenciatura } from "./components/licenciatura";
import { Mestrado } from "./components/mestrado";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

export default function Parameters() {
  const { hasPermission } = usePermission();
  const canViewPostGraduationTabs = hasPermission(
    PermissionTypeDetails.PARAMETROS_ACADEMICOS_POS_GRADUACAO.sigla,
  );

  return (
    <div className="space-y-8 pb-10">

      <PageHeader
        title="Parâmetros do Calendário Académico"
        subtitle="Home / Calendário Académico / Parâmetros"
      />
      <Tabs defaultValue="licenciatura">
        <TabsList>
          <TabsTrigger value="licenciatura">Licenciatura</TabsTrigger>
          {canViewPostGraduationTabs && (
            <TabsTrigger value="mestrado">Mestrado</TabsTrigger>
          )}
          {canViewPostGraduationTabs && (
            <TabsTrigger value="doutoramento">Doutoramento</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="licenciatura">
          <Licenciatura />
        </TabsContent>
        {canViewPostGraduationTabs && (
          <TabsContent value="mestrado">
            <Mestrado />
          </TabsContent>
        )}
        {canViewPostGraduationTabs && (
          <TabsContent value="doutoramento">
            <Doutoramento />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
