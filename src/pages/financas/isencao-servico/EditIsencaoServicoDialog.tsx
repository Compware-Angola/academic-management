import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { TypeServiceSelectList } from "@/components/common/global-selects/TypeServiceSelectList.tsx";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect.tsx";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Search } from "lucide-react";
import { useQueryAlunoMatricula } from "@/hooks/financas/alunos/use-query-fecth-aluno";
import { ConfirmarAlunoModal } from "@/pages/financas/credito-educacional/AtribuirCredito/components/ConfirmarAlunoModal";

export type EditIsencaoServicoFormData = {
    codigoMatricula?: string | number;
    codigoServico?: string | number;
    codigoAnoLectivo?: string | number;
    dataIsencao?: string;
    obs?: string;
    estadoIsencao?: string; // "Activo" | "Inactivo"
    codigo?: number;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: EditIsencaoServicoFormData;
    onChange: (data: EditIsencaoServicoFormData) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
};

export function EditIsencaoServicoDialog({
    open,
    onOpenChange,
    formData,
    onChange,
    onSubmit,
    isSubmitting,
}: Props) {
    const [pesquisar, setPesquisar] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoConfirmado, setAlunoConfirmado] = useState(false);

    const {
        data: aluno,
        isLoading,
        isError,
        error,
    } = useQueryAlunoMatricula(String(formData.codigoMatricula ?? ""), pesquisar);

    useEffect(() => {
        if (aluno) setModalAberto(true);
    }, [aluno]);

    const pesquisarAluno = () => {
        if (!formData.codigoMatricula) return;
        setAlunoConfirmado(false);
        setPesquisar(true);
    };

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setPesquisar(false);
            setModalAberto(false);
            setAlunoConfirmado(false);
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Isenção de Serviço</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Matrícula do Aluno</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ex: 12345"
                                value={String(formData.codigoMatricula ?? "")}
                                onChange={(e) => {
                                    setAlunoConfirmado(false);
                                    setPesquisar(false);
                                    onChange({ ...formData, codigoMatricula: e.target.value });
                                }}
                            />
                            <Button
                                type="button"
                                size="icon"
                                disabled={isLoading || !formData.codigoMatricula}
                                onClick={pesquisarAluno}
                            >
                                {isLoading ? "..." : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                        {isError && (
                            <p className="text-sm text-red-500 font-medium">
                                {error?.response?.data?.message ?? "Estudante não encontrado"}
                            </p>
                        )}
                        {alunoConfirmado && aluno && (
                            <p className="text-sm text-green-600 font-medium">
                                Aluno: {aluno.nome_completo}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Data de Isenção</Label>
                        <Input
                            type="date"
                            value={
                                formData.dataIsencao
                                    ? formData.dataIsencao.split("T")[0]
                                    : ""
                            }
                            onChange={(e) =>
                                onChange({ ...formData, dataIsencao: e.target.value })
                            }
                        />
                    </div>

                    <AcademicYearSelect
                        value={String(formData.codigoAnoLectivo ?? "")}
                        onChangeValue={(v) => onChange({ ...formData, codigoAnoLectivo: v })}
                    />

                    <TypeServiceSelectList
                        value={String(formData.codigoServico ?? "")}
                        onChangeValue={(v) => onChange({ ...formData, codigoServico: v })}
                    />

                    <div className="space-y-2">
                        <Label>Observações</Label>
                        <Input
                            value={formData.obs ?? ""}
                            onChange={(e) => onChange({ ...formData, obs: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Estado</Label>
                        <Select
                            value={String(formData.estadoIsencao ?? "")}
                            onValueChange={(v) => onChange({ ...formData, estadoIsencao: v })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Inactivo">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={onSubmit} disabled={isSubmitting || !alunoConfirmado}>
                        {isSubmitting ? "A atualizar..." : "Atualizar Isenção"}
                    </Button>
                </DialogFooter>
            </DialogContent>

            <ConfirmarAlunoModal
                open={modalAberto}
                aluno={aluno}
                onClose={() => {
                    setModalAberto(false);
                    setPesquisar(false);
                }}
                onConfirm={() => {
                    setAlunoConfirmado(true);
                    setModalAberto(false);
                    setPesquisar(false);
                }}
            />
        </Dialog>
    );
}
