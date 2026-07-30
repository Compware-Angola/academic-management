import { Button } from "@/components/ui/button";
import { Loader2, Paperclip } from "lucide-react";
import { ApiError } from "@/error";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useGetFileUrl } from "@/hooks/upload/use-upload-single";

interface DownloadFileProps {
  path: string;
}
const DownloadFileButton = ({ path }: DownloadFileProps) => {
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const { toast } = useToast();
  const { mutateAsync: getFileUrl, isPending: isLoadingDocumento } =
    useGetFileUrl();
  const handleDownload = async (ficheiroName: string) => {
    const key = ficheiroName;

    if (!key) {
      toast({
        title: "Formato inválido",
        description: "Nenhum documento encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { url } = await getFileUrl({ key });
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
      toast({
        title: "Erro",
        description:
          error instanceof ApiError
            ? error.message
            : "Erro ao abrir o ficheiro.",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      onClick={() => handleDownload(path)}
      variant="outline"
      className="bg-blue-500 text-white"
      size="icon"
    >
      {loadingFile ? <Loader2 className="animate-spin" /> : <Paperclip />}
    </Button>
  );
};

export { DownloadFileButton };
