import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";

import { AvaliableOperatorsSelect } from "@/components/common/global-selects/AvaliableOperators";
import { CaixaSelect } from "@/components/common/global-selects/CaixaSelect";
import { FormaPagamentoSelect } from "@/components/common/global-selects/TipoPagamentoSelect";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;

  tipoPagamento?: string;
  onTipoPagamentoChange?: (v: string) => void;

  operatorId: string;
  onOperatorChange: (v: string) => void;

  caixa: string;
  onCaixaChange: (v: string) => void;

  startDate: string;
  onStartDateChange: (v: string) => void;

  endDate: string;
  onEndDateChange: (v: string) => void;

  onClearFilters: () => void;
  onRefresh: () => void;

  isRefreshing?: boolean;
};

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
  onRefresh,

  tipoPagamento,
  onTipoPagamentoChange,

  isRefreshing = false,
}: Props) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">

        {/* ================= GRID PRINCIPAL ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* SEARCH */}
          <div className="space-y-2">
            <Label>Pesquisa</Label>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Pesquisar..."
                className="pl-9"
              />
            </div>
          </div>

          {/* OPERATOR */}
          <AvaliableOperatorsSelect
            value={operatorId}
            onChangeValue={onOperatorChange}
            availability="all"
          />

          {/* CAIXA */}
          <CaixaSelect
            value={caixa}
            onChangeValue={onCaixaChange}
            allowAll
          />

          {/* FORMA PAGAMENTO */}
          {onTipoPagamentoChange && (
            <FormaPagamentoSelect
              value={tipoPagamento ?? ""}
              onChangeValue={onTipoPagamentoChange}
              allowAll
            />
          )}

          <div className="space-y-1">
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Data Final</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>


        </div>



        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-2">

          <Button variant="outline" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>

          <Button variant="default" onClick={onRefresh}>
            <RefreshCw
              className={cn(
                "w-4 h-4 mr-2",
                isRefreshing ? "animate-spin" : ""
              )}
            />
            Atualizar
          </Button>

        </div>

      </CardContent>
    </Card>
  );
};