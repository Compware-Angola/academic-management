import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  FileCheck,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import UpcomingEventsCard from "./components/UpcomingEventsCard";
import SemesterStatsCard from "./components/SemesterStatsCard";
import QuickActionsCard from "./components/QuickActionsCard";
import { useAuth } from "@/hooks/use-auth";
import { useQueryDashboard } from "@/hooks/dashboard/use-query-dashboard";
import { formatNumber } from "@/util/format-number";

const Index = () => {
  const { user } = useAuth();
  const { data: dashboard, isLoading: isLoadingDashboard } =
    useQueryDashboard();
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Olá, ${user?.username}`}
        subtitle="Sistema de Gestão Académica da Universidade • Ano letivo 2025/2026"
      />

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de Estudantes"
          value={formatNumber(dashboard?.total_estudantes ?? 0)}
          icon={Users}
          description="Matriculados ativos"
        />
        <StatCard
          title="Docentes"
          value={formatNumber(dashboard?.total_docentes ?? 0)}
          icon={GraduationCap}
        />
        <StatCard
          title="Unidades Curriculares"
          value={formatNumber(dashboard?.total_uc ?? 0)}
          icon={BookOpen}
        />
        {/* <StatCard
          title="Avaliações Pendentes"
          value={formatNumber(dashboard?.aval_pendentes ?? 0)}
          icon={FileCheck}
        /> */}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UpcomingEventsCard />

        <SemesterStatsCard
          title="Desempenho Académico 2024/2025"
          description="Licenciatura em Engenharia Informática"
          
        />

        <QuickActionsCard
          title="Tarefas Urgentes"
          description="Ações que requerem atenção"
      
        />
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
              {
                name: "Avaliações",
                icon: FileCheck,
                path: "/avaliacoes/controle",
              },
              {
                name: "Assiduidade",
                icon: BookOpen,
                path: "/assiduidade/controle",
              },
              { name: "Horários", icon: Calendar, path: "/horarios/listar" },
              {
                name: "Estudantes",
                icon: Users,
                path: "/inscricoes/lista-geral",
              },
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
