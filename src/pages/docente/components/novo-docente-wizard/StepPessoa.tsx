// components/novo-docente-wizard/StepPessoa.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PessoaWizardData } from "@/services/docentes/types/gestao-docente/docente-wizard.types";

interface StepPessoaProps {
  data: PessoaWizardData;
  onChange: (data: Partial<PessoaWizardData>) => void;
}

export function StepPessoa({ data, onChange }: StepPessoaProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-1.5 md:col-span-2">
        <Label>Nome completo *</Label>
        <Input
          value={data.nomeCompleto}
          onChange={(e) => onChange({ nomeCompleto: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Nº documento de identificação *</Label>
        <Input
          value={data.numDocIdentificacao}
          onChange={(e) => onChange({ numDocIdentificacao: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Email *</Label>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Telefone 1</Label>
        <Input
          value={data.telefone1 ?? ""}
          onChange={(e) => onChange({ telefone1: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Telefone 2</Label>
        <Input
          value={data.telefone2 ?? ""}
          onChange={(e) => onChange({ telefone2: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Data de nascimento</Label>
        <Input
          type="date"
          value={data.dataDeNascimento ?? ""}
          onChange={(e) => onChange({ dataDeNascimento: e.target.value })}
        />
      </div>

      {/* TODO: tipoDocumentoId, sexoId, estadoCivilId, nacionalidadeId
          são FKs — precisam de Select alimentado por endpoint próprio.
          Ver pergunta no final da resposta. */}
    </div>
  );
}
