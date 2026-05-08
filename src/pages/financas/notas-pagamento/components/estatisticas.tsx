import { useQueryEstatisticasPagamento } from "@/hooks/financa/use-estatisticas-pagamento";
import { ChartAreaInteractivePagamentos } from "./chart-area-interactive-pagamentos";

import { useMemo } from "react";

export function NotasPagamentoEstatisticas() {
  const { data, isLoading } = useQueryEstatisticasPagamento({
    dataInicio: "2025-01-01",
    dataFim: "2025-03-01",
  });

  // Extrair dinamicamente todas as chaves que não são 'data' dos objetos
  const chartLabels = useMemo(() => {
    if (!data?.data?.length) return [];

    // Coletar todas as chaves únicas que não são 'data' ou números
    const allKeys = new Set<string>();
    data.data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "data" && isNaN(Number(key))) {
          allKeys.add(key);
        }
      });
    });

    return Array.from(allKeys);
  }, [data]);

  // Construir dinamicamente o chartConfig baseado nos labels encontrados
  const chartConfig = useMemo(() => {
    const cores = [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
    ];

    const config: Record<string, { label: string; color: string }> = {};

    chartLabels.forEach((label, index) => {
      // Formatar o label para exibição (capitalizar e substituir hífen)
      const formattedLabel = label
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      config[label] = {
        label: formattedLabel,
        color: cores[index % cores.length],
      };
    });

    return config;
  }, [chartLabels]);

  // Filtrar os dados para incluir apenas as propriedades que estão no chartConfig
  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((item) => {
      const filtered: Record<string, any> = { data: item.data };
      
      chartLabels.forEach((label) => {
        if (item[label] !== undefined) {
          filtered[label] = item[label];
        }
      });

      return filtered;
    });
  }, [data, chartLabels]);

console.log(chartConfig)

  return (
    <div>
      <ChartAreaInteractivePagamentos
        chartConfig={chartConfig}
        data={filteredData}
        isLoading={isLoading}
        title="Estatísticas de Pagamentos"
        description="Pagamentos agrupados por forma de pagamento"
      />
    </div>
  );
}