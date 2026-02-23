import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUploadSingleImage } from "@/hooks/acess/use-mutation-upload-single-image";

export default function UploadImagem() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useUploadSingleImage();

  // Limpar input
  const clearFileInput = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Selecionar imagem
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aceitar apenas imagens
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato inválido",
        description: "Selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    toast({
      title: "Imagem selecionada",
      description: file.name,
    });
  };

  // Upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const response = await uploadMutation.mutateAsync(selectedFile);

      toast({
        title: "Upload feito com sucesso!",
        description: response?.message || "Imagem enviada.",
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
  <div className="w-full min-h-screen flex flex-col items-center justify-center px-6">

    {/* Título grande */}
    <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 tracking-tight">
      IMAGEM DE ABERTURA
      <span className="block text-2xl md:text-3xl font-medium mt-4 text-muted-foreground">
        (PORTAL ESTUDANTE)
      </span>
    </h1>

    {/* Área de upload centralizada */}
    <div className="w-full max-w-2xl space-y-6">

      <div className="flex flex-col items-center space-y-4">

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="h-14 text-lg"
        />

        {preview && (
          <div className="w-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-[350px] object-cover rounded-xl"
            />
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isPending}
          className="w-full h-14 text-lg"
        >
          {uploadMutation.isPending ? "Enviando..." : "Enviar Imagem"}
        </Button>

      </div>

    </div>
  </div>
);
}