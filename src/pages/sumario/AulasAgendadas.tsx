import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Search, FileText, Download, Printer, Eye, Plus, ChevronLeft, ChevronRight, Calendar, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useMutationMarcarAula } from "@/hooks/assiduidade/use-mutation-marcar-assiduidade-aula";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryStatusAgendamento } from "@/hooks/assiduidade/use-fetch-assiduidade-status-agendamentos";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQuerySumarioAgendamentoAula } from "@/hooks/sumario/use-fetch-sumario-agendamento-aula-aula";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { AgendamentoAulaItem } from "@/services/sumario/fetch-sumario-agendamento-aula.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationCreateSumario } from "@/hooks/sumario/use-mutation-create-sumario";
import { useMutationUpdateSumario } from "@/hooks/sumario/use-mutation-update-sumario";

type EstadoAssiduidade = 1 | 2 | 3;

function EstadoBadge({ estado }: { estado: EstadoAssiduidade }) {
    const map = {
        1: {
            label: "Pendente",
            className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
        },
        2: {
            label: "Ausente",
            className: "bg-red-500/10 text-red-700 border-red-500/30",
        },
        3: {
            label: "Presente",
            className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
        },
    };

    const info = map[estado] || { label: "Desconhecido", className: "" };

    return (
        <Badge variant="outline" className={info.className}>
            {info.label}
        </Badge>
    );
}

export default function AulasAgendadas() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [selectedAula, setSelectedAula] = useState<AgendamentoAulaItem | null>(null);
    const [sumarioModal, setSumarioModal] = useState<AgendamentoAulaItem | null>(null);
    const [sumarioText, setSumarioText] = useState("");

    const [showMoreFilters, setShowMoreFilters] = useState(false);

    const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
    const { data: statusAgendamentos, isLoading: isLoadingStatusAgendamento } = useQueryStatusAgendamento({ enabled: true });

    const SEMESTRE = [
        { key: "1", label: "1º Semestre", value: "1" },
        { key: "2", label: "2º Semestre", value: "2" },
    ];

    const { data: teachersData = [] } = useQueryTeacther();
    const mutationCreateSumario = useMutationCreateSumario();
    const mutationUpdateSumario = useMutationUpdateSumario();

    const [filters, setFilters] = useState({
        docente: "",
        anoCurricular: "all",
        unidadeCurricular: "",
        dataInicio: "",
        dataFim: "",
        estado: "",
        anoLectivo: "",
        semestre: "",
        curso: "",
        page: 1,
        limit: 10,
    });

    const { data: unidadesCurriculares = [], isLoading: isLoadingUC } = useQueryDisciplinaWithFilter({
        curso: filters.curso,
        semestre: filters.semestre,
        classe: filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
    });

    const { data: aulasSumarioAgendados, isLoading: isLoadingAulasAgendadas } = useQuerySumarioAgendamentoAula({
        docente: filters.docente ? Number(filters.docente) : undefined,
        unidadeCurricular: filters.unidadeCurricular ? Number(filters.unidadeCurricular) : undefined,
        dataInicial: filters.dataInicio || undefined,
        dataFinal: filters.dataFim || undefined,
        estado: filters.estado ? Number(filters.estado) : undefined,
        anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
        semestre: filters.semestre ? Number(filters.semestre) : undefined,
        page: filters.page,
        limit: filters.limit,
    });

    const { data: cursos } = useCursos();
    const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
        curso: filters.curso,
    });

    // Dados derivados
    const totalPages = aulasSumarioAgendados?.totalPages ?? 1;
    const totalItems = aulasSumarioAgendados?.total ?? aulasSumarioAgendados?.data?.length ?? 0;
    const currentData = aulasSumarioAgendados?.data ?? [];

    // Função auxiliar para atualizar filtros e resetar página
    const updateFilters = (newValues: Partial<typeof filters>) => {
        setFilters((prev) => ({
            ...prev,
            ...newValues,
            page: 1,
        }));
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (value: string) => {
        const newLimit = Number(value);
        setItemsPerPage(newLimit);
        updateFilters({ limit: newLimit, page: 1 });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleAddSumario = (sumarioId: number) => () => {
        if (!sumarioModal || !sumarioText.trim()) {
            toast.error("O sumário não pode estar vazio.");
            return;
        }
   
        
        if (sumarioId) {
            mutationUpdateSumario.mutate({
                codigo: sumarioId,
                payload: {
                    fk_agendamento_aula: sumarioModal.codigo,
                    fk_estado_sumario: 1,
                    active_state: 1,
                    descricao: sumarioText.trim()
                }
            });
        } else {
            mutationCreateSumario.mutate({
                fk_agendamento_aula: sumarioModal.codigo,
                fk_estado_sumario: 1,
                active_state: 1,
                descricao: sumarioText.trim()
        });   
        }
        
         sumarioId ? toast.success("Sumário atualizado com sucesso!") : toast.success(`Sumário adicionado à aula ${sumarioModal.codigo}!`);
            setSumarioModal(null);
            setSumarioText("");
    };

    const openSumarioModal = (aula: AgendamentoAulaItem) => {
        setSumarioModal(aula);
        setSumarioText(aula.sumario_descricao || "");
    };

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink href="/">Início</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href="#">Sumário</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Aulas Agendadas</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Aulas Agendadas</h1>
                    <p className="text-muted-foreground">Gerencie as aulas agendadas e adicione sumários</p>
                </div>
             
            </div>

            {/* Filtros */}
            <div className="bg-card border rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filtros</h3>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMoreFilters(!showMoreFilters)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {showMoreFilters ? (
                                <>Menos filtros <ChevronUp className="ml-1 h-4 w-4" /></>
                            ) : (
                                <>Mais filtros <ChevronDown className="ml-1 h-4 w-4" /></>
                            )}
                        </Button>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                setFilters({
                                    docente: "",
                                    anoLectivo: "",
                                    semestre: "",
                                    estado: "",
                                    dataInicio: "",
                                    dataFim: "",
                                    curso: "",
                                    anoCurricular: "all",
                                    unidadeCurricular: "",
                                    page: 1,
                                    limit: itemsPerPage,
                                });
                                setCurrentPage(1);
                            }}
                        >
                            Limpar filtros
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Filtros sempre visíveis */}
                    <div className="space-y-1.5">
                        <Label>Ano Letivo</Label>
                        <FormSelect
                            disabled={isLoadingAcademicYear}
                            value={filters.anoLectivo}
                            onChange={(v) => updateFilters({ anoLectivo: v })}
                            options={anosAcademicos ?? []}
                            map={(a) => ({ key: a.codigo, label: a.designacao, value: String(a.codigo) })}
                            placeholder="Selecione o ano..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Estado</Label>
                        <FormSelect
                            disabled={isLoadingStatusAgendamento}
                            value={filters.estado ?? ""}
                            onChange={(v) => updateFilters({ estado: v === "" ? "" : v })}
                            options={[
                                { key: "todos", label: "Todos os estados", value: null },
                                ...(statusAgendamentos ?? []).map((s) => ({
                                    key: s.codigo,
                                    label: s.designacao,
                                    value: String(s.codigo),
                                })),
                            ]}
                            map={(opt) => opt}
                            placeholder="Selecione o estado..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Semestre</Label>
                        <FormSelect
                            value={filters.semestre}
                            onChange={(v) => updateFilters({ semestre: v })}
                            options={SEMESTRE}
                            map={(s) => ({ key: s.key, label: s.label, value: s.value })}
                            placeholder="Selecione o semestre..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Docente</Label>
                        <FormCommandSelect
                            value={filters.docente}
                            options={teachersData}
                            map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
                            onChange={(codigo) => updateFilters({ docente: codigo })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Data início</Label>
                        <Input
                            type="date"
                            value={filters.dataInicio ?? ""}
                            onChange={(e) => updateFilters({ dataInicio: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Data fim</Label>
                        <Input
                            type="date"
                            value={filters.dataFim ?? ""}
                            onChange={(e) => updateFilters({ dataFim: e.target.value })}
                        />
                    </div>

                    {showMoreFilters && (
                        <>
                            <div className="space-y-1.5">
                                <Label>Curso</Label>
                                <FormCommandSelect
                                    value={filters.curso}
                                    options={cursos}
                                    map={(c) => ({
                                        key: c.codigo.toString(),
                                        value: c.codigo.toString(),
                                        label: c.designacao,
                                    })}
                                    onChange={(v) => updateFilters({ curso: v, unidadeCurricular: "" })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Ano Curricular</Label>
                                <Select
                                    value={filters.anoCurricular}
                                    onValueChange={(v) => updateFilters({ anoCurricular: v, unidadeCurricular: "" })}
                                    disabled={!filters.curso}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={filters.curso ? "Todos os anos" : "Selecione curso"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os anos</SelectItem>
                                        {anosCurriculares.map((ac) => (
                                            <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                                                {ac.designacao}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Unidade Curricular</Label>
                                <FormCommandSelect
                                    value={filters.unidadeCurricular}
                                    options={unidadesCurriculares}
                                    map={(u) => ({ key: u.pk.toString(), value: u.pk.toString(), label: u.descricao })}
                                    placeholder={
                                        !filters.curso
                                            ? "Selecione curso"
                                            : !filters.semestre
                                                ? "Selecione semestre"
                                                : isLoadingUC
                                                    ? "Carregando UCs..."
                                                    : "Selecionar UC"
                                    }
                                    onChange={(u) => updateFilters({ unidadeCurricular: u })}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tabela + Paginação */}
            {isLoadingAulasAgendadas ? (
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : currentData.length === 0 ? (
                <div className="text-center py-16 bg-muted/40 border rounded-lg">
                    <p className="text-muted-foreground text-lg">Nenhum registo encontrado</p>
                    <p className="text-sm mt-2">Tente ajustar os filtros</p>
                </div>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>UC</TableHead>
                                <TableHead>Docente</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Horário</TableHead>

                                <TableHead>Designação do Horário</TableHead>
                                <TableHead>Sala</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Sumário</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.map((a) => (
                                <TableRow key={a.codigo}>
                                    <TableCell className="font-medium">{a.codigo}</TableCell>
                                    <TableCell>{a.unidade_curricular}</TableCell>
                                    <TableCell>{a.docente}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {a.data_aula}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {a.hora_inicio} - {a.hora_fim}
                                        </div>
                                    </TableCell>

                                    <TableCell className="max-w-[150px] truncate">{a.horario}</TableCell>
                                    <TableCell className="max-w-[150px] truncate">{a.sala}</TableCell>
                                    <TableCell>
                                        <EstadoBadge estado={a.estado_agendamento_aula as EstadoAssiduidade} />
                                    </TableCell>
                                    <TableCell>
                                        {a.sumario_codigo ? (
                                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Com sumário</Badge>
                                        ) : (
                                            <Badge className="bg-red-100 text-red-800 border-red-200">Sem sumário</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedAula(a)}
                                                title="Ver detalhes"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {(!a.sumario_codigo || a.estado_agendamento_aula === 1) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openSumarioModal(a)}
                                                    title={a.sumario_codigo ? "Editar sumário" : "Adicionar sumário"}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {a.sumario_codigo ? (
                                                        <FileText className="h-4 w-4" />
                                                    ) : (
                                                        <Plus className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Paginação */}
                    <div className="flex items-center justify-between p-4 border-t flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Itens por página:</span>
                            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">{totalItems} resultado(s)</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Modal de Detalhes */}
            <Dialog open={!!selectedAula} onOpenChange={() => setSelectedAula(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Aula Agendada</DialogTitle>
                    </DialogHeader>
                    {selectedAula && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-foreground">{selectedAula.codigo}</span>
                                <EstadoBadge estado={selectedAula.estado_agendamento_aula as EstadoAssiduidade} />
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">UC:</span>
                                    <p className="font-medium">{selectedAula.unidade_curricular}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Curso:</span>
                                    <p className="font-medium">{selectedAula.curso}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Docente:</span>
                                    <p className="font-medium">{selectedAula.docente}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Horário:</span>
                                    <p className="font-medium">{selectedAula.horario}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Sala:</span>
                                    <p className="font-medium">{selectedAula.sala}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Data:</span>
                                    <p className="font-medium">{selectedAula.data_aula}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Horário:</span>
                                    <p className="font-medium">
                                        {selectedAula.hora_inicio} - {selectedAula.hora_fim}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Dia da Semana:</span>
                                    <p className="font-medium">{selectedAula.dia_semana}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Criado em:</span>
                                    <p className="font-medium">{selectedAula.sumario_data_criacao}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Atualizado em:</span>
                                    <p className="font-medium">{selectedAula.sumario_data_atualizacao}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <span className="text-sm text-muted-foreground">Sumário:</span>
                                <p className="text-sm mt-1">
                                    {selectedAula.sumario_descricao || (
                                        <span className="italic text-muted-foreground">Sem sumário registado</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal de Sumário */}
            <Dialog
                open={!!sumarioModal}
                onOpenChange={() => {
                    setSumarioModal(null);
                    setSumarioText("");
                }}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{sumarioModal?.sumario_codigo ? "Editar Sumário" : "Adicionar Sumário"}</DialogTitle>
                    </DialogHeader>
                    {sumarioModal && (
                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                                <p>
                                    <span className="text-muted-foreground">Horário:</span>{" "}
                                    <span className="font-medium">{sumarioModal.horario}</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">UC:</span>{" "}
                                    <span className="font-medium">{sumarioModal.unidade_curricular}</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Data:</span>{" "}
                                    <span className="font-medium">
                                        {sumarioModal.data_aula} | {sumarioModal.hora_inicio} - {sumarioModal.hora_fim}
                                    </span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Docente:</span>{" "}
                                    <span className="font-medium">{sumarioModal.docente}</span>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sumario-text">Sumário da Aula</Label>
                                <Textarea
                                    id="sumario-text"
                                    placeholder="Descreva o conteúdo leccionado nesta aula..."
                                    value={sumarioText}
                                    onChange={(e) => setSumarioText(e.target.value)}
                                    rows={5}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setSumarioModal(null); setSumarioText(""); }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAddSumario(sumarioModal?.sumario_codigo)}>Guardar Sumário</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}