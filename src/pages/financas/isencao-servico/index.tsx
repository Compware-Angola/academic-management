import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {Link} from "react-router-dom";
import {Home, Plus, RefreshCw} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import { useState } from "react";
import {useQueryFetchIsencaoServico} from "@/hooks/financas/isencao-servico/use-query-isencao-sevico.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {formatarData} from "@/util/date-formate.ts";
import {
    CreateIsencaoServicoDialog,
    CreateIsencaoServicoFormData
} from "@/pages/financas/isencao-servico/CreateIsencaoServicoDialog.tsx";
import {useMutationCreateIsencaoServico} from "@/hooks/financas/isencao-servico/use-mutation-create-isencao-servico.ts";

export default function IsencaoServico() {
    const [matriculaInput, setMatriculaInput] = useState("");
    const [filters, setFilters] = useState({
        matricula: null,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, refetch, isFetching } = useQueryFetchIsencaoServico(
        {
            codigoMatricula: filters.matricula ? Number(filters.matricula) : undefined,
            page,
            limit,
        },
    );

    const items = data?.data ?? [];

    const [formData, setFormData] = useState<CreateIsencaoServicoFormData>({
        codigoServico: "",
        codigoMatricula: "",
        codigoAnoLectivo: "",
        dataIsencao: "",
    });

    const { mutateAsync, isPending } = useMutationCreateIsencaoServico();

    const handleSubmit = async () => {
        await mutateAsync({
            codigoMatricula: Number(formData.codigoMatricula),
            codigoServico: Number(formData.codigoServico),
            codigoAnoLectivo: Number(formData.codigoAnoLectivo),
            dataIsencao: formData.dataIsencao,
        });
        setIsModalOpen(false);
        setFormData({
            codigoServico: "",
            codigoMatricula: "",
            codigoAnoLectivo: "",
            dataIsencao: "",
        });
        await refetch();
    }

    const handleSearch = () => {
        setFilters({
            matricula: matriculaInput,
        });
        setPage(1);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/">
                                        <Home className="h-4 w-4" />
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Finanças</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Isenção de serviços</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-bold tracking-tight">
                        Isenção de serviços
                    </h1>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filtros de Pesquisa</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <Label>Matricula</Label>
                            <Input
                                placeholder="Ex: 12345"
                                value={matriculaInput}
                                onChange={(e) => setMatriculaInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleSearch} disabled={isFetching}>
                                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
                                Pesquisar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Isentar serviço
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Isenções de serviço</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Matricula</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Bilhete</TableHead>
                                <TableHead>Curso</TableHead>
                                <TableHead>Grau Academico</TableHead>
                                <TableHead>Serviço</TableHead>
                                <TableHead>Ano Lectivo</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Data de Isenção</TableHead>
                            </TableRow>
                        </TableHeader>
                                <TableBody>
                                    {(isFetching && items.length === 0) ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10">
                                                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                                Carregando...
                                            </TableCell>
                                        </TableRow>
                                    ) : items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">
                                                Nenhum registro encontrado
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.map((item) => (
                                            <TableRow key={item.codigo}>
                                                <TableCell>{item.codigo_matricula ?? "-"}</TableCell>
                                                <TableCell>{item.nome_completo ?? "-"}</TableCell>
                                                <TableCell>{item.bilhete_identidade ?? "-"}</TableCell>
                                                <TableCell>{item.curso ?? "-"}</TableCell>
                                                <TableCell>{item.grau_academico ?? "-"}</TableCell>
                                                <TableCell>{item.servico ?? "-"}</TableCell>
                                                <TableCell>{item.ano_lectivo ?? "-"}</TableCell>
                                                <TableCell>{item.estado_isensao ?? "-"}</TableCell>
                                                <TableCell>{item.data_isencao ? formatarData(item.data_isencao) : "-"}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                    </Table>

                    <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                            A mostrar {items.length} de {data?.total ?? 0} registos
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                disabled={page === 1 || isFetching}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Anterior
                            </Button>
                            <span>
                                Página {data?.page ?? 1} de {data?.totalPages ?? 1}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page >= (data?.totalPages ?? 1) || isFetching}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Próxima
                            </Button>

                            <Select
                                value={String(limit)}
                                onValueChange={(v) => {
                                    setLimit(Number(v));
                                    setPage(1);
                                }}
                            >
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
                        </div>
                    </div>

                </CardContent>
            </Card>

            <CreateIsencaoServicoDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                formData={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                isSubmitting={isPending}
            />
        </div>
    );
}