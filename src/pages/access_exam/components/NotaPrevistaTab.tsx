import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Lock, LockOpen, Save, Search } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";

import { useToast } from "@/components/ui/use-toast";
import { useAdmissaoManual } from "@/hooks/access_exam/useadmissao-manual";
import { useNotaPrevista } from "@/hooks/access_exam/use-resultado-nota-prevista";
import { NotaPrevista } from "@/services/access_exam/fetch-resultado-nota-prevista.service";


type Filters = {
    codigoAnoLetivo: string;
    codigoCurso: string;
    codigoSala: string;
    dataRealizacao: string;
    dataRealizacaoInput: string;
    horaInicio: string;
    search: string;
    page: number;
    limit: number;
};

const FILTERS_INITIAL: Filters = {
    codigoAnoLetivo: "",
    codigoCurso: "",
    codigoSala: "",
    dataRealizacao: "",
    dataRealizacaoInput: "",
    horaInicio: "",
    search: "",
    page: 1,
    limit: 10,
};

type EditableRow = {
    novaNota: string;
    originalNota: string; // último valor efetivamente guardado (ou "" se ainda não corrigido)
    saving: boolean;
    locked: boolean;
};

export function NotaPrevistaTab() {
    const [filters, setFilters] = useState<Filters>(FILTERS_INITIAL);
    const [editableRows, setEditableRows] = useState<Record<number, EditableRow>>({});

    const { toast } = useToast();
    const { data: salas = [] } = useQuerySalas();
    const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();

    const { data, isLoading, isFetching, refetch } = useNotaPrevista({
        codigoAnoLetivo: filters.codigoAnoLetivo ? Number(filters.codigoAnoLetivo) : undefined,
        codigoCurso: filters.codigoCurso ? Number(filters.codigoCurso) : undefined,
        codigoSala: filters.codigoSala ? Number(filters.codigoSala) : undefined,
        dataRealizacao: filters.dataRealizacao || undefined,
        horaInicio: filters.horaInicio || undefined,
        search: filters.search || undefined,
        page: filters.page,
        limit: filters.limit,
    });

    const admissaoManual = useAdmissaoManual();

    const candidatos = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = data?.totalpages ?? 1;
    const offset = (filters.page - 1) * filters.limit;

    useEffect(() => {
        setEditableRows(
            Object.fromEntries(
                candidatos.map((item) => [
                    item.numero_inscricao,
                    { novaNota: "", originalNota: "", saving: false, locked: true },
                ]),
            ),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // Só considera "alterado" quem tem valor preenchido E diferente do que já foi guardado
    function isChanged(numeroInscricao: number) {
        const row = editableRows[numeroInscricao];
        if (!row) return false;
        const valor = row.novaNota.trim();
        return valor !== "" && valor !== row.originalNota;
    }

    const pendentes = candidatos.filter((item) => isChanged(item.numero_inscricao));

    const allUnlocked =
        candidatos.length > 0 &&
        candidatos.every((item) => editableRows[item.numero_inscricao]?.locked === false);

    function limparFiltros() {
        setFilters({ ...FILTERS_INITIAL, limit: filters.limit });
    }

    function handleDataRealizacao(val: string) {
        if (val) {
            const [yyyy, mm, dd] = val.split("-");
            setFilters((p) => ({ ...p, dataRealizacaoInput: val, dataRealizacao: `${dd}/${mm}/${yyyy}`, page: 1 }));
        } else {
            setFilters((p) => ({ ...p, dataRealizacaoInput: "", dataRealizacao: "", page: 1 }));
        }
    }

    function handleHoraInicio(val: string) {
        setFilters((p) => ({ ...p, horaInicio: val ? `${val}:00` : "", page: 1 }));
    }

    function toggleLock(numeroInscricao: number) {
        setEditableRows((current) => ({
            ...current,
            [numeroInscricao]: {
                ...current[numeroInscricao],
                locked: !current[numeroInscricao]?.locked,
            },
        }));
    }

    function handleUnlockAll() {
        setEditableRows((current) => {
            const next = { ...current };
            candidatos.forEach((item) => {
                next[item.numero_inscricao] = { ...next[item.numero_inscricao], locked: false };
            });
            return next;
        });
    }

    function handleLockAll() {
        setEditableRows((current) => {
            const next = { ...current };
            candidatos.forEach((item) => {
                next[item.numero_inscricao] = { ...next[item.numero_inscricao], locked: true };
            });
            return next;
        });
    }

    function handleNovaNotaChange(numeroInscricao: number, value: string) {
        setEditableRows((current) => ({
            ...current,
            [numeroInscricao]: {
                ...current[numeroInscricao],
                novaNota: value,
            },
        }));
    }

    function validarNota(item: NotaPrevista, novaNota: string): number | null {
        const parsedNota = Number(novaNota);

        if (novaNota.trim() === "" || Number.isNaN(parsedNota) || parsedNota < 0 || parsedNota > 20) {
            toast({
                variant: "destructive",
                title: "Nota inválida",
                description: `A nota de ${item.nome} deve ser um número entre 0 e 20.`,
            });
            return null;
        }

        if (parsedNota < item.nota_prevista) {
            toast({
                variant: "destructive",
                title: "Nota abaixo da prevista",
                description: `A nova nota de ${item.nome} não pode ser inferior à nota prevista (${item.nota_prevista}).`,
            });
            return null;
        }

        return parsedNota;
    }

    async function handleSalvar(item: NotaPrevista) {
        const row = editableRows[item.numero_inscricao];
        if (!row) return;

        if (!isChanged(item.numero_inscricao)) {
            toast({ title: "Nenhuma alteração", description: `A nota de ${item.nome} não foi alterada.` });
            return;
        }

        const parsedNota = validarNota(item, row.novaNota);
        if (parsedNota === null) return;

        setEditableRows((current) => ({
            ...current,
            [item.numero_inscricao]: { ...current[item.numero_inscricao], saving: true },
        }));

        try {
            const response = await admissaoManual.mutateAsync({
                candidatos: [
                    {
                        candidatoId: item.numero_inscricao,
                        provaId: item.prova_id,
                        nota: parsedNota,
                    },
                ],
            });

            const resultado = response.resultados[0];

            if (resultado?.erro) {
                toast({ variant: "destructive", title: "Erro ao processar", description: resultado.erro });
                return;
            }

            setEditableRows((current) => ({
                ...current,
                [item.numero_inscricao]: {
                    ...current[item.numero_inscricao],
                    originalNota: current[item.numero_inscricao].novaNota,
                    locked: true,
                },
            }));
            toast({ title: "Sucesso", description: "Nota corrigida com sucesso." });
        } catch {
            toast({
                variant: "destructive",
                title: "Erro ao guardar",
                description: "Não foi possível processar a correção da nota.",
            });
        } finally {
            setEditableRows((current) => ({
                ...current,
                [item.numero_inscricao]: { ...current[item.numero_inscricao], saving: false },
            }));
        }
    }

    async function handleSalvarTodos() {
        if (pendentes.length === 0) {
            toast({ title: "Nenhuma alteração", description: "Não há notas novas para guardar." });
            return;
        }

        const payload: { candidatoId: number; provaId: number; nota: number }[] = [];

        for (const item of pendentes) {
            const parsedNota = validarNota(item, editableRows[item.numero_inscricao].novaNota);
            if (parsedNota === null) return;
            payload.push({ candidatoId: item.numero_inscricao, provaId: item.prova_id, nota: parsedNota });
        }

        setEditableRows((current) => {
            const next = { ...current };
            pendentes.forEach((item) => {
                next[item.numero_inscricao] = { ...next[item.numero_inscricao], saving: true };
            });
            return next;
        });

        try {
            const response = await admissaoManual.mutateAsync({ candidatos: payload });

            setEditableRows((current) => {
                const next = { ...current };
                response.resultados.forEach((resultado) => {
                    const row = next[resultado.candidatoId];
                    next[resultado.candidatoId] = {
                        ...row,
                        saving: false,
                        originalNota: resultado.erro ? row.originalNota : row.novaNota,
                        locked: resultado.erro ? row.locked : true,
                    };
                });
                return next;
            });

            if (response.erros > 0) {
                toast({
                    variant: "destructive",
                    title: `${response.erros} nota(s) não processada(s)`,
                    description: response.resultados
                        .filter((r) => r.erro)
                        .map((r) => r.erro)
                        .join(" | "),
                });
            } else {
                toast({ title: "Sucesso", description: "Todas as notas foram corrigidas com sucesso." });
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Erro ao guardar",
                description: "Não foi possível processar as correções.",
            });
            setEditableRows((current) => {
                const next = { ...current };
                pendentes.forEach((item) => {
                    next[item.numero_inscricao] = { ...next[item.numero_inscricao], saving: false };
                });
                return next;
            });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={candidatos.length === 0}
                    onClick={allUnlocked ? handleLockAll : handleUnlockAll}
                >
                    {allUnlocked ? (
                        <>
                            <Lock className="h-4 w-4 mr-2" />
                            Fechar Todos os Cadeados
                        </>
                    ) : (
                        <>
                            <LockOpen className="h-4 w-4 mr-2" />
                            Abrir Todos os Cadeados
                        </>
                    )}
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={pendentes.length === 0 || admissaoManual.isPending}
                    onClick={handleSalvarTodos}
                >
                    Guardar Alteradas ({pendentes.length})
                </Button>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    <Button variant="ghost" size="sm" onClick={limparFiltros}>
                        Limpar filtros
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <FormSelect
                            label="Ano Letivo"
                            disabled={isLoadingAcademicYear}
                            loading={isLoadingAcademicYear}
                            value={filters.codigoAnoLetivo}
                            onChange={(v) => setFilters((p) => ({ ...p, codigoAnoLetivo: v, page: 1 }))}
                            options={academicYear}
                            map={(a) => ({
                                key: a.codigo.toString(),
                                label: a.designacao,
                                value: a.codigo.toString(),
                            })}
                        />
                    </div>

                    <div className="space-y-2">
                        <CourseSelect
                            value={filters.codigoCurso}
                            onChangeValue={(v) => setFilters((p) => ({ ...p, codigoCurso: v, page: 1 }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormCommandSelect
                            label="Sala"
                            value={filters.codigoSala}
                            width="full"
                            placeholder="Selecionar sala"
                            options={salas}
                            map={(sala) => ({
                                key: sala.pk,
                                value: sala.pk,
                                label: sala.descricao,
                            })}
                            onChange={(v) => setFilters((p) => ({ ...p, codigoSala: v, page: 1 }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Data Realização</Label>
                        <Input
                            type="date"
                            value={filters.dataRealizacaoInput}
                            onChange={(e) => handleDataRealizacao(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Hora Início</Label>
                        <Input
                            type="time"
                            value={filters.horaInicio ? filters.horaInicio.slice(0, 5) : ""}
                            onChange={(e) => handleHoraInicio(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Pesquisar</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Pesquisar por nome ou BI"
                                value={filters.search}
                                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nº Inscrição</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>BI</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Sala</TableHead>
                            <TableHead>Data / Hora</TableHead>
                            <TableHead className="text-center">Nota Prevista</TableHead>
                            <TableHead>Resultado Previsto</TableHead>
                            <TableHead className="w-40">Nova Nota</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                {Array.from({ length: 10 }).map((_, j) => (
                                    <TableCell key={`skeleton-${i}-${j}`}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {!isLoading && candidatos.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                    {filters.search.trim()
                                        ? "Nenhum candidato encontrado para essa pesquisa"
                                        : "Nenhum registo encontrado"}
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && candidatos.map((item) => {
                            const row = editableRows[item.numero_inscricao] ?? {
                                novaNota: "",
                                originalNota: "",
                                saving: false,
                                locked: true,
                            };
                            const alterado = isChanged(item.numero_inscricao);

                            return (
                                <TableRow key={item.numero_inscricao}>
                                    <TableCell className="font-mono font-semibold">{item.numero_inscricao}</TableCell>
                                    <TableCell className="font-medium">{item.nome}</TableCell>
                                    <TableCell className="font-mono text-sm">{item.numero_bilhete}</TableCell>
                                    <TableCell className="text-sm">{item.curso}</TableCell>
                                    <TableCell><Badge variant="outline">{item.sala}</Badge></TableCell>
                                    <TableCell className="text-sm">
                                        {item.data_realizacao} {item.hora_inicio}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{item.nota_prevista}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                item.resultado_previsto?.toLowerCase().startsWith("admit")
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-red-600 hover:bg-red-700"
                                            }
                                        >
                                            {item.resultado_previsto}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min={item.nota_prevista}
                                            max={20}
                                            step="0.01"
                                            placeholder={`≥ ${item.nota_prevista}`}
                                            value={row.novaNota}
                                            disabled={row.locked || row.saving}
                                            className={alterado ? "border-amber-500" : undefined}
                                            onChange={(e) => handleNovaNotaChange(item.numero_inscricao, e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleLock(item.numero_inscricao)}
                                                disabled={row.saving}
                                            >
                                                {row.locked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={row.locked || row.saving || !alterado}
                                                onClick={() => handleSalvar(item)}
                                            >
                                                <Save className="h-4 w-4 mr-1" />
                                                {row.saving ? "A guardar..." : "Guardar"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mostrar</span>
                    <Select
                        value={filters.limit.toString()}
                        onValueChange={(v) => setFilters((p) => ({ ...p, limit: Number(v), page: 1 }))}
                    >
                        <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground ml-2">
                        Mostrando {total === 0 ? 0 : offset + 1} a {Math.min(offset + filters.limit, total)} de {total} registos
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={filters.page === 1 || isFetching} onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}>
                        Anterior
                    </Button>
                    <span className="text-sm">Página {filters.page} de {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={filters.page === totalPages || isFetching} onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}>
                        Seguinte
                    </Button>
                </div>
            </div>
        </div>
    );
}