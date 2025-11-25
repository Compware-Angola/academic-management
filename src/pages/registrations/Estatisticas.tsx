import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Users, GraduationCap, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Estatisticas = () => {
  const [anoLetivo, setAnoLetivo] = useState("2024-2025");
  const [curso, setCurso] = useState("all");

  const estatisticas = [
    { titulo: "Total de Matrículas", valor: "2.456", icon: Users, variacao: "+12%", cor: "text-blue-500" },
    { titulo: "Novos Estudantes", valor: "845", icon: GraduationCap, variacao: "+8%", cor: "text-green-500" },
    { titulo: "Taxa de Ocupação", valor: "87%", icon: TrendingUp, variacao: "+5%", cor: "text-orange-500" },
    { titulo: "Cursos Ativos", valor: "24", icon: BarChart3, variacao: "0%", cor: "text-purple-500" },
  ];

  const estatisticasPorCurso = [
    { curso: "Eng. Informática", matriculados: 456, novos: 152, taxa: "92%" },
    { curso: "Medicina", matriculados: 389, novos: 98, taxa: "95%" },
    { curso: "Direito", matriculados: 342, novos: 115, taxa: "85%" },
    { curso: "Economia", matriculados: 298, novos: 89, taxa: "78%" },
    { curso: "Eng. Civil", matriculados: 267, novos: 94, taxa: "82%" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/inscricoes">Inscrições e Matrícula</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Estatísticas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Estatísticas de Matrículas</h1>

      <div className="flex gap-4 mb-6">
        <Select value={anoLetivo} onValueChange={setAnoLetivo}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024-2025">2024/2025</SelectItem>
            <SelectItem value="2023-2024">2023/2024</SelectItem>
          </SelectContent>
        </Select>
        <Select value={curso} onValueChange={setCurso}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos Cursos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Cursos</SelectItem>
            <SelectItem value="informatica">Eng. Informática</SelectItem>
            <SelectItem value="medicina">Medicina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {estatisticas.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 ${stat.cor}`} />
                <span className="text-sm font-medium text-green-600">{stat.variacao}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.valor}</h3>
              <p className="text-sm text-muted-foreground">{stat.titulo}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Estatísticas por Curso</h2>
        <div className="space-y-4">
          {estatisticasPorCurso.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{item.curso}</h3>
                <p className="text-sm text-muted-foreground">Matriculados: {item.matriculados} • Novos: {item.novos}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{item.taxa}</div>
                <div className="text-sm text-muted-foreground">Taxa de ocupação</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Estatisticas;
