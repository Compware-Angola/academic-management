# Plano de Refatoração: ExemptDays

## 1. Criar serviço de API

Centralizar todas as chamadas HTTP para o backend.

### Tarefas:

* [ ] Criar arquivo `exemptDayService.ts` em `src/services/`
* [ ] Exportar funções:

  * `getExemptDays()`: retorna lista de dias isentos
  * `createExemptDay(payload)`: cria um novo dia isento
  * `updateExemptDay(id, payload)`: atualiza um dia existente
  * `deleteExemptDay(id)`: deleta um dia isento
* [ ] Usar `axios` dentro do serviço, não diretamente no componente

**Exemplo de serviço:**

```ts
import axios from "axios";

const API_URL = "https://api.compware.net/ords/cmpdev/ga/exempt-days";

export const getExemptDays = async () => {
  const response = await axios.get(API_URL);
  return response.data.dias_isentos || [];
};

export const createExemptDay = async (payload: any) => {
  return axios.post(API_URL, payload);
};

export const updateExemptDay = async (id: number, payload: any) => {
  return axios.put(`${API_URL}/${id}`, payload);
};

export const deleteExemptDay = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
```

---

## 2. Criar hooks usando TanStack Query

Deixar o componente livre de lógica de fetching e mutation.

### Tarefas:

* [ ] Criar hooks em `src/hooks/exempt-day/`

  * `useExemptDays` → `useQuery` para buscar dias isentos
  * `useCreateExemptDay` → `useMutation` para criar
  * `useUpdateExemptDay` → `useMutation` para atualizar
  * `useDeleteExemptDay` → `useMutation` para deletar
* [ ] Incluir `onSuccess` para atualizar cache automaticamente
* [ ] Substituir `axios` direto pelo serviço

**Exemplo de hook `useExemptDays`:**

```ts
import { useQuery } from "@tanstack/react-query";
import { getExemptDays } from "@/services/exemptDayService";

export const useExemptDays = () => {
  return useQuery(["exemptDays"], getExemptDays, {
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
```

---

## 3. Refatorar componente `ExemptDays`

O componente deve focar **apenas em UI e interação**, chamando os hooks.

### Tarefas:

* [ ] Substituir `useState` de `diasIsentos` por `useExemptDays()`
* [ ] Substituir `fetchDiasIsentos()` pelo refetch do query
* [ ] Substituir `updateExemptDay` e `deleteExemptDay` pelas mutações do hook
* [ ] Manter estados de modal, formulário e paginação localmente
* [ ] Remover `axios` direto do componente

---

## 4. Tratar paginação e filtro

* [ ] Manter paginação local (`currentPage`, `itemsPerPage`)
* [ ] Ajustar `paginatedData` com base nos dados retornados do query
* [ ] Opcional: criar hook de paginação reutilizável

---

## 5. Tratar mensagens/toasts

* [ ] Usar `useToast()` para erros e sucesso
* [ ] Adicionar mensagens para sucesso de criação, atualização e exclusão

---

## 6. Limpeza de formulário

* [ ] Criar função `resetForm()` para limpar campos
* [ ] Chamar ao fechar modal

---

## 7. Benefícios desta refatoração

* Componente menor, apenas renderização e interação
* Lógica de API centralizada e reutilizável
* Mutations e cache gerenciados pelo TanStack Query
* Fácil manutenção e testabilidade
* Código mais legível e escalável

---

Se quiser, posso te entregar **uma versão completa do `ExemptDays.tsx` já refatorada** usando **hooks e serviço**, pronta para copiar e colar.

Quer que eu faça isso?
