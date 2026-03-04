| URL                                        | Componente/Página            | Implementada | Observação       |
| ------------------------------------------ | ---------------------------- | ------------ | ---------------- |
| /                                          | Login                        | ✅ Sim       | Login público    |
| /primeiro-acesso                           | PrimeiroAcessoEmail          | ✅ Sim       |                  |
| /boas-vindas                               | BoasVindas                   | ✅ Sim       |                  |
| /auth/primeiro-acesso/redefinir/:token     | RedefinirSenhaPrimeiroAcesso | ✅ Sim       |                  |
| /dashboard                                 | Index                        | ✅ Sim       | Página principal |
| /horarios/criar                            | CreateSchedule               | ✅ Sim       | Protegida        |
| /horarios/listar                           | ScheduleList                 | ✅ Sim       | Protegida        |
| /horarios/eliminados                       | ScheduleListEliminated       | ✅ Sim       | Protegida        |
| /horarios/permissao                        | SchedulesWithPermission      | ✅ Sim       | Protegida        |
| /schedule/:id/edit                         | EditSchedule                 | ✅ Sim       |                  |
| /horarios/sala                             | SchedulesByRoom              | ✅ Sim       | Protegida        |
| /horarios/uc                               | SchedulesByUC                | ✅ Sim       | Protegida        |
| /horarios/docente                          | TeacherSchedules             | ✅ Sim       | Protegida        |
| /horarios/semanais                         | HorariosSemanais             | ✅ Sim       | Protegida        |
| /horarios/inscricoes                       | SchedulesInscription         | ✅ Sim       |                  |
| /horarios/movimentar/estudantes            | MovimentarEstudantes         | ✅ Sim       | Protegida        |
| /plano/disciplinas                         | DisciplineManagementList     | ✅ Sim       | Protegida        |
| /plano/uc-plano                            | UCManagementPlan             | ✅ Sim       | Protegida        |
| /plano/uc-departamento                     | UcDepartmentManagement       | ✅ Sim       | Protegida        |
| /docente/programa                          | DocenteLancamentoProgramaUC  | ✅ Sim       |                  |
| /avaliacoes/notas                          | LaunchNotes                  | ✅ Sim       | Protegida        |
| /avaliacoes/controle                       | ControlNotes                 | ✅ Sim       |                  |
| /avaliacoes/formula-uc                     | FormulaUC                    | ✅ Sim       | Protegida        |
| /avaliacoes/formula-oral                   | FormulaOral                  | ✅ Sim       | Protegida        |
| /avaliacoes/presenca                       | PresenceList                 | ✅ Sim       | Protegida        |
| /avaliacoes/pauta                          | LancamentoPauta              | ✅ Sim       | Protegida        |
| /avaliacoes/pauta-geral                    | PautaGeral                   | ✅ Sim       | Protegida        |
| /avaliacoes/pauta-uc                       | PautaGeralPorUC              | ✅ Sim       | Protegida        |
| /avaliacoes/validacao                      | ValidationTeacherAgenda      | ✅ Sim       | Protegida        |
| /avaliacoes/historico                      | LaunchHistoric               | ✅ Sim       | Protegida        |
| /avaliacoes/estudantes                     | EstudantesInscritos          | ✅ Sim       | Protegida        |
| /marcacao-provas/controle                  | MarkingAssessment            | ✅ Sim       |                  |
| /marcacao-provas/marcacao                  | AddMarkingAssessment         | ✅ Sim       |                  |
| /avaliacoes/estatisticas                   | StatisticAssessment          | ✅ Sim       |                  |
| /avaliacoes/permissao                      | Permission                   | ✅ Sim       | Protegida        |
| /avaliacoes/visualizar                     | ViewNotes                    | ✅ Sim       | Protegida        |
| /avaliacoes/parametros                     | GeneralParametersAvaluation  | ✅ Sim       | Protegida        |
| /acessos/utilizador                        | UserAccess                   | ✅ Sim       | Protegida        |
| /acessos/criar-utilizador                  | CreateUser                   | ✅ Sim       |                  |
| /acessos/grupo                             | AcessGrup                    | ✅ Sim       | Protegida        |
| /acessos/logados                           | LoggedInUsers                | ✅ Sim       |                  |
| /acessos/bloquear                          | BlockAccess                  | ✅ Sim       |                  |
| /acessos/todos                             | ListarAcessos                | ✅ Sim       |                  |
| /acessos/logs                              | LogsAcessos                  | ✅ Sim       |                  |
| /acessos/cargos                            | RectoratePositions           | ✅ Sim       |                  |
| /controle-acesso/diretor                   | DirectorCourseAccess         | ✅ Sim       | Protegida        |
| /controle-acesso/solicitacoes              | SolicitacoesEncaminhadas     | ✅ Sim       |                  |
| /controle-acesso/all-solicitacoes          | Solicitacoes                 | ✅ Sim       |                  |
| /controle-acesso/grupos                    | Grupos                       | ✅ Sim       | Protegida        |
| /comunicacao/avisos                        | Avisos                       | ✅ Sim       |                  |
| /comunicacao/avisos/imagem                 | UploadImagem                 | ✅ Sim       |                  |
| /suporte/solicitacoes                      | ListaSolicitacoes            | ✅ Sim       | Protegida        |
| /suporte/tipos                             | TiposSuporte                 | ✅ Sim       | Protegida        |
| /calendario/atividades                     | ActivitiesLecturesLic        | ✅ Sim       | Protegida        |
| /calendario/dias-isentos                   | ExemptDays                   | ✅ Sim       | Protegida        |
| /calendario/parametros                     | Parameters                   | ✅ Sim       | Protegida        |
| /calendario/prazos                         | Deadlines                    | ✅ Sim       | Protegida        |
| /calendario-pos/atividades                 | ActivitiesLecturesPos        | ✅ Sim       | Protegida        |
| /calendario-pos/provas                     | ExamCalendarPos              | ✅ Sim       |                  |
| /alunos/novo                               | UnderConstruction            | ❌ Não       | Placeholder      |
| /financas/notas-pagamento                  | ListarNotasPagamento         | ✅ Sim       | Protegida        |
| /financas/notas-pagamento/liquidar/:codigo | LiquidarNota                 | ✅ Sim       | Protegida        |
| /financas/listar-pagamentos                | ListarPagamentos             | ✅ Sim       | Protegida        |
| /financas/pagamento-referencia             | PagamentosReferencia         | ✅ Sim       | Protegida        |
| /financas/negociacao-divida                | NegociacaoDivida             | ✅ Sim       | Protegida        |
| /financas/servicos-emolumentos             | ServicosEmolumentos          | ✅ Sim       | Protegida        |
| /financas/credito/instituicoes             | CreateInstituicao            | ✅ Sim       | Protegida        |
| /financas/credito/instituicoes/todas       | TodasInstituicoes            | ✅ Sim       | Protegida        |
| /financas/credito/tipos                    | TipoCredito                  | ✅ Sim       | Protegida        |
| /financas/credito/atribuir                 | AtribuirCredito              | ✅ Sim       | Protegida        |
| /financas/credito/bolsa                    | ListarBolsa                  | ✅ Sim       | Protegida        |
| /financas/credito/bolsa/estudante          | ListaBolseiro                | ✅ Sim       | Protegida        |
| /financas/isencao-servico                  | IsencaoServico               | ✅ Sim       | Protegida        |
| /financas/descontos                        | ListarDescontos              | ✅ Sim       | Protegida        |
| /ajuda                                     | HealpFAQ                     | ✅ Sim       |                  |
| /estudante/:matricula                      | PerfilEstudante              | ✅ Sim       |                  |
| /defesa-tfc/pagamentos                     | PagamentoTFC                 | ✅ Sim       | Protegida        |
| /defesa-tfc/estudantes                     | ListarEstudanteFinalista     | ✅ Sim       | Protegida        |
| /sem-permissao                             | AccessDenied                 | ✅ Sim       |                  |
