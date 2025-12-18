# 🧪 Análise do Debug — Criação de Horário

## 1️⃣ Payload enviado (frontend)

```ts
{
  "anoLectivo": 23,
  "semestre": 1,
  "periodo": 5,
  "curso": 20,
  "unidadeCurricular": 43,
  "modalidade": 1,
  "aulas": [
    {
      "docente": 403,
      "diaSemana": 2,
      "ordemTempo": 1,
      "sala": 8,
      "tipoAula": 4,
      "hora_inicio": "07:20",
      "hora_fim": "08:10",
      "obs": ""
    },
    {
      "docente": 403,
      "diaSemana": 3,
      "ordemTempo": 1,
      "sala": 67,
      "tipoAula": 4,
      "hora_inicio": "07:20",
      "hora_fim": "08:10",
      "obs": ""
    }
  ],
  "apenasPrimeiroAno": 0,
  "capacidade": 50,
  "designacao": "ACSP.1.BIOESTAT-H1",
  "estadoHorario": 2,
  "turma": 0,
  "obs": ""
}
```

---

## 2️⃣ Horário criado (backend)

### 🎓 Dados gerais

✔️ **Corretos e coerentes**

* `anoLectivo → 23`
* `cursoId → 20`
* `unidadeCurricularId → 43`
* `capacidade → 50`
* `designacao → ACSP.1.BIOESTAT-H1`
* `estadoId → 2`
* `semestre → 1`
* `periodo → 5`

👉 **Aqui não há problemas.**

---

## 3️⃣ Problemas identificados (⚠️ importantes)

### ❌ 1. Sala enviada ≠ sala criada

| Aula | Sala enviada (payload) | Sala criada           |
| ---- | ---------------------- | --------------------- |
| 1    | `sala: 8`              | `salaid: 4` (`U-106`) |
| 2    | `sala: 67`             | `salaid: 4` (`U-106`) |

📌 **Problema grave**

* O backend **ignora completamente** o `sala` enviado no payload
* Ambas as aulas foram gravadas **na mesma sala**
* Isso pode gerar **conflitos invisíveis de horário**

🔍 **Possíveis causas**

* Backend sobrescreve a sala com:

  * sala padrão da UC
  * primeira sala encontrada
  * sala calculada por regra interna
* Ou DTO não está a mapear `sala` corretamente

---

### ❌ 2. Campo `obs` enviado, mas não persistido

Payload:

```ts
"obs": ""
```

Resposta:

```json
"observacoes": null
```

📌 **Inconsistência**

* Front envia string vazia
* Backend grava `null`

💡 **Não é crítico**, mas é **inconsistência de contrato**

* Ou o backend normaliza para `null`
* Ou o frontend devia enviar `null` explicitamente

---

### ❌ 3. `ordemTempo` → `ordem` (transformação silenciosa)

Payload:

```ts
"ordemTempo": 1
```

Resposta:

```json
"ordem": 1
```

📌 Aqui há **transformação implícita**

* Não é erro, mas:

  * O nome do campo **não bate**
  * Pode gerar confusão futura

✔️ Ideal:

* Padronizar DTO (`ordemTempo` **ou** `ordem`)

---

### ❌ 4. `modalidade` não vem da aula, mas do horário

Payload (aulas):

```ts
// NÃO existe modalidade dentro da aula
```

Resposta:

```json
"modalidadeId": 1
```

📌 Backend está:

* Herdando `modalidade` do horário
* Ou forçando uma modalidade padrão

⚠️ Se no futuro houver **aulas híbridas**, isso quebra.

---

### ❌ 5. Campo `turma` enviado mas ignorado

Payload:

```ts
"turma": 0
```

Resposta:

```json
// não existe turma na resposta
```

📌 Campo enviado **sem efeito**

* Ou não está implementado
* Ou não faz parte do modelo real

👉 **Deve ser removido do payload** ou implementado corretamente

---

## 4️⃣ Resumo dos pontos críticos

### ❗ Problemas reais (impactam dados)

* ❌ Sala enviada não é respeitada
* ❌ Todas as aulas gravadas na mesma sala
* ❌ Contrato de payload ≠ persistência real

### ⚠️ Problemas de design / contrato

* `obs` → `null`
* `ordemTempo` ≠ `ordem`
* `turma` ignorado
* `modalidade` implícita

---

## 5️⃣ Recomendações claras (próximo passo)

### ✅ Backend

* Validar e **respeitar `sala` por aula**
* Falhar se `sala` não existir
* Alinhar DTO ↔ Entity (nomes iguais)
* Documentar heranças implícitas (`modalidade`)

### ✅ Frontend

* Não permitir múltiplas salas se backend não suporta
* Normalizar `obs` para `null`
* Ajustar nome de campos (`ordem` vs `ordemTempo`)
* Remover campos sem efeito (`turma`)

---

Se quiseres, no próximo passo posso:

* desenhar o **DTO correto ideal**
* revisar o **service NestJS** que grava as aulas
* ou criar um **teste de contrato frontend ↔ backend**

É só dizer.
