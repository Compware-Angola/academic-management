
import { ChartAreaInteractivePagamentos } from "./chart-area-interactive-pagamentos";

export function NotasPagamentoEstatisticas() {
    return (
        <div>

            <ChartAreaInteractivePagamentos
                chartConfig={{
                    deposito: {
                        label: "Depósito",
                        color: "var(--chart-1)",
                    },
                    transferencia: {
                        label: "Transferência",
                        color: "var(--chart-2)",
                    },
                    multicaixa: {
                        label: "Multicaixa",
                        color: "var(--chart-3)",
                    },
                    numerario: {
                        label: "Numerário",
                        color: "var(--chart-4)",
                    },
                }}
                data={[
                    {
                        data: "27/01/2020",
                        deposito: 8,
                        transferencia: 0,
                        multicaixa: 0,
                        numerario: 0,
                    },

                    {
                        data: "28/01/2020",
                        deposito: 8,
                        transferencia: 0,
                        multicaixa: 0,
                        numerario: 0,
                    },

                    {
                        data: "29/01/2020",
                        deposito: 8,
                        transferencia: 1,
                        multicaixa: 2,
                        numerario: 5,
                    },
                ]}
                isLoading={false}
                title="Estatísticas de Pagamentos"
                description="Pagamentos agrupados por forma de pagamento"
            />
        </div>
    );
}