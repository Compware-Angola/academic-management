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
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useMutationUpdateAviso } from "@/hooks/acess/use-mutation-aviso-update";
import { useAuth } from "@/hooks/use-auth";
import { useGroups } from "@/hooks/acess/use-query-groups";

type Props = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";     // ✅ agora aceita 'edit'
  initialData?: any;            // ✅ dados do aviso a editar
};

export function AvisoFormDialog({
  open,
  onClose,
  mode = "create",           // ✅ define 'create' como valor padrão
  initialData,
}: Props) {
  const [matricula, setMatricula] = useState("");
  const [pesquisar, setPesquisar] = useState(false);
  const [estudanteId, setEstudanteId] = useState<number | null>(null);

  const criarAvisoMutation = useMutationCreateAviso();
  const updateAvisoMutation = useMutationUpdateAviso();   // ✅ instância da mutação de edição

  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: roles } = useQueryListarRoles();
  const { data: aluno } = useQueryAlunoMatricula(matricula, pesquisar);
  const { data: groups = [], isLoading: loadingGroups } = useGroups();

  console.log("GRUPOS: ", groups)
  console.log("ROLES: ", roles)

  const {user} = useAuth()
  //console.log("PK_UTILIZADOR", user.user.pk_utilizador)
  console.log("USER: ", user);
  // ✅ Inicializa formData com initialData quando for editar
  const getFormData = (data?: any) => ({
  codigo: data?.codigo ?? "",
  assunto: data?.assunto ?? "",
  descricao: data?.descricao ?? "",
  curso:  "",
  periodo: data?.periodo?.codigo?.toString() ?? data?.periodo?.toString() ?? "",
  destino: data?.destino?.id?.toString() ?? data?.destino?.toString() ?? "",
  date_expiracao: data?.date_expiracao
    ? new Date(data.date_expiracao).toISOString().split("T")[0]
    : "",
  userId: data?.userId ?? "",
});

  const [formData, setFormData] = useState(getFormData(initialData));
    // ✅ Atualiza os campos sempre que o modo ou os dados iniciais mudam
  useEffect(() => {
  if (mode === "edit" && initialData) {
    const cursoEncontrado = cursos?.find(
      (c: any) =>
        c.nome === initialData.curso ||
        c.designacao === initialData.curso
    );

    setFormData({
      codigo:  initialData.codigo ?? "", 
      assunto: initialData.assunto ?? "",
      descricao: initialData.descricao ?? "",
      curso: cursoEncontrado ? cursoEncontrado.codigo.toString() : "",
      periodo: initialData?.periodo?.codigo?.toString() ?? initialData?.periodo?.toString() ?? "",
      destino: initialData?.destino?.id?.toString() ?? initialData?.destino?.toString() ?? "",
      date_expiracao: initialData?.date_expiracao
        ? new Date(initialData.date_expiracao).toISOString().split("T")[0]
        : "",
      userId: initialData?.userId ?? "",
    });
  } else if (mode === "create") {
    resetForm();
  }
}, [mode, initialData, cursos]);
  useEffect(() => {
    if (aluno) {
      setEstudanteId(null);
      setPesquisar(false);
    }
  }, [aluno]);

  const resetForm = () => {
    setFormData({
      codigo: "",
      assunto: "",
      descricao: "",
      curso: "",
      periodo: "",
      destino: "",
      date_expiracao: "",
      userId: ""
    });
  };

  // ✅ Decide entre criar e editar
  const handleSubmit = () => {
    if (!formData.assunto) {
      toast.error("O assunto é obrigatório.");
      return;
    }
    if (!formData.periodo) {
      toast.error("O período é obrigatório.");
      return;
    }

    const payload = {
      assunto: formData.assunto,
      descricao: formData.descricao,
      curso: formData.curso ? Number(formData.curso) : null,
      periodo: formData.periodo ? Number(formData.periodo) : null,
      destino: formData.destino ? Number(formData.destino) : null,
      date_expiracao: formData.date_expiracao || null,
      userId: user.user.pk_utilizador
    };

    // Se estiver a editar e houver ID no initialData, chama update
    if (mode === "edit" && initialData?.codigo) {
      updateAvisoMutation.mutate(
        { codigo: initialData.codigo, ...payload },
        {
          onSuccess: () => {
            toast.success("Aviso atualizado com sucesso");
            resetForm();
            onClose();
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message ?? "Erro ao atualizar aviso."
            );
          },
        }
      );
    } else {
      // caso contrário, cria novo
      criarAvisoMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Aviso criado com sucesso");
          resetForm();
          onClose();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ?? "Erro ao criar aviso."
          );
        },
      });
    }
  };

  const isLoading =
    criarAvisoMutation.isPending ||
    updateAvisoMutation.isPending ||
    isLoadingCurso ||
    isLoadingPeriodos;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {/* ✅ título condicional */}
          <DialogTitle>
            {mode === "edit" ? "Editar Aviso" : "Criar Aviso"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Assunto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Assunto</label>
            <Input
              value={formData.assunto}
              onChange={(e) =>
                setFormData({ ...formData, assunto: e.target.value })
              }
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
            />
          </div>

          {/* Curso */}
                    <div className="space-y-2">
                      <CourseSelect
                        value={formData.curso}
                        onChangeValue={(v) =>
                        setFormData({
                          ...formData,
                            curso: v,
                            })
                            }
                        />
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
                                  Destino
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
                                    {groups?.map((role: any) => (
                                      <SelectItem
                                        key={role.codigo}
                                        value={role.codigo.toString()} // ✅ usa ID
                                      >
                                        {role.descricao}
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
          <Button onClick={handleSubmit} disabled={isLoading}>
            {/* ✅ botão condicional */}
            {mode === "edit" ? null : <Plus className="h-4 w-4 mr-2" />}
            {mode === "edit" ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}