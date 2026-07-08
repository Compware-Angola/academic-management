import { DocenteWizardState } from "@/services/docentes/types/gestao-docente/docente-wizard.types";

interface StepResumoProps {
  data: DocenteWizardState;
}

export function StepResumo({ data }: StepResumoProps) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="mb-1 font-medium">Pessoa</h3>
        <p className="text-muted-foreground">
          {data.pessoa.nomeCompleto} · {data.pessoa.numDocIdentificacao} ·{" "}
          {data.pessoa.email}
        </p>
      </div>

      <div>
        <h3 className="mb-1 font-medium">Candidatura</h3>
        <p className="text-muted-foreground">
          {data.candidatura.apreciacao || "Sem apreciação"}
        </p>
      </div>

      {/* <div>
        <h3 className="mb-1 font-medium">Docente</h3>
        <p className="text-muted-foreground">
          Valor/hora: {data.docente.valorHora ?? "—"} · Contrato:{" "}
          {data.docente.codContrato ?? "—"}
        </p>
      </div> */}

      <p className="text-xs text-muted-foreground">
        Ao confirmar, será criado o registo de Pessoa, Utilizador (login),
        Candidatura e Docente numa única operação.
      </p>
    </div>
  );
}
