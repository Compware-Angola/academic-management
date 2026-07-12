// components/novo-docente-wizard/StepPessoa.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PessoaWizardData } from "@/services/docentes/types/gestao-docente/docente-wizard.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface StepPessoaProps {
  data: PessoaWizardData;
  onChange: (data: Partial<PessoaWizardData>) => void;
}

const BI_REGEX = /^\d{9}[A-Za-z]{2}\d{3}$/;

export function StepPessoa({ data, onChange }: StepPessoaProps) {
  const [biError, setBiError] = useState<string | null>(null);

  function handleBiBlur() {
    if (!data.numDocIdentificacao) {
      setBiError(null);
      return;
    }
    setBiError(
      BI_REGEX.test(data.numDocIdentificacao)
        ? null
        : "Formato inválido. Use: 9 dígitos + 2 letras + 3 dígitos (ex: 123456789LA042)",
    );
  }

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
        <Label>Nome do pai *</Label>
        <Input
          value={data.nomePai ?? ""}
          onChange={(e) => onChange({ nomePai: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Nome da mãe *</Label>
        <Input
          value={data.nomeMae ?? ""}
          onChange={(e) => onChange({ nomeMae: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Nº documento de identificação *</Label>
        <Input
          value={data.numDocIdentificacao}
          onChange={(e) => onChange({ numDocIdentificacao: e.target.value })}
          onBlur={handleBiBlur}
          placeholder="123456789LA042"
        />
        {biError && <p className="text-sm text-red-500">{biError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Data de emissão do documento</Label>
        <Input
          type="date"
          value={data.dataDeEmissaoDocumento ?? ""}
          onChange={(e) => onChange({ dataDeEmissaoDocumento: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Data de expiração do documento</Label>
        <Input
          type="date"
          value={data.dataDeExpiracaoDocumento ?? ""}
          onChange={(e) =>
            onChange({ dataDeExpiracaoDocumento: e.target.value })
          }
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

      <div className="space-y-1.5">
        <Label>Sexo</Label>
        <Select
          value={data.sexoId ? String(data.sexoId) : ""}
          onValueChange={(value) =>
            onChange({ sexoId: value ? Number(value) : undefined })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Masculino</SelectItem>
            <SelectItem value="2">Feminino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <Label>Endereço</Label>
        <Input
          value={data.endereco ?? ""}
          onChange={(e) => onChange({ endereco: e.target.value })}
        />
      </div>

      {/* TODO: tipoDocumentoId, sexoId, estadoCivilId, nacionalidadeId, naturalidadeId
          são FKs — precisam de <Select> seguindo o mesmo padrão do CourseSelect/FacultySelect
          (endpoint próprio + opção "Todos" quando aplicável, aqui sem "Todos" pois é criação). */}
    </div>
  );
}
