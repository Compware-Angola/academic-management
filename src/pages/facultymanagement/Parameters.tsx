import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Parameters = () => {
  const [maxHorasSemanais, setMaxHorasSemanais] = useState("40");
  const [maxUcs, setMaxUcs] = useState("5");
  const [permitirSobreposicao, setPermitirSobreposicao] = useState(false);
  const [validarDisponibilidade, setValidarDisponibilidade] = useState(true);

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gestao-docentes">Gestão de Docentes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Parâmetros</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Parâmetros de Gestão de Docentes</h1>

      <Card className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Configurações do Sistema</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="maxHoras">Máximo de Horas Semanais por Docente</Label>
            <Input
              id="maxHoras"
              type="number"
              value={maxHorasSemanais}
              onChange={(e) => setMaxHorasSemanais(e.target.value)}
              placeholder="Ex: 40"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Número máximo de horas que um docente pode lecionar por semana
            </p>
          </div>

          <div>
            <Label htmlFor="maxUcs">Máximo de UCs por Docente</Label>
            <Input
              id="maxUcs"
              type="number"
              value={maxUcs}
              onChange={(e) => setMaxUcs(e.target.value)}
              placeholder="Ex: 5"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Número máximo de unidades curriculares que um docente pode lecionar
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Regras de Afetação</h3>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <Label>Permitir Sobreposição de Horários</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que um docente tenha aulas no mesmo horário
                </p>
              </div>
              <Switch
                checked={permitirSobreposicao}
                onCheckedChange={setPermitirSobreposicao}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <Label>Validar Disponibilidade</Label>
                <p className="text-sm text-muted-foreground">
                  Verifica a disponibilidade do docente antes de afetar
                </p>
              </div>
              <Switch
                checked={validarDisponibilidade}
                onCheckedChange={setValidarDisponibilidade}
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Notificações</h3>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <Label>Notificar Docente sobre Novas Afetações</Label>
                <p className="text-sm text-muted-foreground">
                  Envia email automático quando docente é afetado
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <Label>Notificar sobre Alterações de Horário</Label>
                <p className="text-sm text-muted-foreground">
                  Alerta docentes sobre mudanças nos horários
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button variant="default">Guardar Configurações</Button>
            <Button variant="outline">Restaurar Padrões</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Parameters;
