import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useQueryCategoriaDocente } from "@/hooks/categoria-docente/use-query-categoria-docente";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useQueryEscalao } from "@/hooks/escalao/use-query-escalao";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { TeachersItem } from "@/services/gestao-docente/fetch-list-teachers.service";
import { useMutationUpdateDocente } from "@/hooks/gestao_docente/use-mutation-update-docente";
import { UpdateDocentePayload } from "@/services/gestao-docente/update-docente.service";
import { parseFilter } from "@/util/parse-filter";

interface GestaoAfectacaoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  docente: TeachersItem;
}
export const EditarDocenteModal = ({
  isModalOpen,
  setIsModalOpen,
  docente,
}: GestaoAfectacaoModalProps) => {
  const { data: categoriaDocente = [] } = useQueryCategoriaDocente();
  const { data: escaloes = [] } = useQueryEscalao();
  const { toast } = useToast();
  const { mutateAsync, isPending } = useMutationUpdateDocente();
  const [params, setParams] = useState({
    escalao: "",
    categoria: "",
    faculdade: "",
    tipoCandidatura: "",
    nMecanografico: "",
    apreciacao: "",
    valor_hora: 0,
    ano_experiencia: 0,
    proposta_contratacao: "",
    codigo_validacao: "",
    data_inicio_docencia: "",
  });

  const handleChangeInput = (key: string, v: any) => {
    setParams({
      ...params,
      [key]: v,
    });
  };
  useEffect(() => {
    if (!docente) return;

    const categoria = docente?.categoriaid?.toString() ?? "";
    const faculdade = docente?.faculdadeid?.toString() ?? "";
    const escalao = docente?.escalaoid?.toString() ?? "";
    const tipoCandidatura = docente?.candidaturaid?.toString() ?? "";

    // input type="date" só aceita "YYYY-MM-DD"
    const dataInicioDocencia = docente?.data_inicio_docencia
      ? docente.data_inicio_docencia.slice(0, 10)
      : "";

    setParams((prev) => ({
      ...prev,
      nMecanografico: docente?.numero_mec ?? "",
      escalao,
      categoria,
      faculdade,
      ano_experiencia: docente?.ano_experiencia ?? 0,
      apreciacao: docente?.apreciacao ?? "",
      codigo_validacao: docente?.codigo_validacao ?? "",
      data_inicio_docencia: dataInicioDocencia,
      proposta_contratacao: docente?.proposta_contratacao ?? "",
      valor_hora: docente?.valor_hora ?? 0,
      tipoCandidatura,
    }));
  }, [docente]);

  console.log(docente);

  const handleSubmit = async () => {
    if (!docente) return;
    const id = docente?.codigo;
    const payload: UpdateDocentePayload = {
      apreciacao: params.apreciacao,
      codigoValidacao: params?.codigo_validacao,
      dataInicioDocencia: params?.data_inicio_docencia,
      faculdade: parseFilter(params?.faculdade),
      fkCandidatura: parseFilter(params?.tipoCandidatura),
      fkEscalao: parseFilter(params?.escalao),
      nMecanografico: params?.nMecanografico,
      propostaDeContratacao: params?.proposta_contratacao,
      tbCategoriaDocente: parseFilter(params?.categoria),
      totalAnoExperiencia: params?.ano_experiencia,
      valorHora: params?.valor_hora,
      valorhoraAlt: params?.valor_hora,
    };
    await mutateAsync(
      {
        codigo: id,
        payload,
      },
      {
        onSuccess(data) {
          toast({
            title: "Actualização",
            description: "Docente actualizado com sucesso",
          });
          setIsModalOpen();
        },
        onError(error) {
          toast({
            title: "Actualização",
            description: "Erro ao actualizar o docente",
          });
        },
      },
    );
  };

  return (
    <>
      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5" />
              Editar Docente
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Apreciação</Label>
              <Input
                placeholder="Apreciação"
                value={params.apreciacao}
                onChange={({ target }) =>
                  handleChangeInput("apreciacao", target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Mecanografico</Label>

              <Input
                value={params.nMecanografico}
                placeholder="Mecanografico"
                onChange={({ target }) =>
                  handleChangeInput("nMecanografico", target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Escalão</Label>
              <FormCommandSelect
                width="full"
                value={params.escalao}
                options={escaloes}
                map={(t) => ({ key: t.value, value: t.value, label: t.label })}
                onChange={(codigo) => handleChangeInput("escalao", codigo)}
              />
            </div>
            <FacultySelect
              onChangeValue={(v) => handleChangeInput("faculdade", v)}
              value={params.faculdade}
            />
            <div className="space-y-2">
              <Label>Categoria</Label>
              <FormCommandSelect
                width="full"
                value={params.categoria}
                options={categoriaDocente}
                map={(t) => ({ key: t.value, value: t.value, label: t.label })}
                onChange={(codigo) => handleChangeInput("categoria", codigo)}
              />
            </div>
            <div className="space-y-2">
              <Label>Código de Validação</Label>
              <Input
                value={params.codigo_validacao}
                placeholder="Código de Validação"
                onChange={({ target }) =>
                  handleChangeInput("codigo_validacao", target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Hora</Label>
              <Input
                value={params.valor_hora}
                type="number"
                placeholder="Valor Hora"
                onChange={({ target }) =>
                  handleChangeInput("valor_hora", parseInt(target.value))
                }
              />
            </div>
            <TipoCandidaturaSelect
              temporarilyUnavailable={true}
              disabled={true}
              value={params.tipoCandidatura}
              onChangeValue={(v) => handleChangeInput("tipoCandidatura", v)}
            />
            <div className="space-y-2">
              <Label>Anos de Experiência</Label>
              <Input
                value={params.ano_experiencia}
                type="number"
                onChange={({ target }) =>
                  handleChangeInput("ano_experiencia", parseInt(target.value))
                }
                placeholder={"Anos de Experiência"}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Inicio do Docente</Label>
              <Input
                value={params.data_inicio_docencia}
                type="date"
                placeholder={"Data Inicio do Docente"}
                onChange={({ target }) =>
                  handleChangeInput("data_inicio_docencia", target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen()}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit()}>
              {isPending ? <Loader2 /> : "Editar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
