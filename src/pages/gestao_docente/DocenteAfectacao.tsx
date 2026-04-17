import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookUser } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GestaoAfectacaoModal } from "./components/GestaoAfectacaoModal";
import { DocentAfectacaoItem } from "./components/DocentAfectacaoItem";
import { DocenteSemAfectacaoItem } from "./components/DocenteSemAfectacaoItem";

export const DocenteAfectacao = () => {
  const [activeTab, setActiveTab] = useState<"docente" | "uc">("docente");
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const openModal = () => setIsShowModal(true);
  const closeModal = () => setIsShowModal(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docente">Gestão de Docentes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Docentes Afectados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Docentes Afectados
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-3xl grid-cols-3 mb-6">
          <TabsTrigger value="docente" className="gap-2">
            <BookUser className="h-4 w-4" />
            Docentes Com Afectação
          </TabsTrigger>
          <TabsTrigger value="uc" className="gap-2">
            <Book className="h-4 w-4" />
            Docentes Sem Afectação
          </TabsTrigger>
        </TabsList>
        <TabsContent value="docente">
          <DocentAfectacaoItem />
        </TabsContent>
        <TabsContent value="uc">
          <DocenteSemAfectacaoItem />
        </TabsContent>
      </Tabs>
      <GestaoAfectacaoModal
        isModalOpen={isShowModal}
        setIsModalOpen={closeModal}
      />
    </div>
  );
};
