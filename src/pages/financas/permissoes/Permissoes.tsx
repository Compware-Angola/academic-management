import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Save } from "lucide-react";
import { Link } from "react-router-dom";

export default function Permissoes() {
  const permissoes = [
    { modulo: "Área Financeira", acoes: ["Visualizar", "Criar", "Editar", "Eliminar"] },
    { modulo: "Confirmações", acoes: ["Visualizar", "Criar", "Editar", "Eliminar"] },
    { modulo: "Crédito Educacional", acoes: ["Visualizar", "Criar", "Editar", "Eliminar"] },
    { modulo: "Fecho de Caixa", acoes: ["Visualizar", "Criar", "Editar", "Eliminar"] },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Gestão Permissões</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Permissões</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Gestão de Permissões</h1>
      <p className="text-muted-foreground">Configurar permissões por perfil.</p>

      <Card>
        <CardHeader><CardTitle>Seleccionar Perfil</CardTitle></CardHeader>
        <CardContent>
          <Select><SelectTrigger className="w-64"><SelectValue placeholder="Escolher perfil" /></SelectTrigger><SelectContent><SelectItem value="admin">Administrador</SelectItem><SelectItem value="tesour">Tesouraria</SelectItem></SelectContent></Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Permissões do Módulo</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissoes.map((perm, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">{perm.modulo}</span>
                <div className="flex gap-4">
                  {perm.acoes.map((acao, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Checkbox id={`${i}-${j}`} />
                      <label htmlFor={`${i}-${j}`} className="text-sm">{acao}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="gap-2"><Save className="h-4 w-4" />Guardar Alterações</Button>
    </div>
  );
}
