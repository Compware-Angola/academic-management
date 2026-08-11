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
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { DocenteCursoSelect } from "@/components/common/global-selects/DocenteCursoSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { DocenteCadeiraSelect } from "@/components/common/global-selects/DocenteCadeiraSelect";

function truncateFileName(fileName: string, maxLength: number): string {
  if (fileName.length <= maxLength) {
    return fileName;
  }
  return fileName.substring(0, maxLength - 10) + "...";
}
interface UploadProgramaComUCModalProps {
  docenteId?: number;
  isDocente: boolean;
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  onSuccess?: () => void;
}

export const UploadProgramaComUCModal = ({
  docenteId,
  isDocente,
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: UploadProgramaComUCModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
  });

  const uploadMutation = useUploadSingle();
  const createProgramaUC = useMutationCreateProgramaUC();
  const { toast } = useToast();

  const isLoadingSubmit =
    createProgramaUC.isPending || uploadMutation.isPending;

  const canSubmit =
    !!file &&
    !!parseFilter(filters.anoLectivo) &&
    !!parseFilter(filters.semestre) &&
    !!parseFilter(filters.curso) &&
    !!parseFilter(filters.anoCurricular) &&
    !!parseFilter(filters.unidadeCurricular);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (["curso", "semestre", "anoCurricular"].includes(key)) {
        newFilters.unidadeCurricular = "";
      }
      return newFilters;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleClose = () => {
    setFile(null);
    setFilters({
      anoLectivo: "",
      semestre: "",
      curso: "",
      anoCurricular: "",
      unidadeCurricular: "",
    });
    setIsModalOpen();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      const uploadResponse = await uploadMutation.mutateAsync({
        file,
        options: { folder: "programas-uc" },
      });
      const fileName = uploadResponse?.key;

      if (!fileName) {
        toast({
          title: "Erro ao fazer upload",
          description: "Não foi possível fazer upload do ficheiro.",
          variant: "destructive",
        });
        return;
      }

      const programaPayload = {
        anoLectivo: parseFilter(filters.anoLectivo),
        semestre: parseFilter(filters.semestre),
        codigoCurso: parseFilter(filters.curso),
        docenteCode: docenteId,
        ficheiroName: fileName,
        gradeCurricularCode: parseFilter(filters.unidadeCurricular),
      };

      await createProgramaUC.mutateAsync(programaPayload, {
        onSuccess: () => {
          toast({
            title: "Programa UC",
            description: "Programa UC criado com sucesso.",
            variant: "default",
          });
          handleClose();
          onSuccess?.();
        },
        onError: (error: any) => {
          toast({
            title: "Programa UC",
            description: error?.message || "Erro ao criar programa UC.",
            variant: "destructive",
          });
        },
      });
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err?.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Upload de Programa UC
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtros */}
          <div className="grid gap-3 grid-cols-2">
            <AcademicYearSelect
              disabled={!isDocente}
              value={filters.anoLectivo}
              onChangeValue={(v) => updateFilter("anoLectivo", v)}
            />
            <SemestreSelect
              disabled={!isDocente}
              value={filters.semestre}
              onChangeValue={(v) => updateFilter("semestre", v)}
            />
            <DocenteCursoSelect
              props={{
                anoLectivo: parseFilter(filters.anoLectivo),
                docenteId,
              }}
              value={filters.curso}
              onChangeValue={(v) => updateFilter("curso", v)}
            />
            <AnoCurricularSelect
              disabled={!isDocente}
              value={filters.anoCurricular}
              onChangeValue={(v) => updateFilter("anoCurricular", v)}
              curso={filters.curso}
            />
            <div className="col-span-2">
              <DocenteCadeiraSelect
                disabled={!isDocente}
                params={{
                  anoLectivo: parseFilter(filters.anoLectivo),
                  classeId: parseFilter(filters.anoCurricular),
                  cursoId: parseFilter(filters.curso),
                  semestreId: parseFilter(filters.semestre),
                  docenteId,
                }}
                value={filters.unidadeCurricular}
                onChangeValue={(v) => updateFilter("unidadeCurricular", v)}
              />
            </div>
          </div>

          {/* Upload */}
          {!file ? (
            <>
              <label className="cursor-pointer block" htmlFor="upload">
                <div className="flex flex-col justify-center items-center w-full h-40 bg-muted rounded-md border-2 border-dashed border-muted-foreground/25 hover:bg-muted/80 transition-colors">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-center mt-2 text-sm text-muted-foreground px-4">
                    Clique nesta área para realizar o upload do documento.
                  </p>
                </div>
              </label>
              <input
                id="upload"
                onChange={handleFileChange}
                type="file"
                className="hidden"
              />
            </>
          ) : (
            <div className="flex items-center justify-between bg-muted rounded-md p-4">
              <div className="flex items-center gap-3">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {truncateFileName(file.name, 40)}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              disabled={!canSubmit}
              size="sm"
              className="w-fit bg-secondary"
              onClick={handleSubmit}
            >
              {isLoadingSubmit ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
