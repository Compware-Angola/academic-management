import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUploadSingleImage } from "@/hooks/acess/use-mutation-upload-single-image";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";

export default function UploadImagem() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useUploadSingleImage();
    const UploadMutation = useUploadSingle();

  
  const clearFileInput = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
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

  
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
        const resposta = await UploadMutation.mutateAsync(selectedFile);
        
        const response = await uploadMutation.mutateAsync(resposta.file.filename);


      toast({
        title: "Upload feito com sucesso!",
        description: resposta?.message || "Imagem enviada.",
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

    
    <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 tracking-tight">
      IMAGEM DE ABERTURA
      <span className="block text-2xl md:text-3xl font-medium mt-4 text-muted-foreground">
        (PORTAL ESTUDANTE)
      </span>
    </h1>

    
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
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}

            className="w-full"
            >
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