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
import React from "react";

// ──────────────────────────────────────────────
// Tipos
export interface EntityHeader {
    logoSrc: string;
    name: string;
    decree?: string;
    address: string;
    addressLine2?: string;
    phone: string;
    nif: string;
}

export const defaultHeaderComprovativoPagamentoV2: EntityHeader = {
    logoSrc: "/logo_uma.png",
    name: "UNIVERSIDADE METODISTA DE ANGOLA",
    decree: "(Aprovado pelo Decreto nº 30/07 de 07/05)",
    address: "Rua Nossa Senhora da Muxima,",
    addressLine2: "Nº10, C.P.-6739-Luanda",
    phone: "947716113",
    nif: "5401150865",
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
    program: string;          // ex: "Mestrado" | "Licenciatura"
    documentType?: string;    // ex: "Comprovativo de Pagamento"
    totalInWords: string;
    totalValue: string;
    payments: PaymentRow[];
    city: string;
    issueDate: string;        // ex: "21 de abril de 2026"
    officer: string;          // ex: "Marisa Kassopa"
    department?: string;      // ex: "Central de Atendimento"
}

// ──────────────────────────────────────────────
// Estilos — fiéis ao PDF original
const S = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 11,
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 50,
        backgroundColor: "#fff",
        color: "#000",
    },

    // Logo alinhada à direita
    topBlock: {
        alignItems: "flex-end",
        marginBottom: 14,
    },
    logo: {
        width: 90,
        height: 52,
        marginBottom: 4,
    },

    // Nome da universidade centrado
    orgName: {
        textAlign: "center" as const,
        fontFamily: "Helvetica-Bold",
        fontSize: 12,
        marginTop: 6,
        marginBottom: 2,
    },
    decree: {
        textAlign: "center" as const,
        fontSize: 9.5,
        color: "#333",
        marginBottom: 14,
    },

    // Info à esquerda
    leftInfoBlock: {
        marginBottom: 20,
    },
    leftInfoBold: {
        fontFamily: "Helvetica-Bold",
        fontSize: 11,
        marginBottom: 4,
    },
    leftInfoLine: {
        fontSize: 11,
        marginBottom: 4,
        color: "#000",
    },

    // Parágrafo principal
    paragraph: {
        fontSize: 11,
        lineHeight: 1.55,
        marginBottom: 18,
        textAlign: "left" as const,
    },
    bold: {
        fontFamily: "Helvetica-Bold",
    },

    // Tabela sem cores — bordas simples
    tableContainer: {
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 22,
    },
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
    },
    tableTotalRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#000",
    },
    thCell: {
        padding: 5,
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        borderRightWidth: 1,
        borderRightColor: "#000",
        textAlign: "center" as const,
    },
    thCellLast: {
        padding: 5,
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        textAlign: "center" as const,
    },
    tdCell: {
        padding: 5,
        fontSize: 10,
        borderRightWidth: 1,
        borderRightColor: "#aaa",
    },
    tdCellCenter: {
        padding: 5,
        fontSize: 10,
        borderRightWidth: 1,
        borderRightColor: "#aaa",
        textAlign: "center" as const,
    },
    tdCellRight: {
        padding: 5,
        fontSize: 10,
        textAlign: "right" as const,
    },
    totalLabel: {
        padding: 5,
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        textAlign: "right" as const,
        borderRightWidth: 1,
        borderRightColor: "#000",
    },
    totalValue: {
        padding: 5,
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        textAlign: "right" as const,
    },

    // Declaração — negrito, justificada
    declaration: {
        fontFamily: "Helvetica-Bold",
        fontSize: 11,
        textAlign: "justify" as const,
        lineHeight: 1.55,
        marginBottom: 30,
    },

    // Assinatura — centrada
    signatureBlock: {
        alignItems: "center",
        marginBottom: 6,
    },
    signatureDept: {
        fontFamily: "Helvetica-Bold",
        fontSize: 11,
        textAlign: "center" as const,
        marginBottom: 4,
    },
    signatureDate: {
        fontSize: 11,
        textAlign: "center" as const,
        marginBottom: 30,
    },
    signatureRole: {
        fontSize: 11,
        textAlign: "center" as const,
        marginBottom: 20,
    },
    signatureLine: {
        width: 160,
        borderTopWidth: 1,
        borderTopColor: "#000",
        marginBottom: 4,
    },
    signatureName: {
        fontSize: 11,
        textAlign: "center" as const,
    },

    // Rodapé
    pageFooter: {
        position: "absolute",
        bottom: 28,
        left: 50,
        right: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerText: {
        fontSize: 9,
        color: "#444",
    },
});

// Larguras das colunas
const W = { date: "18%", desc: "46%", mode: "15%", value: "21%" };

// ──────────────────────────────────────────────
// Documento PDF
export function GenericComprovativoPagamentoPDF({
    header = defaultHeaderComprovativoPagamentoV2,
    data,
}: {
    header?: EntityHeader;
    data: ReceiptData;
}) {
    return (
        <Document>
            <Page size="A4" style={S.page} orientation="portrait">

                {/* ── TOPO: logo à direita ── */}
                <View style={S.topBlock}>
                    <Image style={S.logo} src={header.logoSrc} />
                    <Text style={S.orgName}>{header.name}</Text>
                    {header.decree && <Text style={S.decree}>{header.decree}</Text>}
                </View>

                {/* ── INFO À ESQUERDA ── */}
                <View style={S.leftInfoBlock}>
                    {data.documentType && (
                        <Text style={S.leftInfoBold}>{data.documentType}</Text>
                    )}
                    <Text style={S.leftInfoBold}>{data.program}</Text>
                    <Text style={S.leftInfoLine}>{header.address}</Text>
                    {header.addressLine2 && (
                        <Text style={S.leftInfoLine}>{header.addressLine2}</Text>
                    )}
                    <Text style={S.leftInfoLine}>Telefone: {header.phone}</Text>
                    <Text style={S.leftInfoLine}>NIF:{header.nif}</Text>
                </View>

                {/* ── PARÁGRAFO PRINCIPAL ── */}
                <Text style={S.paragraph}>
                    {"Recebi de "}
                    <Text style={S.bold}>{data.studentName}</Text>
                    {" BI "}
                    <Text style={S.bold}>{data.studentId}</Text>
                    {" curso de " + data.program + " de "}
                    <Text style={S.bold}>{data.course}</Text>
                    {" a quantia de "}
                    <Text style={S.bold}>{data.totalInWords}</Text>
                    {" referente a pagamento à " + header.name + " de:"}
                </Text>

                {/* ── TABELA ── */}
                <View style={S.tableContainer}>
                    <View style={S.tableHeaderRow}>
                        <Text style={[S.thCell, { width: W.date }]}>Data de Pag.</Text>
                        <Text style={[S.thCell, { width: W.desc }]}>Descrição</Text>
                        <Text style={[S.thCell, { width: W.mode }]}>{"Modo\nPag."}</Text>
                        <Text style={[S.thCellLast, { width: W.value }]}>Valor</Text>
                    </View>

                    {data.payments.map((row, i) => (
                        <View key={i} style={S.tableRow}>
                            <Text style={[S.tdCell, { width: W.date }]}>{row.date}</Text>
                            <Text style={[S.tdCell, { width: W.desc }]}>{row.description}</Text>
                            <Text style={[S.tdCellCenter, { width: W.mode }]}>{row.paymentMode}</Text>
                            <Text style={[S.tdCellRight, { width: W.value }]}>{row.value}</Text>
                        </View>
                    ))}

                    <View style={S.tableTotalRow}>
                        <Text style={[S.totalLabel, { width: "79%" }]}>Total</Text>
                        <Text style={[S.totalValue, { width: W.value }]}>{data.totalValue}</Text>
                    </View>
                </View>

                {/* ── DECLARAÇÃO ── */}
                <Text style={S.declaration}>
                    Declara-se, para os devidos efeitos, que o(a) aluno(a) se encontra
                    matriculado(a) nesta Universidade no curso supracitado.
                </Text>

                {/* ── ASSINATURA CENTRADA ── */}
                <View style={S.signatureBlock}>
                    {data.department && (
                        <Text style={S.signatureDept}>{data.department}</Text>
                    )}
                    <Text style={S.signatureDate}>
                        {data.city}, {data.issueDate}
                    </Text>
                    <Text style={S.signatureRole}>Funcionário</Text>
                    <View style={S.signatureLine} />
                    <Text style={S.signatureName}>({data.officer})</Text>
                </View>

                {/* ── RODAPÉ ── */}
                <View style={S.pageFooter} fixed>
                    <Text style={S.footerText}>Recibo nº{data.receiptNumber}</Text>
                    <Text style={S.footerText}>Pagina 1 de 1</Text>
                </View>
            </Page>
        </Document>
    );
}

// ──────────────────────────────────────────────
// Botões Download + Impressão
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

// ──────────────────────────────────────────────


export default PDFActions;