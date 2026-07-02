import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vacancy } from "@/services/academiccalendar/fetch-vacancies";
import { Users } from "lucide-react";
import React, { useState } from "react";
import { AddVacancyModal } from "./add-vacancy-modal";

const VagaItem = React.memo(
    ({
        vaga,
        index,
        onChange,
    }: {
        vaga: any;
        index: number;
        onChange: (index: number, newValue: number) => void;
    }) => {
        return (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/30 transition-colors">
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{vaga.cursoDescricao}</p>
                    <p className="text-sm text-muted-foreground truncate">
                        {vaga.periodoDescricao}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onChange(index, Math.max(0, vaga.numeroVagas - 1))}
                    >
                        -
                    </Button>
                    <Input
                        type="number"
                        value={vaga.numeroVagas}
                        onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            onChange(index, val);
                        }}
                        className="w-24 text-center"
                        min="0"
                    />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onChange(index, vaga.numeroVagas + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>
        );
    },
);
type VagasStepProps = {
    vagasOriginais: Vacancy[]
    loadingVagas: boolean
    handleVagaChange: (index: number, newValue: number) => void
    vagasEditadas: Vacancy[]
    setVagasEditadas: (value: React.SetStateAction<Vacancy[]>) => void
    cursosDisponiveis: { codigo: number; designacao: string }[]
}
export function VagasStep(props: VagasStepProps) {
    const { loadingVagas, vagasOriginais, handleVagaChange, vagasEditadas, setVagasEditadas, cursosDisponiveis } = props
    const [openAdd, setOpenAdd] = useState(false);
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Users className="h-5 w-5" /> Vagas por Curso e Período
            </h3>

            {loadingVagas ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Carregando vagas...</p>
                </div>
            ) : vagasOriginais.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                    <p>Nenhuma vaga encontrada</p>
                    <p className="text-sm mt-2">
                        Verifique se há cursos/períodos cadastrados
                    </p>
                </div>
            ) : vagasEditadas.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">
                    Preparando dados para edição...
                </p>
            ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {vagasEditadas.map((vaga, index) => (
                        <VagaItem
                            key={`${vaga.codigoCurso}-${vaga.codigo_periodo}-${index}`}
                            vaga={vaga}
                            index={index}
                            onChange={handleVagaChange}
                        />
                    ))}
                    {cursosDisponiveis.length > 0 && (
                        <Button
                            className="mb-4"
                            onClick={() => setOpenAdd(true)}
                        >
                            Adicionar curso
                        </Button>
                    )}
                </div>

            )}

            <AddVacancyModal
                open={openAdd}
                onOpenChange={setOpenAdd}
                cursos={cursosDisponiveis}
                onAdd={(novaVaga) => {
                    setVagasEditadas((prev) => [...prev, novaVaga]);
                }}
            />
        </div>
    )
}