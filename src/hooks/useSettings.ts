import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/settingsApi";

export const settingsKeys = {
    font: ["settings", "font"] as const,
    signatures: ["settings", "signatures"] as const,
    documentSignatures: ["settings", "document-signatures"] as const,
    users: ["settings", "users"] as const,
};

export function useFontSettings() {
    return useQuery({ queryKey: settingsKeys.font, queryFn: api.fetchFontSettings });
}

export function useUpdateFontSettings() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.updateFontSettings,
        onSuccess: (data) => qc.setQueryData(settingsKeys.font, data),
    });
}

export function useSignatures() {
    return useQuery({ queryKey: settingsKeys.signatures, queryFn: api.fetchSignatures });
}

export function useSystemUsers() {
    return useQuery({ queryKey: settingsKeys.users, queryFn: api.fetchSystemUsers });
}

export function useCreateSignature() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.createSignature,
        onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.signatures }),
    });
}

export function useUpdateSignature() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<api.SignatureInput> }) =>
            api.updateSignature(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.signatures }),
    });
}

export function useToggleSignature() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            api.toggleSignatureActive(id, isActive),
        onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.signatures }),
    });
}

export function useDeleteSignature() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.deleteSignature,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: settingsKeys.signatures });
            qc.invalidateQueries({ queryKey: settingsKeys.documentSignatures });
        },
    });
}

export function useDocumentSignatures() {
    return useQuery({
        queryKey: settingsKeys.documentSignatures,
        queryFn: api.fetchDocumentSignatures,
    });
}

export function useUpdateDocumentSignatures() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.updateDocumentSignatures,
        onSuccess: (data) => qc.setQueryData(settingsKeys.documentSignatures, data),
    });
}