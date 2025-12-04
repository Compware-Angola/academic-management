// src/components/disciplines/CreateDisciplineModal.tsx

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { Loader2, Plus, AlertCircle, Save } from "lucide-react";

import { useMutationCreateDiscipline } from "@/hooks/study_plan/use-mutation-create-discipline";
import { useMutationUpdateDiscipline } from "@/hooks/study_plan/use-mutation-update-discipline";
import { useTiposUnidade } from "@/hooks/study_plan/use-type-unidade";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import { Discipline } from "@/services/study_plan/fect-discipline.serice";

interface TipoUnidade {
  codigo: number;
  sigla: string;
  descricao: string;
}

interface CreateDisciplineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discipline?: Discipline;
}

export function CreateDisciplineModal({
  open,
  onOpenChange,
  discipline,
}: CreateDisciplineModalProps) {
  const isEdit = !!discipline;

  const { mutate: create, isPending: creating } = useMutationCreateDiscipline();

  const { mutate: update, isPending: updating } = useMutationUpdateDiscipline();

  const isPending = creating || updating;

  const { user } = useAuth();
  const { toast } = useToast();

  // Estados do formulário
  const [designacao, setDesignacao] = useState("");
  const [codigo_disciplina, setCodigoDisciplina] = useState("");
  const [cAbbr, setCAbbr] = useState("");
  const [natureza_unidade_curricular, setNatureza] = useState<
    "TP" | "T" | "P" | ""
  >("");
  const [tipo_unidade_curricular, setTipo] = useState<string>("");

  const {
    data: tiposUnidade = [],
    isLoading: loadingTipos,
    isError,
  } = useTiposUnidade();

  const reset = () => {
    setDesignacao("");
    setCodigoDisciplina("");
    setTipo("");
    setNatureza("");
    setCAbbr("");
  };

  /**
   * Preenche dados quando estiver editando
   */
  useEffect(() => {
    if (discipline && open) {
      setDesignacao(discipline.desginacao);
      setCodigoDisciplina(discipline.codigo_disciplina);
      setCAbbr(discipline.sigla);
      setTipo(discipline.tipo_unidade_curricular);
      setNatureza(discipline.natureza_unidade_curricular as "TP" | "T" | "P");
    } else if (open) {
      reset();
    }
  }, [discipline, open]);

  const handleSubmit = () => {
    if (
      !designacao ||
      !codigo_disciplina ||
      !cAbbr ||
      !tipo_unidade_curricular ||
      !natureza_unidade_curricular
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios!",
        variant: "destructive",
      });
      return;
    }

    // 🔄 Atualizar
    if (isEdit) {
      update(
        {
          codigo: discipline!.codigo,
          codigo_disciplina: codigo_disciplina.toUpperCase(),
          designacao: designacao.trim(),
          natureza_unidade_curricular,
          nome_abreviatura: cAbbr.toUpperCase(),
          tipo_unidade_curricular,
        },
        {
          onSuccess: () => {
            reset();
            onOpenChange(false);
          },
        }
      );
      return;
    }

    // ➕ Criar
    create(
      {
        designacao: designacao.trim(),
        pk_utilizador: Number(user?.user_id) || 1,
        tipo_unidade_curricular,
        natureza_unidade_curricular,
        codigo_disciplina: codigo_disciplina.toUpperCase(),
        cAbbr: cAbbr.toUpperCase(),
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          {/* 🔥 TEXTO DINÂMICO */}
          <DialogTitle>
            {isEdit ? "Atualizar Disciplina" : "Nova Disciplina"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Atualize os dados da unidade curricular selecionada."
              : "Preencha os dados para cadastrar uma nova unidade curricular."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label>Nome da Disciplina *</Label>
              <Input
                value={designacao}
                placeholder="Ex: Direito das Sociedades Comerciais"
                onChange={(e) => setDesignacao(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Código */}
            <div className="space-y-2">
              <Label>Código da Disciplina *</Label>
              <Input
                value={codigo_disciplina}
                placeholder="Ex: ADS"
                className="uppercase"
                onChange={(e) => setCodigoDisciplina(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Sigla */}
            <div className="space-y-2">
              <Label>Sigla (2 letras) *</Label>
              <Input
                value={cAbbr}
                placeholder="DL"
                maxLength={2}
                className="uppercase text-center text-lg font-bold tracking-widest"
                onChange={(e) => setCAbbr(e.target.value.toUpperCase())}
                disabled={isPending}
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo de Unidade *</Label>
              {loadingTipos ? (
                <Skeleton className="h-10 w-full" />
              ) : isError ? (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Erro ao carregar tipos
                </div>
              ) : (
                <Select
                  value={tipo_unidade_curricular}
                  onValueChange={setTipo}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposUnidade.map((tipo) => (
                      <SelectItem key={tipo.codigo} value={tipo.sigla}>
                        {tipo.sigla} — {tipo.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Natureza */}
            <div className="space-y-2">
              <Label>Natureza da UC *</Label>
              <Select
                value={natureza_unidade_curricular}
                onValueChange={(v) => setNatureza(v as any)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a natureza..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TP">Teórico-Prática (TP)</SelectItem>
                  <SelectItem value="T">Teórica (T)</SelectItem>
                  <SelectItem value="P">Prática (P)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? "Atualizando..." : "Criando..."}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <Save className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isEdit ? "Atualizar Disciplina" : "Criar Disciplina"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
