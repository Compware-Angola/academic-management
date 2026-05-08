import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotasPagamentoEstatisticas() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estatísticas de Pagamentos</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Visão geral e indicadores financeiros
                </p>
            </CardHeader>
            <CardContent>
                <div className="py-12 text-center">
                    <h3 className="text-lg font-medium">Em desenvolvimento</h3>
                    <p className="text-muted-foreground mt-2">
                        As estatísticas serão implementadas aqui.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}