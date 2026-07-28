import { useEffect, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
// ajusta os caminhos conforme onde ficaram os teus hooks
import { useQueryListServicesByYear } from "@/hooks/financas/use-query-list-services-by-year";
import { useCreateServicesMass } from "@/hooks/financas/use-create-services-mass";
import { CreateServicesMassResponse } from "@/services/financas/create-services-mass";
import { ResultadoStep } from "./components/ResultadoStep";
import { ServicosStep } from "./components/ServicosStep";
import { ParametrosForm } from "./components/ParametrosForm";
import { mapServicoParaUI, mapServicoParaPayload } from "./helpers/utils";
import { ServicoUI, TipoServicoFiltro } from "./types/types";
import { usePoloDropdown } from "@/hooks/shared/use-query-fetch-polo";

const STEPS = ["Selecção", "Serviços", "Resultado"];

export default function ImportarServicos() {
  const [tipoCandidatura, setTipoCandidatura] = useState(1);
  const [origemAno, setOrigemAno] = useState("");
  const [destinoAno, setDestinoAno] = useState("");

  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [servicos, setServicos] = useState<ServicoUI[]>([]);
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoServicoFiltro>("TODOS");
  const [resultado, setResultado] = useState<CreateServicesMassResponse | null>(
    null,
  );
  const [filtroPolo, setFiltroPolo] = useState<number | "TODOS">("TODOS");
  const habilitarConsulta = etapa === 2 && !!origemAno;

  const mensalidadesQuery = useQueryListServicesByYear(
    { codigoAnoLectivo: Number(origemAno), tipo: "MENSALIDADE" },
    habilitarConsulta,
  );
  const outrosQuery = useQueryListServicesByYear(
    { codigoAnoLectivo: Number(origemAno), tipo: "OUTROS" },
    habilitarConsulta,
  );

  const carregando = mensalidadesQuery.isLoading || outrosQuery.isLoading;
  const poloQuery = usePoloDropdown();

  const { mutateAsync: importarServicos, isPending: importando } =
    useCreateServicesMass();

  useEffect(() => {
    if (!mensalidadesQuery.data || !outrosQuery.data) return;
    const merged = [
      ...mensalidadesQuery.data.map((s) => mapServicoParaUI(s, "MENSALIDADE")),
      ...outrosQuery.data.map((s) => mapServicoParaUI(s, "OUTRO")),
    ];
    setServicos(merged);
    setSel(
      new Set(merged.filter((s) => s.estado === "ACTIVO").map((s) => s.codigo)),
    );
  }, [mensalidadesQuery.data, outrosQuery.data]);

  const carregar = () => {
    if (!origemAno || !destinoAno) {
      toast({
        title: "Selecção incompleta",
        description: "Escolha o ano de início e o ano de destino.",
        variant: "destructive",
      });
      return;
    }
    if (origemAno === destinoAno) {
      toast({
        title: "Anos lectivos iguais",
        description: "Início e destino devem ser diferentes.",
        variant: "destructive",
      });
      return;
    }
    setEtapa(2);
  };

  const toggle = (codigo: number) =>
    setSel((p) => {
      const n = new Set(p);
      n.has(codigo) ? n.delete(codigo) : n.add(codigo);
      return n;
    });

  const patchPreco = (codigo: number, preco: number) =>
    setServicos((p) =>
      p.map((s) => (s.codigo === codigo ? { ...s, preco } : s)),
    );

  const patchDisponibilizar = (codigo: number, disponibilizarAluno: boolean) =>
    setServicos((p) =>
      p.map((s) => (s.codigo === codigo ? { ...s, disponibilizarAluno } : s)),
    );

  const selecionarTodos = (codigos: number[]) => setSel(new Set(codigos));
  const limparSelecao = () => setSel(new Set());

  const importar = async () => {
    const itensSelecionados = servicos.filter((s) => sel.has(s.codigo));
    if (itensSelecionados.length === 0) {
      toast({ title: "Nenhum serviço seleccionado", variant: "destructive" });
      return;
    }
    try {
      const resposta = await importarServicos({
        services: itensSelecionados.map((s) =>
          mapServicoParaPayload(s, Number(destinoAno)),
        ),
      });
      setResultado(resposta);
      setEtapa(3);
    } catch {
      toast({
        title: "Erro ao importar",
        description: "Não foi possível concluir a importação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const reiniciar = () => {
    setEtapa(1);
    setServicos([]);
    setSel(new Set());
    setResultado(null);
    setBusca("");
    setFiltroTipo("TODOS");
    setFiltroPolo("TODOS");
    setOrigemAno("");
    setDestinoAno("");
  };

  return (
    <div className="p-6 space-y-4 pb-28">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Importação de Serviços
          </h1>
          <p className="text-muted-foreground mt-1">
            Copie serviços e emolumentos de um ano lectivo de início para um ano
            lectivo de destino.
          </p>
        </div>
        {etapa !== 1 && (
          <Button variant="outline" onClick={reiniciar} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Nova importação
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {STEPS.map((s, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const done = etapa > n;
          const active = etapa === n;
          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : done
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "text-muted-foreground"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-semibold">
                  {done ? "✓" : n}
                </span>
                {s}
              </div>
              {i < STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
              )}
            </div>
          );
        })}
      </div>

      {etapa === 1 && (
        <ParametrosForm
          tipoCandidatura={tipoCandidatura}
          onChangeTipoCandidatura={setTipoCandidatura}
          origemAno={origemAno}
          onChangeOrigemAno={setOrigemAno}
          destinoAno={destinoAno}
          onChangeDestinoAno={setDestinoAno}
          onCarregar={carregar}
        />
      )}

      {etapa === 2 && (
        <ServicosStep
          servicos={servicos}
          selecionados={sel}
          busca={busca}
          onBusca={setBusca}
          filtroTipo={filtroTipo}
          onFiltroTipo={setFiltroTipo}
          carregando={carregando}
          importando={importando}
          onToggle={toggle}
          onPreco={patchPreco}
          onDisponibilizar={patchDisponibilizar}
          onSelecionarTodos={selecionarTodos}
          onLimparSelecao={limparSelecao}
          onImportar={importar}
          onCancelar={reiniciar}
          polos={poloQuery.data ?? []}
          filtroPolo={filtroPolo}
          onFiltroPolo={setFiltroPolo}
        />
      )}

      {etapa === 3 && resultado && (
        <ResultadoStep
          resultado={resultado}
          origemLabel={origemAno}
          destinoLabel={destinoAno}
          onNovaImportacao={reiniciar}
        />
      )}
    </div>
  );
}
