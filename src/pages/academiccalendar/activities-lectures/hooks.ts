import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryAtividades } from "@/hooks/queries/use-query-atividades";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";

interface FormActivity {
  descricao: string;
  data_inicio: string;
  data_termino: string;
  ano_lectivo: string;
  tipo_calendario: string;
}

export function useActivitiesLectures() {
  const { toast } = useToast();

  // Filtros
  const [anoLetivoId, setAnoLetivoId] = useState("");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal criação
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<FormActivity>({
    descricao: "",
    data_inicio: "",
    data_termino: "",
    ano_lectivo: "",
    tipo_calendario: "",
  });

  // Queries
  const { data: tiposCandidatura = [], isLoading: loadingTipos } =
    useQueryTipoCandidatura();

  const { data: anosLetivos = [], isLoading: loadingAnosLetivos } =
    useQueryAnoAcademico();

  const {
    data: atividades = [],
    isLoading: loadingAtividades,
    refetch: refetchAtividades,
  } = useQueryAtividades({ anoLetivoId, tipoCandidaturaId });

  // ---------------------- Efeitos ----------------------
  useEffect(() => {
    if (!anosLetivos.length) return;

    const anosFiltrados = anosLetivos.filter(
      (a) =>
        !a.designacao.toLowerCase().includes("doutoramento") &&
        !a.designacao.toLowerCase().includes("mestrado"),
    );

    const ativo =
      anosFiltrados.find((a) => a.estado.toLowerCase().includes("activ")) ??
      anosFiltrados[0];

    setAnoLetivoId(ativo.codigo.toString());
    setForm((f) => ({ ...f, ano_lectivo: ativo.designacao }));
  }, [anosLetivos]);

  useEffect(() => {
    if (!tiposCandidatura.length) return;

    const padrao = tiposCandidatura.find((t) => t.codigo === 1);
    if (padrao) setTipoCandidaturaId(padrao.codigo.toString());
  }, [tiposCandidatura]);

  useEffect(() => {
    if (!atividades.length) return;
    setCurrentPage(1);
    toast({ title: `Carregadas ${atividades.length} atividades` });
  }, [atividades]);

  // ---------------------- Handlers ----------------------
  const handleRefresh = () => refetchAtividades();

  const handleSubmitNew = () => {
    if (
      !form.descricao ||
      !form.data_inicio ||
      !form.data_termino ||
      !form.tipo_calendario
    ) {
      toast({
        title: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Atividade cadastrada com sucesso!" });
    setOpenModal(false);
    setForm({
      descricao: "",
      data_inicio: "",
      data_termino: "",
      ano_lectivo:
        anosLetivos.find((a) => a.codigo.toString() === anoLetivoId)
          ?.designacao || "",
      tipo_calendario: "",
    });

    refetchAtividades();
  };

  // ---------------------- Paginação ----------------------
  const totalPages = Math.ceil(atividades.length / itemsPerPage);
  const paginatedData = atividades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return {
    // Dados
    atividades: paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,

    // Form
    form,
    setForm,
    openModal,
    setOpenModal,

    // Filtros
    anoLetivoId,
    setAnoLetivoId,
    tipoCandidaturaId,
    setTipoCandidaturaId,
    tiposCandidatura,
    loadingTipos,
    anosLetivos,
    loadingAnosLetivos,

    // Ações
    handleRefresh,
    handleSubmitNew,
    loadingAtividades,
  };
}
