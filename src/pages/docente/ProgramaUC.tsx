import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Upload, Eye } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ProgramaUC = () => {
  const [uc, setUc] = useState("");

  const programas = [
    { id: 1, uc: "Algoritmos e Estruturas de Dados", codigo: "ENG101", turma: "EI-2A", documento: "Programa_Algoritmos.pdf", dataSubmissao: "2025-01-10", estado: "Aprovado" },
    { id: 2, uc: "Programação I", codigo: "ENG102", turma: "EI-1A", documento: "Programa_Programacao.pdf", dataSubmissao: "2025-01-12", estado: "Pendente" },
    { id: 3, uc: "Estruturas de Dados", codigo: "ENG201", turma: "EI-2B", documento: "Programa_Estruturas.pdf", dataSubmissao: "2025-01-08", estado: "Aprovado" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Aprovado": "default",
      "Pendente": "secondary",
      "Rejeitado": "destructive",
    };
    return <Badge variant={variants[estado as keyof typeof variants] as any}>{estado}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docente">Docente</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Programa da UC</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Programas das Unidades Curriculares</h1>

      <div className="flex gap-4 mb-6">
        <Select value={uc} onValueChange={setUc}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecionar UC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alg">Algoritmos e Estruturas de Dados</SelectItem>
            <SelectItem value="prog">Programação I</SelectItem>
            <SelectItem value="est">Estruturas de Dados</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Submeter Novo Programa
        </Button>
      </div>

      <div className="space-y-4">
        {programas.map((programa) => (
          <Card key={programa.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{programa.uc}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Código: {programa.codigo} • Turma: {programa.turma}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Documento: {programa.documento}</span>
                    <span>Submetido em: {programa.dataSubmissao}</span>
                    {getEstadoBadge(programa.estado)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Conteúdo Programático:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Introdução aos conceitos fundamentais</li>
                <li>• Desenvolvimento de competências práticas</li>
                <li>• Avaliação contínua e exame final</li>
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramaUC;
