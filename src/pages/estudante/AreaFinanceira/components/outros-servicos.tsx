import { useState } from "react";
import {
  Plus,
  Receipt,
  Trash2,
  Minus,
  Plus as PlusIcon,
  BookPlus,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { TypeServiceSelectList } from "@/components/common/global-selects/TypeServiceSelectList";
import { parseFilter } from "@/util/parse-filter";
import { useQueryTiposServico } from "@/hooks/financas/use-query-tipo-service";
import { ModalCadeirasRecurso } from "./modal-uc";
import { servicoExigeSelecaoUC } from "./const";
import { ServicoItem } from "./servicos.types";
import { useServicosFactura } from "./use-servico-factura";
import { toast } from "sonner";
import { Cadeira } from "@/services/students/fetch-recurso-uc.service";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

type Props = {
  codigoMatricula: number;
  poloId?: number;
};

export function OutrosServicosSection({ codigoMatricula, poloId = 1 }: Props) {
  const [servicoSel, setServicoSel] = useState<string>("");
  const [servicosItens, setServicosItens] = useState<ServicoItem[]>([]);
  const [anoLetivo, setAnoLetivo] = useState<string | null>(null);
  const [cadeiras, setCadeiras] = useState<Cadeira[]>([]);
  const [modalUC, setModalUC] = useState<boolean>(false);
  const [servicoSelecionado, setServicoSelecionado] =
    useState<ServicoItem | null>(null);

  const algumServicoExigeUC = servicosItens.some((item) =>
    servicoExigeSelecaoUC(item.sigla),
  );

  const { handleGerarFactura, isPending } = useServicosFactura();

  const { data: services = [], isLoading } = useQueryTiposServico(
    {
      estado: "Ativo",
      codigoAnoLectivo: parseFilter(anoLetivo),
    },
    { enabled: !!anoLetivo },
  );
  console.log(services);
  // ---------- Métodos de manipulação da lista ----------
  const adicionarServico = () => {
    const servico = services.find((t) => t.codigo.toString() === servicoSel);
    if (!servico) return;

    const jaExiste = servicosItens.some(
      (item) => item.codigo === servico.codigo,
    );
    if (jaExiste) {
      toast.error("Serviço já adicionado");
      setServicoSel("");
      return;
    }

    setServicosItens((prev) => [
      ...prev,
      {
        nome: servico.descricao,
        sigla: servico.sigla,
        quantidade: servicoExigeSelecaoUC(servico.sigla) ? 0 : 1,
        valor: servico.preco,
        codigo: servico.codigo,
        status: "pendente",
      },
    ]);
    setServicoSel("");
  };

  const removerServico = (codigo: number) => {
    setServicosItens((prev) => prev.filter((item) => item.codigo !== codigo));
  };

  const alterarQuantidade = (codigo: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    setServicosItens((prev) =>
      prev.map((item) =>
        item.codigo === codigo ? { ...item, quantidade: novaQuantidade } : item,
      ),
    );
  };

  const fmtKz = (v: number) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(v);

  const totalServicos = servicosItens.reduce(
    (soma, item) => soma + item.valor * item.quantidade,
    0,
  );

  // ---------- Modal de seleção de UC ----------
  const handleAbrirModalUC = (item: ServicoItem) => {
    setServicoSelecionado(item);
    setModalUC(true);
  };

  const handleFecharModalUC = (open: boolean) => {
    setModalUC(open);
    if (!open) setServicoSelecionado(null);
  };

  const handleConfirmarUC = (cadeirasSelecionadas: Cadeira[]) => {
    if (!servicoSelecionado) return;
    setCadeiras(cadeirasSelecionadas);
    setServicosItens((prev) =>
      prev.map((item) =>
        item.codigo === servicoSelecionado.codigo
          ? {
              ...item,
              quantidade: cadeirasSelecionadas.length,
              cadeirasRecursoIds: cadeirasSelecionadas,
            }
          : item,
      ),
    );

    setServicoSelecionado(null);
  };

  // ---------- Atualização de status por item ----------
  const handleItemStatusChange = (
    codigo: number,
    status: ServicoItem["status"],
    mensagemErro?: string,
  ) => {
    setServicosItens((prev) =>
      prev.map((item) =>
        item.codigo === codigo ? { ...item, status, mensagemErro } : item,
      ),
    );
  };

  // ---------- Submissão ----------
  const onGerarFactura = () => {
    handleGerarFactura({
      servicosItens,
      anoLetivo,
      poloId,
      codigoMatricula,
      onItemStatusChange: handleItemStatusChange,
      onSuccess: () => setServicosItens([]),
    });
  };

  // Remove só os itens que já tiveram sucesso, mantém pendentes/erro
  const limparConcluidos = () => {
    setServicosItens((prev) =>
      prev.filter((item) => item.status !== "sucesso"),
    );
  };

  const totalColunas = 5 + (algumServicoExigeUC ? 1 : 0) + 1; // +1 coluna de status

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Outros Serviços
        </h2>
        <p className="text-muted-foreground mt-1">
          Selecione e adicione serviços extras para o estudante
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-end gap-4">
        <div className="w-full lg:w-80">
          <AcademicYearSelect
            enableDefaultActiveYear
            value={anoLetivo}
            onChangeValue={(v) => setAnoLetivo(v)}
          />
        </div>

        <div className="flex-1 flex gap-2">
          <div className="flex-1">
            <TypeServiceSelectList
              enabled={!!anoLetivo}
              anoLectivo={parseFilter(anoLetivo)}
              value={servicoSel}
              onChangeValue={(v) => setServicoSel(v)}
            />
          </div>

          <Button
            onClick={adicionarServico}
            disabled={!servicoSel}
            className="gap-2 h-[42px] mt-6"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Serviço</TableHead>
            {algumServicoExigeUC && <TableHead>Cadeiras</TableHead>}
            <TableHead className="text-right">Valor Unitário</TableHead>
            <TableHead className="w-32 text-center">Quantidade</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicosItens.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={totalColunas}
                className="text-center py-8 text-muted-foreground"
              >
                Nenhum serviço adicionado
              </TableCell>
            </TableRow>
          ) : (
            servicosItens.map((item) => (
              <TableRow
                key={item.codigo}
                className={
                  item.status === "sucesso"
                    ? "bg-emerald-50/50"
                    : item.status === "erro"
                      ? "bg-red-50/50"
                      : undefined
                }
              >
                <TableCell>
                  <StatusIcon
                    status={item.status}
                    mensagemErro={item.mensagemErro}
                  />
                </TableCell>
                <TableCell className="font-medium">{item.nome}</TableCell>
                {algumServicoExigeUC && (
                  <TableCell>
                    {servicoExigeSelecaoUC(item.sigla) ? (
                      item.cadeirasRecursoIds &&
                      item.cadeirasRecursoIds.length > 0 ? (
                        item.cadeirasRecursoIds.map((c: Cadeira) => (
                          <span
                            key={c.codigoGradeAluno}
                            className="block text-sm font-medium"
                          >
                            {c.disciplina}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Nenhuma selecionada
                        </span>
                      )
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  {fmtKz(item.valor)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    {!servicoExigeSelecaoUC(item.sigla) && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={
                          item.status === "processando" ||
                          item.status === "sucesso"
                        }
                        onClick={() =>
                          alterarQuantidade(item.codigo, item.quantidade - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    )}
                    <span className="w-8 text-center font-medium">
                      {item.quantidade}
                    </span>
                    {!servicoExigeSelecaoUC(item.sigla) && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        disabled={
                          item.status === "processando" ||
                          item.status === "sucesso"
                        }
                        onClick={() =>
                          alterarQuantidade(item.codigo, item.quantidade + 1)
                        }
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {fmtKz(item.valor * item.quantidade)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={
                        item.status === "processando" ||
                        item.status === "sucesso"
                      }
                      onClick={() => removerServico(item.codigo)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    {servicoExigeSelecaoUC(item.sigla) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={
                          item.status === "processando" ||
                          item.status === "sucesso"
                        }
                        onClick={() => handleAbrirModalUC(item)}
                        title="Adicionar Cadeiras"
                      >
                        <BookPlus className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ModalCadeirasRecurso
        open={modalUC}
        servico={servicoSelecionado}
        onOpenChange={handleFecharModalUC}
        anoLetivo={Number(anoLetivo)}
        matricula={codigoMatricula}
        onConfirm={handleConfirmarUC}
      />

      <div className="flex items-center justify-between border-t pt-6">
        <div>
          <span className="text-lg">Total a pagar: </span>
          <span className="text-2xl font-bold text-primary">
            {fmtKz(totalServicos)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {servicosItens.some((item) => item.status === "sucesso") && (
            <Button variant="outline" onClick={limparConcluidos}>
              Limpar concluídos
            </Button>
          )}
          <Button
            className="gap-2"
            size="lg"
            disabled={servicosItens.length === 0 || isPending || isLoading}
            onClick={onGerarFactura}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Receipt className="h-5 w-5" />
            )}
            Gerar Nota de Pagamento
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({
  status,
  mensagemErro,
}: {
  status?: ServicoItem["status"];
  mensagemErro?: string;
}) {
  if (status === "processando") {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }
  if (status === "sucesso") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }
  if (status === "erro") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <XCircle className="h-4 w-4 text-red-600 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              {mensagemErro ?? "Falha ao processar este item."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return <div className="h-4 w-4" />;
}
