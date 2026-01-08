// useActivitiesLectures.ts (versão final com loading no cadastro)

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryAtividades } from "@/hooks/queries/use-query-atividades";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { useMutationfetchCreateActivity } from "@/hooks/academiccalendar/use-mutation-create-activity";
import { useQueryTypeCalendar } from "@/hooks/academiccalendar/use-query-type-calendar";
import { AxiosError } from "axios";

import { Atividade } from "@/services/fetch-atividade";
import { Edit } from "lucide-react";
import { useMutationActivity } from "@/hooks/academiccalendar/use-mutation-update-activity";
import { useAuth } from "@/hooks/use-auth";

interface FormActivity {
  designacao: string;
  codigo_ano_lectivo: number | string;
  codigo_tipo_candidatura: number | string;
  codigo_tipo_calendario: number | string;
  data_inicio: string;
  data_fim: string;
}

export function useActivitiesLectures() {
  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();
  const { toast } = useToast();

  // Filtros
  const [anoLetivoId, setAnoLetivoId] = useState<string>("");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Modal
  const [openModal, setOpenModal] = useState(false);

  // Formulário
  const [form, setForm] = useState<FormActivity>({
    designacao: "",
    codigo_ano_lectivo: "",
    codigo_tipo_candidatura: "",
    codigo_tipo_calendario: "",
    data_inicio: "",
    data_fim: "",
  });

  // Queries
  const { data: anosLetivos = [], isLoading: loadingAnosLetivos } =
    useQueryAnoAcademico();
  const { data: tiposCandidatura = [], isLoading: loadingTiposCandidatura } =
    useQueryTipoCandidatura();
  const { data: tiposCalendario = [], isLoading: loadingTiposCalendario } =
    useQueryTypeCalendar();

  const {
    data: atividades = [],
    isLoading: loadingAtividades,
    refetch: refetchAtividades,
  } = useQueryAtividades({ anoLetivoId, tipoCandidaturaId });

  // Mutation com loading state
  const criarAtividadeMutation = useMutationfetchCreateActivity();
  const updateAtividadeMutation = useMutationActivity();
  // ==================== EFEITOS ====================
  useEffect(() => {
    if (!anosLetivos.length) return;

    const filtrados = anosLetivos.filter(
      (a) =>
        !a.designacao.toLowerCase().includes("doutoramento") &&
        !a.designacao.toLowerCase().includes("mestrado")
    );

    const ativo =
      filtrados.find((a) => a.estado?.toLowerCase().includes("activ")) ??
      filtrados[0];
    if (ativo) {
      const id = ativo.codigo.toString();
      setAnoLetivoId(id);
      setForm((prev) => ({ ...prev, codigo_ano_lectivo: ativo.codigo }));
    }
  }, [anosLetivos]);

  useEffect(() => {
    if (!tiposCandidatura.length) return;
    const padrao =
      tiposCandidatura.find((t) => t.codigo === 1) ?? tiposCandidatura[0];
    if (padrao) {
      setTipoCandidaturaId(padrao.codigo.toString());
      setForm((prev) => ({ ...prev, codigo_tipo_candidatura: padrao.codigo }));
    }
  }, [tiposCandidatura]);

  useEffect(() => {
    if (atividades.length > 0) {
      toast({ title: `Carregadas ${atividades.length} atividades` });
      setCurrentPage(1);
    }
  }, [atividades, toast]);

  // ==================== HANDLERS ====================
  const handleRefresh = () => refetchAtividades();

  const handleSubmitNew = async () => {
    const camposObrigatorios = [
      form.designacao,
      form.codigo_ano_lectivo,
      form.codigo_tipo_candidatura,
      form.codigo_tipo_calendario,
      form.data_inicio,
      form.data_fim,
    ];

    if (camposObrigatorios.some((campo) => !campo || campo === "")) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para continuar.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    const payload = {
      designacao: form.designacao.trim(),
      codigo_ano_lectivo: Number(form.codigo_ano_lectivo),
      codigo_tipo_candidatura: Number(form.codigo_tipo_candidatura),
      codigo_tipo_calendario: Number(form.codigo_tipo_calendario),
      codigo_utilizador: pk_utilizador,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
    };

    try {
      if (editId) {
        updateAtividadeMutation.mutateAsync({
          codigo: editId,
          data_inicio: form.data_inicio,
          data_termino: form.data_fim,
          descricao: form.designacao,
        });
        return;
      }
      await criarAtividadeMutation.mutateAsync(payload);

      setOpenModal(false);
      resetForm();
      refetchAtividades();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast({
          title: "Erro ao criar atividade",
          description:
            error.response.data?.msgresposta ||
            "Verifique os dados e tente novamente.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Erro ao criar atividade",
        description: "Verifique os dados e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      designacao: "",
      codigo_ano_lectivo: "",
      codigo_tipo_candidatura: "",
      codigo_tipo_calendario: "",
      data_inicio: "",
      data_fim: "",
    });
    setEditId(null);
  };

  // ==================== PAGINAÇÃO ====================
  const totalPages = Math.ceil(atividades.length / itemsPerPage);
  const paginatedData = atividades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleEdit = (item: Atividade) => {
    setForm({
      designacao: item.descricao,
      codigo_ano_lectivo: anosLetivos.find(
        (ano) => ano.designacao === item.ano_lectivo
      )?.codigo,
      codigo_tipo_candidatura: tiposCandidatura.find(
        (cand) => cand.designacao === item.tipo_candidatura
      )?.codigo,
      codigo_tipo_calendario: tiposCalendario.find(
        (cale) => cale.designacao === item.tipo_calendario
      )?.codigo,
      data_inicio: formatDateForInput(item.data_inicio),
      data_fim: formatDateForInput(item.data_termino),
    });

    setEditId(Number(item.codigo));
    setOpenModal(true);
  };

  // ==================== RETORNO ====================
  return {
    // Dados da tabela
    atividades: paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,
    loadingAtividades,

    // Form e modal
    form,
    setForm,
    openModal,
    setOpenModal,
    handleSubmitNew,
    isSubmitting,

    // Filtros e selects
    anoLetivoId,
    setAnoLetivoId,
    tipoCandidaturaId,
    setTipoCandidaturaId,
    editId,
    anosLetivos,
    loadingAnosLetivos,
    tiposCandidatura,
    loadingTiposCandidatura,
    tiposCalendario,
    loadingTiposCalendario,
    handleEdit,
    resetForm,
    // Ações
    handleRefresh,
  };
}
export function formatDateForInput(date: Date | string): string {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
