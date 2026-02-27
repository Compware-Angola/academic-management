// src/pages/avisos/components/aviso-form-dialog.tsx

import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

import { useMutationCreateAviso } from "@/hooks/acess/use-mutation-create-aviso";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryAlunoMatricula } from "@/hooks/financas/alunos/use-query-fecth-aluno";
import { useQueryListarRoles } from "@/hooks/acess/use-query-roles";

type Props = {
  open: boolean;
  onClose: () => void;
   mode?: "create";
  initialData?: any;
};

export function AvisoFormDialog({ open, onClose }: Props) {
    const [matricula, setMatricula] = useState("");
    const [pesquisar, setPesquisar] = useState(false);
    const [estudanteId, setEstudanteId] = useState<number | null>(null);

  const criarAvisoMutation = useMutationCreateAviso();

  const { data: periodos, isLoading: isLoadingPeriodos } =
    useQueryPeriod();
  const { data: cursos, isLoading: isLoadingCurso } =
    useCursos();
    const {data: roles} = useQueryListarRoles()
     const { data: aluno, isLoading: isLoadingAluno, isError, error } =
    useQueryAlunoMatricula(matricula, pesquisar);

  const [formData, setFormData] = useState({
    assunto: "",
    descricao: "",
    curso: "",
    periodo: "",
    destino: "",
    date_expiracao: "",
  });

  console.log("AVISO: ", formData)

  useEffect(() => {
  if (aluno) {
    setEstudanteId(null); // ajusta conforme retorno da API
    setPesquisar(false);
  }
}, [aluno]);

  const resetForm = () => {
    setFormData({
      assunto: "",
      descricao: "",
      curso: "",
      periodo: "",
      destino: "",
      date_expiracao: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.assunto) {
      toast.error("O assunto é obrigatório.");
      return;
    }

    if (!formData.periodo) {
      toast.error("O período é obrigatório.");
      return;
    }

    criarAvisoMutation.mutate(
      {
        assunto: formData.assunto,
        descricao: formData.descricao,
        curso: formData.curso
          ? Number(formData.curso)
          : null,
        periodo: Number(formData.periodo),
        destino: formData.destino
      ? Number(formData.destino)
      : null,
        date_expiracao: formData.date_expiracao || null,
      },
      {
        onSuccess: () => {
          toast.success("Aviso criado com sucesso");
          resetForm();
          onClose();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ??
              "Erro ao criar aviso."
          );
        },
      }
    );
  };

  const isLoading =
    criarAvisoMutation.isPending ||
    isLoadingCurso ||
    isLoadingPeriodos;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Aviso</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Assunto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assunto
            </label>
            <Input
              value={formData.assunto}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assunto: e.target.value,
                })
              }
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descricao: e.target.value,
                })
              }
            />
          </div>

          {/* Curso */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Curso
            </label>
            <Select
              value={formData.curso}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  curso: v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingCurso
                      ? "Carregando cursos..."
                      : "Selecionar curso"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {cursos?.map((c: any) => (
                  <SelectItem
                    key={c.codigo}
                    value={c.codigo.toString()}
                  >
                    {c.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Período
            </label>
            <Select
              value={formData.periodo}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  periodo: v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingPeriodos
                      ? "Carregando períodos..."
                      : "Selecionar período"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {periodos?.map((p: any) => (
                  <SelectItem
                    key={p.codigo}
                    value={p.codigo.toString()}
                  >
                    {p.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DESTINO (Roles) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              DESTINO
            </label>

            <Select
              value={formData.destino}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  destino: v,
                })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="Selecionar destino"
                />
              </SelectTrigger>

              <SelectContent>
                {roles?.map((role: any) => (
                  <SelectItem
                    key={role.id}
                    value={role.id.toString()} // ✅ usa ID
                  >
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Expiração */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Data de Expiração
            </label>
            <Input
              type="date"
              value={formData.date_expiracao}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date_expiracao: e.target.value,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}