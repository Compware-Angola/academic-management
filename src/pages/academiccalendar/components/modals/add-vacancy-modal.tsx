import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { usePoloDropdown } from "@/hooks/shared/use-query-fetch-polo";


type Curso = {
    codigo: number;
    designacao: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    cursos: Curso[];

    onAdd: (vaga: {
        codigoCurso: number;
        cursoDescricao: string;
        codigo_periodo: number;
        periodoDescricao: string;
        codigo_polo: number;
        numeroVagas: number;
    }) => void;
};

export function AddVacancyModal({
    open,
    onOpenChange,
    cursos,
    onAdd,
}: Props) {
    const [curso, setCurso] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [polo, setPolo] = useState("");
    const [vagas, setVagas] = useState(0);


    const { data: periodos = [], isLoading: loadingPeriodos } =
        useQueryPeriod();

    const { data: polos = [], isLoading: loadingPolos } =
        usePoloDropdown();

    function handleSave() {
        const cursoSelecionado = cursos.find(
            (c) => c.codigo === Number(curso),
        );

        const periodoSelecionado = periodos.find(
            (p) => p.codigo === Number(periodo),
        );

        const poloSelecionado = polos.find(
            (p) => p.id === Number(polo),
        );

        if (!cursoSelecionado || !periodoSelecionado || !poloSelecionado)
            return;

        onAdd({
            codigoCurso: cursoSelecionado.codigo,
            cursoDescricao: cursoSelecionado.designacao,
            codigo_periodo: periodoSelecionado.codigo,
            periodoDescricao: periodoSelecionado.designacao,
            codigo_polo: poloSelecionado.id,
            numeroVagas: vagas,
        });

        setCurso("");
        setPeriodo("");
        setPolo("");
        setVagas(0);

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>Adicionar Curso</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    {/* CURSO */}
                    <div>
                        <Label>Curso</Label>
                        <Select value={curso} onValueChange={setCurso}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione curso" />
                            </SelectTrigger>
                            <SelectContent>
                                {cursos.map((c) => (
                                    <SelectItem key={c.codigo} value={String(c.codigo)}>
                                        {c.designacao}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* PERIODO */}
                    <div>
                        <Label>Período</Label>
                        <Select value={periodo} onValueChange={setPeriodo}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione período" />
                            </SelectTrigger>
                            <SelectContent>
                                {loadingPeriodos ? (
                                    <SelectItem value="loading">
                                        Carregando...
                                    </SelectItem>
                                ) : (
                                    periodos.map((p) => (
                                        <SelectItem key={p.codigo} value={String(p.codigo)}>
                                            {p.designacao}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* POLO */}
                    <div>
                        <Label>Polo</Label>
                        <Select value={polo} onValueChange={setPolo}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione polo" />
                            </SelectTrigger>
                            <SelectContent>
                                {loadingPolos ? (
                                    <SelectItem value="loading">
                                        Carregando...
                                    </SelectItem>
                                ) : (
                                    polos.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.designacao}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* VAGAS */}
                    <div>
                        <Label>Número de vagas</Label>
                        <Input
                            type="number"
                            value={vagas}
                            onChange={(e) => setVagas(Number(e.target.value))}
                        />
                    </div>

                    <Button className="w-full" onClick={handleSave}>
                        Adicionar
                    </Button>

                </div>

            </DialogContent>
        </Dialog>
    );
}