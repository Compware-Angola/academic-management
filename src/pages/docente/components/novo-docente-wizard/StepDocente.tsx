import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocenteWizardData } from "@/services/docentes/types/gestao-docente/docente-wizard.types";

interface StepDocenteProps {
  data: DocenteWizardData;
  onChange: (data: Partial<DocenteWizardData>) => void;
}

// TODO: substituir por hooks reais assim que a origem dos dados for definida
// (ex: useQueryEscalao, useQueryCategoriaDocente, useQueryFaculdade, useQueryContrato)
const ESCALAO_OPTIONS = [
  { value: "1", label: "1º Escalão" },
  { value: "2", label: "2º Escalão" },
  { value: "3", label: "3º Escalão" },
];

const CATEGORIA_DOCENTE_OPTIONS = [
  { value: "1", label: "Professor/a Catedrático/a" },
  { value: "2", label: "Professor/a Associado/a" },
  { value: "3", label: "Professor/a Auxiliar" },
  { value: "4", label: "Assistente" },
  { value: "5", label: "Assistente Estagiário/a" },
  { value: "31", label: "Professor" },
  { value: "32", label: "Professor Regente" },
];

const FACULDADE_OPTIONS = [
  { value: "1", label: "Faculdade A" },
  { value: "2", label: "Faculdade B" },
];

const CONTRATO_OPTIONS = [
  { value: "1", label: "Contrato a termo certo" },
  { value: "2", label: "Contrato a termo incerto" },
  { value: "3", label: "Contrato sem termo" },
];

export function StepDocente({ data, onChange }: StepDocenteProps) {
  const handleSelectChange = (
    field: keyof DocenteWizardData,
    value: string,
  ) => {
    onChange({ [field]: Number(value) } as Partial<DocenteWizardData>);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Número Mecanogrico</Label>
        <Input
          type="text"
          value={data.mecanografico ?? ""}
          onChange={(e) =>
            onChange({
              mecanografico: e.target.value ? e.target.value : undefined,
            })
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label>Escalão</Label>
        <Select
          value={data.fkEscalao ? String(data.fkEscalao) : undefined}
          onValueChange={(value) => handleSelectChange("fkEscalao", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar escalão" />
          </SelectTrigger>
          <SelectContent>
            {ESCALAO_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Categoria de docente</Label>
        <Select
          value={
            data.tbCategoriaDocente
              ? String(data.tbCategoriaDocente)
              : undefined
          }
          onValueChange={(value) =>
            handleSelectChange("tbCategoriaDocente", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIA_DOCENTE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* <div className="space-y-1.5">
        <Label>Faculdade</Label>
        <Select
          value={data.faculdade ? String(data.faculdade) : undefined}
          onValueChange={(value) => handleSelectChange("faculdade", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar faculdade" />
          </SelectTrigger>
          <SelectContent>
            {FACULDADE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* <div className="space-y-1.5">
        <Label>Tipo de contrato</Label>
        <Select
          value={data.codContrato ? String(data.codContrato) : undefined}
          onValueChange={(value) => handleSelectChange("codContrato", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar contrato" />
          </SelectTrigger>
          <SelectContent>
            {CONTRATO_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="space-y-1.5">
        <Label>Valor/hora</Label>
        <Input
          type="number"
          step="0.01"
          value={data.valorHora ?? ""}
          onChange={(e) =>
            onChange({
              valorHora: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label>Data de início de docência</Label>
        <Input
          type="date"
          value={data.dataInicioDocencia ?? ""}
          onChange={(e) => onChange({ dataInicioDocencia: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Total anos de experiência</Label>
        <Input
          type="number"
          value={data.totalAnoExperiencia ?? ""}
          onChange={(e) =>
            onChange({
              totalAnoExperiencia: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <Label>Proposta de contratação</Label>
        <Textarea
          value={data.propostaDeContratacao ?? ""}
          onChange={(e) => onChange({ propostaDeContratacao: e.target.value })}
          maxLength={300}
          rows={3}
        />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <Label>Apreciação</Label>
        <Textarea
          value={data.apreciacao ?? ""}
          onChange={(e) => onChange({ apreciacao: e.target.value })}
          maxLength={300}
          rows={3}
        />
      </div>
    </div>
  );
}
