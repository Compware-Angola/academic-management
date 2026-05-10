import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFDownloadLink,
    pdf,
} from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import React from "react";

// ──────────────────────────────────────────────
// Tipos
export interface EntityHeader {
    logoSrc: string;
    name: string;
    decree?: string;
    address: string;
    phone: string;
    nif: string;
    primaryColor?: string;
}

export const defaultHeaderComprovativoPagamento: EntityHeader = {
    logoSrc: "/logo_uma.png",
    name: "UNIVERSIDADE METODISTA DE ANGOLA",
    decree: "(Aprovado pelo Decreto nº 30/07 de 07/05)",
    address: "Rua Nossa Senhora da Muxima, Nº10, C.P.-6739-Luanda",
    phone: "947716113",
    nif: "5401150865",
    primaryColor: "#0D1B48",
};

export interface PaymentRow {
    date: string;
    description: string;
    paymentMode: string;
    value: string;
}

export interface ReceiptData {
    receiptNumber: string;
    studentName: string;
    studentId: string;
    course: string;
    program: string;         // e.g. "Licenciatura" | "Mestrado"
    totalInWords: string;
    totalValue: string;
    payments: PaymentRow[];
    city: string;
    issueDate: string;       // e.g. "21 de abril de 2026"
    officer: string;         // e.g. "Marisa Kassopa"
    department?: string;     // e.g. "Central de Atendimento"
    documentType?: string;   // e.g. "Comprovativo de Pagamento"
}

// ──────────────────────────────────────────────
// Estilos
const S = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        paddingTop: 36,
        paddingBottom: 60,
        paddingHorizontal: 45,
        backgroundColor: "#fff",
    },

    // Cabeçalho: logo esquerda, info direita
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 18,
        paddingBottom: 12,
        borderBottomWidth: 1.5,
        borderBottomColor: "#0D1B48",
    },
    logo: { width: 100, height: 52 },
    headerRight: { alignItems: "flex-end" },
    orgName: {
        fontSize: 13,
        fontFamily: "Helvetica-Bold",
        color: "#0D1B48",
        textAlign: "right",
    },
    orgDecree: { fontSize: 8, color: "#555", marginTop: 2, textAlign: "right" },
    orgDetail: { fontSize: 8.5, color: "#333", marginTop: 2, textAlign: "right" },

    // Título do documento
    docTitleBlock: {
        alignItems: "center",
        marginBottom: 14,
    },
    docTitle: {
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        color: "#0D1B48",
        textTransform: "uppercase" as const,
        letterSpacing: 1,
    },
    docSubtitle: {
        fontSize: 11,
        color: "#444",
        marginTop: 3,
    },

    // Parágrafo de recibo
    receiptParagraph: {
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 14,
        color: "#222",
    },
    bold: { fontFamily: "Helvetica-Bold" },

    // Tabela de pagamentos
    tableContainer: {
        borderWidth: 1,
        borderColor: "#b0b8c9",
        marginBottom: 14,
    },
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#0D1B48",
    },
    tableRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#d0d7e3",
    },
    tableRowAlt: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#d0d7e3",
        backgroundColor: "#f4f6fb",
    },
    tableHeaderCell: {
        padding: 6,
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: "#fff",
        borderRightWidth: 1,
        borderRightColor: "#2a3a6a",
    },
    tableCell: {
        padding: 6,
        fontSize: 9.5,
        color: "#222",
        borderRightWidth: 1,
        borderRightColor: "#d0d7e3",
    },
    tableCellLast: {
        padding: 6,
        fontSize: 9.5,
        color: "#222",
    },
    tableTotalRow: {
        flexDirection: "row",
        backgroundColor: "#e8ecf5",
        borderTopWidth: 1.5,
        borderTopColor: "#0D1B48",
    },
    tableTotalLabel: {
        padding: 6,
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#0D1B48",
    },
    tableTotalValue: {
        padding: 6,
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#0D1B48",
        textAlign: "right" as const,
    },

    // Declaração
    declarationBox: {
        marginTop: 10,
        marginBottom: 18,
        padding: 10,
        borderWidth: 1,
        borderColor: "#0D1B48",
        borderRadius: 4,
        backgroundColor: "#f0f3fa",
    },
    declarationText: {
        fontSize: 9.5,
        color: "#0D1B48",
        fontFamily: "Helvetica-Bold",
        textAlign: "center" as const,
        lineHeight: 1.5,
    },

    // Rodapé de assinatura
    signatureSection: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    signatureLeft: { fontSize: 9, color: "#333" },
    signatureRight: { alignItems: "center" },
    signatureLine: {
        width: 180,
        borderTopWidth: 1,
        borderTopColor: "#333",
        marginBottom: 4,
    },
    signatureName: {
        fontSize: 9,
        color: "#333",
        textAlign: "center" as const,
    },
    signatureDept: {
        fontSize: 8.5,
        color: "#666",
        textAlign: "center" as const,
        marginBottom: 8,
    },

    // Footer da página
    pageFooter: {
        position: "absolute",
        bottom: 24,
        left: 45,
        right: 45,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 0.5,
        borderTopColor: "#aaa",
        paddingTop: 5,
    },
    footerText: { fontSize: 8, color: "#888" },
});

// ──────────────────────────────────────────────
// Colunas da tabela (larguras em %)
const COL_DATE = "18%";
const COL_DESC = "42%";
const COL_MODE = "18%";
const COL_VALUE = "22%";

// ──────────────────────────────────────────────
// Componente principal do documento PDF
export function ReceiptPDFDocumentComprovativoPagamento({
    header = defaultHeaderComprovativoPagamento,
    data,
}: {
    header?: EntityHeader;
    data: ReceiptData;
}) {
    const color = header.primaryColor || "#0D1B48";

    return (
        <Document>
            <Page size="A4" style={S.page} orientation="portrait">

                {/* ── CABEÇALHO ── */}
                <View style={{ ...S.header, borderBottomColor: color }}>
                    <Image style={S.logo} src={header.logoSrc} />
                    <View style={S.headerRight}>
                        <Text style={{ ...S.orgName, color }}>{header.name}</Text>
                        {header.decree && (
                            <Text style={S.orgDecree}>{header.decree}</Text>
                        )}
                        <Text style={S.orgDetail}>{header.address}</Text>
                        <Text style={S.orgDetail}>Telefone: {header.phone}</Text>
                        <Text style={S.orgDetail}>NIF: {header.nif}</Text>
                    </View>
                </View>

                {/* ── TÍTULO ── */}
                <View style={S.docTitleBlock}>
                    <Text style={{ ...S.docTitle, color }}>
                        {data.documentType ?? "Comprovativo de Pagamento"}
                    </Text>
                    <Text style={S.docSubtitle}>{data.program}</Text>
                </View>

                {/* ── PARÁGRAFO PRINCIPAL ── */}
                <Text style={S.receiptParagraph}>
                    Recebi de{" "}
                    <Text style={S.bold}>{data.studentName}</Text>{" "}
                    BI{" "}
                    <Text style={S.bold}>{data.studentId}</Text>{" "}
                    curso de {data.program} de{" "}
                    <Text style={S.bold}>{data.course}</Text>{" "}
                    a quantia de{" "}
                    <Text style={S.bold}>{data.totalInWords}</Text>{" "}
                    referente a pagamento à{" "}
                    <Text style={S.bold}>{header.name}</Text>{" "}
                    de:
                </Text>

                {/* ── TABELA ── */}
                <View style={S.tableContainer}>
                    {/* Cabeçalho */}
                    <View style={S.tableHeaderRow}>
                        <Text style={[S.tableHeaderCell, { width: COL_DATE }]}>Data de Pag.</Text>
                        <Text style={[S.tableHeaderCell, { width: COL_DESC }]}>Descrição</Text>
                        <Text style={[S.tableHeaderCell, { width: COL_MODE }]}>Modo Pag.</Text>
                        <Text style={[S.tableHeaderCell, { width: COL_VALUE, borderRightWidth: 0 }]}>
                            Valor
                        </Text>
                    </View>

                    {/* Linhas */}
                    {data.payments.map((row, i) => {
                        const RowStyle = i % 2 === 0 ? S.tableRow : S.tableRowAlt;
                        return (
                            <View key={i} style={RowStyle}>
                                <Text style={[S.tableCell, { width: COL_DATE }]}>{row.date}</Text>
                                <Text style={[S.tableCell, { width: COL_DESC }]}>{row.description}</Text>
                                <Text style={[S.tableCell, { width: COL_MODE, textAlign: "center" as const }]}>
                                    {row.paymentMode}
                                </Text>
                                <Text
                                    style={[
                                        S.tableCellLast,
                                        { width: COL_VALUE, textAlign: "right" as const },
                                    ]}
                                >
                                    {row.value}
                                </Text>
                            </View>
                        );
                    })}

                    {/* Total */}
                    <View style={S.tableTotalRow}>
                        <Text style={[S.tableTotalLabel, { width: "78%" }]}>Total</Text>
                        <Text style={[S.tableTotalValue, { width: COL_VALUE }]}>
                            {data.totalValue}
                        </Text>
                    </View>
                </View>

                {/* ── DECLARAÇÃO ── */}
                <View style={S.declarationBox}>
                    <Text style={S.declarationText}>
                        Declara-se, para os devidos efeitos, que o(a) aluno(a) se encontra matriculado(a)
                        nesta Universidade no curso supracitado.
                    </Text>
                </View>

                {/* ── ASSINATURA ── */}
                <View style={S.signatureSection}>
                    <View style={S.signatureLeft}>
                        {data.department && (
                            <Text style={{ marginBottom: 4, fontFamily: "Helvetica-Bold" }}>
                                {data.department}
                            </Text>
                        )}
                        <Text>
                            {data.city}, {data.issueDate}
                        </Text>
                        <Text style={{ marginTop: 4, color: "#666" }}>Funcionário</Text>
                    </View>

                    <View style={S.signatureRight}>
                        <View style={S.signatureLine} />
                        <Text style={S.signatureName}>({data.officer})</Text>
                    </View>
                </View>

                {/* ── RODAPÉ DA PÁGINA ── */}
                <View style={S.pageFooter} fixed>
                    <Text style={S.footerText}>
                        Recibo nº{data.receiptNumber}
                    </Text>
                    <Text style={S.footerText}>
                        Emitido em{" "}
                        {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                    </Text>
                    <Text style={S.footerText}>Página 1 de 1</Text>
                </View>
            </Page>
        </Document>
    );
}

// ──────────────────────────────────────────────
// Acções: Download + Impressão
interface PDFActionsProps {
    document: React.ReactElement;
    fileName: string;
    showDownload?: boolean;
    showPrint?: boolean;
}

export function PDFActions({
    document,
    fileName,
    showDownload = true,
    showPrint = true,
}: PDFActionsProps) {
    const handlePrint = async () => {
        try {
            const blob = await pdf(document).toBlob();
            const url = URL.createObjectURL(blob);
            const win = window.open(url);
            if (win) {
                win.focus();
                win.print();
            }
        } catch (err) {
            console.error("Erro ao preparar PDF:", err);
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {showDownload && (
                <PDFDownloadLink document={document} fileName={fileName}>
                    {({ loading }) => (
                        <Button disabled={loading} variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            {loading ? "A gerar..." : "Exportar PDF"}
                        </Button>
                    )}
                </PDFDownloadLink>
            )}

            {showPrint && (
                <Button variant="outline" onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                </Button>
            )}
        </div>
    );
}



export default PDFActions;