import * as React from "react";
import { FormaPagamentoSelect } from "@/components/common/global-selects/TipoPagamentoSelect";
import { useQueryPaymentMonthlySummary } from "@/hooks/statics";
import { parseFilter } from "@/util/parse-filter";
import { PaymentStatsCard } from "./payment-stats-card";
import { formatMonthYear, MonthYearPicker } from "./month-year-picker";

export function PaymentMonthlyStatsCard() {
  const [formaPagamento, setFormaPagamento] = React.useState("");
  const [date, setDate] = React.useState<Date>(new Date());

  const {
    data: dataStatics,
    isLoading: isLoadingStatics,
    isError: isErrorStatics,
    error: errorStatics,
  } = useQueryPaymentMonthlySummary({
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    formaPagamento: parseFilter(formaPagamento),
  });

  return (
    <PaymentStatsCard
      title="Pagamentos Mensais"
      description={`Total arrecadado em ${formatMonthYear(date)}`}
      headerControls={
        <>
          <FormaPagamentoSelect
            allOption
            value={formaPagamento}
            onChangeValue={setFormaPagamento}
            allowAll
          />
          <MonthYearPicker date={date} onChange={setDate} />
        </>
      }
      data={dataStatics}
      isLoading={isLoadingStatics}
      isError={isErrorStatics}
      error={errorStatics}
    />
  );
}
