
| Menu Principal | Submenu | URL | Permissão | Ícone |
| -------------- | ------- | --- | --------- | ----- |

Aqui está uma versão inicial baseada no teu `menuStructure` e outros menus que enviaste:

---

### **Dashboard & Acessos**

| Menu Principal | Submenu                         | URL                       | Permissão                                     | Ícone    |
| -------------- | ------------------------------- | ------------------------- | --------------------------------------------- | -------- |
| Início         | —                               | /dashboard                | —                                             | HomeIcon |
| Acessos        | Lista utilizador                | /acessos/utilizador       | LISTA_DE_UTILIZADORES, LISTA_DE_UTILIZADORES2 | Shield   |
| Acessos        | Criar utilizador                | /acessos/criar-utilizador | CRIAR_UTILIZADOR                              | Shield   |
| Acessos        | Acesso funcionalidade por grupo | /acessos/grupo            | ACESSOS_FUNCIONALIDADES_POR_GRUPO             | Shield   |
| Acessos        | Acessos (todos) + novos         | /acessos/todos            | LISTA_DE_UTILIZADORES, LISTA_DE_UTILIZADORES2 | Shield   |
| Acessos        | Cargos Reitoria administrativo  | /acessos/cargos           | LISTA_DE_UTILIZADORES, LISTA_DE_UTILIZADORES2 | Shield   |
| Acessos        | Logs de acessos                 | /acessos/logs             | LISTAR_LOGS_ACESSO                            | Shield   |
| Acessos        | Utilizadores logados            | /acessos/logados          | LISTAR_UTILIZADORES_LOGADOS                   | Shield   |
| Acessos        | Grupos                          | /controle-acesso/grupos   | GRUPOS                                        | Shield   |

---

### **Docente**

| Menu Principal | Submenu                      | URL               | Permissão                      | Ícone         |
| -------------- | ---------------------------- | ----------------- | ------------------------------ | ------------- |
| Docente        | Lançamento do programa da UC | /docente/programa | DOCENTE_LANCAMENTO_PROGRAMA_UC | GraduationCap |

---

### **Plano de Estudo**

| Menu Principal  | Submenu                       | URL                    | Permissão                              | Ícone    |
| --------------- | ----------------------------- | ---------------------- | -------------------------------------- | -------- |
| Plano de Estudo | Gestão de disciplinas         | /plano/disciplinas     | GESTAO_DISCIPLINAS                     | BookOpen |
| Plano de Estudo | Gestão de UC por departamento | /plano/uc-departamento | GESTAO_UNIDADE_CURRICULAR_DEPARTAMENTO | BookOpen |
| Plano de Estudo | Gestão de UC no plano         | /plano/uc-plano        | GESTAO_UNIDADE_CURRICULAR_PLANO        | BookOpen |

---

### **Gestão de Salas**

| Menu Principal  | Submenu      | URL           | Permissão    | Ícone    |
| --------------- | ------------ | ------------- | ------------ | -------- |
| Gestão de Salas | Listar salas | /salas/listar | LISTAR_SALAS | Building |

---

### **Marcação de Provas**

| Menu Principal     | Submenu  | URL                       | Permissão      | Ícone     |
| ------------------ | -------- | ------------------------- | -------------- | --------- |
| Marcação de Provas | Controle | /marcacao-provas/controle | CONTROLE_NOTA  | FileCheck |
| Marcação de Provas | Marcação | /marcacao-provas/marcacao | MARCACAO_PROVA | FileCheck |

---

### **Finanças**

| Menu Principal | Submenu                      | URL                                  | Permissão                       | Ícone           |
| -------------- | ---------------------------- | ------------------------------------ | ------------------------------- | --------------- |
| Finanças       | Notas de Pagamento           | /financas/notas-pagamento            | FACTURAS                        | BadgeDollarSign |
| Finanças       | Serviços e Emolumentos       | /financas/servicos-emolumentos       | SERVICOS_PRECARIOS              | BadgeDollarSign |
| Finanças       | Negociação de Dívida         | /financas/negociacao-divida          | LISTAR_NEGOCIACAO_DIVIDA        | BadgeDollarSign |
| Finanças       | Tipos Crédito                | /financas/credito/tipos              | LISTAR_TIPO_CREDITO_EDUCACIONAL | BadgeDollarSign |
| Finanças       | Instituições - Todas         | /financas/credito/instituicoes/todas | INSTITUICOES                    | BadgeDollarSign |
| Finanças       | Bolsas                       | /financas/credito/bolsa              | HISTORICO_BOLSAS                | BadgeDollarSign |
| Finanças       | Bolsa Estudante              | /financas/credito/bolsa/estudante    | LISTAR_BOLSEIROS                | BadgeDollarSign |
| Finanças       | Atribuir Crédito Educacional | /financas/credito/atribuir           | ATRIBUICAO_BOLSA_DESCONTO       | BadgeDollarSign |
| Finanças       | Descontos                    | /financas/descontos                  | ATRIBUICAO_BOLSA_DESCONTO       | BadgeDollarSign |
| Finanças       | Pagamentos por referência    | /financas/pagamento-referencia       | PAGAMENTOS                      | BadgeDollarSign |
| Finanças       | Isenção de serviço           | /financas/isencao-servico            | ISENCAO_SERVICO                 | BadgeDollarSign |

---

Perfeito! Vamos continuar com os menus restantes, seguindo a mesma tabela organizada.

---

### **Comunicação / Help**

| Menu Principal | Submenu                   | URL                               | Permissão                  | Ícone         |
| -------------- | ------------------------- | --------------------------------- | -------------------------- | ------------- |
| Comunicação    | Avisos                    | /comunicacao/avisos               | LISTAR_COMUNICACAO_INTERNA | MessageSquare |
| Comunicação    | Solicitações encaminhadas | /controle-acesso/solicitacoes     | —                          | MessageSquare |
| Comunicação    | Solicitações              | /controle-acesso/all-solicitacoes | —                          | MessageSquare |
| Comunicação    | Imagem De Abertura        | /comunicacao/avisos/imagem        | —                          | MessageSquare |

---

### **Suporte**

| Menu Principal | Submenu                 | URL                   | Permissão            | Ícone      |
| -------------- | ----------------------- | --------------------- | -------------------- | ---------- |
| Suporte        | Solicitações de Suporte | /suporte/solicitacoes | LSOLICITACAO_SUPORTE | Headphones |
| Suporte        | Tipos de Suporte        | /suporte/tipos        | TIPO_SUPORTE         | Headphones |

---

### **Defesa TFC**

| Menu Principal         | Submenu               | URL                    | Permissão     | Ícone      |
| ---------------------- | --------------------- | ---------------------- | ------------- | ---------- |
| Gestão de Defesa e TFC | Pagamentos TFC        | /defesa-tfc/pagamentos | PAGAMENTO_TFC | LibraryBig |
| Gestão de Defesa e TFC | Estudantes Finalistas | /defesa-tfc/estudantes | DEFESA        | LibraryBig |

---

### **Assiduidade**

| Menu Principal | Submenu                 | URL                   | Permissão                                        | Ícone      |
| -------------- | ----------------------- | --------------------- | ------------------------------------------------ | ---------- |
| Assiduidade    | Marcação de Assiduidade | /assiduidade/marcacao | MARCAR_ASSIDUIDADE_MSA, MARCAR_ASSIDUIDADE_PROVA | ListChecks |

---

### **Acadêmico / Calendário / Avaliações / Horários**

| Menu Principal       | Submenu                             | URL                             | Permissão                           | Ícone     |
| -------------------- | ----------------------------------- | ------------------------------- | ----------------------------------- | --------- |
| Calendário Académico | Atividades letivas                  | /calendario/atividades          | ACTIVIDADES_LECTIVAS                | Calendar  |
| Calendário Académico | Prazos                              | /calendario/prazos              | CRIAR_PRAZO_ACADEMICO               | Calendar  |
| Calendário Académico | Dias isentos                        | /calendario/dias-isentos        | CRIAR_DIAS_ISENTOS                  | Calendar  |
| Calendário Académico | Parâmetros                          | /calendario/parametros          | PARAMETROS_CALENDARIO_ACADEMICO     | Calendar  |
| Avaliações           | Controle de lançamento de notas     | /avaliacoes/controle            | CONTROLE_LANCAMENTO                 | FileCheck |
| Avaliações           | Fórmula por unidade curricular      | /avaliacoes/formula-uc          | DEFINIR_FORMULA_UNIDADE_CURRICULAR  | FileCheck |
| Avaliações           | Definir unidade curricular com oral | /avaliacoes/formula-oral        | DEFINIR_UNIDADE_CURRICULAR_COM_ORAL | FileCheck |
| Avaliações           | Estatísticas de notas lançadas      | /avaliacoes/estatisticas        | ESTATISTICA_NOTAS_LANCADAS          | FileCheck |
| Avaliações           | Estudantes inscritos por avaliação  | /avaliacoes/estudantes          | ESTUDANTES_INSCRITOS_POR_AVALIACAO  | FileCheck |
| Avaliações           | Histórico de lançamentos            | /avaliacoes/historico           | HISTORICO_LANCAMENTO_NOTAS          | FileCheck |
| Avaliações           | Lançamento de pauta                 | /avaliacoes/pauta               | LANCAMENTO_PAUTA                    | FileCheck |
| Avaliações           | Lançamento de notas                 | /avaliacoes/notas               | LANCAMENTO_NOTAS                    | FileCheck |
| Avaliações           | Lista de presença                   | /avaliacoes/presenca            | LISTA_PRESENCA                      | FileCheck |
| Avaliações           | Pauta geral                         | /avaliacoes/pauta-geral         | PAUTA_GERAL                         | FileCheck |
| Avaliações           | Pauta por UC                        | /avaliacoes/pauta-uc            | PAUTA_GERAL_POR_UC                  | FileCheck |
| Avaliações           | Permissão fora do prazo             | /avaliacoes/permissao           | PERMISSAO_LANC_FORA_PRAZO           | FileCheck |
| Avaliações           | Validação                           | /avaliacoes/validacao           | VALIDACAO_LANCAMENTO_PAUTA          | FileCheck |
| Avaliações           | Visualizar notas                    | /avaliacoes/visualizar          | LANCAMENTO_NOTAS_AVALIACOES         | FileCheck |
| Avaliações           | Parâmetros gerais                   | /avaliacoes/parametros          | PARAMETROS_GERAIS_AVALIACAO         | FileCheck |
| Horários             | Criar horário                       | /horarios/criar                 | CRIAR_HORARIO                       | Calendar  |
| Horários             | Horários semanais                   | /horarios/semanais              | VISUALIZAR_HORARIO_POR_DOCENTE      | Calendar  |
| Horários             | Movimentar estudantes               | /horarios/movimentar/estudantes | MOVIMENTAR_ESTUDANTES_HORARIOS      | Calendar  |
| Horários             | Permissão editar                    | /horarios/permissao             | PERMISSAO_PARA_EDITAR_HORARIO       | Calendar  |
| Horários             | Horários por docente                | /horarios/docente               | VISUALIZAR_HORARIO_POR_DOCENTE      | Calendar  |
| Horários             | Inscrições por horário              | /horarios/inscricoes            | INSCRICAO_POR_HORARIO               | Calendar  |
| Horários             | Listar horário                      | /horarios/listar                | LISTAR_HORARIOS                     | Calendar  |
| Horários             | Eliminados                          | /horarios/eliminados            | HORARIOS_ELIMINADOS                 | Calendar  |
| Horários             | Horários por sala                   | /horarios/sala                  | LISTAR_HORARIOS                     | Calendar  |
| Horários             | Horários por UC                     | /horarios/uc                    | HORARIOS_POR_UC                     | Calendar  |
| Horários             | Parâmetros                          | /horarios/parametros            | PERMISSAO_PARA_EDITAR_HORARIO       | Calendar  |
