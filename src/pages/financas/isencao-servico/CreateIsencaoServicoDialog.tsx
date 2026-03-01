import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {TypeServiceSelectList} from "@/components/common/global-selects/TypeServiceSelectList.tsx";
import {AcademicYearSelect} from "@/components/common/global-selects/AcademicYearSelect.tsx";
import {useState, useEffect} from "react";
import {Search} from "lucide-react";
import {useQueryAlunoMatricula} from "@/hooks/financas/alunos/use-query-fecth-aluno";
import {ConfirmarAlunoModal} from "@/pages/financas/credito-educacional/AtribuirCredito/components/ConfirmarAlunoModal";

export type CreateIsencaoServicoFormData = {
    codigoMatricula: string;
    codigoServico: string;
    codigoAnoLectivo: string;
    dataIsencao: string;
};
type CreateIsencaoServicoDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: CreateIsencaoServicoFormData;
    onChange: (data: CreateIsencaoServicoFormData) => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
};

export function CreateIsencaoServicoDialog({
                                               open,
                                               onOpenChange,
                                               formData,
                                               onChange,
                                               onSubmit,
                                               isSubmitting,
                                           }: CreateIsencaoServicoDialogProps) {
    const [pesquisar, setPesquisar] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoConfirmado, setAlunoConfirmado] = useState(false);

    const {
        data: aluno,
        isLoading,
        isError,
        error,
    } = useQueryAlunoMatricula(formData.codigoMatricula, pesquisar);

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
                    <DialogTitle>Criar Nova Isenção de Serviço</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Matrícula do Aluno</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ex: 12345"
                                value={formData.codigoMatricula}
                                onChange={(e) => {
                                    setAlunoConfirmado(false);
                                    setPesquisar(false);
                                    onChange({...formData, codigoMatricula: e.target.value});
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
                            value={formData.dataIsencao}
                            onChange={(e) =>
                                onChange({...formData, dataIsencao: e.target.value})
                            }
                        />
                    </div>

                    <AcademicYearSelect
                        value={formData.codigoAnoLectivo}
                        onChangeValue={(v) => onChange({...formData, codigoAnoLectivo: v})}
                    />

                    <TypeServiceSelectList
                        value={formData.codigoServico}
                        onChangeValue={(v) => onChange({...formData, codigoServico: v})}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOnOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={
                            isSubmitting ||
                            !alunoConfirmado ||
                            !formData.codigoMatricula ||
                            !formData.codigoServico ||
                            !formData.codigoAnoLectivo ||
                            !formData.dataIsencao
                        }
                    >
                        {isSubmitting ? "Isentando..." : "Isentar Serviço"}
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