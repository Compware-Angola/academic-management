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
import { FileText, Loader2, Printer } from 'lucide-react'
import { useMemo } from 'react'

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
    color: '#0D1B48',
  },
  companyDetails: {
    fontSize: 9,
    color: '#444',
    marginTop: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b71c1c',
    marginVertical: 12,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    color: '#222',
    width: 80,
    //display: 'inline',
  },
  value: {
    color: '#333',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#0D1B48',
    color: 'white',
    fontWeight: 'bold',
  },
  tableCellHeader: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 10.5,
    textAlign: 'center',
  },
  tableCell: {
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 10.5,
  },
  signatureCell: {
    height: 30,
    minHeight: 30,
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

export type Estudante = {
  id: string | number
  nome: string
  numeroProcesso?: string
  curso: string
  ano?: string
  turma?: string
  contacto?: string
}

type Props = {
  estudantes: Estudante[]
  titulo?: string
}

function ListaEstudantesDocument({ estudantes, titulo = 'Lista de Presença' }: Props) {
  const uniqueCursos = [...new Set(estudantes.map(e => e.curso?.trim()))]
  const uniqueAnos = [...new Set(estudantes.map(e => e.ano?.trim()).filter(Boolean))]
  const uniqueTurmas = [...new Set(estudantes.map(e => e.turma?.trim()).filter(Boolean))]

  const curso = uniqueCursos.length === 1 ? uniqueCursos[0] : 'Vários Cursos'
  const ano = uniqueAnos.length === 1 ? uniqueAnos[0] : 'Vários Anos'
  const turma = uniqueTurmas.length === 1 ? uniqueTurmas[0] : 'Várias Turmas'

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logo_uma.png" />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              Universidade Metodista de Angola
            </Text>
            <Text style={styles.companyDetails}>
              Rua Nossa Senhora da Muxima Nº 10, Bairro Kinaxixi, Luanda
            </Text>
            <Text style={styles.companyDetails}>NIF: 5401150865</Text>
            <Text style={styles.companyDetails}>
              Tel: +244 912 131 138 | Email: geral@uma.co.ao
            </Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>{titulo}</Text>

        {/* Informações do grupo - uma por linha */}
<View style={styles.section}>
  <View style={styles.infoItem}>
    <Text>
      <Text style={styles.label}>Curso: </Text>
      <Text style={styles.value}>{curso}</Text>
    </Text>
  </View>
  <View style={styles.infoItem}>
    <Text>
      <Text style={styles.label}>Ano: </Text>
      <Text style={styles.value}>{ano}</Text>
    </Text>
  </View>
  <View style={styles.infoItem}>
    <Text>
      <Text style={styles.label}>Turma: </Text>
      <Text style={styles.value}>{turma}</Text>
    </Text>
  </View>
</View>

        {/* Tabela compacta */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellHeader, { width: '8%' }]}>Nº</Text>
            <Text style={[styles.tableCellHeader, { width: '22%' }]}>
              Nº Processo
            </Text>
            <Text style={[styles.tableCellHeader, { width: '50%' }]}>
              Nome Completo
            </Text>
            <Text style={[styles.tableCellHeader, { width: '20%' }]}>
              Assinatura
            </Text>
          </View>

          {estudantes.map((estudante, index) => (
            <View key={estudante.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '8%', textAlign: 'center' }]}>
                {index + 1}
              </Text>
              <Text style={[styles.tableCell, { width: '22%' }]}>
                {estudante.numeroProcesso || '-'}
              </Text>
              <Text style={[styles.tableCell, { width: '50%' }]}>
                {estudante.nome}
              </Text>
              <View
                style={[
                  styles.tableCell,
                  styles.signatureCell,
                  { width: '20%' },
                ]}
              />
            </View>
          ))}
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

export function ListaEstudantesPDF({
  estudantes,
  titulo = 'Lista de Presença',
  showDownloadButton = true,
  showPrintButton = true,
}: {
  estudantes: Estudante[]
  titulo?: string
  showDownloadButton?: boolean
  showPrintButton?: boolean
}) {
  const document = useMemo(
    () => <ListaEstudantesDocument estudantes={estudantes} titulo={titulo} />,
    [estudantes, titulo],
  )

  const handlePrint = async () => {
    try {
      const blob = await pdf(document).toBlob()
      const url = URL.createObjectURL(blob)
      const printWindow = window.open(url)
      if (printWindow) {
        printWindow.focus()
        printWindow.print()
      }
    } catch (error) {
      console.error('Erro ao imprimir PDF', error)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {showDownloadButton && (
        <PDFDownloadLink
          document={document}
          fileName={`lista_${titulo.replace(/\s+/g, '_')}_UMA.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A gerar...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Descarregar PDF
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      )}

      {showPrintButton && (
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}