import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationCreateAgendaLaunch } from "@/hooks/post-graduation/use-mutation-create-agenda-launch";
import { useToast } from "@/hooks/use-toast";
import type { PostGraduationAgendaLaunchOptions } from "@/services/post-graduation/fetch-agenda-launch-options.service";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { formatDateOnlyPt } from "@/util/date-formate";

type CreateAgendaLaunchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYearId: number;
  degreeId: number;
  semesterId: number;
  options?: PostGraduationAgendaLaunchOptions;
};

type FormState = {
  courseId: string;
  curricularYearId: string;
  curricularGradeId: string;
  termId: string;
};

const initialForm: FormState = {
  courseId: "",
  curricularYearId: "",
  curricularGradeId: "",
  termId: "",
};

export function CreateAgendaLaunchModal({
  open,
  onOpenChange,
  academicYearId,
  degreeId,
  semesterId,
  options,
}: CreateAgendaLaunchModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadSingle();
  const createMutation = useMutationCreateAgendaLaunch();
  const { toast } = useToast();

  const curricularYears = useMemo(
    () =>
      (options?.curricularYears ?? []).filter(
        (item) => item.courseId === Number(form.courseId),
      ),
    [form.courseId, options?.curricularYears],
  );

  const curricularUnits = useMemo(
    () =>
      (options?.curricularUnits ?? []).filter(
        (item) =>
          item.courseId === Number(form.courseId) &&
          item.curricularYearId === Number(form.curricularYearId),
      ),
    [
      form.courseId,
      form.curricularYearId,
      options?.curricularUnits,
    ],
  );

  const openTerms = useMemo(
    () => (options?.terms ?? []).filter((term) => term.isOpen),
    [options?.terms],
  );

  const selectedTerm = openTerms.find(
    (term) => term.id === Number(form.termId),
  );

  const isPending = uploadMutation.isPending || createMutation.isPending;
  const canSubmit =
    academicYearId > 0 &&
    [2, 3].includes(degreeId) &&
    [1, 2].includes(semesterId) &&
    Number(form.courseId) > 0 &&
    Number(form.curricularYearId) > 0 &&
    Number(form.curricularGradeId) > 0 &&
    Boolean(selectedTerm) &&
    Boolean(selectedFile);

  useEffect(() => {
    if (open) return;

    setForm(initialForm);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast({
        title: "Ficheiro inválido",
        description: "Seleccione um ficheiro PDF.",
        variant: "destructive",
      });
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  function clearFile() {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit() {
    if (!canSubmit || !selectedFile || !selectedTerm) return;

    let fileName: string;

    try {
      const uploadResponse = await uploadMutation.mutateAsync(selectedFile);
      fileName = uploadResponse.file?.filename;

      if (!fileName) {
        throw new Error("O serviço de ficheiros não devolveu o nome do PDF.");
      }
    } catch (error) {
      toast({
        title: "Não foi possível carregar o PDF.",
        description:
          error instanceof Error
            ? error.message
            : "O serviço de ficheiros não respondeu.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        academicYearId,
        degreeId,
        semesterId,
        courseId: Number(form.courseId),
        curricularYearId: Number(form.curricularYearId),
        curricularGradeId: Number(form.curricularGradeId),
        termId: selectedTerm.id,
        assessmentTypeId: selectedTerm.assessmentTypeId,
        fileName,
      });

      onOpenChange(false);
    } catch {
      // O interceptor da API apresenta a mensagem devolvida pelo backend.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submeter pauta</DialogTitle>
          <DialogDescription>
            Seleccione a unidade curricular, a avaliação e o ficheiro PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
          <FormSelect
            label="Curso"
            value={form.courseId}
            options={options?.courses ?? []}
            disabled={isPending}
            map={(item) => ({
              key: item.id,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) =>
              setForm({
                courseId: value,
                curricularYearId: "",
                curricularGradeId: "",
                termId: form.termId,
              })
            }
          />

          <FormSelect
            label="Ano Curricular"
            value={form.curricularYearId}
            options={curricularYears}
            disabled={!form.courseId || isPending}
            map={(item) => ({
              key: `${item.courseId}-${item.id}`,
              value: item.id,
              label: item.designation,
            })}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                curricularYearId: value,
                curricularGradeId: "",
              }))
            }
          />

          <div className="md:col-span-2">
            <FormSelect
              label="Unidade Curricular"
              value={form.curricularGradeId}
              options={curricularUnits}
              disabled={!form.curricularYearId || isPending}
              map={(item) => ({
                key: item.curricularGradeId,
                value: item.curricularGradeId,
                label: item.designation,
              })}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  curricularGradeId: value,
                }))
              }
            />
          </div>

          <div className="md:col-span-2">
            <FormSelect
              label="Tipo de Avaliação"
              value={form.termId}
              options={openTerms}
              disabled={openTerms.length === 0 || isPending}
              map={(item) => ({
                key: item.id,
                value: item.id,
                label: `${item.assessmentType} (${formatDateOnlyPt(
                  item.startDate,
                )} - ${formatDateOnlyPt(item.endDate)})`,
              })}
              onChange={(value) =>
                setForm((current) => ({ ...current, termId: value }))
              }
            />
            {openTerms.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                Não existe prazo aberto para lançamento de pauta neste
                contexto.
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="post-graduation-agenda-file">
              Ficheiro PDF
            </Label>
            <Input
              ref={fileInputRef}
              id="post-graduation-agenda-file"
              type="file"
              accept=".pdf,application/pdf"
              disabled={isPending}
              onChange={handleFileChange}
            />

            {selectedFile && (
              <div className="flex min-h-10 items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 shrink-0 text-red-500" />
                <span className="min-w-0 flex-1 truncate">
                  {selectedFile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title="Remover ficheiro"
                  disabled={isPending}
                  onClick={clearFile}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || isPending}
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Submeter pauta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
