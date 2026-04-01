import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/dasboard/Index";
import Login from "./pages/auth/Login";

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
import TipoCredito from "./pages/financas/credito-educacional/tipo-credito";
import CreateInstituicao from "./pages/financas/credito-educacional/CriarInstituicao";
import TodasInstituicoes from "./pages/financas/credito-educacional/TodasInstituicoes";
import PerfilEstudante from "./pages/estudante/PerfilEstudante";
import AtribuirCredito from "./pages/financas/credito-educacional/AtribuirCredito";
import ListarBolsa from "./pages/financas/credito-educacional/bolsa/ListarBolsa";
import ListaBolseiro from "./pages/financas/credito-educacional/bolsa/ListarBolsaEstudante";
import { PermissionTypeDetails } from "./constants/permission.type";
import ServicosEmolumentos from "./pages/financas/area-financeira/ServicosEmolumentos";
import PrimeiroAcessoEmail from "./pages/auth/PrimeiroAcessoEmail";
import RedefinirSenhaPrimeiroAcesso from "./pages/auth/RedefinirSenhaPrimeiroAcesso";
import ListaSolicitacoes from "./pages/suporte/ListaSolicitacoes";
import TiposSuporte from "./pages/suporte/tiposSuporte";
import BoasVindas from "./pages/auth/BoasVindas";
import Avisos from "./pages/controle-acesso/solicitacao/Avisos";
import Solicitacoes from "./pages/controle-acesso/solicitacao/Solicitacoes";
import PagamentoTFC from "./pages/defesa-tfc/PagamentoTFC";
import MarcarAssiduidade from "./pages/assiduidade/MarcarAssiduidade";
import ListarEstudanteFinalista from "./pages/defesa-tfc/ListarEEstudanteFinalista";
import LiquidarNota from "./pages/financas/notas-pagamento/LiquidarNota";
import DocenteLancamentoProgramaUC from "./pages/docente/ProgramaUC";
import IsencaoServico from "@/pages/financas/isencao-servico";
import ListarDescontos from "./pages/financas/descontos/ListarDescontos";
import UploadImagem from "./pages/controle-acesso/solicitacao/CreateImagePortal";
import ControleAssiduidade from "./pages/assiduidade/ControleAssiduidade";
import ListarPagamentos from "./pages/financas/notas-pagamento/ListarPagamentos";
import AtribuirDescontos from "./pages/financas/descontos/AtribuirDescontos";
import ValidacaoPrograma from "./pages/docente/ValidacaoPrograma";
import AulasAgendadas from "./pages/sumario/AulasAgendadas";
import ParametrosSumario from "./pages/sumario/ParametrosSumario";
import ControleGeral from "./pages/sumario/ControleGeral";
import ListagemSumarios from "./pages/sumario/ListagemSumarios";
import HorasVigilancia from "./pages/docente/HorasVigilancia";
import AssiduidadeDocente from "./pages/docente/AssiduidadeDocente";
import ListarOrientadores from "./pages/defesa-tfc/ListarOrientadores";
import CalendarioAulasDocente from "./pages/docente/CalendarioAulasDocenteContent";
import ControleGeralPorDocente from "./pages/assiduidade";
import Parametros from "./pages/gestao_docente/Parametros";
import SalarioDocente from "./pages/gestao_docente/Salario_docente";
import GestaoAfectacao from "./pages/gestao_docente/GestaoAfectacao";
import ListarUCDocenteSemAfetacao from "./pages/gestao_docente/listar-uc-docente-sem-afetacao";
import { DocenteAfectacao } from "./pages/gestao_docente/DocenteAfectacao";
import ListagemDocentes from "./pages/gestao_docente/ListDocentes";
import ListaCandidatos from "./pages/access_exam/ListaCandidatos";
import AlterarSenhaExame from "./pages/access_exam/AlterarSenhaExame";

import InscricaoEpocaEspecial from "./pages/access_exam/InscricaoEpocaEspecial";

import HorariosPorCurso from "./pages/access_exam/HorariosPorCurso";
import PautaGeralExame from "./pages/access_exam/PautaGeralExame";
import CandidatosComESemProva from "./pages/access_exam/CandidatosComESemProva";
import { ListaPresencaExame } from "./pages/access_exam/ListaPresencaExame";
import NotificacoesPage from "./pages/notification/Notificacoespage";
import VinculosTFC from "./pages/defesa-tfc/VinculosTFC";
import Regentes from "./pages/gestao_docente/Regentes";
import ListaGeralEstudantes from "./pages/registrations/GeneralListStudents";
import AdmitirCandidaturaUniversidadePublica from "./pages/access_exam/AdmitirCandidaturaUniversidadePublica";
<<<<<<< HEAD
import InscritosPorUc from "./pages/registrations/InscritosPorUc";
=======
import ListaProvaPorCandidatos from "./pages/access_exam/ListaProvaPorCandidatos";
import ConsultarProvaIndividual from "./pages/access_exam/ConsultarProvaIndividual";
import AtribuirProva from "./pages/access_exam/AtribuirProva";
import ResetarProva from "./pages/access_exam/ResetarProva";
import LancarNotaArquitectura from "./pages/access_exam/LancarNotaArquitectura";
import { InscricaoSemUc } from "./pages/registrations/InscricaoSemUc";
import { EstudantesMatriculado } from "./pages/registrations/EstudantesMatriculado";
>>>>>>> 570e0ad8e6ba175b2314d00b358bcee8ddf8663e

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="uma-ui-theme">
      <BrowserRouter>
        <ReactQueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" closeButton richColors />
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<Login />} />
                </Route>
                <Route element={<PublicRoute />}>
                  <Route
                    path="/primeiro-acesso"
                    element={<PrimeiroAcessoEmail />}
                  />
                </Route>
                <Route element={<PublicRoute />}>
                  <Route path="/boas-vindas" element={<BoasVindas />} />
                </Route>

                <Route element={<PublicRoute />}>
                  <Route
                    path="/auth/primeiro-acesso/redefinir/:token"
                    element={<RedefinirSenhaPrimeiroAcesso />}
                  />
                </Route>

                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Index />} />
                  <Route
                    path="/horarios/criar"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.CRIAR_HORARIO.sigla!,
                        ]}
                      >
                        <CreateSchedule />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/controle-acesso/diretor"
                    element={
                      <ProtectedRoute allowedPermissions={[]}>
                        <DirectorCourseAccess />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/controle-acesso/solicitacoes"
                    element={<SolicitacoesEncaminhadas />}
                  />
                  <Route
                    path="/financas/listar-pagamentos"
                    element={<ListarPagamentos />}
                  />

                  <Route
                    path="/controle-acesso/all-solicitacoes"
                    element={<Solicitacoes />}
                  />
                  <Route path="/notificacoes" element={<NotificacoesPage />} />

                  <Route path="/comunicacao/avisos" element={<Avisos />} />
                  <Route
                    path="/comunicacao/avisos/imagem"
                    element={<UploadImagem />}
                  />
                  <Route
                    path="/gestao-docentes/parametros"
                    element={<Parametros />}
                  />
                  <Route
                    path="/gestao-docentes/salario"
                    element={<SalarioDocente />}
                  />
                  <Route
                    path="/financas/notas-pagamento/liquidar/:codigo"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LIQUIDAR_NOTA_PAGAMENTO.sigla!,
                        ]}
                      >
                        <LiquidarNota />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/financas/notas-pagamento"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.FACTURAS.sigla!,
                        ]}
                      >
                        <ListarNotasPagamento />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/financas/servicos-emolumentos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.SERVICOS_PRECARIOS.sigla!,
                        ]}
                      >
                        <ServicosEmolumentos />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/financas/credito/instituicoes"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.INSTITUICOES.sigla!,
                        ]}
                      >
                        <CreateInstituicao />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="horarios/inscricoes"
                    element={<SchedulesInscription />}
                  />
                  <Route
                    path="sumario/aulas-agendadas"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.AULAS_AGENDADAS.sigla!,
                        ]}
                      >
                        <AulasAgendadas />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="sumario/parametros"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.SUMARIO_PARAMETROS.sigla!,
                        ]}
                      >
                        <ParametrosSumario />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/horarios/listar" element={<ScheduleList />} />
                  <Route
                    path="/horarios/eliminados"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTAR_HORARIOS_ELIMINADOS
                            .sigla!,
                        ]}
                      >
                        <ScheduleListEliminated />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/horarios/permissao"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PERMISSAO_PARA_EDITAR_HORARIO
                            .sigla,
                        ]}
                      >
                        <SchedulesWithPermission />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/schedule/:id/edit" element={<EditSchedule />} />
                  <Route path="horarios/sala" element={<SchedulesByRoom />} />
                  <Route
                    path="/salas/listar"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTAR_SALAS.sigla!,
                        ]}
                      >
                        <ClassromList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plano/disciplinas"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.GESTAO_DISCIPLINAS.sigla!,
                        ]}
                      >
                        <DisciplineManagementList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/assiduidade/marcacao"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.MARCAR_ASSIDUIDADE_MSA.sigla,
                          PermissionTypeDetails.MARCAR_ASSIDUIDADE_PROVA.sigla,
                        ]}
                      >
                        <MarcarAssiduidade />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/assiduidade/controle"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.CONTROLE_DE_ASSIDUIDADES.sigla,
                        ]}
                      >
                        <ControleAssiduidade />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/assiduidade/docente"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.CONTROLE_DE_ASSIDUIDADES.sigla,
                        ]}
                      >
                        <ControleGeralPorDocente />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/sumario/controle-geral"
                    element={<ControleGeral />}
                  />
                  <Route
                    path="/sumario/listar"
                    element={<ListagemSumarios />}
                  />

                  <Route
                    path="/gestao-docentes/listagem"
                    element={<GeneralListing />}
                  />
                  <Route
                    path="/docente/programa"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.DOCENTE_LANCAMENTO_PROGRAMA_UC
                            .sigla,
                        ]}
                      >
                        <DocenteLancamentoProgramaUC />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/docente/validacao"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.VALIDACAO_PROGRAMA_UC.sigla,
                        ]}
                      >
                        <ValidacaoPrograma />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/docente/assiduidade"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.MINHAS_ASSIDUIDADES.sigla,
                        ]}
                      >
                        <AssiduidadeDocente />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route
                  path="/exame/lista-candidatos"
                  element={<CandidateList />}
                /> */}
                  <Route
                    path="/avaliacoes/notas"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LANCAMENTO_NOTAS_MPGS.sigla,
                        ]}
                      >
                        <LaunchNotes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/controle"
                    element={<ControlNotes />}
                  />
                  <Route
                    path="/avaliacoes/formula-uc"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .DEFINIR_FORMULA_UNIDADE_CURRICULAR.sigla!,
                        ]}
                      >
                        <FormulaUC />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/presenca"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTA_PRESENCA.sigla!,
                        ]}
                      >
                        <PresenceList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/pauta"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LANCAMENTO_PAUTA.sigla!,
                        ]}
                      >
                        <LancamentoPauta />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="avaliacoes/pauta-geral"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PAUTA_GERAL.sigla!,
                        ]}
                      >
                        <PautaGeral />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="avaliacoes/pauta-uc"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PAUTA_GERAL_POR_UC.sigla!,
                        ]}
                      >
                        <PautaGeralPorUC />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/validacao"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.VALIDACAO_LANCAMENTO_PAUTA
                            .sigla!,
                        ]}
                      >
                        <ValidationTeacherAgenda />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/formula-oral"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .DEFINIR_UNIDADE_CURRICULAR_COM_ORAL.sigla!,
                        ]}
                      >
                        <FormulaOral />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/historico"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.HISTORICO_LANCAMENTO_NOTAS
                            .sigla!,
                        ]}
                      >
                        <LaunchHistoric />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/avaliacoes/estudantes"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .ESTUDANTES_INSCRITOS_POR_AVALIACAO.sigla!,
                        ]}
                      >
                        <EstudantesInscritos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/marcacao-provas/controle"
                    element={<MarkingAssessment />}
                  />
                  <Route
                    path="avaliacoes/estatisticas"
                    element={<StatisticAssessment />}
                  />
                  <Route
                    path="avaliacoes/permissao"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PERMISSAO_LANC_NOTA_FORA_PRAZO
                            .sigla!,
                        ]}
                      >
                        <Permission />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="avaliacoes/visualizar"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LANCAMENTO_NOTAS_AVALIACOES
                            .sigla!,
                        ]}
                      >
                        <ViewNotes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="avaliacoes/parametros"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PARAMETROS_GERAIS_AVALIACAO
                            .sigla!,
                        ]}
                      >
                        <GeneralParametersAvaluation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="marcacao-provas/marcacao"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PRAZO_MARCACAO_PROVAS_LANC_NOTAS
                            .sigla!,
                        ]}
                      >
                        <AddMarkingAssessment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/estudante/:matricula"
                    element={<PerfilEstudante />}
                  />

                  {/* EXAME ACESSO */}

                  <Route
                    path="/exame/presenca"
                    element={<ListaPresencaExame />}
                  />
                  <Route
                    path="/exame/admitir"
                    element={<AdmitirCandidaturaUniversidadePublica />}
                  />
                  <Route
                    path="/exame/provas-candidato"
                    element={<ListaProvaPorCandidatos />}
                  />

                  <Route
                    path="/exame/consultar-prova"
                    element={<ConsultarProvaIndividual />}
                  />
                  <Route
                    path="/exame/atribuir-prova"
                    element={<AtribuirProva />}
                  />
                  <Route
                    path="/exame/lancar-nota-arquitectura"
                    element={<LancarNotaArquitectura />}
                  />
                  <Route path="/exame/resetar" element={<ResetarProva />} />
                  <Route
                    path="/exame/lista-candidatos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.CANDIDATOS_INSCRITOS.sigla!,
                        ]}
                      >
                        <ListaCandidatos />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/exame/pauta-geral"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PAUTA_GERAL_EXAME_ACESSO.sigla!,
                        ]}
                      >
                        <PautaGeralExame />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/exame/candidatos-prova"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .LISTA_CANDIDATOS_SEM_PROVAS_MARCADAS.sigla!,
                        ]}
                      >
                        <CandidatosComESemProva />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/exame/alterar-senha"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ALTERAR_SENHA_CANDIDATO.sigla!,
                        ]}
                      >
                        <AlterarSenhaExame />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/exame/epoca-especial"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.INSCRICAO_EXAME_ACESSO_ESPECIAL
                            .sigla!,
                        ]}
                      >
                        <InscricaoEpocaEspecial />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/exame/horarios"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTAR_HORARIO_PROVA_POR_CURSO
                            .sigla!,
                        ]}
                      >
                        <HorariosPorCurso />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/acessos/utilizador"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTA_DE_UTILIZADORES2.sigla!,
                          PermissionTypeDetails.LISTA_DE_UTILIZADORES.sigla!,
                        ]}
                      >
                        <UserAccess />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/acessos/criar-utilizador"
                    element={<CreateUser />}
                  />
                  {/*
                  <Route
                    path="/acessos/funcionalidade-utilizador"
                    element={<UserFunctionality />}
                  />
                  */}
                  <Route
                    path="/acessos/grupo"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .ACESSOS_FUNCIONALIDADES_POR_GRUPO.sigla!,
                        ]}
                      >
                        <AcessGrup />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/controle-acesso/grupos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.GRUPOS.sigla!,
                        ]}
                      >
                        <Grupos />
                      </ProtectedRoute>
                    }
                  />
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
                  <Route
                    path="/horarios/uc"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.VISUALIZAR_HORARIO_POR_UC
                            .sigla!,
                        ]}
                      >
                        <SchedulesByUC />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/horarios/docente"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTAR_HORARIOS.sigla,
                          PermissionTypeDetails.VISUALIZAR_HORARIO_POR_DOCENTE
                            .sigla,
                        ]}
                      >
                        <TeacherSchedules />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/horarios/semanais"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.VISUALIZAR_HORARIO_POR_DOCENTE
                            .sigla!,
                        ]}
                      >
                        <HorariosSemanais />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/docente/calendario"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.VISUALIZAR_HORARIO_POR_DOCENTE
                            .sigla!,
                        ]}
                      >
                        <CalendarioAulasDocente />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/horarios/movimentar/estudantes"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .MOVIMENTAR_ESTUDANTES_POR_HORARIO.sigla,
                        ]}
                      >
                        <MovimentarEstudantes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plano/uc-plano"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.GESTAO_UNIDADE_CURRICULAR_PLANO
                            .sigla!,
                        ]}
                      >
                        <UCManagementPlan />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plano/uc-departamento"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .GESTAO_UNIDADE_CURRICULAR_DEPARTAMENTO.sigla!,
                        ]}
                      >
                        <UcDepartmentManagement />
                      </ProtectedRoute>
                    }
                  />

                  {/*SUPORTE*/}

                  <Route
                    path="/suporte/solicitacoes"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LSOLICITACAO_SUPORTE.sigla!,
                        ]}
                      >
                        <ListaSolicitacoes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/suporte/tipos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.TIPO_SUPORTE.sigla!,
                        ]}
                      >
                        <TiposSuporte />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/calendario/atividades"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ACTIVIDADES_LECTIVAS.sigla!,
                        ]}
                      >
                        <ActivitiesLecturesLic />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendario/dias-isentos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.CRIAR_DIAS_ISENTOS.sigla!,
                        ]}
                      >
                        <ExemptDays />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendario/parametros"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PARAMETROS_CALENDARIO_ACADEMICO
                            .sigla!,
                        ]}
                      >
                        <Parameters />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendario/prazos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.CRIAR_PRAZO_ACADEMICO.sigla!,
                        ]}
                      >
                        <Deadlines />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/calendario-pos/atividades"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ACTIVIDADES_LECTIVAS.sigla!,
                        ]}
                      >
                        <ActivitiesLecturesPos />
                      </ProtectedRoute>
                    }
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
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PAGAMENTOS.sigla!,
                        ]}
                      >
                        <PagamentosReferencia />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/financas/negociacao-divida"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTAR_NEGOCIACAO_DIVIDA.sigla!,
                        ]}
                      >
                        <NegociacaoDivida />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="financas/credito/tipos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTAR_TIPO_CREDITO_EDUCACIONAL
                            .sigla,
                        ]}
                      >
                        <TipoCredito />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="financas/credito/instituicoes/todas"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.INSTITUICOES.sigla!,
                        ]}
                      >
                        <TodasInstituicoes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="financas/credito/atribuir"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO
                            .sigla!,
                        ]}
                      >
                        <AtribuirCredito />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="financas/credito/bolsa"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.HISTORICO_BOLSAS.sigla!,
                        ]}
                      >
                        <ListarBolsa />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="financas/credito/bolsa/estudante"
                    element={<ListaBolseiro />}
                  />

                  <Route
                    path="/financas/isencao-servico"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ISENCAO_SERVICO.sigla!,
                        ]}
                      >
                        <IsencaoServico />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/financas/descontos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO
                            .sigla!,
                        ]}
                      >
                        <ListarDescontos />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/financas/descontos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO
                            .sigla!,
                        ]}
                      >
                        <ListarDescontos />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/financas/descontos/atribuicao"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO
                            .sigla!,
                        ]}
                      >
                        <AtribuirDescontos />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/ajuda" element={<HealpFAQ />} />
                  <Route path="/sem-permissao" element={<AccessDenied />} />
                  <Route
                    path="/defesa-tfc/pagamentos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.PAGAMENTO_TFC.sigla!,
                        ]}
                      >
                        <PagamentoTFC />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/defesa-tfc/estudantes"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.DEFESA.sigla!,
                        ]}
                      >
                        <ListarEstudanteFinalista />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/defesa-tfc/orientadores"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.DEFESA.sigla!,
                        ]}
                      >
                        <ListarOrientadores />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/defesa-tfc/vinculos"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.DEFESA.sigla!,
                        ]}
                      >
                        <VinculosTFC />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route
                    path="/docente/validacao-uc"
                    element={<ValidacaoPrograma />}
                  /> */}
                  <Route
                    path="/docente/vigilancia"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.HORAS_DE_VIGILANCIA.sigla!,
                        ]}
                      >
                        <HorasVigilancia />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/gestao-docente/afectacoes"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.GESTAO_AFETACOES.sigla!,
                        ]}
                      >
                        <GestaoAfectacao />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/gestao-docente/sem-afetacao/uc"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTA_UC_SEM_DOCENTES_AFETADOS
                            .sigla,
                        ]}
                      >
                        <ListarUCDocenteSemAfetacao />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/gestao-docente/docente-afectados"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.GESTAO_AFETACOES.sigla!,
                        ]}
                      >
                        <DocenteAfectacao />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inscricoes/sem-uc"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails
                            .LISTAR_ESTUDANTES_SEM_INSCRICAO_UC.sigla!,
                        ]}
                      >
                        <InscricaoSemUc />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/inscricoes/matriculados"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.ESTUDANTES_MATRICULADOS.sigla!,
                        ]}
                      >
                        <EstudantesMatriculado />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/gestao-docentes/docentes"
                    element={
                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTA_DE_DOCENTES.sigla!,
                        ]}
                      >
                        <ListagemDocentes />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/gestao-docentes/regentes"

                    element={

                      <ProtectedRoute
                        allowedPermissions={[
                          PermissionTypeDetails.LISTA_DOCENTES_REGENTES.sigla!,
                        ]}
                      >
                        <Regentes />
                      </ProtectedRoute>
                  }

                  />

                  <Route
                    path="/inscricoes/lista-geral"

                    element={ <ListaGeralEstudantes />}

                  />

                  <Route
                    path="/inscricoes/inscritos-uc"

                    element={ <InscritosPorUc />}

                  />

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
