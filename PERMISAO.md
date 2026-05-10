# 📚 Mapeamento de Permissões — Perfil do Estudante

## 📌 Visão Geral

O módulo **Perfil do Estudante** está dividido em 4 grandes áreas:

| Área               | Objetivo                                |
| ------------------ | --------------------------------------- |
| Perfil             | Gestão académica e dados do estudante   |
| Documentação       | Emissão de documentos académicos        |
| Área Financeira    | Gestão financeira e cobranças           |
| Notas & Avaliações | Consulta de notas e histórico académico |

---

# 🧩 Estrutura Completa das Permissões

# 1️⃣ PERFIL

## 🏷️ Área

Académica / Secretaria Académica

## 📂 Aba

`perfil`

## 🔐 Permissões Utilizadas

| Permissão                            | O que permite fazer              |
| ------------------------------------ | -------------------------------- |
| `ACTUALIZAR_SENHA_ESTUDANTE`         | Alterar senha do estudante       |
| `ACTUALIZAR_CONTACTOS_ESTUDANTE`     | Actualizar contactos             |
| `ACTUALIZAR_DADOS_ESTUDANTE`         | Editar dados pessoais/académicos |
| `ACTIVAR_MATRICULA_CANCELADA`        | Reactivar matrícula cancelada    |
| `ACTIVAR_CONFIRMACAO`                | Confirmar matrícula/estado       |
| `VER_INSCRICOES`                     | Visualizar inscrições            |
| `INSCRICOES_UC`                      | Gerir inscrições em disciplinas  |
| `DEFINIR_ESPECIALIDADE_LICENCIATURA` | Definir especialidade            |
| `DIPLOMAR`                           | Diplomar estudante               |
| `MUDAR_CURSO`                        | Alterar curso do estudante       |

---

# 2️⃣ DOCUMENTAÇÃO

## 🏷️ Área

Secretaria / Documentação Académica

## 📂 Aba Principal

`documentacao`

---

## 📄 Carta de Conclusão

### Permissão

```ts
CARTA_CONCLUSAO;
```

### Função

Permite gerar ou visualizar carta de conclusão.

---

## 📄 Certidões

### Permissão

```ts
CERTIDOES;
```

### Função

Permite emitir certidões académicas.

---

## 🎓 Gerar Diploma

### Permissão

```ts
GERAR_DIPLOMA;
```

### Função

Permite gerar diploma do estudante.

---

## 📝 Certificado com Notas

### Permissão

```ts
CERTIFICADO_COM_NOTAS;
```

### Função

Permite gerar certificado com histórico de notas.

---

# 3️⃣ ÁREA FINANCEIRA

## 🏷️ Área

Financeiro / Tesouraria

## 📂 Aba Principal

`area-financeira`

---

## 💳 Notas de Pagamento

### Permissão

```ts
FACTURAS;
```

### Função

Permite visualizar e gerar notas/facturas de pagamento.

---

## 💰 Mensalidades

### Permissão

```ts
GERAR_MENSALIDADES;
```

### Função

Permite gerar mensalidades do estudante.

---

## 📦 Outros Serviços

### Permissão

```ts
GERAR_OUTROS_SERVICOS;
```

### Função

Permite cobrar serviços adicionais.

Exemplo:

- Declarações
- Segunda via
- Emolumentos
- Taxas extras

---

# 4️⃣ NOTAS & AVALIAÇÕES

## 🏷️ Área

Académica / Pedagógica

## 📂 Aba Principal

`avaliacao`

---

## 📝 Notas e Avaliações

### Permissão

```ts
LISTAR_AVALICOES_ESTUDANTE;
```

### Função

Permite consultar:

- MAC
- Provas
- Exames
- Média final

---

## 📚 Histórico Académico

### Permissão

```ts
HISTORICO_LANCAMENTO_NOTAS;
```

### Função

Permite consultar:

- Histórico de notas
- Aproveitamento académico
- Disciplinas concluídas

---

## 📖 Plano de Estudo

### Permissão

```ts
RESULTADO_PLANO_ESTUDO;
```

### Função

Permite visualizar:

- Estado curricular
- Disciplinas em falta
- Progresso do curso

---

# 5️⃣ DISCIPLINAS

## 🏷️ Área

Académica

## 📂 Componente

`DisciplinasSection`

---

## ⚠️ Observação Importante

Actualmente a `DisciplinasSection`:

- Está sendo renderizada:

```tsx
<DisciplinasSection />
```

- Mas NÃO possui controlo de permissões.

---

## 🚨 Problema Actual

Qualquer utilizador que acesse o perfil pode visualizar:

- disciplinas
- horários
- salas
- estado académico

Mesmo sem permissão específica.

---

# ✅ Recomendação

Criar uma permissão dedicada:

```ts
VER_DISCIPLINAS_ESTUDANTE;
```

---

## ✅ Exemplo Ideal

```tsx
const canViewDisciplinas = hasPermission(
  PermissionTypeDetails.VER_DISCIPLINAS_ESTUDANTE.sigla,
);
```

---

## ✅ Renderização Segura

```tsx
{
  canViewDisciplinas && (
    <DisciplinasSection
      value="disciplinas"
      codigoMatricula={Number(matricula)}
    />
  );
}
```

---

# 🧠 Resumo Arquitectural

| Área         | Tipo                 | Responsável         |
| ------------ | -------------------- | ------------------- |
| Perfil       | Secretaria Académica | Gestão do estudante |
| Documentação | Secretaria           | Emissão documental  |
| Financeiro   | Tesouraria           | Cobranças           |
| Avaliações   | Pedagógico           | Notas e histórico   |
| Disciplinas  | Académico            | Plano curricular    |

---

# 🔒 Mapa Geral de Segurança

| Permissão                            | Área         |
| ------------------------------------ | ------------ |
| `ACTUALIZAR_SENHA_ESTUDANTE`         | Perfil       |
| `ACTUALIZAR_CONTACTOS_ESTUDANTE`     | Perfil       |
| `ACTUALIZAR_DADOS_ESTUDANTE`         | Perfil       |
| `ACTIVAR_MATRICULA_CANCELADA`        | Perfil       |
| `ACTIVAR_CONFIRMACAO`                | Perfil       |
| `VER_INSCRICOES`                     | Perfil       |
| `INSCRICOES_UC`                      | Perfil       |
| `DEFINIR_ESPECIALIDADE_LICENCIATURA` | Perfil       |
| `DIPLOMAR`                           | Perfil       |
| `MUDAR_CURSO`                        | Perfil       |
| `CARTA_CONCLUSAO`                    | Documentação |
| `CERTIDOES`                          | Documentação |
| `GERAR_DIPLOMA`                      | Documentação |
| `CERTIFICADO_COM_NOTAS`              | Documentação |
| `FACTURAS`                           | Financeiro   |
| `GERAR_MENSALIDADES`                 | Financeiro   |
| `GERAR_OUTROS_SERVICOS`              | Financeiro   |
| `LISTAR_AVALICOES_ESTUDANTE`         | Avaliações   |
| `HISTORICO_LANCAMENTO_NOTAS`         | Avaliações   |
| `RESULTADO_PLANO_ESTUDO`             | Avaliações   |

---

# ✅ Melhorias Recomendadas

## 🔹 1. Criar permissões por submódulo

Exemplo:

```ts
VER_AREA_FINANCEIRA;
VER_DOCUMENTACAO;
VER_AVALIACOES;
VER_PERFIL_ESTUDANTE;
```

Assim evita usar múltiplas permissões apenas para abrir abas.

---

## 🔹 2. Criar enum de áreas

Exemplo:

```ts
export enum PermissionArea {
  ACADEMICO = "ACADEMICO",
  FINANCEIRO = "FINANCEIRO",
  SECRETARIA = "SECRETARIA",
  PEDAGOGICO = "PEDAGOGICO",
}
```

---

## 🔹 3. Adicionar metadata nas permissões

Exemplo:

```ts
{
  sigla: "GERAR_DIPLOMA",
  area: "SECRETARIA",
  descricao: "Permite gerar diploma",
}
```

---

## 🔹 4. Centralizar regras

Hoje as permissões estão espalhadas.

Ideal:

```ts
student - profile.permissions.ts;
```

Exemplo:

```ts
export const StudentProfilePermissions = {
  canViewFinanceiro: [...],
  canViewDocuments: [...],
  canViewGrades: [...],
}
```
