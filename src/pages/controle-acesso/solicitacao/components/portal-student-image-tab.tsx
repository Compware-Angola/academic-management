import { useMutationUpdatePortalStudentImage } from "@/hooks/acess/use-mutation-update-portal-student-image";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { ImageUploadTab } from "./image-upload-tab";

export function PortalStudentImageTab() {
  const uploadFileMutation = useUploadSingle();
  const saveImageMutation = useMutationUpdatePortalStudentImage();

  const handleUpload = async (file: File) => {
    const uploadResponse = await uploadFileMutation.mutateAsync(file);
    const saveResponse = await saveImageMutation.mutateAsync(
      uploadResponse.file.filename,
    );

    return saveResponse.message;
  };

  return (
    <ImageUploadTab
      title="Imagem do Portal do Estudante"
      onUpload={handleUpload}
      isPending={
        uploadFileMutation.isPending || saveImageMutation.isPending
      }
    />
  );
}
