import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Search } from "lucide-react";
import { useQueryAlunoMatricula } from "@/hooks/financas/alunos/use-query-fecth-aluno";
import { ConfirmarAlunoModal } from "@/pages/financas/credito-educacional/AtribuirCredito/components/ConfirmarAlunoModal";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { CreateDescontoAddBody } from "@/services/financas/descontos/descontos.service.ts";
import { AxiosError } from "axios";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect.tsx";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect.tsx";
import { DescontoSelect } from "@/components/common/global-selects/DescontoSelect.tsx";
import { FormSelect } from "@/components/common/FormSelect";
import { parseFilter } from "@/util/parse-filter";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<CreateDescontoAddBody>;
  onSubmit: (body: CreateDescontoAddBody) => Promise<void>;
  isSubmitting?: boolean;
  isEditing?: boolean;
};

export default function AtribuirDescontoModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
  isSubmitting,
  isEditing,
}: Props) {
  const [observacao, setObservacao] = useState<string>(
    initial?.observacao ?? "",
  );
  const [codigoMatriculaStr, setCodigoMatriculaStr] = useState<string>(
    initial?.codigoMatricula ? String(initial.codigoMatricula) : "",
  );
  const [codigoTaxa, setCodigoTaxa] = useState<string>(
    initial?.codigoTaxa ? String(initial.codigoTaxa) : "",
  );
  const [codigoInstituicao, setCodigoInstituicao] = useState<string>(
    initial?.codigoInstituicao ? String(initial.codigoInstituicao) : "",
  );
  const [codigoAnoStr, setCodigoAnoStr] = useState<string>(
    initial?.codigoAno ? String(initial.codigoAno) : "",
  );
  const [semestre, setSemestre] = useState<string>(
    initial?.semestre ? String(initial?.semestre) : "",
  );
  const [afectacao, setAfectacao] = useState<string>("1");

  const [pesquisar, setPesquisar] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [alunoConfirmado, setAlunoConfirmado] = useState(false);

  const {
    data: aluno,
    isLoading: isLoadingAluno,
    isError,
    error,
  } = useQueryAlunoMatricula(codigoMatriculaStr, pesquisar);
  const tipoPagamentos = [
    {
      key: "1",
      label: "Pagamento de Propina",
    },
    {
      key: "2",
      label: "Pagamentos Globais",
    },
  ];

  useEffect(() => {
    if (open) {
      setObservacao(initial?.observacao ?? "");
      setCodigoMatriculaStr(
        initial?.codigoMatricula ? String(initial.codigoMatricula) : "",
      );
      setCodigoTaxa(initial?.codigoTaxa ? String(initial.codigoTaxa) : "");
      setCodigoInstituicao(
        initial?.codigoInstituicao ? String(initial.codigoInstituicao) : "",
      );
      setCodigoAnoStr(initial?.codigoAno ? String(initial.codigoAno) : "");
      setSemestre(initial?.semestre ? String(initial.semestre) : "");
      setPesquisar(false);
      setModalAberto(false);
      setAlunoConfirmado(false);
    }
  }, [open, initial]);

  const pesquisarAluno = () => {
    if (!codigoMatriculaStr) return;
    setAlunoConfirmado(false);
    setPesquisar(true);
  };

  useEffect(() => {
    if (aluno) setModalAberto(true);
  }, [aluno]);

  useEffect(() => {
    if (open && initial?.codigoMatricula) {
      setAlunoConfirmado(true);
    }
  }, [open, initial]);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setPesquisar(false);
      setModalAberto(false);
      setAlunoConfirmado(false);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async () => {
    if (!alunoConfirmado) {
      alert("Por favor confirme o estudante antes de submeter");
      return;
    }
    if (!codigoMatriculaStr || !codigoTaxa) {
      alert("Código matrícula e código taxa são obrigatórios");
      return;
    }

    const body: CreateDescontoAddBody = {
      observacao: observacao || undefined,
      codigoMatricula: Number(codigoMatriculaStr),
      codigoTaxa: Number(codigoTaxa),
      codigoInstituicao: Number(codigoInstituicao),
      codigoAno: codigoAnoStr ? Number(codigoAnoStr) : undefined,
      semestre: semestre ? Number(semestre) : undefined,
      afectacao: parseFilter(afectacao),
    };

    await onSubmit(body);
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Atribuição" : "Atribuir Desconto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Altere os dados da atribuição abaixo."
              : "Atribuir um desconto ao estudante."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Matrícula do Aluno</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: 12345"
                value={codigoMatriculaStr}
                onChange={(e) => {
                  setAlunoConfirmado(false);
                  setPesquisar(false);
                  setCodigoMatriculaStr(e.target.value);
                }}
              />
              <Button
                type="button"
                size="icon"
                disabled={isLoadingAluno || !codigoMatriculaStr}
                onClick={pesquisarAluno}
              >
                {isLoadingAluno ? "..." : <Search className="h-4 w-4" />}
              </Button>
            </div>
            {isError && (
              <p className="text-sm text-red-500 font-medium">
                {(error as unknown as AxiosError<{ message?: string }>)
                  ?.response?.data?.message ?? "Estudante não encontrado"}
              </p>
            )}
            {alunoConfirmado && aluno && (
              <p className="text-sm text-green-600 font-medium">
                Aluno: {aluno.nome_completo}
              </p>
            )}
          </div>

          <DescontoSelect
            value={codigoTaxa}
            onChangeValue={(v) => setCodigoTaxa(v)}
          />

          <div className="space-y-2">
            <InstituicaoSelect
              value={codigoInstituicao}
              onChangeValue={(v) => setCodigoInstituicao(v)}
            />
          </div>

          <div>
            <AcademicYearSelect
              value={codigoAnoStr}
              onChangeValue={(v) => setCodigoAnoStr(v)}
            />
          </div>

          <SemestreSelect
            value={semestre}
            onChangeValue={(v) => setSemestre(v)}
          />
          {!isEditing && (
            <FormSelect
              label="Afectação"
              value={afectacao}
              onChange={(v) => setAfectacao(v)}
              options={tipoPagamentos}
              map={(a) => ({
                key: a.key,
                label: a.label,
                value: a.key,
              })}
            />
          )}
          <div>
            <Label htmlFor="observacao">Observação</Label>
            <Input
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Salvando..."
                : "Atribuindo..."
              : isEditing
                ? "Salvar Alterações"
                : "Atribuir Desconto"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ConfirmarAlunoModal
        open={modalAberto}
        aluno={aluno}
        onClose={() => {
          setModalAberto(false);
          setPesquisar(false);
        }}
        onConfirm={() => {
          setAlunoConfirmado(true);
          setModalAberto(false);
          setPesquisar(false);
        }}
      />
    </Dialog>
  );
}
