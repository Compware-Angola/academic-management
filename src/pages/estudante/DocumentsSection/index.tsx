import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact, FileText, GraduationCap } from "lucide-react";
import { CertidoesSection } from "./components/CertidoesSection";
import { GerarDiploma } from "./gerar-diploma";

import { CartaConclusaoSection } from "./components/CartaConclusaoSection";
import { CertificadoNotas } from "./components/certificado-notas";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

interface DocumentsSectionProps {
  codigoMatricula: number;
  value?: string;
}

export function DocumentsSection({
  codigoMatricula,
  value = "documentos",
}: DocumentsSectionProps) {
  const { hasPermission } = usePermission();
  return (
    <TabsContent value={value}>
      <Tabs
        defaultValue="carta-de-conclusao"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-fit w-52">
          {hasPermission(PermissionTypeDetails.CARTA_CONCLUSAO.sigla) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="carta-de-conclusao"
            >
              <FileText className="h-4 w-4" />
              <span>Carta de Conclusão</span>
            </TabsTrigger>
          )}
          {hasPermission(PermissionTypeDetails.CERTIDOES.sigla) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="certidoes"
            >
              <Contact className="h-4 w-4" />
              <span>Certidões</span>
            </TabsTrigger>
          )}
          {hasPermission(PermissionTypeDetails.GERAR_DIPLOMA.sigla) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="gerar-diploma"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Gerar Diploma</span>
            </TabsTrigger>
          )}
          {hasPermission(PermissionTypeDetails.CERTIFICADO_COM_NOTAS.sigla) && (
            <TabsTrigger
              className="w-full justify-start gap-2"
              value="certificado-notas"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="truncate">Certificado de Notas</span>
            </TabsTrigger>
          )}
        </TabsList>
        <Card className="flex-1 p-6">
          {hasPermission(PermissionTypeDetails.CARTA_CONCLUSAO.sigla) && (
            <TabsContent value="carta-de-conclusao">
              <CartaConclusaoSection codigoMatricula={codigoMatricula} />
            </TabsContent>
          )}
          {hasPermission(PermissionTypeDetails.CERTIDOES.sigla) && (
            <TabsContent value="certidoes">
              <CertidoesSection codigoMatricula={codigoMatricula} />
            </TabsContent>
          )}

          {hasPermission(PermissionTypeDetails.CERTIFICADO_COM_NOTAS.sigla) && (
            <TabsContent value="certificado-notas">
              <CertificadoNotas codigoMatricula={codigoMatricula} />
            </TabsContent>
          )}
          {hasPermission(PermissionTypeDetails.GERAR_DIPLOMA.sigla) && (
            <TabsContent value="gerar-diploma">
              <GerarDiploma
                codigoMatricula={codigoMatricula}
                value="gerar-diploma"
              />
            </TabsContent>
          )}
        </Card>
      </Tabs>
    </TabsContent>
  );
}
