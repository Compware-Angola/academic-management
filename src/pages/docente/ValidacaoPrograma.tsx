import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Download, Eye, CheckCircle, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ValidacaoPrograma = () => {
  const [estado, setEstado] = useState("all");

  const programas = [
    { id: 1, uc: "Matemática I", codigo: "MAT101", docente: "Prof. Dr. João Silva", documento: "Programa_Mat.pdf", dataSubmissao: "2025-01-10", estado: "Pendente Validação" },
    { id: 2, uc: "Física I", codigo: "FIS101", docente: "Prof.ª Dra. Maria Santos", documento: "Programa_Fis.pdf", dataSubmissao: "2025-01-12", estado: "Validado" },
    { id: 3, uc: "Química I", codigo: "QUI101", docente: "Prof. Dr. Carlos Manuel", documento: "Programa_Qui.pdf", dataSubmissao: "2025-01-08", estado: "Requer Alterações" },
  ];

  const getEstadoBadge = (estado: string) => {
    const variants = {
      "Pendente Validação": "secondary",
      "Validado": "default",
      "Requer Alterações": "outline",
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
            <BreadcrumbPage>Validação do Programa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Validação de Programas</h1>

      <div className="flex gap-4 mb-6">
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Estados</SelectItem>
            <SelectItem value="pendente">Pendente Validação</SelectItem>
            <SelectItem value="validado">Validado</SelectItem>
            <SelectItem value="alteracoes">Requer Alterações</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {programas.map((programa) => (
          <Card key={programa.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{programa.uc}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Código: {programa.codigo} • Docente: {programa.docente}
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
                {programa.estado === "Pendente Validação" && (
                  <>
                    <Button variant="default" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ValidacaoPrograma;
