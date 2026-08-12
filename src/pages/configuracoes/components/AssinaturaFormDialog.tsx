import { useEffect, useRef, useState } from "react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ImageUp, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    Signature, SignatureInput, SIGNATURE_MIME_TYPES, uploadSignatureImage,
} from "@/lib/settingsApi";
import { useSystemUsers } from "@/hooks/useSettings";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    signature?: Signature | null;
    onSubmit: (data: SignatureInput) => Promise<void> | void;
    isSaving?: boolean;
}

const EMPTY: SignatureInput = {
    userId: "", name: "", email: "", position: "", department: "", imageUrl: "", isActive: true,
};

export function AssinaturaFormDialog({ open, onOpenChange, signature, onSubmit, isSaving }: Props) {
    const { data: users = [], isLoading: loadingUsers } = useSystemUsers();
    const [form, setForm] = useState<SignatureInput>(EMPTY);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setForm(signature ? { ...signature } : EMPTY);
            setErrors({});
        }
    }, [open, signature]);

    const set = <K extends keyof SignatureInput>(k: K, v: SignatureInput[K]) =>
        setForm((f) => ({ ...f, [k]: v }));

    const handleUser = (userId: string) => {
        const u = users.find((x) => x.id === userId);
        setForm((f) => ({
            ...f,
            userId,
            name: u?.name ?? f.name,
            email: u?.email ?? "",
            position: u?.position ?? f.position,
            department: u?.department ?? f.department,
        }));
    };

    const handleFile = async (file?: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadSignatureImage(file);
            set("imageUrl", url);
            setErrors((e) => ({ ...e, imageUrl: "" }));
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Falha no upload da imagem.");
        } finally {
            setUploading(false);
        }
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.userId) e.userId = "Seleccione o utilizador responsável.";
        if (!form.position.trim()) e.position = "Indique o cargo/função.";
        if (!form.department.trim()) e.department = "Indique o departamento.";
        if (!form.imageUrl) e.imageUrl = "Carregue a imagem da assinatura.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        await onSubmit(form);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{signature ? "Editar assinatura" : "Adicionar assinatura"}</DialogTitle>
                    <DialogDescription>
                        A assinatura é sempre associada a um utilizador do sistema.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                        <Label>Utilizador responsável *</Label>
                        <Select value={form.userId} onValueChange={handleUser} disabled={loadingUsers}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar utilizador" /></SelectTrigger>
                            <SelectContent>
                                {users.map((u) => (
                                    <SelectItem key={u.id} value={u.id}>{u.name} — {u.email}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.userId && <p className="text-xs text-destructive">{errors.userId}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Nome do responsável</Label>
                        <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Preenchido pelo utilizador" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={form.email ?? ""} readOnly className="bg-muted/50" placeholder="—" />
                    </div>
                    <div className="space-y-2">
                        <Label>Cargo/Função *</Label>
                        <Input value={form.position} onChange={(e) => set("position", e.target.value)} />
                        {errors.position && <p className="text-xs text-destructive">{errors.position}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Departamento *</Label>
                        <Input value={form.department} onChange={(e) => set("department", e.target.value)} />
                        {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label>Imagem da assinatura *</Label>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <input
                                ref={fileRef}
                                type="file"
                                accept={SIGNATURE_MIME_TYPES.join(",")}
                                className="hidden"
                                onChange={(e) => handleFile(e.target.files?.[0])}
                            />
                            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageUp className="mr-2 h-4 w-4" />}
                                Carregar imagem
                            </Button>
                            <p className="text-xs text-muted-foreground">PNG, JPG ou SVG · máx. 2MB · fundo transparente recomendado</p>
                        </div>
                        <div className="mt-2 flex items-center justify-center rounded-lg border border-dashed bg-[linear-gradient(45deg,hsl(var(--muted))_25%,transparent_25%,transparent_75%,hsl(var(--muted))_75%),linear-gradient(45deg,hsl(var(--muted))_25%,transparent_25%,transparent_75%,hsl(var(--muted))_75%)] [background-position:0_0,8px_8px] [background-size:16px_16px] p-4">
                            {form.imageUrl ? (
                                <div className="flex items-center gap-4">
                                    <img src={form.imageUrl} alt="Pré-visualização da assinatura" className="h-20 object-contain" />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => set("imageUrl", "")}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ) : (
                                <p className="py-6 text-sm text-muted-foreground">Nenhuma imagem carregada</p>
                            )}
                        </div>
                        {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl}</p>}
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-2">
                        <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
                        <Label>Assinatura activa</Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={submit} disabled={isSaving || uploading}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {signature ? "Guardar assinatura" : "Adicionar assinatura"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}