// src/components/disciplines/CreateDisciplineModal.tsx
import { useState } from "react";
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
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { useMutationCreateDiscipline } from "@/hooks/study_plan/use-mutation-create-discipline";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { axiosApexGa } from "@/lib/axios-apex-ga";
import { useTiposUnidade } from "@/hooks/study_plan/use-type-unidade";
import { useToast } from "@/hooks/use-toast";

interface TipoUnidade {
  codigo: number;
  sigla: string;
  descricao: string;
}

interface CreateDisciplineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDisciplineModal({ open, onOpenChange }: CreateDisciplineModalProps) {
  const { mutate: create, isPending } = useMutationCreateDiscipline();
  const { user } = useAuth();
  const { toast } = useToast();
  // Estados do formulário
  const [designacao, setDesignacao] = useState("");
  const [codigo_disciplina, setCodigoDisciplina] = useState("");
  const [cAbbr, setCAbbr] = useState("");
  const [natureza_unidade_curricular, setNatureza] = useState<"TP" | "T" | "P" | "">("");
  const [tipo_unidade_curricular, setTipo] = useState<string>("");
const { data: tiposUnidade = [], isLoading: loadingTipos,isError } = useTiposUnidade();

  const handleSubmit = () => {
    if (!designacao.trim() || !codigo_disciplina.trim() || !cAbbr.trim() || !tipo_unidade_curricular || !natureza_unidade_curricular) {
      alert("Preencha todos os campos obrigatórios!");
       toast({
            title: "Erro ao fazer Cadastro",
            description: 'Preencha todos os campos obrigatórios!',
            variant: "destructive",
          });
      return;
    }

    create(
      {
        designacao: designacao.trim(),
        pk_utilizador: Number(user?.user_id) || 1,
        tipo_unidade_curricular: tipo_unidade_curricular,
        natureza_unidade_curricular,
        codigo_disciplina: codigo_disciplina.toUpperCase(),
        cAbbr: cAbbr.toUpperCase(),
      },
      {
        onSuccess: () => {
          setDesignacao("");
          setCodigoDisciplina("");
          setCAbbr("");
          setTipo("");
          setNatureza("");
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Disciplina</DialogTitle>
          <DialogDescription>
            Preencha todos os dados da nova unidade curricular.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Nome */}
            <div className="space-y-2">
              <Label>Nome da Disciplina *</Label>
              <Input
                placeholder="Ex: Direito das Sociedades Comerciais"
                value={designacao}
                onChange={(e) => setDesignacao(e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Código */}
            <div className="space-y-2">
              <Label>Código da Disciplina *</Label>
              <Input
                placeholder="Ex: BBRN"
                value={codigo_disciplina}
                onChange={(e) => setCodigoDisciplina(e.target.value)}
                className="uppercase"
                disabled={isPending}
              />
            </div>

            {/* Sigla */}
            <div className="space-y-2">
              <Label>Sigla (2 letras) *</Label>
              <Input
                placeholder="DL"
                maxLength={2}
                value={cAbbr}
                onChange={(e) => setCAbbr(e.target.value.toUpperCase())}
                className="uppercase text-center text-lg font-bold tracking-widest"
                disabled={isPending}
              />
            </div>

            {/* Tipo de Unidade Curricular - DINÂMICO DA API */}
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
                <Select value={tipo_unidade_curricular} onValueChange={setTipo} disabled={isPending}>
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

            {/* Natureza (TP/T/P) */}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Disciplina
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}