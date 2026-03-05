import { Button } from "@/components/ui/button";
import { Loader2, Paperclip } from "lucide-react";
import { viewFile } from "@/services/upload/upload-single.service";
import { ApiError } from "@/error";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DownloadFileProps {
  path: string;
}
const DownloadFileButton = ({ path }: DownloadFileProps) => {
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDownload = async (path: string) => {
    if (!path) return;
    setLoadingFile(true);
    try {
      const blob = await viewFile(path);
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
    } catch (error) {
      setLoadingFile(false);
      toast({
        title: "Erro",
        description:
          error instanceof ApiError
            ? error.message
            : "Erro ao abrir o ficheiro.",
        variant: "destructive",
      });
    }
    setLoadingFile(false);
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
