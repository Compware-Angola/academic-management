import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCheck, GraduationCap } from "lucide-react";
import { useMutationDiplomarAluno } from "@/hooks/students/use-mutation-diplomar-aluno";
import { useMutationDesdiplomarAluno } from "@/hooks/students/use-mutation-desdiplomar-aluno";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useUploadSingle,
  useGetFileUrl,
} from "@/hooks/upload/use-upload-single";
import { FileFolder } from "@/enums/file-folder";
import { ResponseUpload } from "@/services/upload/upload-single.service";

type DiplomarProps = {
  value: string;
  codigoMatricula: number;
};

export function Diplomar({ value, codigoMatricula }: DiplomarProps) {
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [actaFile, setActaFile] = useState<File | null>(null);
  const [dataActa, setDataActa] = useState<string>("");

  const { mutate: diplomarAluno, isPending } = useMutationDiplomarAluno();
  const { mutateAsync: desdiplomarAluno, isPending: isDesdiplomando } =
    useMutationDesdiplomarAluno();

  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadSingle();
  const { mutateAsync: getFileUrl, isPending: isLoadingDocumento } =
    useGetFileUrl();

  const { data: student, isFetching } = useStudentDetail(codigoMatricula);
  const isDiplomado = student?.estado?.toLowerCase() === "diplomado";

  // `student.acta_filename` aqui deve guardar o `key` do S3, não o nome
  // original do ficheiro — é o que a rota /view precisa para gerar a URL assinada.
  const handleVerDocumento = async () => {
    const key = student?.acta_filename;

    if (!key) {
      toast.error("Nenhum documento de acta encontrado para este estudante.");
      return;
    }

    try {
      const { url } = await getFileUrl({ key, expiry: 3600 });
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
      toast.error("Erro ao carregar o documento da acta.");
    }
  };

  async function handleDiplomar() {
    if (!dataActa) {
      toast.error("Informe a data da acta.");
      return;
    }
    // if (!actaFile) {
    //   toast.error("Selecione o ficheiro da acta.");
    //   return;
    // }
    try {
      let uploaded: ResponseUpload;
      if (!!actaFile) {
        uploaded = await uploadFile({
          file: actaFile,
          options: { folder: FileFolder.ACTAS_DIPLOMA },
        });
      }
      diplomarAluno({
        codigoMatricula,
        imprimeCartaConclusao: false,
        dataActa,
        fileName: uploaded?.key ?? null, // guardamos o key, não o filename
      });
    } catch (err: any) {
      const message = err?.message ?? "Erro ao enviar ficheiro da acta.";
      toast.error(message);
    }
  }

  async function handleDesdiplomar() {
    await desdiplomarAluno({
      codigoMatricula,
      motivo: motivo.trim(),
    });

    setMotivo("");
    setConfirmacaoAberta(false);
  }

  return (
    <TabsContent value={value} className="mt-0">
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertCircle className="h-5 w-5 mt-0.5 text-amber-500" />
          <div className="space-y-1">
            <p className="font-medium">
              {isDiplomado
                ? "Atenção antes de anular diploma"
                : "Atenção antes de diplomar"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isDiplomado ? (
                <>
                  Esta ação irá anular a diplomação do estudante, remover o
                  registo de conclusão do curso e voltar o estado da matrícula
                  para <span className="font-medium">activo</span>.
                </>
              ) : (
                <>
                  Esta ação irá alterar o estado da matrícula para{" "}
                  <span className="font-medium">diplomado</span>, registar a
                  conclusão do curso e criar o log da operação.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="w-full flex justify-between items-end">
          {!isDiplomado ? (
            <div className="flex gap-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dataActa">Data da Acta</Label>
                <Input
                  id="dataActa"
                  type="date"
                  value={dataActa}
                  onChange={(e) => setDataActa(e.target.value)}
                  className="w-48"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="actaFile">Ficheiro da Acta</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="actaFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setActaFile(e.target.files?.[0] ?? null)}
                    className="max-w-xs"
                  />
                  {!!actaFile && (
                    <span className="flex items-center gap-1 text-sm text-green-600 whitespace-nowrap">
                      <CheckCheck className="h-4 w-4" />
                      Selecionado
                    </span>
                  )}
                </div>
                {!!actaFile && (
                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                    {actaFile.name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <Button
                variant="outline"
                onClick={handleVerDocumento}
                disabled={isLoadingDocumento}
              >
                {isLoadingDocumento ? "Carregando..." : "Visualizar Acta"}
              </Button>
            </div>
          )}

          <div>
            {isDiplomado ? (
              <Button
                variant="destructive"
                onClick={() => setConfirmacaoAberta(true)}
                disabled={isFetching || isDesdiplomando}
              >
                {isDesdiplomando ? "Anulando..." : "Anular Diploma"}
              </Button>
            ) : (
              <Button
                onClick={handleDiplomar}
                disabled={isPending || isUploading || isFetching || !dataActa}
              >
                {isUploading
                  ? "Enviando ficheiro..."
                  : isPending
                    ? "Diplomando..."
                    : "Diplomar Estudante"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={confirmacaoAberta} onOpenChange={setConfirmacaoAberta}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anular diploma do estudante</DialogTitle>
            <DialogDescription>
              Esta operação irá remover o registo de conclusão do curso e voltar
              o estado da matrícula para activo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="motivoDesdiplomar">Motivo da anulação</Label>
            <Textarea
              id="motivoDesdiplomar"
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              placeholder="Descreva o motivo da anulação"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              O motivo será registado no log da operação.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmacaoAberta(false)}
              disabled={isDesdiplomando}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDesdiplomar}
              disabled={isDesdiplomando || !motivo.trim()}
            >
              {isDesdiplomando ? "Anulando..." : "Confirmar anulação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
