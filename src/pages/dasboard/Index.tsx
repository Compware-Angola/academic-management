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

  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import UpcomingEventsCard from "./components/UpcomingEventsCard";
import QuickActionsCard from "./components/QuickActionsCard";
import { useAuth } from "@/hooks/use-auth";
import { useQueryDashboard } from "@/hooks/dashboard/use-query-dashboard";
import { formatNumber } from "@/util/format-number";
import { useFilterMenuByPermission } from "@/util/menuFilter";
import { useQueryConfigurationGeral } from "@/hooks/academiccalendar/use-query-configuration";
import { PaymentServiceComparison } from "./components/payment-comparison";
import { PaymentComparisonChart } from "./components/payment-comparison-chart";
import { PaymentDailyStatsCard } from "./components/paymentt-daily-Stats-card";
import { usePermission } from "@/auth/permission.helper";
import { StudentEnrollmentStatsCard } from "./components/student-enrollment-stats-card";


const Index = () => {

  const { haveFullAccess } = usePermission();
  const { user: userData } = useAuth();
  const { data: dashboard, isLoading: isLoadingDashboard } =
    useQueryDashboard();
  const { data: configurationGeral, isLoading: isLoadingConfigurationGeral } =
    useQueryConfigurationGeral();
  const canViewStats = haveFullAccess()


  // encontra o ano activo

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


  const allowedQuickLinks = useFilterMenuByPermission(quickLinks);
  return (
    <div className="space-y-6">
      <PageHeader
        title={"Olá, " + (user?.nome ?? "N/A")}
        subtitle={
          "Sistema de Gestão Académica da Universidade • Ano letivo " +
          (configurationGeral?.anoLectivo?.designacao ?? "N/A")
        }
      />

      {/* <Dialog open={openAvisoModal} onOpenChange={setOpenAvisoModal}>

      </Dialog> */}

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Estudantes Inscritos"
          value={formatNumber(dashboard?.total_estudantes ?? 0)}
          icon={Users}
          isAvailable={false}
          description="Inscritos no Ano Lectivo Atual"
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <UpcomingEventsCard />

        {/* <SemesterStatsCard
          title={"Desempenho Académico do  " + (configurationGeral?.semestreAtual?.semestre === 1 ? "1º" : "2º") + " Semestre"}

          description={""}

        /> */}

        <QuickActionsCard
          title="Configuração Académica Atual"
          description=""
          configuration={configurationGeral}
          isLoading={isLoadingConfigurationGeral}

        />
      </div>

      {/* {canViewStats && <div className="grid gap-4 md:grid-cols-2">
        <StudentEnrollmentStatsCard />
        <PaymentDailyStatsCard />
        <PaymentServiceComparison />
        <PaymentComparisonChart />
      </div>} */}

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
