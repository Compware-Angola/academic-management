import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Save,
    RefreshCw,

} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";


import { useQueryAcademicYearParams } from "@/hooks/academiccalendar/use-query-academic-years-params";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { useQueryAcademicYearVacancies } from "@/hooks/academiccalendar/use-query-academic-year-vacancies";
import { useQueryAcademicYearMonthlyFees } from "@/hooks/academiccalendar/use-query-academic-year-monthly-fees";
import { formatarData } from "@/util/date-formate";
import { useMutationUpdateAcademicYearState } from "@/hooks/academiccalendar/useMutation-update-academic-year-state";
import { Vacancy } from "@/services/academiccalendar/fetch-vacancies-per-course";
import { PeriodosLetivosCard } from "./periodos-letivos-card";
import { VacanciesTableCard } from "./vacancies-Card";
import { MonthlyFeesTableCard } from "./monthly-fees-table-card";
import { ParametersModal } from "./modals/parameters-modal";
import { EditVagaModal } from "./modals/EditVagaModal";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";

const TIPO_CANDIDATURA_LICENCIATURA = 1

export function Licenciatura() {
    const { toast } = useToast();
    const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState<string>("");
    const [tipoCandidaturaSelecionado, setTipoCandidaturaSelecionado] =
        useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPageMonthly, setCurrentPageMonthly] = useState(1);
    const [itemsPerPageMonthly, setItemsPerPageMonthly] = useState(6);
    const [openModal, setOpenModal] = useState(false);
    const [vagaSelecionada, setVagaSelecionada] = useState<{
        id: number;
        numeroVagas: number;
    } | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const updateEstadoMutation = useMutationUpdateAcademicYearState();


    const selectedCodigo = useMemo(() => {
        if (!anoLetivoSelecionado) return undefined;
        const codigo = Number(anoLetivoSelecionado);
        return Number.isNaN(codigo) ? undefined : codigo;
    }, [anoLetivoSelecionado]);

    // Parâmetros do ano selecionado
    const {
        academicYearParams: currentYearParams,
        isLoading: isLoadingParams,
        isFetching: isFetchingParams,
    } = useQueryAcademicYearParams(selectedCodigo, {
        enabled: !!selectedCodigo,
    });
    const {
        monthlyFees,
        isLoading: isLoadingMonthlyFees,
        isFetching: isFetchingMonthlyFees,
    } = useQueryAcademicYearMonthlyFees({
        codigoAno: selectedCodigo,
        enabled: !!selectedCodigo,
    });

    // Vagas
    const tipoCandidaturaId = Number(tipoCandidaturaSelecionado);
    const {
        vacancies = [],
        isLoading: isLoadingVacancies,
        isFetching: isFetchingVacancies,
    } = useQueryAcademicYearVacancies({
        codigoAno: selectedCodigo,
        tipoCandidatura: tipoCandidaturaId,
        enabled: !!selectedCodigo && !!tipoCandidaturaId,
    });
    const handleEditVaga = (vaga: Vacancy) => {
        setVagaSelecionada({
            id: vaga.codigo,
            numeroVagas: vaga.numeroVagas,
        });

        setOpenModal(true);
    };

    // Resetar página ao mudar filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCodigo, tipoCandidaturaSelecionado]);

    // Paginação das vagas
    const filteredVacancies = vacancies;
    const totalPages = Math.ceil(filteredVacancies.length / itemsPerPage);
    const paginatedVacancies = filteredVacancies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    // Paginação das mensalidades
    const totalPagesMonthly = Math.ceil(monthlyFees.length / itemsPerPageMonthly);
    const paginatedMonthlyFees = monthlyFees.slice(
        (currentPageMonthly - 1) * itemsPerPageMonthly,
        currentPageMonthly * itemsPerPageMonthly
    );


    useEffect(() => {
        setCurrentPageMonthly(1);
    }, [selectedCodigo]);


    const calcularDias = (inicio: string, fim: string) => {
        const diff = new Date(fim).getTime() - new Date(inicio).getTime();
        return Math.round(diff / (1000 * 60 * 60 * 24));
    };
    const handleToggleEstado = (ativo: boolean) => {
        if (!selectedCodigo) {
            toast({
                title: "Erro",
                description: "Selecione o ano letivo",
                variant: "destructive",
            });
            return;
        }

        // Atualiza o backend
        updateEstadoMutation.mutate({
            codigoAno: selectedCodigo,
            estado: ativo ? 1 : 0,
        });
    };

    const tipoCandidaturaNome = "Licenciatura"



    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex justify-between gap-4">
                <div className="space-y-2 min-w-44">
                    <AcademicYearsAvailableForOperationSelect
                        value={anoLetivoSelecionado}
                        onChangeValue={setAnoLetivoSelecionado}
                        tipoCandidaturaId={TIPO_CANDIDATURA_LICENCIATURA}
                        enableDefaultActiveYear
                        label="Ano Letivo"
                        onlyConfigurable={false}
                    />
                </div>
                <Button
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    disabled={!currentYearParams}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Novo Parâmetro
                </Button>
            </div>
            {currentYearParams && (
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">
                        {tipoCandidaturaNome} — {currentYearParams.designacao}
                    </h2>
                    <p className="text-muted-foreground text-lg mt-2">
                        Parâmetros académicos e financeiros do ano letivo
                    </p>
                </div>
            )}
            <Tabs defaultValue="anoLetivo" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="anoLetivo">Calendário Académico</TabsTrigger>
                    <TabsTrigger value="vagas">Vagas por Curso</TabsTrigger>
                    <TabsTrigger value="mensalidade">Mensalidades</TabsTrigger>
                </TabsList>


                <TabsContent value="anoLetivo" className="mt-6 relative">
                    <PeriodosLetivosCard
                        data={currentYearParams}
                        loading={isLoadingParams || isFetchingParams}
                        updating={updateEstadoMutation.isPending}
                        onToggleEstado={handleToggleEstado}
                        formatarData={formatarData}
                        calcularDias={calcularDias}
                    />

                    {isFetchingParams && !isLoadingParams && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                </TabsContent>


                <TabsContent value="vagas" className="mt-6">
                    <VacanciesTableCard
                        vacancies={vacancies}
                        paginatedVacancies={paginatedVacancies}
                        filteredVacancies={filteredVacancies}
                        loading={isLoadingVacancies || isFetchingVacancies}
                        tipoCandidaturaNome={tipoCandidaturaNome}
                        anoLetivo={currentYearParams?.designacao}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onEdit={handleEditVaga}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </TabsContent>
                <TabsContent value="mensalidade" className="mt-6">
                    <MonthlyFeesTableCard
                        yearLabel={currentYearParams?.designacao}
                        monthlyFees={monthlyFees}
                        paginatedMonthlyFees={paginatedMonthlyFees}
                        isLoading={isLoadingMonthlyFees}
                        isFetching={isFetchingMonthlyFees}
                        itemsPerPage={itemsPerPageMonthly}
                        setItemsPerPage={setItemsPerPageMonthly}
                        currentPage={currentPageMonthly}
                        setCurrentPage={setCurrentPageMonthly}
                        totalPages={totalPagesMonthly}
                        formatarData={formatarData}
                    />
                </TabsContent>
            </Tabs>
            <ParametersModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                anoLetivo={currentYearParams?.designacao || ""}
                tipo_candidatura={TIPO_CANDIDATURA_LICENCIATURA}
            />
            {vagaSelecionada && (
                <EditVagaModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    idVaga={vagaSelecionada.id}
                    numeroVagasAtual={vagaSelecionada.numeroVagas}
                />
            )}
        </div>
    );
}
