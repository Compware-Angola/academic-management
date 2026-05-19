import { Calendar, Hash, Loader2, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ProvaDetalhe } from "@/services/access_exam/provas.service";
import { formatarData, formatDateTimePt } from "@/util/date-formate";
import { HtmlContent, QuestionContent } from "@/util/prova-text-format";

type ProvaDetailsDialogProps = {
  open: boolean;
  provaDetalhe?: ProvaDetalhe;
  isLoading: boolean;
  onClose: () => void;
};

export function ProvaDetailsDialog({
  open,
  provaDetalhe,
  isLoading,
  onClose,
}: ProvaDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da prova</DialogTitle>
          <DialogDescription>
            Informações completas da prova selecionada.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              A carregar detalhes...
            </p>
          </div>
        ) : provaDetalhe ? (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <Card>
                <CardContent className="pt-4">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-3.5 w-3.5" />
                    ID
                  </p>
                  <p className="mt-1 font-semibold">{provaDetalhe.id}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Ano Letivo
                  </p>
                  <p className="mt-1 font-semibold">
                    {provaDetalhe.ano_letivo}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Autor
                  </p>
                  <p className="mt-1 font-semibold">{provaDetalhe.usuario}</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Label>Descrição</Label>
              <div className="mt-1 rounded-md border bg-muted/30 p-3">
                <HtmlContent value={provaDetalhe.descricao} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Duração</Label>
                <p className="mt-1 text-sm">{provaDetalhe.duracao} min</p>
              </div>
              <div>
                <Label>Criada em</Label>
                <p className="mt-1 text-sm">
                  {formatDateTimePt(provaDetalhe.created_at)}
                </p>
              </div>
              <div>
                <Label>Data de realização</Label>
                <p className="mt-1 text-sm">
                  {provaDetalhe.data_realizacao
                    ? formatarData(provaDetalhe.data_realizacao)
                    : "Sem data"}
                </p>
              </div>
            </div>

            {provaDetalhe.texto && (
              <div>
                <Label>Texto/Instruções</Label>
                <div className="mt-1 rounded-md border bg-muted/30 p-3">
                  <HtmlContent value={provaDetalhe.texto} />
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-4">
                  <h4 className="mb-3 font-semibold">Cursos</h4>
                  {provaDetalhe.cursos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum curso associado.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {provaDetalhe.cursos.map((curso) => (
                        <Badge key={curso.codigo} variant="outline">
                          {curso.designacao}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h4 className="mb-3 font-semibold">Disciplinas</h4>
                  {provaDetalhe.disciplinas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma disciplina associada.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {provaDetalhe.disciplinas.map((disciplina) => (
                        <Badge key={disciplina.id} variant="outline">
                          {disciplina.designacao}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-4">
                <h4 className="mb-3 font-semibold">Perguntas</h4>
                {provaDetalhe.perguntas.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma pergunta associada.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {provaDetalhe.perguntas.map((pergunta, index) => (
                      <div
                        key={pergunta.id}
                        className="rounded-md border bg-background p-4"
                      >
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">
                            Pergunta {index + 1}
                          </Badge>
                          <Badge variant="outline">
                            {pergunta.tipo_pergunta}
                          </Badge>
                          <Badge variant="outline">{pergunta.disciplina}</Badge>
                          <Badge variant="outline">
                            {pergunta.respostas.length} respostas
                          </Badge>
                        </div>
                        <div className="rounded-md border bg-muted/20 p-4">
                          <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                            Enunciado
                          </p>
                          <div className="min-w-0">
                            <QuestionContent value={pergunta.pergunta_texto} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
