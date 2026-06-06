import { useMutationUpdateComunicadoPortalImage } from "@/hooks/acess/use-mutation-update-comunicado-portal-image";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { ImageUploadTab } from "./image-upload-tab";

export function ComunicadoPortalImageTab() {
  const uploadFileMutation = useUploadSingle();
  const saveImageMutation = useMutationUpdateComunicadoPortalImage();

  const handleUpload = async (file: File) => {
    const uploadResponse = await uploadFileMutation.mutateAsync(file);
    const saveResponse = await saveImageMutation.mutateAsync(
      uploadResponse.file.filename,
    );

    return saveResponse.message;
  };

  return (
    <ImageUploadTab
      title="Banner da Página de Comunicados"
      onUpload={handleUpload}
      isPending={
        uploadFileMutation.isPending || saveImageMutation.isPending
      }
    />
  );
}
