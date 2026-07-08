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
import { CandidaturaWizardData } from "@/services/docentes/types/gestao-docente/docente-wizard.types";

interface StepCandidaturaProps {
  data: CandidaturaWizardData;
  onChange: (data: Partial<CandidaturaWizardData>) => void;
}

// TODO: substituir por hooks reais assim que a origem dos dados for definida
// (ex: useQueryGrauAcademico, useQueryCanal, useQueryFaculdade, etc.)
const GRAU_ACADEMICO_OPTIONS = [
  { value: "2", label: "Doutor/a" },
  { value: "3", label: "Mestre" },
  { value: "1", label: "Licenciado" },
];

// const CANAL_OPTIONS = [
//   { value: "1", label: "Presencial" },
//   { value: "2", label: "Online" },
//   { value: "3", label: "Recomendação" },
// ];

const ESTADO_CANDIDATURA_OPTIONS = [
  { value: "6", label: "Aprovada" },
  { value: "10", label: "Em análise" },
];

const FACULDADE_OPTIONS = [
  { value: "1", label: "Faculdade A" },
  { value: "2", label: "Faculdade B" },
];

export function StepCandidatura({ data, onChange }: StepCandidaturaProps) {
  const handleSelectChange = (
    field: keyof CandidaturaWizardData,
    value: string,
  ) => {
    onChange({ [field]: Number(value) } as Partial<CandidaturaWizardData>);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Grau académico</Label>
        <Select
          value={data.grauAcademico ? String(data.grauAcademico) : undefined}
          onValueChange={(value) => handleSelectChange("grauAcademico", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar grau académico" />
          </SelectTrigger>
          <SelectContent>
            {GRAU_ACADEMICO_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* <div className="space-y-1.5">
        <Label>Canal</Label>
        <Select
          value={data.canal ? String(data.canal) : undefined}
          onValueChange={(value) => handleSelectChange("canal", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar canal" />
          </SelectTrigger>
          <SelectContent>
            {CANAL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      <div className="space-y-1.5">
        <Label>Estado da candidatura</Label>
        <Select
          value={
            data.fkEstadoCandidatura
              ? String(data.fkEstadoCandidatura)
              : undefined
          }
          onValueChange={(value) =>
            handleSelectChange("fkEstadoCandidatura", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar estado" />
          </SelectTrigger>
          <SelectContent>
            {ESTADO_CANDIDATURA_OPTIONS.map((option) => (
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
        <Label>Código motivo</Label>
        <Input
          type="number"
          value={data.codigoMotivo ?? ""}
          onChange={(e) =>
            onChange({
              codigoMotivo: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div> */}

      <div className="space-y-1.5">
        <Label>Data início experiência</Label>
        <Input
          type="date"
          value={data.dataInicioExperiencia ?? ""}
          onChange={(e) => onChange({ dataInicioExperiencia: e.target.value })}
        />
      </div>

      {/* <div className="space-y-1.5">
        <Label>Data fim experiência</Label>
        <Input
          type="date"
          value={data.dataFimExperiencia ?? ""}
          onChange={(e) => onChange({ dataFimExperiencia: e.target.value })}
        />
      </div> */}

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
