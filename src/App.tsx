import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/dasboard/Index";
import Login from "./pages/Login";


import { ThemeProvider } from "./hooks/thme-provider";
import { MainLayout } from "./pages/App";
import UnderConstruction from "./pages/UnderConstruction";
import CreateSchedule from "./pages/schedules/CreateSchedule/CreateSchedule";
import ScheduleList from "./pages/schedules/ScheduleList";
import ClassromList from "./pages/classroom/ClassromList";
import DisciplineManagementList from "./pages/disciplinemanagement/DisciplineManagementList";
import GeneralListing from "./pages/facultymanagement/GeneralListing";

import LaunchNotes from "./pages/rating(avaliation)/LaunchNotes";
import UserAccess from "./pages/access/UserAccess";
import LoggedInUsers from "./pages/access/LoggedInUsers";
import UserFunctionality from "./pages/access/UserFunctionality";
import RectoratePositions from "./pages/access/RectoratePositions";
import BlockAccess from "./pages/access/BlockAccess";

import AcessGrup from "./pages/access/AccessGroup";
import TeacherProfile from "./pages/TeacherProfile";
import ActivitiesLecturesLic from "./pages/academiccalendar/activities-lectures";

import ExemptDays from "./pages/academiccalendar/ExemptDays";
import Parameters from "./pages/academiccalendar/Parameters";
import ActivitiesLecturesPos from "./pages/calendar-pos/ActivitiesLectures";
import ExamCalendarPos from "./pages/calendar-pos/ExamCalendar";
import { ReactQueryProvider } from "./providers/react-query.provider";
import Deadlines from "./pages/academiccalendar/Deadlines";
import UCManagementPlan from "./pages/disciplinemanagement/UCManagementPlan";
import UcDepartmentManagement from "./pages/disciplinemanagement/UcDepartmentManagement";
import ControlNotes from "./pages/rating(avaliation)/control";
import FormulaUC from "./pages/rating(avaliation)/formula-uc";
import FormulaOral from "./pages/rating(avaliation)/formula-oral";
import ScheduleListEliminated from "./pages/schedules/ScheduleListEliminated";
import SchedulesByUC from "./pages/schedules/SchedulesByUC";
import TeacherSchedules from "./pages/schedules/TeacherSchedules";
import SchedulesInscription from "./pages/schedules/ScheduleInscription";
import MovimentarEstudantes from "./pages/schedules/MoveStudents";
import HorariosSemanais from "./pages/schedules/HorariosSemanais";
import HealpFAQ from "./pages/healp/HealpFAQ";
import SchedulesWithPermission from "./pages/schedules/SchedulesWithPermission";
import { EditSchedule } from "./pages/schedules/EditSchedule";
import SchedulesByRoom from "./pages/schedules/ScheduleByRoom";
import PresenceList from "./pages/rating(avaliation)/ListaPresenca";
import LancamentoPauta from "./pages/rating(avaliation)/LancamentoPauta";
import LaunchHistoric from "./pages/rating(avaliation)/launch-historic";
import MarkingAssessment from "./pages/rating(avaliation)/marking-assessment";
import StatisticAssessment from "./pages/rating(avaliation)/statistic";
import Permission from "./pages/rating(avaliation)/permission/permission";
import PautaGeral from "./pages/rating(avaliation)/pauta-geral";
import ViewNotes from "./pages/rating(avaliation)/view-notes";
import AddMarkingAssessment from "./pages/rating(avaliation)/marking-assessment/addMarkAssessment";
import ValidationTeacherAgenda from "./pages/rating(avaliation)/Validation-teacher-agenda";
import PautaGeralPorUC from "./pages/rating(avaliation)/pauta-geral-uc";
import EstudantesInscritos from "./pages/rating(avaliation)/enrolled-students";
import GeneralParametersAvaluation from "./pages/rating(avaliation)/parameters";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import AccessDenied from "./pages/AccessDenied";
import Grupos from "./pages/controle-acesso/grupos";
import ListarGrupos from "./pages/access/ListarTodosGrupos";
import AccessGroup from "./pages/access/AccessGroup";
import CreateUser from "./pages/access/CreateUser";
import { ListarAcessos } from "./pages/access/AllAccesses";
import LogsAcessos from "./pages/access/LogsAccess";
import DirectorCourseAccess from "./pages/controle-acesso/dir-surso/DiretorCurso";
import SolicitacoesEncaminhadas from "./pages/controle-acesso/solicitacao/SolicitacoesEncaminhadas";
import { AuthProvider } from "./providers/auth.provider";
import { PublicRoute } from "./components/auth/publicRounte";
import ListarNotasPagamento from "./pages/financas/notas-pagamento/ListarNotasPagamento";
import PagamentosReferencia from "./pages/financas/area-financeira/PagamentosReferencia";
import NegociacaoDivida from "./pages/financas/area-financeira/NegociacaoDivida";
import ListarCreditoEducacional from "./pages/financas/credito-educacional/ListarCreditoEducacional";
import CreateInstituicao from "./pages/financas/credito-educacional/CriarInstituicao";
import TodasInstituicoes from "./pages/financas/credito-educacional/TodasInstituicoes";
import AtribuirCredito from "./pages/financas/credito-educacional/AtribuirCredito";
import PerfilEstudante from "./pages/estudante/PerfilEstudante";


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="uma-ui-theme">
      <BrowserRouter>
        <ReactQueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<Login />} />
                </Route>

                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Index />} />
                  <Route
                    path="/horarios/criar"
                    element={
                      <ProtectedRoute
                        allowedGroups={["adm", "dct", "rootAdmin"]}
                      >
                        <CreateSchedule />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/controle-acesso/diretor"
                    element={
                      <ProtectedRoute
                        allowedGroups={["adm", "dct", "rootAdmin"]}
                      >
                        <DirectorCourseAccess />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/controle-acesso/solicitacoes"
                    element={
                      <ProtectedRoute
                        allowedGroups={["adm", "dct", "rootAdmin"]}
                      >
                        <SolicitacoesEncaminhadas />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/financas/notas-pagamento"
                    element={
                      <ProtectedRoute
                        allowedGroups={["adm", "dct", "rootAdmin"]}
                      >
                        <ListarNotasPagamento />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/financas/credito/instituicoes"
                    element={
                      <ProtectedRoute
                        allowedGroups={["adm", "dct", "rootAdmin"]}
                      >
                        <CreateInstituicao />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="horarios/inscricoes"
                    element={<SchedulesInscription />}
                  />
                  <Route path="/horarios/listar" element={<ScheduleList />} />
                  <Route
                    path="/horarios/eliminados"
                    element={<ScheduleListEliminated />}
                  />
                  <Route
                    path="/horarios/permissao"
                    element={<SchedulesWithPermission />}
                  />
                  <Route path="/schedule/:id/edit" element={<EditSchedule />} />
                  <Route path="horarios/sala" element={<SchedulesByRoom />} />
                  <Route path="/salas/listar" element={<ClassromList />} />
                  <Route
                    path="/plano/disciplinas"
                    element={<DisciplineManagementList />}
                  />
                  {/* <Route
                  path="/inscricoes/matriculados"
                  element={<EnrolledList />}
                /> */}
                  <Route
                    path="/gestao-docentes/listagem"
                    element={<GeneralListing />}
                  />
                  {/* <Route
                  path="/exame/lista-candidatos"
                  element={<CandidateList />}
                /> */}
                  <Route path="/avaliacoes/notas" element={<LaunchNotes />} />
                  <Route
                    path="/avaliacoes/controle"
                    element={<ControlNotes />}
                  />
                  <Route
                    path="/avaliacoes/formula-uc"
                    element={<FormulaUC />}
                  />
                  <Route
                    path="/avaliacoes/presenca"
                    element={<PresenceList />}
                  />
                  <Route
                    path="/avaliacoes/pauta"
                    element={<LancamentoPauta />}
                  />
                  <Route
                    path="avaliacoes/pauta-geral"
                    element={<PautaGeral />}
                  />
                  <Route
                    path="avaliacoes/pauta-uc"
                    element={<PautaGeralPorUC />}
                  />
                  <Route
                    path="/avaliacoes/validacao"
                    element={<ValidationTeacherAgenda />}
                  />
                  <Route
                    path="/avaliacoes/formula-oral"
                    element={<FormulaOral />}
                  />
                  <Route
                    path="/avaliacoes/historico"
                    element={<LaunchHistoric />}
                  />
                  <Route
                    path="/avaliacoes/estudantes"
                    element={<EstudantesInscritos />}
                  />
                  <Route
                    path="/marcacao-provas/controle"
                    element={<MarkingAssessment />}
                  />
                  <Route
                    path="avaliacoes/estatisticas"
                    element={<StatisticAssessment />}
                  />
                  <Route path="avaliacoes/permissao" element={<Permission />} />
                  <Route path="avaliacoes/visualizar" element={<ViewNotes />} />
                  <Route
                    path="avaliacoes/parametros"
                    element={<GeneralParametersAvaluation />}
                  />
                  <Route
                    path="marcacao-provas/marcacao"
                    element={<AddMarkingAssessment />}
                  />
                  {/* <Route
                    <Route
                    path="/estudante/:matricula"
                    element={<PerfilEstudante />}
                  />
                  {/*
                  {/* <Route
                  path="/bolsa/bolseiros"
                  element={<ScholarshipHoldersList />}
                /> */}
                  {/*
                <Route
                  path="/assiduidade/docente"
                  element={<TeacherAttendance />}
                />
                <Route
                  path="/assiduidade/controle"
                  element={<AttendanceControl />}
                />
                <Route
                  path="/assiduidade/marcar"
                  element={<MarkAttendance />}
                />
              */}

                  <Route path="/acessos/utilizador" element={<UserAccess />} />
                  <Route
                    path="/acessos/criar-utilizador"
                    element={<CreateUser />}
                  />
                  <Route
                    path="/acessos/funcionalidade-utilizador"
                    element={<UserFunctionality />}
                  />
                  <Route path="/acessos/grupo" element={<AcessGrup />} />
                  <Route
                    path="/acessos/grupos/utilizadores"
                    element={<ListarGrupos />}
                  />
                  <Route path="/controle-acesso/grupos" element={<Grupos />} />
                  <Route
                    path="/ver-utilizadores/grupos"
                    element={<AccessGroup />}
                  />
                  <Route path="/acessos/logados" element={<LoggedInUsers />} />
                  <Route path="/acessos/bloquear" element={<BlockAccess />} />
                  <Route path="/acessos/todos" element={<ListarAcessos />} />
                  <Route path="/acessos/logs" element={<LogsAcessos />} />
                  <Route
                    path="/acessos/cargos"
                    element={<RectoratePositions />}
                  />
                  <Route path="/profile" element={<TeacherProfile />} />
                  <Route path="/horarios/uc" element={<SchedulesByUC />} />
                  <Route
                    path="/horarios/docente"
                    element={<TeacherSchedules />}
                  />
                  <Route
                    path="/horarios/semanais"
                    element={<HorariosSemanais />}
                  />
                  <Route
                    path="/horarios/movimentar/estudantes"
                    element={<MovimentarEstudantes />}
                  />
                  <Route
                    path="/plano/uc-plano"
                    element={<UCManagementPlan />}
                  />
                  <Route
                    path="/plano/uc-departamento"
                    element={<UcDepartmentManagement />}
                  />
                  <Route
                    path="/calendario/atividades"
                    element={<ActivitiesLecturesLic />}
                  />
                  <Route
                    path="/calendario/dias-isentos"
                    element={<ExemptDays />}
                  />
                  <Route
                    path="/calendario/parametros"
                    element={<Parameters />}
                  />
                  <Route path="/calendario/prazos" element={<Deadlines />} />
                  <Route
                    path="/calendario-pos/atividades"
                    element={<ActivitiesLecturesPos />}
                  />
                  <Route
                    path="/calendario-pos/provas"
                    element={<ExamCalendarPos />}
                  />
                  <Route path="/alunos/novo" element={<UnderConstruction />} />
                  {/* <Route path="*" element={<NotFound />} />*/}
                  <Route path="*" element={<UnderConstruction />} />
                  {/* Finanças */}

                  <Route
                    path="/financas/pagamento-referencia"
                    element={<PagamentosReferencia />}
                  />
                  <Route
                    path="/financas/negociacao-divida"
                    element={<NegociacaoDivida />}
                  />
                  <Route
                    path="financas/credito/listar"
                    element={<ListarCreditoEducacional />}
                  />
                  <Route
                    path="financas/credito/instituicoes/todas"
                    element={<TodasInstituicoes />}
                  />
                  <Route
                    path="financas/credito/atribuir"
                    element={<AtribuirCredito />}
                  />

                  <Route path="/ajuda" element={<HealpFAQ />} />
                  <Route path="/sem-permissao" element={<AccessDenied />} />
                </Route>
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
