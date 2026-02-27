
import { uploadSingleImage } from '@/services/access/solicitacao/create-upload.service'
import { useMutation } from '@tanstack/react-query'

export function useUploadSingleImage() {
  return useMutation({
    mutationFn: uploadSingleImage,
  })
}