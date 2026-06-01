import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact, Key, FileText } from "lucide-react";
import { StudentAcademicHistory } from "./student-academic-history";
import { Notes } from "./Notes";
import { StudentResultPlan } from "./student-result-plan";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";
import { LaunchMigration } from "./launch-migration";

type AvaliacaoSectionProps = {
  value?: string;
  codigoMatricula?: number;
};

export function AvaliacaoSection({
  value = "avaliacao",
  codigoMatricula,
}: AvaliacaoSectionProps) {
  const { hasPermission } = usePermission();
  return (
    <TabsContent value={value}>
      <Tabs
        defaultValue="avaliacao"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-52 shrink-0">
          {hasPermission(
            PermissionTypeDetails.LISTAR_AVALICOES_ESTUDANTE.sigla,
          ) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="avaliacao"
            >
              <Key className="h-4 w-4" />
              <span>Notas e Avaliações</span>
            </TabsTrigger>
          )}
          {hasPermission(
            PermissionTypeDetails.HISTORICO_LANCAMENTO_NOTAS.sigla,
          ) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="historico-academico"
            >
              <Contact className="h-4 w-4" />
              <span>Historico Academico</span>
            </TabsTrigger>
          )}
          {hasPermission(
            PermissionTypeDetails.RESULTADO_PLANO_ESTUDO.sigla,
          ) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="plano-estudo"
            >
              <Contact className="h-4 w-4" />
              <span>Plano de Estudo</span>
            </TabsTrigger>
          )}
          {hasPermission(
            PermissionTypeDetails.LANCAMENTO_NOTAS_EQUIVALENCIA_TFC_MIGRACAO
              .sigla,
          ) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="migration"
            >
              <Contact className="h-4 w-4" />
              <span className="whitespace-normal break-words text-left leading-tight">
                Equivalência, TFC e Migração
              </span>
            </TabsTrigger>
          )}
        </TabsList>

        <Card className="flex-1 min-w-0 overflow-hidden p-6">
          {hasPermission(
            PermissionTypeDetails.LISTAR_AVALICOES_ESTUDANTE.sigla,
          ) && <Notes codigoMatricula={codigoMatricula} value="avaliacao" />}

          {hasPermission(
            PermissionTypeDetails.HISTORICO_LANCAMENTO_NOTAS.sigla,
          ) && (
            <StudentAcademicHistory
              value="historico-academico"
              codigoMatricula={codigoMatricula}
            />
          )}
          {hasPermission(
            PermissionTypeDetails.RESULTADO_PLANO_ESTUDO.sigla,
          ) && (
            <StudentResultPlan
              value="plano-estudo"
              codigoMatricula={codigoMatricula}
            />
          )}
          {hasPermission(
            PermissionTypeDetails.LANCAMENTO_NOTAS_EQUIVALENCIA_TFC_MIGRACAO
              .sigla,
          ) && (
            <LaunchMigration
              value="migration"
              codigoMatricula={codigoMatricula}
            />
          )}
        </Card>
      </Tabs>
    </TabsContent>
  );
}
