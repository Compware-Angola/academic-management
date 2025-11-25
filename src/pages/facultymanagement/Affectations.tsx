import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Affectations = () => {
  const [docente, setDocente] = useState("");
  const [uc, setUc] = useState("");
  const [turma, setTurma] = useState("");
  const [tipoAula, setTipoAula] = useState("");
  const [horasSemanais, setHorasSemanais] = useState("");

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
            <BreadcrumbPage>Afetações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Nova Afetação de Docente</h1>

      <Card className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Afetar Docente a UC</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="docente">Docente *</Label>
            <Select value={docente} onValueChange={setDocente}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar docente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doc1">Prof. Dr. João Silva</SelectItem>
                <SelectItem value="doc2">Prof.ª Dra. Maria Santos</SelectItem>
                <SelectItem value="doc3">Prof. Dr. Carlos Manuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="uc">Unidade Curricular *</Label>
            <Select value={uc} onValueChange={setUc}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar UC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uc1">Algoritmos e Estruturas de Dados</SelectItem>
                <SelectItem value="uc2">Programação I</SelectItem>
                <SelectItem value="uc3">Matemática I</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="turma">Turma *</Label>
            <Select value={turma} onValueChange={setTurma}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ei1a">EI-1A</SelectItem>
                <SelectItem value="ei1b">EI-1B</SelectItem>
                <SelectItem value="ei2a">EI-2A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tipoAula">Tipo de Aula *</Label>
            <Select value={tipoAula} onValueChange={setTipoAula}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teorica">Teórica</SelectItem>
                <SelectItem value="pl">PL</SelectItem>
                <SelectItem value="lab">Laboratório</SelectItem>
                <SelectItem value="teorico-pratica">Teórico-Prática</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="horasSemanais">Horas Semanais *</Label>
            <Input
              id="horasSemanais"
              type="number"
              value={horasSemanais}
              onChange={(e) => setHorasSemanais(e.target.value)}
              placeholder="Ex: 4"
            />
          </div>

          <div>
            <Label htmlFor="periodoLetivo">Período Letivo *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-1">2024/2025 - 1º Semestre</SelectItem>
                <SelectItem value="2024-2">2024/2025 - 2º Semestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg mt-6">
          <h3 className="font-medium mb-2">Informações Importantes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Verifique a disponibilidade do docente antes de afetar</li>
            <li>• Certifique-se de que não há conflitos de horário</li>
            <li>• A carga horária será contabilizada automaticamente</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="default">Afetar Docente</Button>
          <Button variant="outline">Limpar Formulário</Button>
          <Button variant="ghost">Cancelar</Button>
        </div>
      </Card>
    </div>
  );
};

export default Affectations;
