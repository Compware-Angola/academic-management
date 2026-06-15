import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LoginGaImageTab } from "./components/login-ga-image-tab";
import { PortalStudentImageTab } from "./components/portal-student-image-tab";
import { ComunicadoPortalImageTab } from "./components/comunicado-portal-image-tab";

export default function UploadImagem() {
  return (
    <div className="w-full space-y-6 pb-10">
      <h1 className="text-3xl font-bold">Imagem de abertura</h1>

      <Tabs defaultValue="portal-estudante" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="portal-estudante">
            Portal do Estudante
          </TabsTrigger>
          <TabsTrigger value="login-ga">Login do GA</TabsTrigger>
          <TabsTrigger value="comunicado-portal">
            Banner de Comunicados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portal-estudante">
          <PortalStudentImageTab />
        </TabsContent>

        <TabsContent value="login-ga">
          <LoginGaImageTab />
        </TabsContent>

        <TabsContent value="comunicado-portal">
          <ComunicadoPortalImageTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
