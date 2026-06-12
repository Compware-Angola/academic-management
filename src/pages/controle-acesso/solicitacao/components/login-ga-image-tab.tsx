import { useMutationUpdateLoginGaImage } from "@/hooks/acess/use-mutation-update-login-ga-image";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { ImageUploadTab } from "./image-upload-tab";

export function LoginGaImageTab() {
  const uploadFileMutation = useUploadSingle();
  const saveImageMutation = useMutationUpdateLoginGaImage();

  const handleUpload = async (file: File) => {
    const uploadResponse = await uploadFileMutation.mutateAsync(file);
    const saveResponse = await saveImageMutation.mutateAsync(
      uploadResponse.file.filename,
    );

    return saveResponse.message;
  };

  return (
    <ImageUploadTab
      title="Imagem do Login do GA"
      onUpload={handleUpload}
      isPending={
        uploadFileMutation.isPending || saveImageMutation.isPending
      }
    />
  );
}
