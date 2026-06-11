import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type ImageUploadTabProps = {
  title: string;
  onUpload: (file: File) => Promise<string | undefined>;
  isPending: boolean;
};

export function ImageUploadTab({
  title,
  onUpload,
  isPending,
}: ImageUploadTabProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const clearFileInput = () => {
    setSelectedFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      toast({
        title: "Formato inválido",
        description: "Selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      const message = await onUpload(selectedFile);

      toast({
        title: "Upload feito com sucesso!",
        description: message || "Imagem enviada.",
      });

      clearFileInput();
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error?.message || "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pt-6">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isPending}
        className="h-12"
      />

      {preview && (
        <div className="max-h-[400px] w-full overflow-y-auto rounded-md border">
          <img
            src={preview}
            alt="Pré-visualização da imagem selecionada"
            className="w-full object-contain"
          />
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isPending}
        className="w-full"
      >
        <Upload className="h-4 w-4" />
        {isPending ? "Enviando..." : "Enviar imagem"}
      </Button>
    </div>
  );
}
