import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CalendarDays, X } from "lucide-react";
import { Label } from "@/components/ui/label";

import { AvaliableOperatorsSelect } from "@/components/common/global-selects/AvaliableOperators";
import { CaixaSelect } from "@/components/common/global-selects/CaixaSelect";

import { Card, CardContent } from "@/components/ui/card";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;

  operatorId: string;
  onOperatorChange: (v: string) => void;

  caixa: string;
  onCaixaChange: (v: string) => void;

  startDate: string;
  onStartDateChange: (v: string) => void;

  endDate: string;
  onEndDateChange: (v: string) => void;

  onClearFilters: () => void;

  singleOperator?: boolean;
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

  singleOperator = false,
}: Props) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div
          className={`grid gap-4 ${
            singleOperator ? "md:grid-cols-1" : "md:grid-cols-3"
          }`}
        >
          {!singleOperator && (
            <>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Pesquisa
                </Label>

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
              <AvaliableOperatorsSelect
                value={operatorId}
                onChangeValue={onOperatorChange}
                availability="all"
              />
            </>
          )}

          <CaixaSelect value={caixa} onChangeValue={onCaixaChange} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>

          <div>
            <Label>Data Final</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
