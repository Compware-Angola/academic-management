// components/suporte/ModalDetalhesSolicitacao.tsx
import { Download, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_FILES = 3;

interface UploadFilesAreaProps {
  selectedFiles: File[];
  fileNames: {
    fileName1: string | null;
    fileName2: string | null;
    fileName3: string | null;
  };
  isUploading: boolean;
  onUploadFiles: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
}

function UploadFilesArea({
  selectedFiles,
  fileNames,
  isUploading,
  onUploadFiles,
  onRemoveFile,
}: UploadFilesAreaProps) {
  const uploadedCount = [
    fileNames.fileName1,
    fileNames.fileName2,
    fileNames.fileName3,
  ].filter(Boolean).length;
  const atLimit = selectedFiles.length >= MAX_FILES;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="justify-start"
        disabled={isUploading || atLimit}
        asChild
      >
        <label className="cursor-pointer flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span>
            {isUploading
              ? "Enviando..."
              : atLimit
                ? "Limite de arquivos atingido"
                : "Escolher arquivos"}
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.zip"
            disabled={isUploading || atLimit}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onUploadFiles(e.target.files);
              }
              e.target.value = "";
            }}
          />
        </label>
      </Button>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 bg-muted/50 p-2 rounded border"
            >
              <span className="text-sm truncate max-w-[280px]">
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive shrink-0"
                onClick={() => onRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {uploadedCount}/{MAX_FILES} arquivos
      </p>
    </div>
  );
}

interface RespostaItem {
  resposta_id: number;
  mensagem_resposta: string;
  nome_usuario_resposta: string;
  data_resposta: string;
  file_name1?: string;
  file_name2?: string;
  file_name3?: string;
}

interface RespostasListProps {
  respostas: RespostaItem[];
  onDownload: (fileName: string) => void;
}

function RespostasList({ respostas, onDownload }: RespostasListProps) {
  if (!respostas.length) return null;

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-2">
        Respostas ({respostas.length})
      </p>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/50">
        {respostas.map((resposta) => (
          <div
            key={resposta.resposta_id}
            className="p-3 bg-muted rounded-md border border-border/50"
          >
            <p className="whitespace-pre-wrap text-sm">
              {resposta.mensagem_resposta}
            </p>
            <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground italic">
              <span>Respondido por: {resposta.nome_usuario_resposta}</span>
              {resposta.data_resposta && (
                <span>Em: {resposta.data_resposta}</span>
              )}
            </div>
            {(resposta.file_name1 ||
              resposta.file_name2 ||
              resposta.file_name3) && (
              <div className="mt-3 text-xs">
                <p className="font-medium text-muted-foreground mb-1">
                  Anexos:
                </p>
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map((n) => {
                    const key = `file_name${n}` as keyof typeof resposta;
                    const nome = resposta[key];
                    if (!nome) return null;
                    return (
                      <div
                        key={n}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded border"
                      >
                        <span className="text-blue-600 truncate max-w-[220px]">
                          {nome as string}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownload(nome as string)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ModalDetalhesSolicitacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: number | null;
  isLoadingDetail: boolean;
  solicitacaoDetail: any; // Substitua pelo tipo real
  respostaTexto: string;
  setRespostaTexto: (value: string) => void;
  selectedFiles: File[];
  fileNames: {
    fileName1: string | null;
    fileName2: string | null;
    fileName3: string | null;
  };
  isUploading: boolean;
  onUploadFiles: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
  onEnviarResposta: () => void;
  isPending: boolean;
  onDownload: (fileName: string) => void;
  BadgeStatus: React.ComponentType<{ status: number }>;
}

export function ModalDetalhesSolicitacao({
  open,
  onOpenChange,
  selectedId,
  isLoadingDetail,
  solicitacaoDetail,
  respostaTexto,
  setRespostaTexto,
  selectedFiles,
  fileNames,
  isUploading,
  onUploadFiles,
  onRemoveFile,
  onEnviarResposta,
  isPending,
  onDownload,
  BadgeStatus,
}: ModalDetalhesSolicitacaoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl! max-h-[90vh]! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitação #{selectedId}</DialogTitle>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className="py-10 text-center">Carregando detalhes...</div>
        ) : solicitacaoDetail ? (
          <div className="space-y-6 py-4">
            {/* Informações principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Estudante</p>
                <p className="font-medium">{solicitacaoDetail.estudante}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Utilizador</p>
                <p className="font-medium">{solicitacaoDetail.utilizador}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium">
                  {solicitacaoDetail.descricao_tipo_suporte}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <BadgeStatus status={solicitacaoDetail.status_mensagem} />
              </div>
              <div>
                <p className="text-muted-foreground">Data Mensagem</p>
                <p className="font-medium">{solicitacaoDetail.data_mensagem}</p>
              </div>
              {solicitacaoDetail.data_resposta && (
                <div>
                  <p className="text-muted-foreground">Data Resposta</p>
                  <p className="font-medium">
                    {solicitacaoDetail.data_resposta}
                  </p>
                </div>
              )}
            </div>

            {/* Assunto e mensagem */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Assunto
              </p>
              <p className="mt-1 font-medium">{solicitacaoDetail.assunto}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Descrição
              </p>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p className="whitespace-pre-wrap text-sm">
                  {solicitacaoDetail.mensagem}
                </p>
              </div>
            </div>

            {/* Histórico de respostas */}
            {solicitacaoDetail.respostas &&
            solicitacaoDetail.respostas.length > 0 ? (
              <RespostasList
                respostas={solicitacaoDetail.respostas}
                onDownload={onDownload}
              />
            ) : (
              solicitacaoDetail.mensagem_resposta && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resposta
                  </p>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="whitespace-pre-wrap text-sm">
                      {solicitacaoDetail.mensagem_resposta}
                    </p>
                    {solicitacaoDetail.nome_usuario_resposta && (
                      <p className="mt-2 text-xs text-muted-foreground italic">
                        Respondido por:{" "}
                        {solicitacaoDetail.nome_usuario_resposta}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}

            {/* Área para nova resposta */}
            <div className="pt-6 border-t">
              <label className="block text-sm font-medium mb-2">
                Sua Resposta
              </label>
              {solicitacaoDetail?.status_mensagem === "respondido" ? (
                <div className="space-y-3">
                  <Textarea
                    value={respostaTexto}
                    onChange={(e) => setRespostaTexto(e.target.value)}
                    placeholder="Esta solicitação já foi respondida."
                    rows={5}
                    className="resize-none bg-muted/50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground italic">
                    Esta solicitação já está marcada como respondida. Não é
                    possível adicionar novas respostas.
                  </p>
                </div>
              ) : (
                <>
                  <Textarea
                    value={respostaTexto}
                    onChange={(e) => setRespostaTexto(e.target.value)}
                    placeholder="Digite a resposta para o estudante..."
                    rows={5}
                    className="resize-none mb-4"
                  />

                  <div className="space-y-3 mb-6">
                    <label className="block text-sm font-medium text-muted-foreground">
                      Anexos (máx. {MAX_FILES} arquivos)
                    </label>
                    <UploadFilesArea
                      selectedFiles={selectedFiles}
                      fileNames={fileNames}
                      isUploading={isUploading}
                      onUploadFiles={onUploadFiles}
                      onRemoveFile={onRemoveFile}
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={onEnviarResposta}
                      disabled={
                        isPending ||
                        (!respostaTexto.trim() &&
                          !fileNames.fileName1 &&
                          !fileNames.fileName2 &&
                          !fileNames.fileName3)
                      }
                    >
                      {isPending ? "Enviando..." : "Enviar Resposta"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            Não foi possível carregar os detalhes da solicitação.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
