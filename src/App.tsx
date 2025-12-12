import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/dasboard/Index";
import GenericPage from "./pages/GenericPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { menuStructure } from "./config/menuStructure";

import { ThemeProvider } from "./hooks/thme-provider";
import { MainLayout } from "./pages/App";
import UnderConstruction from "./pages/UnderConstruction";
import CreateSchedule from "./pages/schedules/CreateSchedule/CreateSchedule";
import ScheduleList from "./pages/schedules/ScheduleList";
import ClassromList from "./pages/classroom/ClassromList";
import DisciplineManagementList from "./pages/disciplinemanagement/DisciplineManagementList";
import EnrolledList from "./pages/registrations/EnrolledList";
import GeneralListing from "./pages/facultymanagement/GeneralListing";
import CandidateList from "./pages/exam/CandidateList";
import ScholarshipHoldersList from "./pages/bolsa/ScholarshipHoldersList";
import LaunchNotes from "./pages/rating(avaliation)/LaunchNotes";
import TeacherAttendance from "./pages/attendance/TeacherAttendance";
import AttendanceControl from "./pages/attendance/AttendanceControl";
import MarkAttendance from "./pages/attendance/MarkAttendance";
import UserAccess from "./pages/access/UserAccess";
import LoggedInUsers from "./pages/access/LoggedInUsers";
import AccessLogs from "./pages/access/AccessLogs";
import UserFunctionality from "./pages/access/UserFunctionality";
import RectoratePositions from "./pages/access/RectoratePositions";
import BlockAccess from "./pages/access/BlockAccess";
import AllAccesses from "./pages/access/AllAccesses";
import AcessGrup from "./pages/access/AccessGroup";
import TeacherProfile from "./pages/TeacherProfile";
import ActivitiesLecturesLic from "./pages/academiccalendar/activities-lectures";

import ExemptDays from "./pages/academiccalendar/ExemptDays";
import Parameters from "./pages/academiccalendar/Parameters";
import ProofDeadlines from "./pages/academiccalendar/ProofDeadlines";
import ActivitiesLecturesPos from "./pages/calendar-pos/ActivitiesLectures";
import ExamCalendarPos from "./pages/calendar-pos/ExamCalendar";
import DeadlinesPos from "./pages/calendar-pos/Deadlines";
import { ReactQueryProvider } from "./providers/react-query.provider";
import Deadlines from "./pages/academiccalendar/Deadlines";
import UCManagementPlan from "./pages/disciplinemanagement/UCManagementPlan";
import UcDepartmentManagement from "./pages/disciplinemanagement/UcDepartmentManagement";
import ControlNotes from "./pages/rating(avaliation)/control";
import FormulaUC from "./pages/rating(avaliation)/formula-uc";
import FormulaOral from "./pages/rating(avaliation)/formula-oral";
import ScheduleListEliminated from "./pages/schedules/ScheduleListEliminated";
import schedulesByUC from "./pages/schedules/SchedulesByUC";
import SchedulesByUC from "./pages/schedules/SchedulesByUC";
import TeacherSchedules from "./pages/schedules/TeacherSchedules";

import SchedulesInscription from "./pages/schedules/ScheduleInscription";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="uma-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ReactQueryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Index />} />
                <Route path="/horarios/criar" element={<CreateSchedule />} />
                <Route
                  path="horarios/inscricoes"
                  element={<SchedulesInscription />}
                />
                <Route path="/horarios/listar" element={<ScheduleList />} />
                <Route
                  path="/horarios/eliminados"
                  element={<ScheduleListEliminated />}
                />
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
                <Route path="/avaliacoes/controle" element={<ControlNotes />} />
                <Route path="/avaliacoes/formula-uc" element={<FormulaUC />} />
                <Route
                  path="/avaliacoes/formula-oral"
                  element={<FormulaOral />}
                />

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

                {/* <Route
                  path="/acessos/funcionalidade-utilizador"
                  element={<UserFunctionality />}
                /> */}

                <Route path="/acessos/grupo" element={<AcessGrup />} />
                {/*
                <Route path="/acessos/logados" element={<LoggedInUsers />} />
                <Route path="/acessos/bloquear" element={<BlockAccess />} />
                <Route path="/acessos/todos" element={<AllAccesses />} />
                <Route path="/acessos/logs" element={<AccessLogs />} />
                  <Route
                  path="/acessos/cargos"
                  element={<RectoratePositions />}
                />
                */}
                <Route path="/profile" element={<TeacherProfile />} />
                 <Route path="/horarios/uc" element={<SchedulesByUC />} /> 
                  <Route path="/horarios/docente" element={<TeacherSchedules />} />  

                <Route path="/horarios/uc" element={<SchedulesByUC />} />


                <Route path="/plano/uc-plano" element={<UCManagementPlan />} />
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
                <Route path="/calendario/parametros" element={<Parameters />} />
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
              </Route>
            </Routes>
          </BrowserRouter>
        </ReactQueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
