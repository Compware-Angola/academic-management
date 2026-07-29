import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Layers,
  ListChecks,
  MapPin,
  RefreshCw,
  Search as SearchIcon,
  Wallet,
} from "lucide-react";
import { ServicoCard } from "./ServicoCard";
import { ServicoUI, TipoServicoFiltro } from "../types/types";
import { DataResponse } from "@/services/shared/fecth-polo.service";
const fmt = (v: number) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(v);

interface ServicosStepProps {
  servicos: ServicoUI[];
  selecionados: Set<number>;
  busca: string;
  onBusca: (v: string) => void;
  filtroTipo: TipoServicoFiltro;
  onFiltroTipo: (v: TipoServicoFiltro) => void;
  carregando: boolean;
  importando: boolean;
  onToggle: (codigo: number) => void;
  onPreco: (codigo: number, v: number) => void;
  onDisponibilizar: (codigo: number, v: boolean) => void;
  onSelecionarTodos: (codigos: number[]) => void;
  onLimparSelecao: () => void;
  onImportar: () => void;
  onCancelar: () => void;

  polos: DataResponse[]; // novo
  filtroPolo: number | "TODOS"; // novo
  onFiltroPolo: (v: number | "TODOS") => void; // novo
}

export function ServicosStep({
  servicos,
  selecionados,
  busca,
  onBusca,
  filtroTipo,
  onFiltroTipo,
  carregando,
  importando,
  onToggle,
  onPreco,
  onDisponibilizar,
  onSelecionarTodos,
  onLimparSelecao,
  onImportar,
  onCancelar,
  filtroPolo,
  onFiltroPolo,
  polos,
}: ServicosStepProps) {
  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return servicos.filter((s) => {
      if (
        q &&
        !`${s.codigo} ${s.descricao} ${s.sigla}`.toLowerCase().includes(q)
      )
        return false;
      if (filtroTipo !== "TODOS" && s.grupo !== filtroTipo) return false;
      if (filtroPolo !== "TODOS" && s.poloId !== filtroPolo) return false;
      return true;
    });
  }, [servicos, busca, filtroTipo, filtroPolo]);

  const mensalidades = filtrados.filter((s) => s.grupo === "MENSALIDADE");
  const outros = filtrados.filter((s) => s.grupo === "OUTRO");

  const itensSelecionados = servicos.filter((s) => selecionados.has(s.codigo));
  const totalValor = itensSelecionados.reduce((a, s) => a + s.preco, 0);

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl sticky top-2 z-20 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => onBusca(e.target.value)}
              placeholder="Pesquisar por código, descrição ou sigla..."
              className="pl-9 h-11 rounded-xl"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ["TODOS", "Todos"],
                ["MENSALIDADE", "Mensalidades"],
                ["OUTRO", "Outros Serviços"],
              ] as const
            ).map(([v, l]) => (
              <Button
                key={v}
                size="sm"
                variant={filtroTipo === v ? "default" : "outline"}
                className="rounded-full"
                onClick={() => onFiltroTipo(v)}
              >
                {l}
              </Button>
            ))}
            <div className="ml-auto flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  onSelecionarTodos(filtrados.map((s) => s.codigo))
                }
                className="gap-1.5"
              >
                <ListChecks className="h-4 w-4" /> Seleccionar todos
              </Button>
              <Button size="sm" variant="ghost" onClick={onLimparSelecao}>
                Limpar
              </Button>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <Button
                size="sm"
                variant={filtroPolo === "TODOS" ? "default" : "outline"}
                className="rounded-full shrink-0"
                onClick={() => onFiltroPolo("TODOS")}
              >
                Todos os polos
              </Button>
              {polos.map((polo) => (
                <Button
                  key={polo.id}
                  size="sm"
                  variant={filtroPolo === polo.id ? "secondary" : "outline"}
                  className="rounded-full shrink-0"
                  onClick={() => onFiltroPolo(polo.id)}
                >
                  {polo.designacao}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>
              <b className="text-foreground">{filtrados.length}</b> encontrados
            </span>
            <span>
              <b className="text-foreground">{selecionados.size}</b>{" "}
              seleccionados
            </span>
            <span>
              <b className="text-foreground">{mensalidades.length}</b>{" "}
              mensalidades
            </span>
            <span>
              <b className="text-foreground">{outros.length}</b> outros serviços
            </span>
          </div>
        </CardContent>
      </Card>

      {carregando ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-xl">
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-9 w-44" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={["mens", "outros"]}
          className="space-y-4"
        >
          <AccordionItem
            value="mens"
            className="rounded-2xl border bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="font-semibold">Mensalidades</span>
                <Badge variant="secondary">{mensalidades.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                {mensalidades.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Nenhuma mensalidade encontrada
                  </p>
                ) : (
                  mensalidades.map((s) => (
                    <ServicoCard
                      key={s.codigo}
                      servico={s}
                      selecionado={selecionados.has(s.codigo)}
                      onToggle={() => onToggle(s.codigo)}
                      onPreco={(v) => onPreco(s.codigo, v)}
                      onDisponibilizar={(v) => onDisponibilizar(s.codigo, v)}
                    />
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="outros"
            className="rounded-2xl border bg-card px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="font-semibold">Outros Serviços</span>
                <Badge variant="secondary">{outros.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pb-2">
                {outros.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Nenhum serviço encontrado
                  </p>
                ) : (
                  outros.map((s) => (
                    <ServicoCard
                      key={s.codigo}
                      servico={s}
                      selecionado={selecionados.has(s.codigo)}
                      onToggle={() => onToggle(s.codigo)}
                      onPreco={(v) => onPreco(s.codigo, v)}
                      onDisponibilizar={(v) => onDisponibilizar(s.codigo, v)}
                    />
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="text-muted-foreground">
              Encontrados: <b className="text-foreground">{filtrados.length}</b>
            </span>
            <span className="text-muted-foreground">
              Seleccionados:{" "}
              <b className="text-foreground">{selecionados.size}</b>
            </span>
            <span className="text-muted-foreground">
              Valor total: <b className="text-primary">{fmt(totalValor)}</b>
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button
              onClick={onImportar}
              disabled={importando || carregando}
              className="gap-2"
            >
              {importando ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {importando ? "A importar..." : "Importar Serviços"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
