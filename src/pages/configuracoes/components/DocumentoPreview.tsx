import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontSettings, Signature } from "@/lib/settingsApi";

interface Props {
    font: FontSettings;
    signature?: Signature | null;
    documentTitle?: string;
    compact?: boolean;
}

export function DocumentoPreview({ font, signature, documentTitle = "DECLARAÇÃO", compact }: Props) {
    const baseStyle = {
        fontFamily: font.fontFamily,
        color: font.color,
        lineHeight: font.lineHeight,
        fontWeight: Number(font.fontWeight),
    } as const;

    return (
        <Card className="sticky top-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Pré-visualização do documento</CardTitle>
                <CardDescription>Reflecte imediatamente as configurações seleccionadas.</CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    className="rounded-lg border bg-card p-6 shadow-sm"
                    style={baseStyle}
                >
                    <div className="border-b pb-3 text-center">
                        <p style={{ fontSize: font.subtitleSize, fontWeight: 600 }}>NOME DA ORGANIZAÇÃO</p>
                        <p style={{ fontSize: font.fontSize * 0.85, opacity: 0.7 }}>
                            Rua Principal, Luanda &middot; NIF 5000000000
                        </p>
                    </div>

                    <h2 className="mt-6 text-center uppercase tracking-wide" style={{ fontSize: font.titleSize, fontWeight: 700 }}>
                        {documentTitle}
                    </h2>

                    <h3 className="mt-5" style={{ fontSize: font.subtitleSize, fontWeight: 600 }}>
                        1. Identificação
                    </h3>
                    <p className="mt-1" style={{ fontSize: font.fontSize }}>
                        Este é um exemplo de texto que representa o conteúdo dos documentos gerados pelo sistema.
                    </p>

                    {!compact && (
                        <>
                            <h3 className="mt-4" style={{ fontSize: font.subtitleSize, fontWeight: 600 }}>
                                2. Objecto
                            </h3>
                            <p className="mt-1" style={{ fontSize: font.fontSize }}>
                                O presente documento é emitido para os devidos efeitos, com base nas configurações
                                globais definidas pela administração do sistema.
                            </p>
                        </>
                    )}

                    <div className="mt-10 flex flex-col items-center">
                        {signature?.imageUrl ? (
                            <img
                                src={signature.imageUrl}
                                alt={`Assinatura de ${signature.name}`}
                                className="h-16 object-contain"
                            />
                        ) : (
                            <div className="h-16" />
                        )}
                        <div className="w-64 border-t pt-1 text-center">
                            <p style={{ fontSize: font.fontSize, fontWeight: 600 }}>
                                {signature?.name ?? "—"}
                            </p>
                            <p style={{ fontSize: font.fontSize * 0.9, opacity: 0.75 }}>
                                {signature?.position ?? "Sem assinatura configurada"}
                            </p>
                        </div>
                    </div>

                    <div
                        className="mt-6 border-t pt-2 text-center"
                        style={{ fontSize: font.fontSize * 0.8, opacity: 0.65 }}
                    >
                        Documento gerado automaticamente pelo sistema &middot; Página 1 de 1
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}