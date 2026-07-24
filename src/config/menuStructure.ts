import {
  Shield,
  Calendar,
  MessageSquare,
  FileCheck,
  BookOpen,
  Building,
  HomeIcon,
  BadgeDollarSign,
  Headphones,
  ListChecks,
  LibraryBig,
  GraduationCap,
  FileText,
  BookUser,
  Files,
  BarChart3,
} from "lucide-react";
import { MenuStructure } from "./menu.types";
import { PermissionTypeDetails } from "@/constants/permission.type";

export const administracaoStructure: MenuStructure = {
  items: [
    {
      title: "Início",
      url: "/dashboard",
      icon: HomeIcon,
    },
    // ----------------------------------------------------
    // ACESSOS
    // ----------------------------------------------------
    {
      title: "Acessos",
      url: "/acessos",
      icon: Shield,
      items: [
        {
          title: "Lista  utilizador",
          url: "/acessos/utilizador",
          permission: [
            PermissionTypeDetails.LISTA_DE_UTILIZADORES.sigla,
            PermissionTypeDetails.LISTA_DE_UTILIZADORES2.sigla,
          ],
        },

        {
          title: "Criar utilizador",
          url: "/acessos/criar-utilizador",
          permission: [PermissionTypeDetails.CRIAR_UTILIZADOR.sigla],
        },
        {
          title: "Acesso funcionalidade por grupo",
          url: "/acessos/grupo",
          permission: [
            PermissionTypeDetails.ACESSOS_FUNCIONALIDADES_POR_GRUPO.sigla,
          ],
        },

        {
          title: "Acessos (todos) + novos",
          url: "/acessos/todos",
          permission: [
            PermissionTypeDetails.LISTA_DE_UTILIZADORES.sigla,
            PermissionTypeDetails.LISTA_DE_UTILIZADORES2.sigla,
          ],
        },
        // { title: "Bloquear acesso", url: "/acessos/bloquear" },
        {
          title: "Cargos Reitoria administrativo",
          url: "/acessos/cargos",
          permission: [
            PermissionTypeDetails.LISTA_DE_UTILIZADORES.sigla,
            PermissionTypeDetails.LISTA_DE_UTILIZADORES2.sigla,
          ],
        },
        {
          title: "Logs de acessos",
          url: "/acessos/logs",
          permission: [PermissionTypeDetails.LISTAR_LOGS_ACESSO.sigla],
        },
        {
          title: "Utilizadores logados",
          url: "/acessos/logados",
          permission: [PermissionTypeDetails.LISTAR_UTILIZADORES_LOGADOS.sigla],
        },
        {
          title: "Grupos",
          url: "/controle-acesso/grupos",
          permission: [PermissionTypeDetails.GRUPOS.sigla],
        },
      ],

      permission: [],
    },
  ],
};
export const ingressoStructure: MenuStructure = {
  items: [
    {
      title: "Exame de Acesso",
      url: "/exame",
      icon: FileCheck,
      items: [
        // { title: "Candidatos do preparatório", url: "/exame/candidatos-prep" },
        {
          title: "Admitir candidatura",
          url: "/exame/admitir",
          permission: [PermissionTypeDetails.ADMITIR_CANDIDATO.sigla],
        },
        {
          title: "Alterar senha",
          url: "/exame/alterar-senha",
          permission: [PermissionTypeDetails.ALTERAR_SENHA_CANDIDATO.sigla],
        },

        {
          title: "Atribuir prova",
          url: "/exame/atribuir-prova",
          permission: [PermissionTypeDetails.ATRIBUIR_PROVA.sigla],
        },
        {
          title: "Consultar prova",
          url: "/exame/consultar-prova",
          permission: [PermissionTypeDetails.CONSULTAR_PROVA_CANDIDATO.sigla],
        },

        {
          title: "Estatísticas",
          url: "/exame/estatisticas",
          permission: [
            PermissionTypeDetails.ESTATISTICA_CANDIDATOS_INSCRITOS.sigla,
          ],
        },
        {
          title: "Estatísticas diária",
          url: "/exame/estatisticas-diaria",
          permission: [
            PermissionTypeDetails.ESTATISTICA_CANDIDATOS_POR_DIA.sigla,
          ],
        },
        {
          title: "Inscrição época especial",
          url: "/exame/epoca-especial",
          permission: [
            PermissionTypeDetails.INSCRICAO_EXAME_ACESSO_ESPECIAL.sigla,
          ],
        },
        {
          title: "Lançar nota (Arq/Urbanismo)",
          url: "/exame/lancar-nota-arquitectura",
          permission: [PermissionTypeDetails.LANCAR_NOTA_ARQUITECTURA.sigla],
        },
        {
          title: "Lançar nota manual",
          url: "/exame/lancar-nota-manual",
          permission: [PermissionTypeDetails.LANCAR_NOTA_ARQUITECTURA.sigla],
        },
        {
          title: "Lista de candidatos",
          url: "/exame/lista-candidatos",
          permission: [PermissionTypeDetails.CANDIDATOS_INSCRITOS.sigla],
        },
        {
          title: "Admitidos",
          url: "/exame/admitidos",
          permission: [PermissionTypeDetails.LISTA_CANDIDATOS_ADMITIDOS.sigla],
        },
        // { title: "Admitidos sem matrícula", url: "/exame/sem-matricula" },
        // { title: "Sem prova marcada", url: "/exame/sem-prova" },
        {
          title: "Provas por candidato",
          url: "/exame/provas-candidato",
          permission: [PermissionTypeDetails.PROVAS_POR_CANDIDATO.sigla],
        },
        {
          title: "Resultados finais",
          url: "/exame/resultados-finais",
          permission: [PermissionTypeDetails.LISTA_RESULTADOS_FINAIS.sigla],
        },
        {
          title: "Horários por curso",
          url: "/exame/horarios",
          permission: [
            PermissionTypeDetails.LISTAR_HORARIO_PROVA_POR_CURSO.sigla,
          ],
        },
        {
          title: "Pauta geral",
          url: "/exame/pauta-geral",
          permission: [PermissionTypeDetails.PAUTA_GERAL_EXAME_ACESSO.sigla],
        },
        {
          title: "Resetar prova",
          url: "/exame/resetar",
          permission: [PermissionTypeDetails.RESETAR_PROVA_CANDIDATO.sigla],
        },
        {
          title: "Lista de presença",
          url: "/exame/presenca",
          permission: [PermissionTypeDetails.LISTA_PRESENCA_PROVA_ACESSO.sigla],
        },
        {
          title: "Candidatos com/sem prova",
          url: "/exame/candidatos-prova",
          permission: [
            PermissionTypeDetails.LISTA_CANDIDATOS_SEM_PROVAS_MARCADAS.sigla,
          ],
        },
        {
          title: "Listar Tópicos",
          url: "/exame/topicos",
          permission: [PermissionTypeDetails.TOPICO_PROVA.sigla],
        },
        {
          title: "Listar Perguntas",
          url: "/exame/perguntas",
          permission: [PermissionTypeDetails.PERGUNTA_PROVA.sigla],
        },
        {
          title: "Listagem Provas",
          url: "/exame/provas",
          permission: [PermissionTypeDetails.PROVA.sigla],
        },
        {
          title: "Configurar vaga",
          url: "/exame/configurar-vaga",
          permission: [PermissionTypeDetails.DEFINIR_VAGAS_POR_CURSO.sigla],
        },
      ],

      permission: [],
    },
    {
      title: "Inscrições e Matrícula",
      url: "/inscricoes",
      icon: FileCheck,
      items: [
        {
          title: "Estatística de estudantes aprovados e reprovados",
          url: "/inscricoes/estatisticas",
          permission: [
            PermissionTypeDetails.ESTATISTICA_ESTUDANTES_APROVADOS_REPROVADOS
              .sigla!,
          ],
        },

        {
          title: "Matriculados",
          url: "/inscricoes/matriculados",
          permission: [PermissionTypeDetails.ESTUDANTES_MATRICULADOS.sigla],
        },

        {
          title: "Sem inscrição em UC",
          url: "/inscricoes/sem-uc",
          permission: [
            PermissionTypeDetails.LISTAR_ESTUDANTES_SEM_INSCRICAO_UC.sigla,
          ],
        },
        {
          title: "Sem inscrição em curso",
          url: "/inscricoes/sem-curso",
          permission: [
            PermissionTypeDetails.LISTAR_ESTUDANTES_SEM_INSCRICOES_CURSO.sigla,
          ],
        },
        {
          title: "Estado por horário",
          url: "/inscricoes/estado-horario",
          permission: [
            PermissionTypeDetails.LISTAR_ESTADO_MATRICULA_ESTUDANTE_POR_HORARIO
              .sigla,
          ],
        },
        {
          title: "Lista inscritos por UC",
          url: "/inscricoes/inscritos-uc",
          permission: [PermissionTypeDetails.LISTAR_INSCRITOS_UC.sigla],
        },
        {
          title: "Listagem Geral Estudantes",
          url: "/inscricoes/estudantes/listagem/geral",
          permission: [PermissionTypeDetails.LISTAGEM_GERAL_ESTUDANTES.sigla!],
        },
        {
          title: "Estado da matrícula",
          url: "/inscricoes/estado-matricula",
          permission: [
            PermissionTypeDetails.LISTAR_ESTUDANTES_POR_ESTADO_MATRICULA.sigla,
          ],
        },
        {
          title: "Isentar colisão",
          url: "/inscricoes/colisao",
          permission: [
            PermissionTypeDetails.INSENCAO_COLISAO_CURSO_ESTUDANTE.sigla,
          ],
        },

        {
          title: "Estudantes Diplomados",
          url: "/inscricoes/estudantes-diplomados",
          permission: [
            PermissionTypeDetails.LISTA_ESTUDANTES_DIPLOMANDOS.sigla,
          ],
        },
      ],

      permission: [],
    },
  ],
};
export const academicStructure: MenuStructure = {
  items: [
    {
      title: "Calendário Académico ",
      url: "/calendario",
      icon: Calendar,
      items: [
        {
          title: "Actividades lectivas",
          url: "/calendario/atividades",
          permission: [
            PermissionTypeDetails.ACTIVIDADES_LECTIVAS.sigla,
            PermissionTypeDetails.ATIVIDADES_LETIVAS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Prazos",
          url: "/calendario/prazos",
          permission: [
            PermissionTypeDetails.CRIAR_PRAZO_ACADEMICO.sigla,
            PermissionTypeDetails.PRAZOS_ACADEMICOS_POS_GRADUACAO.sigla,
          ],
        },
        //{ title: "Calendário de provas", url: "/calendario/provas" },
        {
          title: "Dias isentos",
          url: "/calendario/dias-isentos",
          permission: [PermissionTypeDetails.CRIAR_DIAS_ISENTOS.sigla],
        },
        {
          title: "Parâmetros",
          url: "/calendario/parametros",
          permission: [
            PermissionTypeDetails.PARAMETROS_CALENDARIO_ACADEMICO.sigla,
            PermissionTypeDetails.PARAMETROS_ACADEMICOS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Configurações Ano lectivo",
          url: "/calendario/fases-lectivas",
          permission: [
            PermissionTypeDetails.PARAMETROS_CALENDARIO_ACADEMICO.sigla,
            PermissionTypeDetails.PARAMETROS_ACADEMICOS_POS_GRADUACAO.sigla,
          ],
        },

        //{ title: "Criar horário", url: "/calendario-lic/criar-horario" },
      ],

      permission: [],
    },
    {
      title: "Horários",
      url: "/horarios",
      icon: Calendar,
      items: [
        {
          title: "Criar horário",
          url: "/horarios/criar",
          permission: [
            PermissionTypeDetails.CRIAR_HORARIO.sigla,
            PermissionTypeDetails.CRIAR_HORARIOS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Horários semanais",
          url: "/horarios/semanais",
          permission: [
            PermissionTypeDetails.VISUALIZAR_HORARIO_POR_DOCENTE.sigla!,
          ],
        },
        {
          title: "Docentes Substitutos",
          url: "/horarios/docentes-substitutos",
          permission: [PermissionTypeDetails.LISTAR_DOCENTES_SUBSTITUTO.sigla!],
        },
        // { title: "Horários com/sem sala", url: "/horarios/salas" },
        {
          title: "Movimentar estudantes",
          url: "/horarios/movimentar/estudantes",
          permission: [
            PermissionTypeDetails.MOVIMENTAR_ESTUDANTES_POR_HORARIO.sigla,
            PermissionTypeDetails.MOVIMENTAR_ESTUDANTES_HORARIOS_POS_GRADUACAO
              .sigla,
          ],
        },
        {
          title: "Permissão editar",
          url: "/horarios/permissao",
          permission: [
            PermissionTypeDetails.PERMISSAO_PARA_EDITAR_HORARIO.sigla,
            PermissionTypeDetails.EDITAR_HORARIOS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Horários por docente",
          url: "/horarios/docente",
          permission: [
            PermissionTypeDetails.VISUALIZAR_HORARIO_POR_DOCENTE.sigla,
          ],
        },
        {
          title: "Inscrições por horário",
          url: "/horarios/inscricoes",
          permission: [PermissionTypeDetails.INSCRICAO_POR_HORARIO.sigla],
        },
        {
          title: "Listar horário",
          url: "/horarios/listar",
          permission: [
            PermissionTypeDetails.LISTAR_HORARIOS.sigla,
            PermissionTypeDetails.LISTAR_HORARIOS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Eliminados",
          url: "/horarios/eliminados",
          permission: [PermissionTypeDetails.LISTAR_HORARIOS_ELIMINADOS.sigla],
        },
        {
          title: "Horários por sala",
          url: "/horarios/sala",
          permission: [PermissionTypeDetails.LISTAR_HORARIOS.sigla],
        },
        {
          title: "Horários por UC",
          url: "/horarios/uc",
          permission: [PermissionTypeDetails.VISUALIZAR_HORARIO_POR_UC.sigla],
        },
        {
          title: "Parâmetros",
          url: "/horarios/parametros",
          permission: [
            PermissionTypeDetails.PERMISSAO_PARA_EDITAR_HORARIO.sigla!,
          ],
        },
      ],

      permission: [],
    },
    {
      title: "Plano de Estudo",
      url: "/plano",
      icon: BookOpen,
      items: [
        // { title: "Gestão de Curso", url: "/plano/cursos" },
        {
          title: "Gestão de disciplinas",
          url: "/plano/disciplinas",
          permission: [PermissionTypeDetails.GESTAO_DISCIPLINAS.sigla],
        },
        // { title: "Disciplinas sem siglas", url: "/plano/sem-siglas" },

        {
          title: "Gestão de UC por departamento",
          url: "/plano/uc-departamento",
          permission: [
            PermissionTypeDetails.GESTAO_UNIDADE_CURRICULAR_DEPARTAMENTO.sigla,
          ],
        },
        {
          title: "Gestão de UC no plano",
          url: "/plano/uc-plano",
          permission: [
            PermissionTypeDetails.GESTAO_UNIDADE_CURRICULAR_PLANO.sigla,
          ],
        },
      ],

      permission: [],
    },
    {
      title: "Gestão de Docentes",
      url: "/gestao-docente",
      icon: BookUser,
      items: [
        {
          title: "Gestão de Afectação",
          url: "/gestao-docente/afectacoes",
          permission: [PermissionTypeDetails.GESTAO_AFETACOES!.sigla],
        },
        {
          title: "Lista de UC sem docentes afectados",
          url: "/gestao-docente/sem-afetacao/uc",
          permission: [
            PermissionTypeDetails.LISTA_UC_SEM_DOCENTES_AFETADOS.sigla,
          ],
        },
        {
          title: "Lista de Docentes",
          url: "/gestao-docentes/docentes",
          permission: [PermissionTypeDetails.LISTA_DE_DOCENTES.sigla],
        },
        // { title: "Sem afetação", url: "/gestao-docentes/sem-afetacao" },
        // { title: "Afetações", url: "/gestao-docentes/afetacoes" },
        // { title: "Contratos", url: "/gestao-docentes/contratos" },
        {
          title: "Regentes",
          url: "/gestao-docentes/regentes",
          permission: [PermissionTypeDetails.LISTA_DOCENTES_REGENTES.sigla],
        },
        // { title: "Afetados", url: "/gestao-docentes/afetados" },
        // { title: "UC sem docentes", url: "/gestao-docentes/uc-sem-docentes" },
        // { title: "Candidaturas", url: "/gestao-docentes/candidaturas" },
        {
          title: "Parâmetros",
          url: "/gestao-docentes/parametros",
          permission: [PermissionTypeDetails.PARAMETROS_MGD.sigla],
        },
        {
          title: "Salário",
          url: "/gestao-docentes/salario",
          permission: [PermissionTypeDetails.DESEMPENHO_DOCENTE.sigla],
        },
        //{ title: "Validação docente", url: "/gestao-docentes/validacao" },

        {
          title: "Docente Afectados",
          url: "/gestao-docente/docente-afectados",
          permission: [PermissionTypeDetails.LISTA_DOCENTES_AFETADOS!.sigla],
        },
      ],
      permission: [],
    },

    {
      title: "Avaliações",
      url: "/avaliacoes",
      icon: FileCheck,
      items: [
        {
          title: "Controle de lançamento de notas",
          url: "/avaliacoes/controle",
          permission: [
            PermissionTypeDetails.CONTROLE_LANCAMENTO.sigla,
            PermissionTypeDetails.CONTROLE_LANCAMENTO_NOTAS_POS_GRADUACAO.sigla,
          ],
        },

        {
          title: "Fórmula por unidade curricular",
          url: "/avaliacoes/formula-uc",
          permission: [
            PermissionTypeDetails.DEFINIR_FORMULA_UNIDADE_CURRICULAR.sigla!,
            PermissionTypeDetails.DEFINIR_FORMULA_UC_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Definir unidade curricular com oral",
          url: "/avaliacoes/formula-oral",
          permission: [
            PermissionTypeDetails.DEFINIR_UNIDADE_CURRICULAR_COM_ORAL.sigla!,
            PermissionTypeDetails.DEFINIR_UC_ORAL_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Estatísticas de notas lançadas",
          url: "/avaliacoes/estatisticas",
          permission: [PermissionTypeDetails.ESTATISTICA_NOTAS_LANCADAS.sigla],
        },
        {
          title: "Estudantes inscritos por avaliação",
          url: "/avaliacoes/estudantes",
          permission: [
            PermissionTypeDetails.ESTUDANTES_INSCRITOS_POR_AVALIACAO.sigla!,
          ],
        },
        {
          title: "Histórico de lançamentos",
          url: "/avaliacoes/historico",
          permission: [
            PermissionTypeDetails.HISTORICO_LANCAMENTO_NOTAS.sigla!,
            PermissionTypeDetails.HISTORICO_LANCAMENTO_NOTAS_POS_GRADUACAO
              .sigla,
          ],
        },
        {
          title: "Lançamento de pauta",
          url: "/avaliacoes/pauta",
          permission: [
            PermissionTypeDetails.LANCAMENTO_PAUTA.sigla,
            PermissionTypeDetails.LANCAMENTO_PAUTA_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Lançamento de notas",
          url: "/avaliacoes/notas",
          permission: [
            PermissionTypeDetails.LANCAMENTO_NOTAS_MPGS.sigla,
            PermissionTypeDetails.LANCAMENTO_NOTAS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Lista de presença",
          url: "/avaliacoes/presenca",
          permission: [
            PermissionTypeDetails.LISTA_PRESENCA.sigla,
            PermissionTypeDetails.LISTA_PRESENCA_POS_GRADUACAO.sigla,
          ],
        },

        {
          title: "Pauta geral",
          url: "/avaliacoes/pauta-geral",
          permission: [
            PermissionTypeDetails.PAUTA_GERAL.sigla,
            PermissionTypeDetails.PAUTA_GERAL_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Pauta por UC",
          url: "/avaliacoes/pauta-uc",
          permission: [
            PermissionTypeDetails.PAUTA_GERAL_POR_UC.sigla!,
            PermissionTypeDetails.PAUTA_GERAL_UC_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Permissão fora do prazo",
          url: "/avaliacoes/permissao",
          permission: [
            PermissionTypeDetails.PERMISSAO_LANC_NOTA_FORA_PRAZO.sigla,
            PermissionTypeDetails.PERMISSAO_FORA_PRAZO_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Validação",
          url: "/avaliacoes/validacao",
          permission: [
            PermissionTypeDetails.VALIDACAO_LANCAMENTO_PAUTA.sigla,
            PermissionTypeDetails.VALIDACAO_PAUTA_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Visualizar notas",
          url: "/avaliacoes/visualizar",
          permission: [
            PermissionTypeDetails.LANCAMENTO_NOTAS_AVALIACOES.sigla!,
          ],
        },
        {
          title: "Parâmetros gerais",
          url: "/avaliacoes/parametros",
          permission: [
            PermissionTypeDetails.PARAMETROS_GERAIS_AVALIACAO.sigla!,
          ],
        },
      ],

      permission: [],
    },

    // ----------------------------------------------------
    // DOCUMENTOS MINISTÉRIO
    // ----------------------------------------------------

    {
      title: "Marcação de Provas",
      url: "/marcacao",
      icon: FileCheck,
      permission: [],
      items: [
        {
          title: "Controle",
          url: "/marcacao-provas/controle",
          permission: [PermissionTypeDetails.CONTROLE_NOTA.sigla],
        },
        {
          title: "Marcação",
          url: "/marcacao-provas/marcacao",
          permission: [
            PermissionTypeDetails.PRAZO_MARCACAO_PROVAS_LANC_NOTAS.sigla,
          ],
        },
      ],
    },
    {
      title: "Docente",
      url: "/docente",
      icon: GraduationCap,
      items: [
        {
          title: "Calendário de aulas",
          url: "/docente/calendario",
          permission: [
            PermissionTypeDetails.VISUALIZAR_HORARIO_POR_DOCENTE.sigla,
          ],
        },
        // { title: "Horas de vigilância", url: "/docente/vigilancia" },

        {
          title: "Horas de vigilância",
          url: "/docente/vigilancia",
          permission: [PermissionTypeDetails.HORAS_DE_VIGILANCIA.sigla!],
        },
        {
          title: "Lançamento do programa da UC",
          url: "/docente/programa",
          permission: [
            PermissionTypeDetails.DOCENTE_LANCAMENTO_PROGRAMA_UC.sigla,
          ],
        },
        {
          title: "Validação do programa",
          url: "/docente/validacao",
          permission: [PermissionTypeDetails.VALIDACAO_PROGRAMA_UC.sigla],
        },
        /*
        {
          title: "Assiduidade",
          url: "/docente/assiduidade",
          permission: [PermissionTypeDetails.MINHAS_ASSIDUIDADES.sigla],
        },
        */
      ],

      permission: [],
    },

    {
      permission: [PermissionTypeDetails.DEFESA.sigla],
      title: "Gestão de Defesa e TFC",
      url: "/defesa-tfc",
      icon: LibraryBig,
      items: [
        {
          title: "Estudantes Finalistas",
          url: "/defesa-tfc/estudantes",
          permission: [PermissionTypeDetails.DEFESA.sigla],
        },
        {
          title: "Orientadores",
          url: "/defesa-tfc/orientadores",
          permission: [PermissionTypeDetails.DEFESA.sigla],
        },
        {
          title: "Vínculos de TFC",
          url: "/defesa-tfc/vinculos",
          permission: [PermissionTypeDetails.DEFESA.sigla],
        },
      ],
    },
  ],
};

export const postGraduationStructure: MenuStructure = {
  items: [
    {
      title: "Avaliações",
      url: "/pos-graduacao",
      icon: FileCheck,

      items: [
        {
          title: "Canditatos inscritos",
          url: "/pos-graduacao/inscritos",
        },

        /*
        {
          title: "Atividades Letivas",
          url: "/pos-graduacao/calendario/atividades",
          permission: [
            PermissionTypeDetails.ACTIVIDADES_LECTIVAS_MPGS.sigla,
          ],
        },
        {
          title: "Parâmetros do Calendário",
          url: "/pos-graduacao/calendario/parametros",
          permission: [
            PermissionTypeDetails.PARAMETROS_CALENDARIO_ACADEMICO.sigla,
          ],
        },
        

        {
          title: "Fórmula de Definição das UCs",
          url: "/pos-graduacao/avaliacoes/formula-ucs",
          permission: [
            PermissionTypeDetails.DEFINIR_FORMULA_UC_POS_GRADUACAO.sigla,
          ],
        },

        {
          title: "Fórmula de Definição das UCs Oral",
          url: "/pos-graduacao/avaliacoes/formula-ucs-oral",
          permission: [
            PermissionTypeDetails.DEFINIR_UC_ORAL_POS_GRADUACAO.sigla,
          ],
        },

        {
          title: "Marcação de Provas",
          url: "/pos-graduacao/avaliacoes/marcacao-provas",
          permission: [PermissionTypeDetails.MARCAR_PROVA_POS_GRADUACAO.sigla],
        },
        {
          title: "Controle de Marcação de Provas",
          url: "/marcacao-provas/controle",
          permission: [
            PermissionTypeDetails.CONTROLE_MARCACAO_PROVAS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Controle de Lançamento de Notas",
          url: "/avaliacoes/controle",
          permission: [
            PermissionTypeDetails.CONTROLE_LANCAMENTO_NOTAS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Histórico de Lançamento de Notas",
          url: "/avaliacoes/historico",
          permission: [
            PermissionTypeDetails.HISTORICO_LANCAMENTO_NOTAS_POS_GRADUACAO
              .sigla,
          ],
        },
        */
        {
          title: "Lista de Presença",
          url: "/pos-graduacao/avaliacoes/lista-presenca",
          permission: [
            PermissionTypeDetails.LISTA_PRESENCA_POS_GRADUACAO.sigla,
          ],
        },
        /*

        {
          title: "Lançamento de Notas",
          url: "/pos-graduacao/avaliacoes/lancamento-notas",
          permission: [
            PermissionTypeDetails.LANCAMENTO_NOTAS_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Lançamento de Pauta",
          url: "/pos-graduacao/avaliacoes/lancamento-pauta",
          permission: [
            PermissionTypeDetails.LANCAMENTO_PAUTA_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Pauta Geral",
          url: "/avaliacoes/pauta-geral",
          permission: [PermissionTypeDetails.PAUTA_GERAL_POS_GRADUACAO.sigla],
        },
        {
          title: "Pauta Geral por UC",
          url: "/avaliacoes/pauta-uc",
          permission: [
            PermissionTypeDetails.PAUTA_GERAL_UC_POS_GRADUACAO.sigla,
          ],
        },
        
        {
          title: "Permissão fora do prazo",
          url: "/avaliacoes/permissao",
          permission: [
            PermissionTypeDetails.PERMISSAO_FORA_PRAZO_POS_GRADUACAO.sigla,
          ],
        },
        {
          title: "Validação de Pauta",
          url: "/pos-graduacao/avaliacoes/validacao-pauta",
          permission: [
            PermissionTypeDetails.VALIDACAO_PAUTA_POS_GRADUACAO.sigla,
          ],
        },
         */
      ],
      permission: [],
    },

    {
      title: "Gestão de Orientação e Pesquisa",
      url: "/gestao-orientacao-pesquisa",
      icon: GraduationCap,
      items: [
        {
          title: "Estudantes",
          url: "/gestao-orientacao-pesquisa/estudantes",
          permission: [
            PermissionTypeDetails
              .POST_GRADUACAO_GESTAO_ORIENTACAO_PESQUISA_ESTUDANTES.sigla,
          ],
        },
        {
          title: "Orientadores",
          url: "/gestao-orientacao-pesquisa/orientadores",
          permission: [
            PermissionTypeDetails
              .POST_GRADUACAO_GESTAO_ORIENTACAO_PESQUISA_ORIENTADORES.sigla,
          ],
        },
        {
          title: "Vínculos",
          url: "/gestao-orientacao-pesquisa/vinculos",
          permission: [
            PermissionTypeDetails
              .POST_GRADUACAO_GESTAO_ORIENTACAO_PESQUISA_VINCULOS.sigla,
          ],
        },
      ],
    },


  ],
};

export const operacionalStructure: MenuStructure = {
  items: [
    {
      permission: [PermissionTypeDetails.MARCAR_ASSIDUIDADE_MSA.sigla],
      title: "Assiduidade",
      url: "/assiduidade",
      icon: ListChecks,
      items: [
        {
          title: "Marcação de Assuidade",
          url: "/assiduidade/marcacao",
          permission: [
            PermissionTypeDetails.MARCAR_ASSIDUIDADE_MSA.sigla,
            PermissionTypeDetails.MARCAR_ASSIDUIDADE_PROVA.sigla,
          ],
        },
        {
          title: "Controle de Assuidade",
          url: "/assiduidade/controle",
          permission: [
            PermissionTypeDetails.CONTROLE_DE_ASSIDUIDADES.sigla,
            PermissionTypeDetails.CONTROLE_DE_ASSIDUIDADES.sigla,
          ],
        },
        {
          title: "Controle Geral de Assuidade por Docente",
          url: "/assiduidade/docente",
          permission: [
            PermissionTypeDetails.CONTROLE_GERAL_ASSIDUIDADE_POR_DOCENTE.sigla,
          ],
        },
      ],
    },
    {
      title: "Sumário",
      url: "/gestao-docentes",
      icon: FileText,
      items: [
        {
          title: "Aulas Agendadas",
          url: "/sumario/aulas-agendadas",
          permission: [PermissionTypeDetails.AULAS_AGENDADAS.sigla],
        },
        {
          title: "Controle Geral de Sumário & Assiduidade",
          url: "/sumario/controle-geral",
          permission: [
            PermissionTypeDetails.CONTROLE_GERAL_SUMARIOS_ASSIDUIDADE.sigla,
          ],
        },
        {
          title: "Listar Sumários",
          url: "/sumario/listar",
          permission: [PermissionTypeDetails.LISTAR_SUMARIO.sigla],
        },
        {
          title: "Parâmetros",
          url: "/sumario/parametros",
          permission: [PermissionTypeDetails.SUMARIO_PARAMETROS.sigla],
        },
      ],
      permission: [],
    },
    {
      title: "Documentos para o Ministério",
      url: "/ministerio",
      icon: FileText,
      items: [
        {
          title: "Mapa finalistas",
          url: "/ministerio/mapa-finalistas",
          permission: [
            PermissionTypeDetails.MAPA_ANUAL_ESTUDANTES_FINALISTAS.sigla,
          ],
        },
        {
          title: "Registo exame de acesso",
          url: "/ministerio/registro-exame",
          permission: [
            PermissionTypeDetails.REGISTRO_PRIMARIO_EXAME_ACESSO.sigla,
          ],
        },
        {
          title: "Registo de Matriculados",
          url: "/ministerio/registro-matricula",
          permission: [
            PermissionTypeDetails.REGISTRO_PRIMARIO_MATRICULADOS.sigla,
          ],
        },
      ],

      permission: [],
    },
    {
      title: "Gestão de Salas",
      url: "/salas",
      icon: Building,
      items: [
        {
          title: "Listar salas",
          url: "/salas/listar",
          permission: [PermissionTypeDetails.LISTAR_SALAS.sigla],
        },
      ],

      permission: [],
    },
  ],
};
export const finaceStructure: MenuStructure = {
  items: [
    /* -------------------------------------------------------- */
    /* 1) FINANÇAS (UNIFICADO) */
    /* -------------------------------------------------------- */
    {
      title: "Finanças",
      url: "/financas",
      icon: BadgeDollarSign,
      items: [
        /* Área Financeira */
        {
          title: "Estud. Mensalidades Pagas",
          url: "/financas/mensalidades-pagas",
          permission: [
            PermissionTypeDetails.ESTUDANTES_COM_PROPINAS_PAGA.sigla,
          ],
        },
        {
          title: "Notas de Pagamentos",
          url: "/financas/notas-pagamento",
          permission: [PermissionTypeDetails.FACTURAS.sigla],
        },
        {
          title: "Serviços e Emolumentos",
          url: "/financas/servicos-emolumentos",
          permission: [PermissionTypeDetails.SERVICOS_PRECARIOS.sigla],
        },

        {
          title: "Negociação de Dívida",
          url: "/financas/negociacao-divida",
          permission: [PermissionTypeDetails.LISTAR_NEGOCIACAO_DIVIDA.sigla],
        },
        {
          title: "Tipos Credito",
          url: "/financas/credito/tipos",
          permission: [
            PermissionTypeDetails.LISTAR_TIPO_CREDITO_EDUCACIONAL.sigla,
          ],
        },

        {
          title: "Instituições - Todas",
          url: "/financas/credito/instituicoes/todas",
          permission: [PermissionTypeDetails.INSTITUICOES.sigla],
        },

        {
          title: "Credito Educacional",
          url: "financas/credito/bolsa",
          permission: [PermissionTypeDetails.HISTORICO_BOLSAS.sigla],
        },
        {
          title: "Créd. Edu. Estudante",
          url: "/financas/credito/bolsa/estudante",
          permission: [PermissionTypeDetails.LISTAR_BOLSEIROS.sigla],
        },

        {
          title: "Atribuir Crédito Educacional",
          url: "/financas/credito/atribuir",
          permission: [PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO.sigla],
        },
        {
          title: "Contratos - Instituição",
          url: "/financas/contratos-instituicao",
          permission: [
            PermissionTypeDetails.CONTROLE_CONTRATO_INSTITUICAO.sigla,
          ],
        },
        /*
        {
          title: "Rel. Pagamentos Instituições",
          icon: BarChart3,
          url: "/financas/rel-pagamentos-instituicoes",
          permission: [PermissionTypeDetails.PARAMETROS_MGH.sigla],
        },
       */

        /* Gestão de Descontos */
        {
          title: "Descontos",
          url: "/financas/descontos",
          permission: [PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO.sigla],
        },
        {
          title: "Atribuir Desconto",
          url: "/financas/descontos/atribuicao",
          permission: [PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO.sigla],
        },

        {
          title: "Pagamentos",
          url: "/financas/listar-pagamentos",
          permission: [PermissionTypeDetails.PAGAMENTOS.sigla],
        },
        {
          title: "Pagamentos TFC",
          url: "/defesa-tfc/pagamentos",
          permission: [PermissionTypeDetails.PAGAMENTO_TFC.sigla],
        },
        {
          title: "Isenção de serviço",
          url: "/financas/isencao-servico",
          permission: [PermissionTypeDetails.ISENCAO_SERVICO.sigla],
        },
        {
          title: "Forma de Pagamentos",
          url: "/financas/forma-pagamento",
          permission: [PermissionTypeDetails.FORMA_PAGAMENTO.sigla],
        },

        {
          title: "Caixas",
          url: "/financas/caixas",
          permission: [PermissionTypeDetails.FECHO_CAIXA_GERAL.sigla],
        },
        {
          title: "Meu Caixa",
          url: "/financas/caixas/meu-caixa",
          permission: [PermissionTypeDetails.FECHO_CAIXA_POR_UTILIZADOR.sigla],
        },
      ],

      permission: [],
    },
  ],
};
export const comunicationStructure: MenuStructure = {
  items: [
    {
      title: "Comunicação",
      url: "/comunicacao",
      icon: MessageSquare,
      items: [
        {
          title: "Avisos",
          url: "/comunicacao/avisos",
          permission: [PermissionTypeDetails.LISTAR_COMUNICACAO_INTERNA.sigla],
        },

        {
          title: "Solicitações encaminhadas",
          url: "/controle-acesso/solicitacoes",
          permission: [PermissionTypeDetails.SOLICITACOES_ENCAMINHADAS.sigla],
        },

        {
          title: "Solicitações",
          url: "/controle-acesso/all-solicitacoes",
          permission: [PermissionTypeDetails.LISTAR_SOLICITACOES.sigla],
        },
        {
          title: "Imagem De Abertura",
          url: "/comunicacao/avisos/imagem",
          permission: [
            PermissionTypeDetails.IMAGEM_ABERTURA_PORTAL_ESTUDANTE.sigla,
          ],
        },
      ],

      permission: [],
    },
  ],
};
export const suporteStructure: MenuStructure = {
  items: [
    {
      title: "Suporte",
      url: "/suporte",
      icon: Headphones,
      items: [
        {
          title: "Solicitações de Suporte",
          url: "/suporte/solicitacoes",
          permission: [PermissionTypeDetails.LSOLICITACAO_SUPORTE.sigla],
        },
        {
          title: "Tipos de Suporte",
          url: "/suporte/tipos",
          permission: [PermissionTypeDetails.TIPO_SUPORTE.sigla],
        },
      ],
      permission: [],
    },
  ],
};
export const documentStructure: MenuStructure = {
  items: [
    {
      title: "Documentos",
      url: "/documentos",
      icon: Files,
      items: [
        {
          title: "Validar Documentos",
          url: "/documentos/validar",
          permission: [PermissionTypeDetails.VALIDAR_DOCUMENTO.sigla],
        },
      ],
      permission: [],
    },
  ],
};
