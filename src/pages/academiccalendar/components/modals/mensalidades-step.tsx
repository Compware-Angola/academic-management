import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCardIcon } from "lucide-react";
type MensalidadesStepProps = {
    loadingMeses: boolean
    errorMeses?: Error
    mensalidadesEditadas: any[]
    setMensalidadesEditadas: (value: React.SetStateAction<any[]>) => void
}

export function MensalidadesStep(props: MensalidadesStepProps) {
    const { loadingMeses, errorMeses, mensalidadesEditadas, setMensalidadesEditadas } = props
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <CreditCardIcon className="h-5 w-5" /> Mensalidades Geradas
            </h3>

            {loadingMeses ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Gerando mensalidades...</p>
                </div>
            ) : errorMeses ? (
                <div className="text-center py-12 text-destructive">
                    <p>Erro ao gerar mensalidades</p>
                    <p className="text-sm">
                        {(errorMeses as Error)?.message || "Tente novamente"}
                    </p>
                </div>
            ) : mensalidadesEditadas.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                    <p>Nenhuma mensalidade gerada ainda</p>
                    <p className="text-sm mt-2">
                        Preencha as datas dos semestres e avance para gerar
                    </p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Designação</TableHead>
                                <TableHead>Ordem</TableHead>
                                <TableHead>Prestação</TableHead>
                                <TableHead>Semestre</TableHead>
                                <TableHead>Data Inicial</TableHead>
                                <TableHead>Data Final</TableHead>
                                <TableHead>Data Limite</TableHead>
                                <TableHead>Isenção</TableHead>
                                <TableHead>Activo</TableHead>
                                <TableHead>Pós-Grad.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mensalidadesEditadas.map((item, index) => (
                                <TableRow key={index}
                                    className={
                                        item.activo === 0
                                            ? "text-red-600 line-through decoration-red-600 decoration-2"
                                            : ""
                                    }>
                                    <TableCell className="font-medium">
                                        {item.designacao}
                                    </TableCell>
                                    <TableCell>{item.ordem_mes}</TableCell>
                                    <TableCell>{item.prestacao}ª</TableCell>
                                    <TableCell>{item.semestre}º</TableCell>
                                    <TableCell>
                                        {item.data_inicial?.split("T")[0] || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {item.data_final?.split("T")[0] || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="date"
                                            value={item.data_limite?.split("T")[0] || ""}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setMensalidadesEditadas((prev) =>
                                                    prev.map((mes, i) =>
                                                        i === index
                                                            ? { ...mes, data_limite: newValue }
                                                            : mes,
                                                    ),
                                                );
                                            }}
                                            className="w-[150px]"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {item.isencao === 1 ? "Sim" : "Não"}
                                    </TableCell>
                                    <TableCell>
                                        {item.activo === 1 ? "Activo" : "Inactivo"}
                                    </TableCell>
                                    <TableCell>
                                        {item.activo_posgraduacao === 1 ? "Sim" : "Não"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}