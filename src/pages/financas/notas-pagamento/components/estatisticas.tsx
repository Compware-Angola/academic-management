
import { ChartAreaInteractivePagamentos } from "./chart-area-interactive-pagamentos";

export function NotasPagamentoEstatisticas() {
    return (
        <div>

            <ChartAreaInteractivePagamentos
                chartConfig={{
                    qt_diurno: {
                        label: "Laboral",
                        color: "var(--chart-1)",
                    },
                    qt_noturno: {
                        label: "Pós-Laboral",
                        color: "var(--chart-2)",
                    },
                }}
                data={[
                    {
                        data: "02/09/2025",
                        qt_diurno: 16,
                        qt_noturno: 2,
                    },
                    {
                        data: "02/10/2025",
                        qt_diurno: 21,
                        qt_noturno: 2,
                    },
                    {
                        data: "03/09/2025",
                        qt_diurno: 126,
                        qt_noturno: 17,
                    },
                ]}
                isLoading={false}
                title="Estatísticas de Pagamentos"
                description="Pagamentos por data"
            />
        </div>
    );
}