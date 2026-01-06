import {
  Shield,
  Users,
  ClipboardCheck,
  Wallet,
  Calendar,
  MessageSquare,
  UserCheck,
  FileCheck,
  GraduationCap,
  FileText,
  BookOpen,

  BookMarked,

  Building,

  HomeIcon,
  BadgeDollarSign,
  HelpCircle,
} from "lucide-react";

import { MenuStructure } from "./menu.types";

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
        { title: "Lista  utilizador", url: "/acessos/utilizador" },
        { title: "Lista por grupos", url: "/ver-utilizadores/grupos" },
        { title: "Alterar senha", url: "/utilizadores/alterar-senha" },
        { title: "Criar utilizador", url: "/utilizadores/criar" },
        { title: "Acesso funcionalidade por grupo", url: "/acessos/grupo" },
        {
          title: "Funcionalidade por utilizador",
          url: "/acessos/funcionalidade-utilizador",
        },
        { title: "Listar grupos", url: "/grupos" },

        { title: "Acessos (todos) + novos", url: "/acessos/todos" },
        { title: "Bloquear acesso", url: "/acessos/bloquear" },
        { title: "Cargos Reitoria administrativo", url: "/acessos/cargos" },
        { title: "Logs de acessos", url: "/acessos/logs" },
        { title: "Utilizadores logados", url: "/acessos/logados" },
      ],
       roles: ['adm','rootAdmin', 'dct']
    },

    // ----------------------------------------------------
    // ASSIDUIDADE
    // ----------------------------------------------------
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
       roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // CALENDÁRIO LIC
    // ----------------------------------------------------

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
    // ----------------------------------------------------
    {
      title: "Docente",
      url: "/docente",
      icon: GraduationCap,
      items: [
        { title: "Calendário de aulas", url: "/docente/calendario" },
        { title: "Horas de vigilância", url: "/docente/vigilancia" },
        { title: "Programa da UC", url: "/docente/programa" },
        { title: "Validação do programa", url: "/docente/validacao" },
        { title: "Assiduidade", url: "/docente/assiduidade" },
      ],
       roles: ['adm','rootAdmin', 'dct']
    },

    // ----------------------------------------------------
    // TFC
    // ----------------------------------------------------
    {
      title: "Gestão de Defesas e TFC",
      url: "/tfc",
      icon: BookMarked,
      items: [
        { title: "Finalistas", url: "/tfc/finalistas" },
        { title: "Orientadores", url: "/tfc/orientadores" },
        { title: "Pagamentos TFC", url: "/tfc/pagamentos" },
      ],
        roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // GESTÃO DE DOCENTES
    // ----------------------------------------------------
    {
      title: "Gestão de Docentes",
      url: "/gestao-docentes",
      icon: GraduationCap,
      items: [
        { title: "Atualização de dados", url: "/gestao-docentes/atualizacao" },
        { title: "Alterar senha", url: "/gestao-docentes/senha" },
        { title: "Sem afetação", url: "/gestao-docentes/sem-afetacao" },
        { title: "Afetações", url: "/gestao-docentes/afetacoes" },
        { title: "Contratos", url: "/gestao-docentes/contratos" },
        { title: "Listagem geral", url: "/gestao-docentes/listagem" },
        { title: "Regentes", url: "/gestao-docentes/regentes" },
        { title: "Afetados", url: "/gestao-docentes/afetados" },
        { title: "UC sem docentes", url: "/gestao-docentes/uc-sem-docentes" },
        { title: "Candidaturas", url: "/gestao-docentes/candidaturas" },
        { title: "Parâmetros", url: "/gestao-docentes/parametros" },
        { title: "Salário", url: "/gestao-docentes/salario" },
        { title: "Validação docente", url: "/gestao-docentes/validacao" },
      ],
        roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // INSCRIÇÕES E MATRÍCULA
    // ----------------------------------------------------
    {
      title: "Inscrições e Matrícula",
      url: "/inscricoes",
      icon: FileCheck,
      items: [
        { title: "Atribuição de turma", url: "/inscricoes/turma" },
        { title: "Estatísticas", url: "/inscricoes/estatisticas" },
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
        roles: ['adm','rootAdmin']
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
        { title: "Gestão de disciplinas", url: "/plano/disciplinas" },
        { title: "Disciplinas sem siglas", url: "/plano/sem-siglas" },

        {
          title: "Gestão de UC por departamento",
          url: "/plano/uc-departamento",
        },
        { title: "Gestão de UC no plano", url: "/plano/uc-plano" },
      ],
        roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // PÓS-GRADUAÇÃO
    // ----------------------------------------------------
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
        roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // SUMÁRIO
    // ----------------------------------------------------
    {
      title: "Sumário",
      url: "/sumario",
      icon: FileText,
      items: [{ title: "Parâmetros", url: "/sumario/parametros" }],
        roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // VER UTILIZADORES
    // ----------------------------------------------------

    // ----------------------------------------------------
    // CONTROLE DE ACESSO
    // ----------------------------------------------------
    {
      title: "Controle de Acesso",
      url: "/controle-acesso",
      icon: Shield,
      items: [
        { title: "Documentos", url: "/controle-acesso/documentos" },
        { title: "Módulos", url: "/controle-acesso/modulos" },
        {
          title: "Solicitações encaminhadas",
          url: "/controle-acesso/solicitacoes",
        },
        { title: "Aplicação", url: "/controle-acesso/aplicacao" },
        { title: "Páginas", url: "/controle-acesso/paginas" },
        { title: "Diretor do curso", url: "/controle-acesso/diretor" },
        { title: "Grupos", url: "/controle-acesso/grupos" },
      ],
        roles: ['adm','rootAdmin']
    },

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
        roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // SALAS
    // ----------------------------------------------------
    {
      title: "Gestão de Salas",
      url: "/salas",
      icon: Building,
      items: [{ title: "Listar salas", url: "/salas/listar" }],
        roles: ['adm','rootAdmin']
    },

    // ----------------------------------------------------
    // MARCAÇÃO DE PROVAS
    // ----------------------------------------------------
    {
      title: "Marcação de Provas",
      url: "/marcacao-provas",
      icon: FileCheck,
      items: [
        { title: "Controle", url: "/marcacao-provas/controle" },
        { title: "Marcação", url: "/marcacao-provas/marcacao" },
      ],
        roles: ['adm','rootAdmin', 'dct']
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
        },
        { title: "Estudantes Devedores", url: "/financas/devedores" },
        { title: "Estudantes Inactivos", url: "/financas/inactivos" },
        {
          title: "Estud. Finalistas Inactivos",
          url: "/financas/finalistas-inactivos",
        },
        { title: "Consult. Nº Operação", url: "/financas/num-operacao" },
        { title: "Controlo Actual. Saldo", url: "/financas/controlo-saldo" },
        { title: "Isentar Serviços (Novos)", url: "/financas/isentar-novos" },
        {
          title: "Isentar Serviços (Antigos)",
          url: "/financas/isentar-antigos",
        },
        {
          title: "Pagamentos por Referência",
          url: "/financas/pagamentos-referencia",
        },
        { title: "Negociação de Dívida", url: "/financas/negociacao-divida" },
        { title: "Talão em Desuso", url: "/financas/talao-desuso" },
        { title: "Serviços e Emolumentos", url: "/financas/emolumentos" },

        /* Crédito Educacional */
        { title: "Instituições", url: "/financas/credito/instituicoes" },
        {
          title: "Instituições - Todas",
          url: "/financas/credito/instituicoes/todas",
        },
        {
          title: "Instituições com Despesa",
          url: "/financas/credito/instituicoes/despesa",
        },
        {
          title: "Instituições com Receita",
          url: "/financas/credito/instituicoes/receita",
        },
        { title: "Tipo Bolsas", url: "/financas/credito/tipo-bolsas" },
        {
          title: "Tipos de Estudantes",
          url: "/financas/credito/tipo-estudantes",
        },
        {
          title: "Atribuir Crédito Educacional",
          url: "/financas/credito/atribuir",
        },
        {
          title: "Pagamentos Bolseiros",
          url: "/financas/credito/pag-bolseiros",
        },
        {
          title: "Listar Pagamentos de Bolseiros",
          url: "/financas/credito/listar-bolseiros",
        },
        {
          title: "Listar Crédito Educacional",
          url: "/financas/credito/listar",
        },

        /* Gestão de Descontos */
        {
          title: "Atribuição de Desconto",
          url: "/financas/descontos/atribuicao",
        },
        {
          title: "Estudantes com Descontos",
          url: "/financas/descontos/estudantes",
        },
        { title: "Listar Descontos", url: "/financas/descontos/listar" },

        /* Fecho de Caixa */
        { title: "Fecho Caixa Diário", url: "/financas/caixa/diario" },
        { title: "Fecho Caixa Geral", url: "/financas/caixa/geral" },
        { title: "Fecho Caixa Utilizador", url: "/financas/caixa/utilizador" },

        /* Outros Recursos */
        {
          title: "Pagamentos Docentes",
          url: "/financas/outros/pagamentos-docentes",
        },

        /* Relatórios */
        {
          title: "Estudantes Matriculados",
          url: "/financas/relatorios/matriculados",
        },
        {
          title: "Listar Estudantes Isentos",
          url: "/financas/relatorios/isentos",
        },
        {
          title: "Estudantes Matriculadas",
          url: "/financas/relatorios/matriculadas",
        },
        { title: "Listar Todos", url: "/financas/relatorios/todos" },
        {
          title: "Estudantes Finalistas",
          url: "/financas/relatorios/finalistas",
        },
        {
          title: "Estudantes com Crédito Institucional",
          url: "/financas/relatorios/credito-institucional",
        },
        {
          title: "Estudantes com Desconto",
          url: "/financas/relatorios/descontos",
        },
        { title: "Listar Loggs", url: "/financas/relatorios/loggs" },

        /* Serviços Tributários */
        { title: "Nota de Crédito", url: "/financas/agt/nota-credito" },
        { title: "Taxa do IVA", url: "/financas/agt/iva" },
        { title: "Gerar SAFT", url: "/financas/agt/saft" },
      ],
       roles: ['adm','rootAdmin', 'fin']
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
        { title: "Avisos", url: "/comunicacao/avisos" },
        { title: "Imagens de abertura", url: "/comunicacao/imagens" },
        { title: "Solicitações", url: "/comunicacao/solicitacoes" },
      ],
       roles: ['adm','rootAdmin']
    },
    {
      title: "Ajuda",
      url: "/ajuda",
      icon: HelpCircle,
      items: [],
       roles: ['adm','rootAdmin', 'healp', 'dct', 'fin']
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
        { title: "Atividades letivas", url: "/calendario/atividades" },
        { title: "Prazos", url: "/calendario/prazos" },
        //{ title: "Calendário de provas", url: "/calendario/provas" },
        { title: "Dias isentos", url: "/calendario/dias-isentos" },
        { title: "Parâmetros", url: "/calendario/parametros" },
        // { title: "Prazos de provas + notas", url: "/calendario-lic/prazos" },

        //{ title: "Criar horário", url: "/calendario-lic/criar-horario" },
      ],
       roles: ['adm','rootAdmin', 'dct']
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
        },
        {
          title: "Fórmula por unidade curricular",
          url: "/avaliacoes/formula-uc",
        },
        {
          title: "Fórmula para grade com oral",
          url: "/avaliacoes/formula-oral",
        },
        { title: "Estatísticas", url: "/avaliacoes/estatisticas" },
        { title: "Estudantes inscritos", url: "/avaliacoes/estudantes" },
        { title: "Histórico de lançamentos", url: "/avaliacoes/historico" },
        { title: "Lançamento de pauta", url: "/avaliacoes/pauta" },
        { title: "Lançamento de notas", url: "/avaliacoes/notas" },
        { title: "Lista de presença", url: "/avaliacoes/presenca" },

        { title: "Pauta geral", url: "/avaliacoes/pauta-geral" },
        { title: "Pauta por UC", url: "/avaliacoes/pauta-uc" },
        { title: "Permissão fora do prazo", url: "/avaliacoes/permissao" },
        { title: "Validação", url: "/avaliacoes/validacao" },
        { title: "Visualizar notas", url: "/avaliacoes/visualizar" },
        { title: "Parâmetros gerais", url: "/avaliacoes/parametros" },
      ],
        roles: ['adm','rootAdmin', 'dct']
    }, // ----------------------------------------------------
    // HORÁRIOS
    // ----------------------------------------------------
    {
      title: "Horários",
      url: "/horarios",
      icon: Calendar,
      items: [
        { title: "Criar horário", url: "/horarios/criar" },
        { title: "Horários semanais", url: "/horarios/semanais" },
        { title: "Substitutos", url: "/horarios/substitutos" },
        // { title: "Horários com/sem sala", url: "/horarios/salas" },
        {
          title: "Movimentar estudantes",
          url: "/horarios/movimentar/estudantes",
        },
        { title: "Permissão editar", url: "/horarios/permissao" },
        { title: "Horários por docente", url: "/horarios/docente" },
        { title: "Inscrições por horário", url: "/horarios/inscricoes" },
        { title: "Listar horário", url: "/horarios/listar" },
        { title: "Eliminados", url: "/horarios/eliminados" },
        { title: "Horários por sala", url: "/horarios/sala" },
        { title: "Horários por UC", url: "/horarios/uc" },
        { title: "Parâmetros", url: "/horarios/parametros" },
      ],
        roles: ['adm','rootAdmin', 'dct']
    },
    // ----------------------------------------------------
    // EXAME DE ACESSO
    // ----------------------------------------------------
    {
      title: "Exame de Acesso",
      url: "/exame",
      icon: FileCheck,
      items: [
        { title: "Candidatos do preparatório", url: "/exame/candidatos-prep" },
        { title: "Admitir candidatura", url: "/exame/admitir" },
        { title: "Alterar senha", url: "/exame/alterar-senha" },
        { title: "Alterar tipo", url: "/exame/alterar-tipo" },
        { title: "Atribuir prova", url: "/exame/atribuir-prova" },
        { title: "Consultar prova", url: "/exame/consultar-prova" },
        { title: "Estatísticas", url: "/exame/estatisticas" },
        { title: "Estatísticas diária", url: "/exame/estatisticas-diaria" },
        { title: "Inscrição época especial", url: "/exame/epoca-especial" },
        { title: "Lançar nota (Arq/Urbanismo)", url: "/exame/lancar-nota" },
        { title: "Lista de candidatos", url: "/exame/lista-candidatos" },
        { title: "Admitidos", url: "/exame/admitidos" },
        { title: "Admitidos sem matrícula", url: "/exame/sem-matricula" },
        { title: "Sem prova marcada", url: "/exame/sem-prova" },
        { title: "Provas por candidato", url: "/exame/provas-candidato" },
        { title: "Resultados finais", url: "/exame/resultados" },
        { title: "Horários por curso", url: "/exame/horarios" },
        { title: "Pauta geral", url: "/exame/pauta-geral" },
        { title: "Resetar prova", url: "/exame/resetar" },
        { title: "Lista de presença", url: "/exame/presenca" },
      ],
        roles: ['adm','rootAdmin', 'dct']
    },
  ],
};
