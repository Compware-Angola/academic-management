import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {

  Loader2,
  Paperclip,

  UserPlus,
  History,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryAssessmentParametersNote } from "@/hooks/avaliacao/use-query-parameters-note-service";
import { Switch } from "@/components/ui/switch";
import { useMutationUpdateAssessmentParametersNote } from "@/hooks/avaliacao/use-mutation-update-assessment-parameters-note";
import { AssessmentParameterNote } from "@/services/avaliacao/fetch-assessment-parameter-note.service";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// ---- MOCK: substituir depois por dados vindos da API ----
interface MockUtilizador {
  codigo: number;
  nome: string;
  email: string;
}

interface MockAnoLectivoPassado {
  codigo: number;
  designacao: string;
}

interface AutorizacaoLancamento {
  codigo: number;
  utilizador: MockUtilizador;
  anoLectivo: MockAnoLectivoPassado;
  dataAutorizacao: string;
}

const MOCK_UTILIZADORES: MockUtilizador[] = [
  { codigo: 1, nome: "Maria Fernandes", email: "maria.fernandes@escola.ao" },
  { codigo: 2, nome: "João Manuel", email: "joao.manuel@escola.ao" },
  { codigo: 3, nome: "Ana Paula Neto", email: "ana.neto@escola.ao" },
];

const MOCK_ANOS_LECTIVOS_PASSADOS: MockAnoLectivoPassado[] = [
  { codigo: 1, designacao: "2023/2024" },
  { codigo: 2, designacao: "2022/2023" },
  { codigo: 3, designacao: "2021/2022" },
];

const MOCK_AUTORIZACOES_INICIAIS: AutorizacaoLancamento[] = [
  {
    codigo: 1,
    utilizador: MOCK_UTILIZADORES[0],
    anoLectivo: MOCK_ANOS_LECTIVOS_PASSADOS[0],
    dataAutorizacao: "12/03/2025",
  },
];
// ---- FIM MOCK ----

const LaunchNotesParameter = () => {
  const { data, isLoading: isLoadingParameterNode } =
    useQueryAssessmentParametersNote({
      search:
        "Permitir a confirmação do codigo por email antes do lançamento de notas",
    });

  const { mutate: updateParametersNote, isPending } =
    useMutationUpdateAssessmentParametersNote();

  const parameters = data || [];

  const handleUpdateParameterNote = (parameter: AssessmentParameterNote) => {
    let updateState = 0;
    if (parameter.activo == 0) {
      updateState = 1;
    } else {
      updateState = 0;
    }
    updateParametersNote({
      parametroId: parameter.codigo,
      payload: {
        descricao: parameter.descricao,
        activo: updateState,
      },
    });
  };

  // ---- Estado mocado da autorização de lançamento em anos passados ----
  const [autorizacoes, setAutorizacoes] = useState<AutorizacaoLancamento[]>(
    MOCK_AUTORIZACOES_INICIAIS
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [utilizadorSelecionado, setUtilizadorSelecionado] = useState<string>("");
  const [anoLectivoSelecionado, setAnoLectivoSelecionado] = useState<string>("");

  const handleAdicionarAutorizacao = () => {
    if (!utilizadorSelecionado || !anoLectivoSelecionado) return;

    const utilizador = MOCK_UTILIZADORES.find(
      (u) => String(u.codigo) === utilizadorSelecionado
    );
    const anoLectivo = MOCK_ANOS_LECTIVOS_PASSADOS.find(
      (a) => String(a.codigo) === anoLectivoSelecionado
    );
    if (!utilizador || !anoLectivo) return;

    // TODO: substituir por chamada real (useMutation) quando o endpoint existir
    const novaAutorizacao: AutorizacaoLancamento = {
      codigo: Date.now(),
      utilizador,
      anoLectivo,
      dataAutorizacao: new Date().toLocaleDateString("pt-PT"),
    };

    setAutorizacoes((prev) => [...prev, novaAutorizacao]);
    setUtilizadorSelecionado("");
    setAnoLectivoSelecionado("");
    setDialogOpen(false);
  };

  const handleRemoverAutorizacao = (codigo: number) => {
    // TODO: substituir por chamada real (useMutation) quando o endpoint existir
    setAutorizacoes((prev) => prev.filter((a) => a.codigo !== codigo));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Lançamento de Notas
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingParameterNode ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : parameters.length == 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma dado encontrada.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codigo</TableHead>
                    <TableHead>Designação</TableHead>
                    <TableHead className="text-center">Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parameters.map((parameter) => (
                    <TableRow key={parameter.codigo}>
                      <TableCell>{parameter.codigo}</TableCell>
                      <TableCell>{parameter.descricao}</TableCell>
                      <TableCell>
                        <Switch
                          disabled={isPending}
                          checked={parameter.activo === 1}
                          onCheckedChange={() =>
                            handleUpdateParameterNote(parameter)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Autorização de lançamento de notas em anos lectivos não activos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Lançamento em Anos Lectivos Anteriores
            </CardTitle>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Adicionar Utilizador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Autorizar Lançamento em Ano Anterior</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Utilizador</label>
                    <Select
                      value={utilizadorSelecionado}
                      onValueChange={setUtilizadorSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o utilizador..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_UTILIZADORES.map((u) => (
                          <SelectItem key={u.codigo} value={String(u.codigo)}>
                            {u.nome} — {u.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Ano Lectivo (não activo)
                    </label>
                    <Select
                      value={anoLectivoSelecionado}
                      onValueChange={setAnoLectivoSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano lectivo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ANOS_LECTIVOS_PASSADOS.map((a) => (
                          <SelectItem key={a.codigo} value={String(a.codigo)}>
                            {a.designacao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAdicionarAutorizacao}
                    disabled={!utilizadorSelecionado || !anoLectivoSelecionado}
                    className="gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Autorizar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {[].length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Em Desenvolvimento...
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilizador</TableHead>
                    <TableHead>Ano Lectivo</TableHead>
                    <TableHead>Autorizado em</TableHead>
                    <TableHead className="text-center">Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autorizacoes.map((autorizacao) => (
                    <TableRow key={autorizacao.codigo}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {autorizacao.utilizador.nome}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {autorizacao.utilizador.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {autorizacao.anoLectivo.designacao}
                        </Badge>
                      </TableCell>
                      <TableCell>{autorizacao.dataAutorizacao}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoverAutorizacao(autorizacao.codigo)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { LaunchNotesParameter };