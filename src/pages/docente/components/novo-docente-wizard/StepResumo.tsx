import { DocenteWizardState } from "@/services/docentes/types/gestao-docente/docente-wizard.types";

interface StepResumoProps {
  data: DocenteWizardState;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-AO");
}

function sexoLabel(id?: number) {
  if (id === 1) return "Masculino";
  if (id === 2) return "Feminino";
  return "—";
}

// TODO: alinhar com ESCALAO_OPTIONS / CATEGORIA_DOCENTE_OPTIONS reais do StepDocente
const ESCALAO_LABELS: Record<number, string> = {
  1: "1º Escalão",
  2: "2º Escalão",
  3: "3º Escalão",
};

const CATEGORIA_DOCENTE_LABELS: Record<number, string> = {
  1: "Professor/a Catedrático/a",
  2: "Professor/a Associado/a",
  3: "Professor/a Auxiliar",
  4: "Assistente",
  5: "Assistente Estagiário/a",
  31: "Professor",
  32: "Professor Regente",
};

const GRAU_ACADEMICO_LABELS: Record<number, string> = {
  1: "Licenciado",
  2: "Doutor/a",
  3: "Mestre",
};

interface FieldProps {
  label: string;
  value?: string | number | null;
}

function Field({ label, value }: FieldProps) {
  const isEmpty = value === undefined || value === null || value === "";
  return (
    <div>
      <span className="block text-xs text-muted-foreground">{label}</span>
      <span className={isEmpty ? "text-red-500" : ""}>
        {isEmpty ? "Não preenchido" : value}
      </span>
    </div>
  );
}

export function StepResumo({ data }: StepResumoProps) {
  const p = data.pessoa;
  const c = data.candidatura;
  const d = data.docente;

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="mb-2 font-medium">Pessoa</h3>
        <div className="grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-3">
          <Field label="Nome completo" value={p.nomeCompleto} />
          <Field
            label="Nº documento de identificação"
            value={p.numDocIdentificacao}
          />
          <Field label="Nome do pai" value={p.nomePai} />
          <Field label="Nome da mãe" value={p.nomeMae} />
          <Field
            label="Data de nascimento"
            value={formatDate(p.dataDeNascimento)}
          />
          <Field label="Sexo" value={sexoLabel(p.sexoId)} />
          <Field
            label="Data de emissão do documento"
            value={formatDate(p.dataDeEmissaoDocumento)}
          />
          <Field
            label="Data de expiração do documento"
            value={formatDate(p.dataDeExpiracaoDocumento)}
          />
          <Field label="Email" value={p.email} />
          <Field label="Telefone 1" value={p.telefone1} />
          <Field label="Telefone 2" value={p.telefone2} />
          <Field label="Endereço" value={p.endereco} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Candidatura</h3>
        <div className="grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-3">
          {/* TODO: confirmar nome real do campo de grau académico em DocenteWizardState["candidatura"] */}
          <Field
            label="Grau académico"
            value={
              c.grauAcademico
                ? (GRAU_ACADEMICO_LABELS[c.grauAcademico] ?? c.grauAcademico)
                : undefined
            }
          />
          <Field label="Apreciação" value={c.apreciacao} />
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Docente</h3>
        <div className="grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-3">
          <Field label="Número mecanográfico" value={d.mecanografico} />
          <Field
            label="Escalão"
            value={
              d.fkEscalao
                ? (ESCALAO_LABELS[d.fkEscalao] ?? d.fkEscalao)
                : undefined
            }
          />
          <Field
            label="Categoria de docente"
            value={
              d.tbCategoriaDocente
                ? (CATEGORIA_DOCENTE_LABELS[d.tbCategoriaDocente] ??
                  d.tbCategoriaDocente)
                : undefined
            }
          />
          <Field label="Valor/hora" value={d.valorHora} />
          <Field
            label="Data de início de docência"
            value={formatDate(d.dataInicioDocencia)}
          />
          <Field
            label="Total anos de experiência"
            value={d.totalAnoExperiencia}
          />
          <Field
            label="Proposta de contratação"
            value={d.propostaDeContratacao}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Ao confirmar, será criado o registo de Pessoa, Utilizador (login),
        Candidatura e Docente numa única operação. Revise os campos a vermelho
        antes de continuar.
      </p>
    </div>
  );
}
