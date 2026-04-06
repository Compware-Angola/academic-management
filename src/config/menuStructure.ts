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
} from "lucide-react";
import { MenuStructure } from "./menu.types";
import { PermissionTypeDetails } from "@/constants/permission.type";

export const menuStructure: MenuStructure = {
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

    // ----------------------------------------------------
    // CONTROLE DE ACESSO
    // ----------------------------------------------------

    // ----------------------------------------------------
    // ASSIDUIDADE
    /* ----------------------------------------------------
    {
      title: "Assiduidade",
      url: "/assiduidade",
      icon: ClipboardCheck,
      items: [
        { title: "Controle de assiduidade", url: "/assiduidade/controle" },
        { title: "Assiduidade por docente", url: "/assiduidade/docente" },
        { title: "Assiduidade + sumário", url: "/assiduidade/sumario" },
        { title: "Assiduidade aulas de campo", url: "/assiduidade/campo" },
        { title: "Marcar assiduidade", url: "/assiduidade/marcar" },
        { title: "Marcar assiduidade prova", url: "/assiduidade/prova" },
      ],

      permission: ["adm", "rootAdmin"],
    },
    */

 

    // ----------------------------------------------------
    // CALENDÁRIO PÓS
    /* ----------------------------------------------------
    {
      title: "Cale Académico (Pós)",
      url: "/calendario-pos",
      icon: Calendar,
      items: [
        { title: "Atividades letivas", url: "/calendario-pos/atividades" },
        { title: "Calendário de provas", url: "/calendario-pos/provas" },

      ],
    },
    */

    // ----------------------------------------------------
    // CRIAR UTILIZADORES
    // ----------------------------------------------------

    // ----------------------------------------------------
    // DOCENTE

    {
      title: "Docente",
      url: "/docente",
      icon: GraduationCap,
      items: [
        { title: "Calendário de aulas", url: "/docente/calendario" },
        // { title: "Horas de vigilância", url: "/docente/vigilancia" },
        // { title: "Calendário de aulas", url: "/docente/calendario" },
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

    // ----------------------------------------------------

    // ----------------------------------------------------
    // GESTÃO DE DOCENTES
    // ----------------------------------------------------

    // ----------------------------------------------------
    // INSCRIÇÕES E MATRÍCULA
    // ----------------------------------------------------
    {
      title: "Inscrições e Matrícula",
      url: "/inscricoes",
      icon: FileCheck,
      items: [
        { title: "Atribuição de turma", url: "/inscricoes/turma" },
        {
          title: "Estatística de estudantes aprovados e reprovados",
          url: "/inscricoes/estatisticas",
          permission: [
            PermissionTypeDetails.ESTATISTICA_ESTUDANTES_APROVADOS_REPROVADOS.sigla!,
          ],
        },
        { title: "Inserir colisão", url: "/inscricoes/colisao" },
        { title: "Diplomandos", url: "/inscricoes/diplomandos" },
        { title: "Lista personalizada", url: "/inscricoes/personalizada" },
        { title: "Mensalidades (mensal)", url: "/inscricoes/mensalidades" },
        { title: "Lista geral", url: "/inscricoes/lista-geral" },
        { title: "Estado por horário", url: "/inscricoes/estado-horario" },
        { title: "Matriculados", url: "/inscricoes/matriculados" },
        { title: "Estado da matrícula", url: "/inscricoes/estado-matricula" },
        { title: "Sem inscrição em UC", url: "/inscricoes/sem-uc" },
        { title: "Sem inscrição no curso", url: "/inscricoes/sem-curso" },
        { title: "Inscritos em UC", url: "/inscricoes/inscritos-uc" },
        {
          title: "Mensalidades por curso",
          url: "/inscricoes/mensalidades-curso",
        },
      ],

      permission: ["adm", "rootAdmin"],
    },

    // ----------------------------------------------------
    // PLANO DE ESTUDO
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // PÓS-GRADUAÇÃO
    /* ----------------------------------------------------
    {
      title: "Pós-Graduação",
      url: "/pos-graduacao",
      icon: GraduationCap,
      items: [
        { title: "Candidatos", url: "/pos-graduacao/candidatos" },
        { title: "Propinas pagas", url: "/pos-graduacao/propinas" },
        { title: "Devedores", url: "/pos-graduacao/devedores" },
        { title: "Matriculados", url: "/pos-graduacao/matriculados" },
        { title: "Estudantes por UC", url: "/pos-graduacao/estudantes-uc" },
        { title: "Inscrição em grade", url: "/pos-graduacao/inscricao" },
        { title: "Lançamento de notas", url: "/pos-graduacao/notas" },
        {
          title: "Lista de estudantes",
          url: "/pos-graduacao/lista-estudantes",
        },
        {
          title: "Lista de matriculados",
          url: "/pos-graduacao/lista-matriculados",
        },
        { title: "Lista de presença", url: "/pos-graduacao/presenca" },
        { title: "TFC", url: "/pos-graduacao/tfc" },
      ],

      permission: ["adm", "rootAdmin"],
    },

    // ----------------------------------------------------
    // SUMÁRIO
    // ----------------------------------------------------
    {
      title: "Sumário",
      url: "/sumario",
      icon: FileText,
      items: [{ title: "Parâmetros", url: "/sumario/parametros" }],

      permission: ["adm", "rootAdmin"],
    },

    // ----------------------------------------------------
    // VER UTILIZADORES
    // ----------------------------------------------------

    // ----------------------------------------------------
    // CONTROLE DE ACESSO
    // ----------------------------------------------------

    // ----------------------------------------------------
    // DOCUMENTOS MINISTÉRIO
    // ----------------------------------------------------
    {
      title: "Documentos para o Ministério",
      url: "/ministerio",
      icon: FileText,
      items: [
        { title: "Mapa finalistas", url: "/ministerio/mapa-finalistas" },
        { title: "Registro pós-graduação", url: "/ministerio/registro-pos" },
        {
          title: "Registro exame de acesso",
          url: "/ministerio/registro-exame",
        },
        { title: "Registro matrícula", url: "/ministerio/registro-matricula" },
      ],

      permission: ["adm", "rootAdmin"],
    },
*/
    // ----------------------------------------------------
    // SALAS
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // MARCAÇÃO DE PROVAS
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
        // {
        //   title: "Estud. Mensalidades Pagas",
        //   url: "/financas/mensalidades-pagas",
        // },
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
        // { title: "Estudantes Devedores", url: "/financas/devedores" },
        // { title: "Estudantes Inactivos", url: "/financas/inactivos" },
        // {
        //   title: "Estud. Finalistas Inactivos",
        //   url: "/financas/finalistas-inactivos",
        // },
        // { title: "Consult. Nº Operação", url: "/financas/num-operacao" },
        // { title: "Controlo Actual. Saldo", url: "/financas/controlo-saldo" },
        // { title: "Isentar Serviços (Novos)", url: "/financas/isentar-novos" },
        // {
        //   title: "Isentar Serviços (Antigos)",
        //   url: "/financas/isentar-antigos",
        // },

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
        // { title: "Talão em Desuso", url: "/financas/talao-desuso" },
        // { title: "Serviços e Emolumentos", url: "/financas/emolumentos" },

        /* Crédito Educacional */
        //  { title: "Instituições", url: "/financas/credito/instituicoes" },
        {
          title: "Instituições - Todas",
          url: "/financas/credito/instituicoes/todas",
          permission: [PermissionTypeDetails.INSTITUICOES.sigla],
        },

        // {
        //   title: "Instituições com Despesa",
        //   url: "/financas/credito/instituicoes/despesa",
        // },
        // {
        //   title: "Instituições com Receita",
        //   url: "/financas/credito/instituicoes/receita",
        // },
        {
          title: "Bolsas",
          url: "financas/credito/bolsa",
          permission: [PermissionTypeDetails.HISTORICO_BOLSAS.sigla],
        },
        {
          title: "Bolsa Estudante",
          url: "/financas/credito/bolsa/estudante",
          permission: [PermissionTypeDetails.LISTAR_BOLSEIROS.sigla],
        },
        // {
        //   title: "Tipos de Estudantes",
        //   url: "/financas/credito/tipo-estudantes",
        // },
        {
          title: "Atribuir Crédito Educacional",
          url: "/financas/credito/atribuir",
          permission: [PermissionTypeDetails.ATRIBUICAO_BOLSA_DESCONTO.sigla],
        },

        // {
        //   title: "Pagamentos Bolseiros",
        //   url: "/financas/credito/pag-bolseiros",
        // },
        // {
        //   title: "Listar Pagamentos de Bolseiros",
        //   url: "/financas/credito/listar-bolseiros",
        // },
        // {
        //   title: "Listar Crédito Educacional",
        //   url: "/financas/credito/listar",
        // },

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
        // {
        //   title: "Atribuição de Desconto",
        //   url: "/financas/descontos/atribuicao",
        // },
        // {
        //   title: "Estudantes com Descontos",
        //   url: "/financas/descontos/estudantes",
        // },
        // { title: "Listar Descontos", url: "/financas/descontos/listar" },

        /* Fecho de Caixa */
        // { title: "Fecho Caixa Diário", url: "/financas/caixa/diario" },
        // { title: "Fecho Caixa Geral", url: "/financas/caixa/geral" },
        // { title: "Fecho Caixa Utilizador", url: "/financas/caixa/utilizador" },

        // /* Outros Recursos */
        // {
        //   title: "Pagamentos Docentes",
        //   url: "/financas/outros/pagamentos-docentes",
        // },

        // /* Relatórios */
        // {
        //   title: "Estudantes Matriculados",
        //   url: "/financas/relatorios/matriculados",
        // },
        // {
        //   title: "Listar Estudantes Isentos",
        //   url: "/financas/relatorios/isentos",
        // },
        // {
        //   title: "Estudantes Matriculadas",
        //   url: "/financas/relatorios/matriculadas",
        // },
        // { title: "Listar Todos", url: "/financas/relatorios/todos" },
        // {
        //   title: "Estudantes Finalistas",
        //   url: "/financas/relatorios/finalistas",
        // },
        // {
        //   title: "Estudantes com Crédito Institucional",
        //   url: "/financas/relatorios/credito-institucional",
        // },
        // {
        //   title: "Estudantes com Desconto",
        //   url: "/financas/relatorios/descontos",
        // },
        {
          title: "Pagamentos por referência",
          url: "/financas/pagamento-referencia",
          permission: [PermissionTypeDetails.PAGAMENTOS.sigla],
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
        // { title: "Listar Loggs", url: "/financas/relatorios/loggs" },

        // /* Serviços Tributários */
        // { title: "Nota de Crédito", url: "/financas/agt/nota-credito" },
        // { title: "Taxa do IVA", url: "/financas/agt/iva" },
        // { title: "Gerar SAFT", url: "/financas/agt/saft" },
      ],

      permission: [],
    },
  ],
};
export const healpStructure: MenuStructure = {
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

    /*
    {
      title: "Ajuda",
      url: "/ajuda",
      icon: HelpCircle,
      items: [],

      permission: [],
    },
    */
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
export const gestaoDocente: MenuStructure = {
  items: [
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
        // { title: "Regentes", url: "/gestao-docentes/regentes" },
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
          permission: [PermissionTypeDetails.GESTAO_AFETACOES!.sigla],
        },
      ],
      permission: [],
    },
  ],
};
export const defenseTFC: MenuStructure = {
  items: [
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
export const assiduidade: MenuStructure = {
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
          title: "Atividades letivas",
          url: "/calendario/atividades",
          permission: [PermissionTypeDetails.ACTIVIDADES_LECTIVAS.sigla],
        },
        {
          title: "Prazos",
          url: "/calendario/prazos",
          permission: [PermissionTypeDetails.CRIAR_PRAZO_ACADEMICO.sigla],
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
          ],
        },
        // { title: "Prazos de provas + notas", url: "/calendario-lic/prazos" },

        //{ title: "Criar horário", url: "/calendario-lic/criar-horario" },
      ],

      permission: [],
    }, // ----------------------------------------------------
    // AVALIAÇÕES
    // ----------------------------------------------------
    {
      title: "Avaliações",
      url: "/avaliacoes",
      icon: FileCheck,
      items: [
        {
          title: "Controle de lançamento de notas",
          url: "/avaliacoes/controle",
          permission: [PermissionTypeDetails.CONTROLE_LANCAMENTO.sigla],
        },
        {
          title: "Fórmula por unidade curricular",
          url: "/avaliacoes/formula-uc",
          permission: [
            PermissionTypeDetails.DEFINIR_FORMULA_UNIDADE_CURRICULAR.sigla!,
          ],
        },
        {
          title: "Definir unidade curricular com oral",
          url: "/avaliacoes/formula-oral",
          permission: [
            PermissionTypeDetails.DEFINIR_UNIDADE_CURRICULAR_COM_ORAL.sigla!,
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
          permission: [PermissionTypeDetails.HISTORICO_LANCAMENTO_NOTAS.sigla!],
        },
        {
          title: "Lançamento de pauta",
          url: "/avaliacoes/pauta",
          permission: [PermissionTypeDetails.LANCAMENTO_PAUTA.sigla],
        },
        {
          title: "Lançamento de notas",
          url: "/avaliacoes/notas",
          permission: [PermissionTypeDetails.LANCAMENTO_NOTAS_MPGS.sigla],
        },
        {
          title: "Lista de presença",
          url: "/avaliacoes/presenca",
          permission: [PermissionTypeDetails.LISTA_PRESENCA.sigla],
        },

        {
          title: "Pauta geral",
          url: "/avaliacoes/pauta-geral",
          permission: [PermissionTypeDetails.PAUTA_GERAL.sigla],
        },
        {
          title: "Pauta por UC",
          url: "/avaliacoes/pauta-uc",
          permission: [PermissionTypeDetails.PAUTA_GERAL_POR_UC.sigla!],
        },
        {
          title: "Permissão fora do prazo",
          url: "/avaliacoes/permissao",
          permission: [
            PermissionTypeDetails.PERMISSAO_LANC_NOTA_FORA_PRAZO.sigla,
          ],
        },
        {
          title: "Validação",
          url: "/avaliacoes/validacao",
          permission: [PermissionTypeDetails.VALIDACAO_LANCAMENTO_PAUTA.sigla],
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
    }, // ----------------------------------------------------
    // HORÁRIOS
    // ----------------------------------------------------
    {
      title: "Horários",
      url: "/horarios",
      icon: Calendar,
      items: [
        {
          title: "Criar horário",
          url: "/horarios/criar",
          permission: [PermissionTypeDetails.CRIAR_HORARIO.sigla],
        },
        {
          title: "Horários semanais",
          url: "/horarios/semanais",
          permission: [
            PermissionTypeDetails.VISUALIZAR_HORARIO_POR_DOCENTE.sigla!,
          ],
        },
          { title: "Substitutos", url: "/horarios/docentes-substitutos", permission: [PermissionTypeDetails.LISTAR_DOCENTES_SUBSTITUTO.sigla!] },
        // { title: "Horários com/sem sala", url: "/horarios/salas" },
        {
          title: "Movimentar estudantes",
          url: "/horarios/movimentar/estudantes",
          permission: [
            PermissionTypeDetails.MOVIMENTAR_ESTUDANTES_POR_HORARIO.sigla,
          ],
        },
        {
          title: "Permissão editar",
          url: "/horarios/permissao",
          permission: [
            PermissionTypeDetails.PERMISSAO_PARA_EDITAR_HORARIO.sigla,
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
          permission: [PermissionTypeDetails.LISTAR_HORARIOS.sigla],
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

    // ----------------------------------------------------
    // EXAME DE ACESSO
    // ----------------------------------------------------

    {
      title: "Exame de Acesso",
      url: "/exame",
      icon: FileCheck,
      items: [

       // { title: "Candidatos do preparatório", url: "/exame/candidatos-prep" },
       { title: "Admitir candidatura", url: "/exame/admitir", permission: [PermissionTypeDetails.ADMITIR_CANDIDATO.sigla] },
        { title: "Alterar senha", url: "/exame/alterar-senha" ,permission:[PermissionTypeDetails.ALTERAR_SENHA_CANDIDATO.sigla]},
     
       { title: "Atribuir prova", url: "/exame/atribuir-prova", permission: [PermissionTypeDetails.ATRIBUIR_PROVA.sigla] },
       { title: "Consultar prova", url: "/exame/consultar-prova", permission: [PermissionTypeDetails.CONSULTAR_PROVA_CANDIDATO.sigla] },
        // { title: "Candidatos do preparatório", url: "/exame/candidatos-prep" },
        // { title: "Admitir candidatura", url: "/exame/admitir" },
    
        //{ title: "Estatísticas", url: "/exame/estatisticas" },
        // { title: "Estatísticas diária", url: "/exame/estatisticas-diaria" },
        {
          title: "Inscrição época especial",
          url: "/exame/epoca-especial",
          permission: [
            PermissionTypeDetails.INSCRICAO_EXAME_ACESSO_ESPECIAL.sigla,
          ],
        },
         { title: "Lançar nota (Arq/Urbanismo)", url: "/exame/lancar-nota-arquitectura", permission: [PermissionTypeDetails.LANCAR_NOTA_ARQUITECTURA.sigla] },
        {
          title: "Lista de candidatos",
          url: "/exame/lista-candidatos",
          permission: [PermissionTypeDetails.CANDIDATOS_INSCRITOS.sigla],
        },
        //{ title: "Admitidos", url: "/exame/admitidos" },
        // { title: "Admitidos sem matrícula", url: "/exame/sem-matricula" },
        // { title: "Sem prova marcada", url: "/exame/sem-prova" },
       { title: "Provas por candidato", url: "/exame/provas-candidato", permission: [PermissionTypeDetails.PROVAS_POR_CANDIDATO.sigla] },
        // { title: "Resultados finais", url: "/exame/resultados" },
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
        { title: "Resetar prova", url: "/exame/resetar", permission: [PermissionTypeDetails.RESETAR_PROVA_CANDIDATO.sigla] },
        { title: "Lista de presença", url: "/exame/presenca", permission: [PermissionTypeDetails.LISTA_PRESENCA_PROVA_ACESSO.sigla] },
        {
          title: "Candidatos com/sem prova",
          url: "/exame/candidatos-prova",
          permission: [
            PermissionTypeDetails.LISTA_CANDIDATOS_SEM_PROVAS_MARCADAS.sigla,
          ],
        },
      ],

      permission: [],
    },
  ],
};
