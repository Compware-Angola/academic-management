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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [openAvisoModal, setOpenAvisoModal] = useState(false);
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

        const agora = new Date();

        const avisosValidos = (avisosGrupo || []).filter((aviso) => {
          const ativo = aviso.STATUS === 1;

          const naoExpirado =
            !aviso.DATE_EXPIRACAO || new Date(aviso.DATE_EXPIRACAO) >= agora;

          return ativo && naoExpirado;
        });


        const avisoPrincipal = avisosValidos[0];

        const avisoAtivo = avisosGrupo?.[0];

        console.log("AVISOS VALIDOS: ", avisosValidos)
        
        //console.log("Grupo principal:", grupoPrincipal);
        //console.log("Avisos do grupo:", avisoAtivo);

useEffect(() => {
  if (avisoPrincipal) {
    setOpenAvisoModal(true);
  }
}, [avisoPrincipal]);
    
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

  <Dialog open={openAvisoModal} onOpenChange={setOpenAvisoModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl">
            🔔
          </div>

          <DialogTitle>{avisoPrincipal?.ASSUNTO}</DialogTitle>

          <DialogDescription className="pt-2 text-sm leading-6 text-slate-600">
            {avisoPrincipal?.DESCRICAO}
          </DialogDescription>
        </DialogHeader>

        {avisoPrincipal?.DATE_EXPIRACAO && (
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Expira em{" "}
              {new Date(avisoPrincipal.DATE_EXPIRACAO).toLocaleDateString(
                "pt-PT",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={() => setOpenAvisoModal(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>

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
