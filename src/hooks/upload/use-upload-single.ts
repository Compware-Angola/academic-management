import { uploadSingleFile } from '@/services/upload/upload-single.service'
import { useMutation } from '@tanstack/react-query'

export function useUploadSingle() {
  return useMutation({
    mutationFn: uploadSingleFile,
  })
}
