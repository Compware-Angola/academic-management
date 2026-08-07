// components/CorrigirProvasModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PlayCircle, X } from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";
import { useCorrigirProvas } from "@/hooks/access_exam/use-corrigir-provas";

import { parseFilter } from "@/util/parse-filter";
import type { CorrigirProvasFiltros } from "@/services/access_exam/corrigir-provas.service";

type CorrigirProvasFiltrosForm = {
  codigoAnoLetivo: string;
  codigoCurso: string;
  codigoTurno: string;
  codigoFaculdade: string;
  codigoSala: string;
  dataInicio: string;
  dataFim: string;
  search: string;
};

const filtrosVazios: CorrigirProvasFiltrosForm = {
  codigoAnoLetivo: "",
  codigoFaculdade: undefined,
  codigoCurso: undefined,
  codigoTurno: undefined,
  codigoSala: undefined,
  dataInicio: "",
  dataFim: "",
  search: "",
};

interface CorrigirProvasModalProps {
  disabled?: boolean;
}

export function CorrigirProvasModal({ disabled }: CorrigirProvasModalProps) {
  const [open, setOpen] = useState(false);
  const [isProcessando, setIsProcessando] = useState(false);
  const [filters, setFilters] =
    useState<CorrigirProvasFiltrosForm>(filtrosVazios);

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const { data: salas } = useQuerySalas();

  const { mutate: corrigirProvas, isPending } =
    useCorrigirProvas(setIsProcessando);

  const carregando = isPending || isProcessando;

  const limparFiltros = () => setFilters(filtrosVazios);

  const handleConfirmar = () => {
    const payload: CorrigirProvasFiltros = {
      codigoAnoLetivo: filters.codigoAnoLetivo
        ? Number(filters.codigoAnoLetivo)
        : undefined,
      codigoCurso: filters.codigoCurso
        ? Number(filters.codigoCurso)
        : undefined,
      codigoTurno: parseFilter(filters.codigoTurno),
      codigoFaculdade: filters.codigoFaculdade
        ? Number(filters.codigoFaculdade)
        : undefined,
      codigoSala: filters.codigoSala ? Number(filters.codigoSala) : undefined,
      search: filters.search || undefined,
      dataInicio: filters.dataInicio || undefined,
      dataFim: filters.dataFim || undefined,
    };

    corrigirProvas(payload, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled || carregando} className="gap-2">
          {carregando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
          {carregando ? "Corrigindo provas..." : "Corrigir Provas Agora"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Corrigir Provas</DialogTitle>
            <Button variant="ghost" size="sm" onClick={limparFiltros}>
              <X className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <FormSelect
            label="Ano Letivo"
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            value={filters.codigoAnoLetivo}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                codigoAnoLetivo: v,
                codigoTurno: undefined,
              }))
            }
            options={academicYear}
            map={(a) => ({
              key: a.codigo.toString(),
              label: a.designacao,
              value: a.codigo.toString(),
            })}
          />

          <FacultySelect
            allOption
            value={filters.codigoFaculdade}
            onChangeValue={(v) =>
              setFilters((p) => ({
                ...p,
                codigoFaculdade: v,
                codigoCurso: undefined,
              }))
            }
          />

          <CourseSelect
            value={filters.codigoCurso}
            onChangeValue={(v) => setFilters((p) => ({ ...p, codigoCurso: v }))}
          />

          <FormSelect
            label="Período"
            disabled={
              isLoadingPeriodos ||
              isLoadingAcademicYear ||
              filters.codigoAnoLetivo === ""
            }
            loading={isLoadingPeriodos}
            value={filters.codigoTurno?.toString() ?? "all"}
            onChange={(v) =>
              setFilters((p) => ({
                ...p,
                codigoTurno: v === "all" ? undefined : v,
              }))
            }
            options={[
              { codigo: "all", designacao: "Todos" },
              ...(periodos ?? []),
            ]}
            map={(p) => ({
              key: p.codigo.toString(),
              label: p.designacao,
              value: p.codigo.toString(),
            })}
          />

          <FormCommandSelect
            label="Sala"
            value={filters.codigoSala}
            width="full"
            placeholder="Selecionar sala"
            options={salas}
            map={(sala) => ({
              key: sala.pk,
              value: sala.pk,
              label: sala.descricao,
            })}
            onChange={(v) => setFilters((p) => ({ ...p, codigoSala: v }))}
          />

          <div className="space-y-2">
            <Label>Pesquisar</Label>
            <Input
              placeholder="Pesquisar por nome ou BI"
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
            />
          </div>

          {/* <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={filters.dataInicio}
              onChange={(e) =>
                setFilters((p) => ({ ...p, dataInicio: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={filters.dataFim}
              onChange={(e) =>
                setFilters((p) => ({ ...p, dataFim: e.target.value }))
              }
            />
          </div> */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={carregando || !filters.codigoAnoLetivo}
          >
            {carregando && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Confirmar Correção
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
