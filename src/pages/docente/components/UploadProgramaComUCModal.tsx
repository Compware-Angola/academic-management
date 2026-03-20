import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Loader2, Paperclip, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { useToast } from "@/components/ui/use-toast";
import { useMutationCreateProgramaUC } from "@/hooks/docentes/use-mutation-create-docente-programa";
import { parseFilter } from "@/util/parse-filter";

interface PayloadProps {
  anoLectivo: string;
  semestre: string;
  curso: string;
  unidadeCurricular: string;
}
interface ListaPagamentoModalProps {
  docenteId: number;
  payload: PayloadProps;
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}
export const UploadProgramaComUCModal = ({
  isModalOpen,
  payload,
  docenteId,
  setIsModalOpen,
}: ListaPagamentoModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadSingle();
  const createProgramaUC = useMutationCreateProgramaUC();

  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };
  const handleSubmit = async () => {
    const uploadResponse = await uploadMutation.mutateAsync(file!);
    const fileName = uploadResponse?.file?.filename;

    if (!fileName) {
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível fazer upload do ficheiro.",
        variant: "destructive",
      });
      return;
    }
    const programaPayload = {
      anoLectivo: parseFilter(payload.anoLectivo),
      semestre: parseFilter(payload.semestre),
      codigoCurso: parseFilter(payload.curso),
      docenteCode: docenteId,
      ficheiroName: fileName,
      gradeCurricularCode: parseFilter(payload.unidadeCurricular),
    };
    await createProgramaUC.mutateAsync(programaPayload, {
      onSuccess: (uploadResponse) => {
        toast({
          title: "Programa UC",
          description: "Programa UC criado com sucesso.",
          variant: "default",
        });
        setFile(null);
        setIsModalOpen();
      },
      onError(error) {
        toast({
          title: "Programa UC",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };
  const isLoadingSubmit =
    createProgramaUC.isPending || uploadMutation.isPending;
  return (
    <>
      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[350px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Upload de Programa UC
            </DialogTitle>
          </DialogHeader>
          {!file && (
            <>
              <label className="cursor-pointer" htmlFor="upload">
                <div className="p-2">
                  <div className="flex flex-col justify-center items-center w-full h-80 bg-[#f4f4f4] rounded-md">
                    <FileText className="h-11 w-11" />
                    <p className="text-center mt-2">
                      Clique nesta área para realizar o upload do documento.
                    </p>
                  </div>
                </div>
              </label>
              <input
                id="upload"
                onChange={handleFileChange}
                type="file"
                className="hidden"
              />
            </>
          )}
          {file && (
            <div className="p-2">
              <div className="flex items-center justify-between bg-[#f4f4f4] rounded-md p-5">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isLoadingSubmit}
                  onClick={handleRemoveFile}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              disabled={!file}
              size="sm"
              className="w-fit bg-secondary"
              onClick={() => handleSubmit()}
            >
              {isLoadingSubmit ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Adicionar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
