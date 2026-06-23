import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { MoveStudentsWithoutSchedule } from "./MoveStudentsWithoutSchedule";
import { MoveStudentsWithSchedule } from "./MoveStudentsWithSchedule";

export default function MovimentarEstudantes() {
  return (
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
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
              <BreadcrumbLink>Horários</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Movimentar Estudantes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <h1 className="text-2xl font-bold">
            Movimentar Estudantes entre Horários
          </h1> 
        </div>
        <Tabs defaultValue="MoveStudentsWithSchedule">
          <TabsList>
            <TabsTrigger value="MoveStudentsWithSchedule">Estudante com Horario</TabsTrigger>
            <TabsTrigger value="MoveStudentsWithoutSchedule">Estudante sem Horario</TabsTrigger>
          </TabsList>
           <TabsContent className="mt-6" value="MoveStudentsWithSchedule">
           <MoveStudentsWithSchedule />
           </TabsContent>
           <TabsContent className="mt-6" value="MoveStudentsWithoutSchedule">
           <MoveStudentsWithoutSchedule />
           </TabsContent>
        </Tabs>
      </div>
    
  );
}
