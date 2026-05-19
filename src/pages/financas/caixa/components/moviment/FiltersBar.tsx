
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    CalendarDays,
    X,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { AvaliableOperatorsSelect } from "@/components/common/global-selects/AvaliableOperators";
import { CaixaSelect } from "@/components/common/global-selects/CaixaSelect";
import { Card, CardContent } from "@/components/ui/card";

export const FiltersBar = ({
    search,
    onSearchChange,
    operatorId,
    onOperatorChange,
    caixa,
    onCaixaChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    onClearFilters,
}: {
    search: string;
    onSearchChange: (value: string) => void;
    operatorId: string;
    onOperatorChange: (value: string) => void;
    caixa: string;
    onCaixaChange: (value: string) => void;
    startDate: string;
    onStartDateChange: (value: string) => void;
    endDate: string;
    onEndDateChange: (value: string) => void;
    onClearFilters: () => void;
}) => {
    const hasActiveFilters = search || operatorId || caixa || startDate || endDate;

    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Pesquisar por caixa ou operador..."
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <AvaliableOperatorsSelect
                            onChangeValue={onOperatorChange}
                            availability="all"
                            value={operatorId}
                        />

                        <CaixaSelect onChangeValue={onCaixaChange} value={caixa} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                Data Inicial
                            </Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => onStartDateChange(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                Data Final
                            </Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => onEndDateChange(e.target.value)}
                                min={startDate || undefined}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        type="button"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Limpar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


















