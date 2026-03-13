import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BookUser, CheckCircle2, CircleX, Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GestaoAfectacaoPorUC } from "./components/GestaoAfectacaoPorUC";
import { GestaoAfectacaoPorDocente } from "./components/GestaoAfectacaoPorDocente";
import { Button } from "@/components/ui/button";
import { GestaoAfectacaoModal } from "./components/GestaoAfectacaoModal";

const GestaoAfectacao = () => {
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
            <BreadcrumbLink href="/docente">Gestão de Docente</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gestão de Afectações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Gestão de Afectações
        </h1>
        <Button size="sm" onClick={openModal}>
          <Plus className={`w-4 h-4 mr-2`} />
          Adicionar
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-3xl grid-cols-3 mb-6">
          <TabsTrigger value="docente" className="gap-2">
            <BookUser className="h-4 w-4" />
            Filtrar por docente
          </TabsTrigger>
          <TabsTrigger value="uc" className="gap-2">
            <Book className="h-4 w-4" />
            Filtrar por UC
          </TabsTrigger>
        </TabsList>
        <TabsContent value="docente">
          <GestaoAfectacaoPorDocente />
        </TabsContent>
        <TabsContent value="uc">
          <GestaoAfectacaoPorUC />
        </TabsContent>
      </Tabs>
      <GestaoAfectacaoModal
        isModalOpen={isShowModal}
        setIsModalOpen={closeModal}
      />
    </div>
  );
};

export default GestaoAfectacao;
