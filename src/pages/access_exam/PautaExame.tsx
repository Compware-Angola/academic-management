import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { NotaPrevistaTab } from "./components/NotaPrevistaTab";
import { PautaGeralTab } from "./components/PautaGeralTab";


const NOTA_PREVISTA_ATIVA = true;

export default function PautaExame() {
    return (
        <div className="space-y-6 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Pauta</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Pauta do Exame de Acesso</h1>
                <p className="text-muted-foreground">
                    Consulte a nota prevista dos candidatos e a pauta geral com o resultado final.
                </p>
            </div>

            <Tabs defaultValue={NOTA_PREVISTA_ATIVA ? "nota-prevista" : "pauta-geral"} className="w-full">
                <TabsList className={`grid w-full max-w-sm ${NOTA_PREVISTA_ATIVA ? "grid-cols-2" : "grid-cols-1"}`}>
                    {NOTA_PREVISTA_ATIVA && (
                        <TabsTrigger value="nota-prevista">Nota Prevista</TabsTrigger>
                    )}
                    <TabsTrigger value="pauta-geral">Pauta Geral</TabsTrigger>
                </TabsList>

                {NOTA_PREVISTA_ATIVA && (
                    <TabsContent value="nota-prevista" className="pt-5">
                        <NotaPrevistaTab />
                    </TabsContent>
                )}

                <TabsContent value="pauta-geral" className="pt-5">
                    <PautaGeralTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}