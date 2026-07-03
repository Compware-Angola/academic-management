import { useCreateInvoice } from "@/hooks/financas/invoice/use-create-mutation";
import { getTipoFluxoServico, TipoFluxoServico } from "./const";
import { ServicoItem } from "./servicos.types";
import {
  useMutateInscricaoRecuro,
  useMutateInscricaoEpocaEspecial,
} from "@/hooks/students/use-recursos-UC";
import { toast } from "sonner";

type HandleGerarFacturaParams = {
  servicosItens: ServicoItem[];
  anoLetivo: string | null;
  poloId: number;
  codigoMatricula: number;
  onItemStatusChange: (
    codigo: number,
    status: ServicoItem["status"],
    mensagemErro?: string,
  ) => void;
  onSuccess: () => void;
};

const LABEL_FLUXO: Record<TipoFluxoServico, string> = {
  [TipoFluxoServico.NORMAL]: "outros serviços",
  [TipoFluxoServico.RECURSO]: "inscrição em recurso",
  [TipoFluxoServico.EPOCA_ESPECIAL]: "inscrição em época especial",
};

export function useServicosFactura() {
  const { mutateAsync: criarFactura, isPending: isCriandoFactura } =
    useCreateInvoice();
  const { mutateAsync: inscreverRecurso, isPending: isInscrevendoRecurso } =
    useMutateInscricaoRecuro();
  const {
    mutateAsync: inscreverEpocaEspecial,
    isPending: isInscrevendoEpocaEspecial,
  } = useMutateInscricaoEpocaEspecial();

  const validarSelecaoUC = (itens: ServicoItem[]): ServicoItem | null => {
    return (
      itens.find(
        (item) =>
          getTipoFluxoServico(item.sigla) !== TipoFluxoServico.NORMAL &&
          (!item.cadeirasRecursoIds || item.cadeirasRecursoIds.length === 0),
      ) ?? null
    );
  };

  const agruparPorFluxo = (itens: ServicoItem[]) => {
    return itens.reduce(
      (grupos, item) => {
        grupos[getTipoFluxoServico(item.sigla)].push(item);
        return grupos;
      },
      {
        [TipoFluxoServico.NORMAL]: [] as ServicoItem[],
        [TipoFluxoServico.RECURSO]: [] as ServicoItem[],
        [TipoFluxoServico.EPOCA_ESPECIAL]: [] as ServicoItem[],
      },
    );
  };

  const montarPayloadFaturaNormal = (
    itensNormais: ServicoItem[],
    anoLetivo: string,
    poloId: number,
    codigoMatricula: number,
  ) => {
    const total = itensNormais.reduce(
      (soma, item) => soma + item.valor * item.quantidade,
      0,
    );

    return {
      DataFactura: new Date().toISOString(),
      polo_id: poloId,
      TotalPreco: total,
      ValorAPagar: total,
      total_incidencia: total,
      total_retencao: 0,
      CodigoMatricula: codigoMatricula,
      Desconto: 0,
      totalIVA: 0,
      TotalMulta: 0,
      Descricao: "Pagamento de outros serviços",
      tipo_documento_factura_id: 1,
      canal: 3,
      codigo_anoLectivo: parseInt(anoLetivo),
      itens: itensNormais.map((item) => ({
        CodigoProduto: item.codigo,
        Quantidade: item.quantidade,
        preco: item.valor,
        Total: item.valor * item.quantidade,
        valor_pago: item.valor * item.quantidade,
        obs: item.nome,
        taxaIva: 0,
        valorIva: 0,
        retencao: 0,
        incidencia: item.valor * item.quantidade,
        valorDesconto: 0,
        descontoProduto: 0,
        estado: 0,
        valorPago: item.valor * item.quantidade,
        valorATransportar: 0,
        codigo_anoLectivo: parseInt(anoLetivo),
      })),
    };
  };

  const handleGerarFactura = async ({
    servicosItens,
    anoLetivo,
    poloId,
    codigoMatricula,
    onItemStatusChange,
    onSuccess,
  }: HandleGerarFacturaParams) => {
    if (servicosItens.length === 0 || !anoLetivo) {
      toast.warning("Atenção", {
        description: "Selecione pelo menos um serviço e um ano letivo.",
      });
      return;
    }

    const servicoSemUC = validarSelecaoUC(servicosItens);
    if (servicoSemUC) {
      toast.error("Atenção", {
        description: `Selecione as cadeiras para o serviço "${servicoSemUC.nome}".`,
      });
      return;
    }

    const grupos = agruparPorFluxo(servicosItens);
    const codigosSucesso: number[] = [];
    const falhas: { nome: string; erro: string }[] = [];

    // Marca tudo como "processando" no início
    servicosItens.forEach((item) =>
      onItemStatusChange(item.codigo, "processando"),
    );

    // --- Grupo RECURSO ---
    if (grupos[TipoFluxoServico.RECURSO].length > 0) {
      const itensRecurso = grupos[TipoFluxoServico.RECURSO];
      const gradesAlunos = itensRecurso.flatMap(
        (item) => item.cadeirasRecursoIds ?? [],
      );
      try {
        await inscreverRecurso({ codigoMatricula, gradesAlunos });
        itensRecurso.forEach((item) => {
          onItemStatusChange(item.codigo, "sucesso");
          codigosSucesso.push(item.codigo);
        });
      } catch (error) {
        const msg = "Falha ao inscrever em exame de recurso.";
        itensRecurso.forEach((item) =>
          onItemStatusChange(item.codigo, "erro", msg),
        );
        falhas.push({ nome: LABEL_FLUXO[TipoFluxoServico.RECURSO], erro: msg });
      }
    }

    // --- Grupo ÉPOCA ESPECIAL ---
    if (grupos[TipoFluxoServico.EPOCA_ESPECIAL].length > 0) {
      const itensEpoca = grupos[TipoFluxoServico.EPOCA_ESPECIAL];
      const gradesAlunos = itensEpoca.flatMap(
        (item) => item.cadeirasRecursoIds ?? [],
      );
      try {
        await inscreverEpocaEspecial({ codigoMatricula, gradesAlunos });
        itensEpoca.forEach((item) => {
          onItemStatusChange(item.codigo, "sucesso");
          codigosSucesso.push(item.codigo);
        });
      } catch (error) {
        const msg = "Falha ao inscrever em época especial.";
        itensEpoca.forEach((item) =>
          onItemStatusChange(item.codigo, "erro", msg),
        );
        falhas.push({
          nome: LABEL_FLUXO[TipoFluxoServico.EPOCA_ESPECIAL],
          erro: msg,
        });
      }
    }

    // --- Grupo NORMAL (fatura) ---
    if (grupos[TipoFluxoServico.NORMAL].length > 0) {
      const itensNormais = grupos[TipoFluxoServico.NORMAL];
      try {
        const payload = montarPayloadFaturaNormal(
          itensNormais,
          anoLetivo,
          poloId,
          codigoMatricula,
        );
        await criarFactura(payload);
        itensNormais.forEach((item) => {
          onItemStatusChange(item.codigo, "sucesso");
          codigosSucesso.push(item.codigo);
        });
      } catch (error) {
        const msg = "Falha ao gerar a nota de pagamento.";
        itensNormais.forEach((item) =>
          onItemStatusChange(item.codigo, "erro", msg),
        );
        falhas.push({ nome: LABEL_FLUXO[TipoFluxoServico.NORMAL], erro: msg });
      }
    }

    // --- Resumo final ---
    if (falhas.length === 0) {
      toast.success("Sucesso", {
        description: "Todos os serviços foram processados com sucesso!",
      });
      onSuccess(); // limpa tudo, já que passou 100%
    } else if (codigosSucesso.length > 0) {
      // toast.warning("Processado parcialmente", {
      //   description: `Concluído: ${servicosItens.length - falhas.reduce((n, f) => n, 0)} de ${servicosItens.length} itens. Falharam: ${falhas.map((f) => f.nome).join(", ")}. Os itens com falha continuam na lista para nova tentativa.`,
      // });
      // não chama onSuccess() — mantém os itens que falharam na tabela
    } else {
      // toast.error("Erro ao processar", {
      //   description:
      //     "Nenhum serviço foi processado. Verifique e tente novamente.",
      // });
    }
  };

  return {
    handleGerarFactura,
    isPending:
      isCriandoFactura || isInscrevendoRecurso || isInscrevendoEpocaEspecial,
  };
}
