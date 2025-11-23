import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, FileCheck, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="space-y-6">
     <PageHeader
  title={`Olá,Isaac Isvaldo Bunga`}
 subtitle="Sistema de Gestão Académica da Universidade • Ano letivo 2025/2026" 
/>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Estudantes"
          value="2,845"
          icon={Users}
          description="Matriculados ativos"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Docentes"
          value="156"
          icon={GraduationCap}
          description="Corpo docente ativo"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Unidades Curriculares"
          value="342"
          icon={BookOpen}
          description="Distribuídas por curso"
        />
        <StatCard
          title="Avaliações Pendentes"
          value="28"
          icon={FileCheck}
          description="Aguardando validação"
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Eventos Próximos
            </CardTitle>
            <CardDescription>Calendário académico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
              <p className="text-sm font-medium">Início das Avaliações</p>
              <p className="text-xs text-muted-foreground">15 de Janeiro, 2025</p>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
              <p className="text-sm font-medium">Prazo Lançamento de Notas</p>
              <p className="text-xs text-muted-foreground">28 de Janeiro, 2025</p>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
              <p className="text-sm font-medium">Reunião Conselho Pedagógico</p>
              <p className="text-xs text-muted-foreground">5 de Fevereiro, 2025</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Estatísticas do Semestre
            </CardTitle>
            <CardDescription>Dados académicos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
              <span className="text-sm font-medium">Taxa de Aprovação</span>
              <span className="text-sm font-bold text-success">87%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
              <span className="text-sm font-medium">Assiduidade Média</span>
              <span className="text-sm font-bold text-success">92%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
              <span className="text-sm font-medium">Avaliações Realizadas</span>
              <span className="text-sm font-bold">1,246</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>Tarefas pendentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm font-medium">8 Pautas para validar</p>
              <p className="text-xs text-muted-foreground">Avaliações → Validação</p>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium">12 Novos candidatos</p>
              <p className="text-xs text-muted-foreground">Exame de Acesso</p>
            </div>
            <div className="flex flex-col gap-1 p-3 rounded-lg bg-accent/50">
              <p className="text-sm font-medium">3 Solicitações pendentes</p>
              <p className="text-xs text-muted-foreground">Comunicação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Links */}
      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido aos Módulos</CardTitle>
          <CardDescription>Módulos mais utilizados</CardDescription>
        </CardHeader>
        <CardContent>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  {[
    { name: "Avaliações", icon: FileCheck, path: "/avaliacoes/controle" },
    { name: "Assiduidade", icon: BookOpen, path: "/assiduidade/controle" },
    { name: "Horários", icon: Calendar, path: "/horarios/listar" },
    { name: "Estudantes", icon: Users, path: "/inscricoes/lista-geral" },
  ].map((module) => {
    const Icon = module.icon;

    return (
      <Link
        key={module.name}
        to={module.path}
        className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Icon className="h-8 w-8 text-primary" />
        <span className="text-sm font-medium">{module.name}</span>
      </Link>
    );
  })}
</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
