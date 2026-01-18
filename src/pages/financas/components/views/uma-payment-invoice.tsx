// src/components/finance/PaymentNotePDF.tsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
  pdf,
} from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Factura, FacturaItem } from '@/services/finance/listar-facturas.service'


const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#d32f2f',
    paddingBottom: 8,
    marginBottom: 15,
  },
  logo: { width: 110, height: 60 },
  companyInfo: { textAlign: 'right' },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d1b48',
  },
  companyDetails: {
    fontSize: 9,
    color: '#444',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginVertical: 10,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#222',
  },
  value: {
    color: '#333',
  },
  paymentBox: {
    borderWidth: 1.5,
    borderColor: '#0d1b48',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f8f9fb',
    marginBottom: 15,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0d1b48',
    marginBottom: 6,
    textAlign: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 11,
    color: '#111',
    fontWeight: 'bold',
  },
  table: {
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: 'row' },
  tableHeader: {
    backgroundColor: '#0d1b48',
    color: 'white',
    fontWeight: 'bold',
  },
  tableCellHeader: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    fontSize: 10,
    textAlign: 'center',
  },
  tableCell: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    fontSize: 10,
  },
  totalSection: {
    marginTop: 15,
    padding: 10,
    borderTopWidth: 2,
    borderColor: '#d32f2f',
    textAlign: 'right',
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d1b48',
    marginTop: 6,
  },
  nonFiscalBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#b71c1c',
    borderRadius: 6,
    backgroundColor: '#fdf3f4',
  },
  nonFiscalTitle: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nonFiscalText: {
    fontSize: 9,
    textAlign: 'center',
    color: '#444',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: 'center',
    color: '#777',
  },
})

interface PaymentNotePDFProps {
  nota: Factura
  itens: FacturaItem[]
  showDownloadButton?: boolean
  showPrintButton?: boolean
}

function PaymentNoteDocument({ nota, itens }: PaymentNotePDFProps 
) {
  const statusText =
    nota.estado === 0
      ? 'Pendente'
      : nota.estado === 1
      ? 'Pago'
      : nota.estado === 2
      ? 'Parcelado'
      : 'Anulado'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logo_uma.png" /> {/* ajuste o caminho da logo */}

          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Universidade Metodista de Angola</Text>
            <Text style={styles.companyDetails}>Luanda - Angola</Text>
            <Text style={styles.companyDetails}>
              Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi
            </Text>
            <Text style={styles.companyDetails}>NIF: 5401150865</Text>
            <Text style={styles.companyDetails}>
              Tel: +244 912 131 138 | +244 947 716 133
            </Text>
            <Text style={styles.companyDetails}>Email: geral@uma.co.ao</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Nota de Pagamento</Text>

        {/* Informações principais */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Referência:</Text> {nota.referencia || nota.codigo}
            </Text>
            <Text>
              <Text style={styles.label}>Estado:</Text> {statusText}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Data de Emissão:</Text>{' '}
              {format(new Date(nota.data_factura), 'dd/MM/yyyy', { locale: pt })}
            </Text>
        
          </View>

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.label}>Ano Lectivo:</Text> {nota.ano_lectivo || '—'}
            </Text>
            <Text>
              <Text style={styles.label}>Curso:</Text> {nota.curso || '—'}
            </Text>
          </View>
        </View>

        {/* Dados do Estudante */}
        <View style={styles.section}>
          <Text style={{ ...styles.label, fontSize: 12, marginBottom: 6 }}>
            Dados do Estudante
          </Text>
          <Text>Nome: {nota.nome_aluno}</Text>
          <Text>Matrícula: {nota.codigo_matricula}</Text>
        </View>

      

        {/* Tabela de itens */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellHeader, { width: '55%' }]}>Descrição</Text>
            <Text style={[styles.tableCellHeader, { width: '15%' }]}>Qtd</Text>
            <Text style={[styles.tableCellHeader, { width: '15%' }]}>Unitário</Text>
            <Text style={[styles.tableCellHeader, { width: '15%' }]}>Total</Text>
          </View>

          {itens.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, { width: '55%' }]}>
                {item.obs || item.descricaoservico || '—'}
              </Text>
              <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>
                {item.quantidade ?? 1}
              </Text>
           
              <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>
                {item.preco?.toFixed(2) || '—'}
              </Text>
                <Text style={[styles.tableCell, { width: '15%', textAlign: 'right' }]}>
                {item.total?.toFixed(2) || '—'}
              </Text>
            </View>
          ))}
        </View>

        {/* Totais */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            Total: {nota.total_preco.toFixed(2)} Kz
          </Text>
        </View>

        {/* Não fiscal */}
        <View style={styles.nonFiscalBox}>
          <Text style={styles.nonFiscalTitle}>Documento Não Fiscal</Text>
          <Text style={styles.nonFiscalText}>
            Este documento serve apenas como comprovativo informativo. Não possui validade fiscal.
          </Text>
        </View>

        {/* Rodapé */}
        <Text style={styles.footer}>
          Documento emitido automaticamente — Universidade Metodista de Angola ©{' '}
          {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  )
}

export function PaymentNoteActions({
  nota,
  itens,
  showDownload = true,
  showPrint = true,
}: {
  nota: Factura
  itens: FacturaItem[]
  showDownload?: boolean
  showPrint?: boolean
}) {
  const document = <PaymentNoteDocument nota={nota} itens={itens} />

  const handlePrint = async () => {
    try {
      const blob = await pdf(document).toBlob()
      const url = URL.createObjectURL(blob)
      const win = window.open(url)
      if (win) {
        win.focus()
        win.print()
      }
    } catch (err) {
      console.error('Erro ao gerar PDF para impressão:', err)
      // Aqui podes mostrar um toast de erro se tiveres um sistema de notificações
    }
  }

  return (
    <div className="flex items-center gap-2">
      {showDownload && (
        <PDFDownloadLink
          document={document}
          fileName={`Nota_Pagamento_${nota.referencia || nota.codigo}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {loading ? 'A gerar...' : 'Exportar PDF'}
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
  )
}