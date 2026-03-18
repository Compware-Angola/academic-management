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

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useFilterMenuByPermission } from "@/util/menuFilter";
import { useQueryAvisosPorGrupo } from "@/hooks/acess/use-query-avisos-por-grupo";
import { useEffect, useState } from "react";

const Index = () => {
  const [mostrarAviso, setMostrarAviso] = useState(true);
  const { user:userData} = useAuth();
  const { data: dashboard, isLoading: isLoadingDashboard } =
    useQueryDashboard();
      const { data: academicYear, isLoading: isLoadingAcademicYear } =
        useQueryAnoAcademico();

        const grupoPrincipal = userData?.groups?.find(
          (group) => group.type_group === 1
        );

        //onsole.log("TEACHER INFORMATION: ", userData)

        const { data: avisosGrupo, isLoading: isLoadingAvisos, error } = useQueryAvisosPorGrupo({grupoId: grupoPrincipal?.codigo});

        const avisoAtivo = avisosGrupo?.[0];

        //console.log("Grupo principal:", grupoPrincipal);
        //console.log("Avisos do grupo:", avisoAtivo);

        useEffect(() => {
          if (avisoAtivo) {
            setMostrarAviso(true);
          }
        }, [avisoAtivo]);

      function fecharAviso() {
      setMostrarAviso(false);
    }
    
      // encontra o ano activo
      const activeAcademicYear = academicYear?.find(
        (year) => year.estado.toLowerCase() === "activo",
      );
  const quickLinks = [
  {
    name: "Avaliações",
    icon: FileCheck,
    path: "/avaliacoes/controle",
    permission: [],
  },
  {
    name: "Assiduidade",
    icon: BookOpen,
    path: "/assiduidade/controle",
    permission: [],
  },
  {
    name: "Horários",
    icon: Calendar,
    path: "/horarios/listar",
    permission: [],
  },
  {
    name: "Estudantes",
    icon: Users,
    path: "/inscricoes/lista-geral",
    permission: [],
  },
];
  const { user } = userData || {};


const allowedQuickLinks =  useFilterMenuByPermission(quickLinks);
  return (
    <div className="space-y-6">
  <PageHeader
  title={"Olá, " + (user?.nome ?? "N/A")}
  subtitle={
    "Sistema de Gestão Académica da Universidade • Ano letivo " +
    (activeAcademicYear?.designacao ?? "N/A")
  }
/>

  {avisoAtivo && mostrarAviso && (
  <div className="flex justify-center">
    <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
      <div className="h-1 w-full bg-amber-400" />

      <div className="relative px-6 py-5">
        <button
          onClick={fecharAviso}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-700"
          aria-label="Fechar aviso"
        >
          ✕
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">
            🔔
          </div>

          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
              Aviso importante
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {avisoAtivo.ASSUNTO}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {avisoAtivo.DESCRICAO}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <StatCard
          title="Avaliações Pendentes"
          value={formatNumber(dashboard?.aval_pendentes ?? 0)}
          icon={FileCheck}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UpcomingEventsCard />

        <SemesterStatsCard
         title={"Desempenho Académico  " + (activeAcademicYear?.designacao ?? "N/A")}
         
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
  <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
  {allowedQuickLinks.map((module) => {
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
