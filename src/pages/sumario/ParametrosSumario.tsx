import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pencil,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface Parametro {
  pk_parametro: number;
  designacao: string;
  descricao: string;
  sigla: string;
  args: { valor: number | boolean };
}

const dadosMock: Parametro[] = [
  {
    pk_parametro: 2,
    designacao: "Permitir Validar Sumários Sem Marcação do Sumarista",
    descricao: "",
    sigla: "pvssms",
    args: { valor: true },
  },
  {
    pk_parametro: 1,
    designacao: "Tamanho Mínimo do Sumário",
    descricao: "",
    sigla: "tms",
    args: { valor: 7 },
  },
];

const ParametrosSumario = () => {
  const [parametros, setParametros] = useState<Parametro[]>(dadosMock);
  const [pesquisa, setPesquisa] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [parametroEditando, setParametroEditando] = useState<Parametro | null>(
    null,
  );
  const [editValorNumero, setEditValorNumero] = useState(0);

  // Lógica para atualizar booleanos diretamente na linha
  const handleToggleBoolean = (pk: number, novoValor: boolean) => {
    setParametros((prev) =>
      prev.map((item) =>
        item.pk_parametro === pk
          ? { ...item, args: { valor: novoValor } }
          : item,
      ),
    );
    toast.success(
      `Parâmetro ${novoValor ? "ativado" : "desativado"} com sucesso.`,
    );
  };

  const RenderEstadoVisual = (p: Parametro) => {
    const valor = p.args.valor;
    if (typeof valor === "boolean") {
      return (
        <div className="flex items-center justify-start py-2">
          <Switch
            checked={valor}
            onCheckedChange={(checked) =>
              handleToggleBoolean(p.pk_parametro, checked)
            }
          />
        </div>
      );
    }
    return (
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="w-full h-full transform -rotate-90 text-slate-700">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="opacity-90"
          />
        </svg>
        <span className="absolute text-base font-bold text-slate-800 tracking-tight">
          {valor}
        </span>
      </div>
    );
  };

  const abrirEdicao = (p: Parametro) => {
    setParametroEditando(p);
    setEditValorNumero(p.args.valor as number);
    setEditModalOpen(true);
  };

  const guardarEdicao = () => {
    if (!parametroEditando) return;
    setParametros((prev) =>
      prev.map((p) =>
        p.pk_parametro === parametroEditando.pk_parametro
          ? { ...p, args: { valor: editValorNumero } }
          : p,
      ),
    );
    setEditModalOpen(false);
    toast.success("Valor atualizado com sucesso.");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/sumario">Sumário</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Parâmetros</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b bg-muted/10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="py-3 px-6 font-semibold text-foreground text-xs uppercase text-left">
                  Codigo
                </th>
                <th className="py-3 px-6 font-semibold text-foreground text-xs uppercase text-left">
                  Designação
                </th>
                <th className="py-3 px-6 font-semibold text-foreground text-xs uppercase text-left">
                  Sigla
                </th>
                <th className="py-3 px-6 font-semibold text-foreground text-xs uppercase text-left">
                  Descrição
                </th>
                <th className="py-3 px-6 font-semibold text-foreground text-xs uppercase text-left">
                  Estado
                </th>
                <th className="py-3 px-6 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {parametros.map((p) => (
                <tr
                  key={p.pk_parametro}
                  className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  <td className="py-4 px-6 text-muted-foreground">
                    {p.pk_parametro}
                  </td>
                  <td className="py-4 px-6 text-foreground font-medium">
                    {p.designacao}
                  </td>
                  <td className="py-4 px-6 text-foreground">{p.sigla}</td>
                  <td className="py-4 px-6 text-muted-foreground italic">
                    {p.descricao || "-"}
                  </td>
                  <td className="py-4 px-6">{RenderEstadoVisual(p)}</td>
                  <td className="py-4 px-6 text-right">
                    {/* Botão de edição aparece apenas para valores numéricos */}
                    {typeof p.args.valor === "number" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => abrirEdicao(p)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Valor Numérico</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Parâmetro
              </Label>
              <p className="text-sm font-semibold">
                {parametroEditando?.designacao}
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-muted/20 space-y-6">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Valor Definido</Label>
                <span className="text-3xl font-black text-primary">
                  {editValorNumero}
                </span>
              </div>
              <Slider
                value={[editValorNumero]}
                onValueChange={(v) => setEditValorNumero(v[0])}
                max={100}
                step={1}
                className="py-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarEdicao} className="px-8">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametrosSumario;
