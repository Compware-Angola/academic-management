import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Parameters() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Parâmetros salvos com sucesso" });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parâmetros do Calendário Académico"
        subtitle="Home / Calendário Académico (Lic.) / Parâmetros"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar Padrão
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ano Letivo Atual</CardTitle>
            <CardDescription>Defina o ano letivo ativo no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="anoLetivo">Ano Letivo</Label>
                <Select defaultValue="2024-2025">
                  <SelectTrigger id="anoLetivo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="2024-2025">2024/2025</SelectItem>
                    <SelectItem value="2025-2026">2025/2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semestreAtivo">Semestre Ativo</Label>
                <Select defaultValue="1">
                  <SelectTrigger id="semestreAtivo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="1">1º Semestre</SelectItem>
                    <SelectItem value="2">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prazos e Períodos</CardTitle>
            <CardDescription>Configure os prazos principais do calendário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inicioAulas">Início das Aulas (1º Semestre)</Label>
                <Input id="inicioAulas" type="date" defaultValue="2024-09-02" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fimAulas">Fim das Aulas (1º Semestre)</Label>
                <Input id="fimAulas" type="date" defaultValue="2024-12-20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inicioProvas">Início Período de Provas</Label>
                <Input id="inicioProvas" type="date" defaultValue="2024-12-21" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fimProvas">Fim Período de Provas</Label>
                <Input id="fimProvas" type="date" defaultValue="2025-01-15" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duração das Aulas</CardTitle>
            <CardDescription>Defina a duração padrão das aulas em minutos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracaoTeorica">Aula Teórica (min)</Label>
                <Input id="duracaoTeorica" type="number" defaultValue="90" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracaoPratica">Aula Prática (min)</Label>
                <Input id="duracaoPratica" type="number" defaultValue="120" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracaoLab">Laboratório (min)</Label>
                <Input id="duracaoLab" type="number" defaultValue="180" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Avaliação</CardTitle>
            <CardDescription>Configure parâmetros relacionados à avaliação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir lançamento de notas fora do prazo</Label>
                <p className="text-sm text-muted-foreground">
                  Docentes poderão lançar notas após o prazo estabelecido
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar época de recurso automaticamente</Label>
                <p className="text-sm text-muted-foreground">
                  Sistema criará época de recurso ao fim da época normal
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exigir lista de presença nas provas</Label>
                <p className="text-sm text-muted-foreground">
                  Obriga preenchimento da lista de presença para validar prova
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações de Horário</CardTitle>
            <CardDescription>Parâmetros relacionados à criação de horários</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verificar colisões de sala automaticamente</Label>
                <p className="text-sm text-muted-foreground">
                  Sistema impedirá conflitos na alocação de salas
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verificar disponibilidade de docente</Label>
                <p className="text-sm text-muted-foreground">
                  Sistema alertará sobre conflitos de horário do docente
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir horários aos sábados</Label>
                <p className="text-sm text-muted-foreground">
                  Habilita criação de horários aos sábados
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
