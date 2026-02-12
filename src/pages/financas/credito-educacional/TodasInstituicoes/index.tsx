import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";


import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Home, Plus, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Instituicao } from "@/services/financas/instituicao/fetch-instituicao.service";
import { useQueryFetchInstituicao } from "@/hooks/financas/instituicao/use-query-fetch-instituicao";
import { useDebounce } from "@/hooks/use-debounce";
import { FormData, InstituitionModal } from "./components/InstituitionModal";

export default function TodasInstituicoes() {
  const [selectedInstituicao, setSelectedInstituicao] =
    useState<Instituicao | null>(null);

  const [instituicaoInput, setInstituicaoInput] = useState("");
  const [nifInput, setNifInput] = useState("");
  const [filters, setFilters] = useState({
    instituicao: "",
    nif: "",
  });
  const [formData, setFormData] = useState<FormData>({
    instituicao: "",
    nif: "",
    contacto: "",
    endereco: "",
    sigla: "",
  });
  const [pageUrl, setPageUrl] = useState<string | undefined>(undefined);
  const debouncedInstituicao = useDebounce(instituicaoInput, 500);
  const debouncedNif = useDebounce(nifInput, 500);
  const { data, isLoading, refetch } = useQueryFetchInstituicao(
    {
      instituicao: filters.instituicao || undefined,
      nif: filters.nif || undefined,
    },
    pageUrl,
  );
  const nextPage = () => {
    if (data?.next?.$ref) {
      setPageUrl(data?.next.$ref);
    }
  };

  const prevPage = () => {
    if (data?.prev?.$ref) {
      setPageUrl(data?.prev.$ref);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetFormData = () => {
    setFormData({
      instituicao: "",
      nif: "",
      contacto: "",
      endereco: "",
      sigla: "",
    });
  };
  useEffect(() => {
    setFilters({
      instituicao: debouncedInstituicao,
      nif: debouncedNif,
    });

    setPageUrl(undefined);
  }, [debouncedInstituicao, debouncedNif]);

  const instituicoes = data?.items ?? [];

  const exportData = instituicoes.map((item) => ({
  instituicao: item.instituicao,
  sigla: item.sigla ?? "-",
  nif: item.nif,
  contacto: item.contacto ?? "-",
  endereco: item.endereco ?? "-",
}));

const baseFileName = `Instituicoes_${new Date().toISOString().slice(0, 10)}`;

const pdfData = exportData.length
  ? {
      filtros: [
        filters.instituicao && `Instituição: ${filters.instituicao}`,
        filters.nif && `NIF: ${filters.nif}`,
      ]
        .filter(Boolean)
        .join(" | ") || "Sem filtros",

      total: exportData.length,

      rows: exportData.map((item, index) => ({
        id: index + 1,
        instituicao: item.instituicao,
        sigla: item.sigla,
        nif: item.nif,
        contacto: item.contacto,
        endereco: item.endereco,
      })),
    }
  : null;

  const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Lista de Instituições"
    subtitle="Instituições registadas no sistema"
    infoSections={[
      { title: "Filtros Aplicados", content: pdfData.filtros },
      { title: "Resumo", content: [`Total de instituições: ${pdfData.total}`] },
    ]}
    mainTable={{
      headers: [
        { key: "id", label: "#", width: "6%" },
        { key: "instituicao", label: "Instituição", width: "30%" },
        { key: "sigla", label: "Sigla", width: "10%" },
        { key: "nif", label: "NIF", width: "18%" },
        { key: "contacto", label: "Contacto", width: "16%" },
        { key: "endereco", label: "Endereço", width: "20%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;

const excelProps = {
  documentTitle: "Lista de Instituições",
  subtitle: "Instituições registadas no sistema",
  infoSections: [
    { title: "Filtros Aplicados", content: pdfData?.filtros ?? "Sem filtros" },
    { title: "Resumo", content: [`Total de instituições: ${exportData.length}`] },
  ],
  mainTable: {
    headers: [
      { key: "instituicao", label: "Instituição", width: 40 },
      { key: "sigla", label: "Sigla", width: 15 },
      { key: "nif", label: "NIF", width: 25 },
      { key: "contacto", label: "Contacto", width: 25 },
      { key: "endereco", label: "Endereço", width: 40 },
    ],
    rows: exportData,
  },
  footerNotice: "Documento gerado automaticamente pelo sistema.",
  primaryColor: "#1e40af",
};


  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div className="space-y-1">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>Finanças</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Todas Instituições</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <h1 className="text-2xl font-bold tracking-tight">
      Todas Instituições
    </h1>
  </div>

  {instituicoes.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {pdfContent && (
        <PDFActions
          document={pdfContent}
          fileName={`${baseFileName}.pdf`}
          showDownload
          showPrint
        />
      )}

      <ExcelActions
        excelProps={excelProps}
        fileName={`${baseFileName}.xlsx`}
        showDownload
      />
    </div>
  )}
</div>


      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Instituições</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Instituição</Label>
              <Input
                placeholder="Ex: Hospital São Lucas"
                value={instituicaoInput}
                onChange={(e) => setInstituicaoInput(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>NIF</Label>
              <Input
                placeholder="Ex: 12345678000190"
                value={nifInput}
                onChange={(e) => setNifInput(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setInstituicaoInput("");
                  setNifInput("");
                  setPageUrl(undefined);
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Instituição
        </Button>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Instituições</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instituição</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instituicoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                instituicoes.map((item) => (
                  <TableRow key={item.nif}>
                    <TableCell>{item.instituicao}</TableCell>
                    <TableCell>{item.sigla ?? "-"}</TableCell>
                    <TableCell>{item.nif}</TableCell>
                    <TableCell>{item.contacto ?? "-"}</TableCell>
                    <TableCell>{item.endereco ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInstituicao(item);
                            setIsModalOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {instituicoes.length > 0 && (
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-muted-foreground"></div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data?.prev?.$ref}
                  onClick={prevPage}
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data?.next?.$ref}
                  onClick={nextPage}
                >
                  Próxima <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <InstituitionModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setSelectedInstituicao(null);
          }
        }}
        instituicao={selectedInstituicao}
        formData={formData}
        setFormData={setFormData}
        resetFormData={handleResetFormData}
        onSuccess={() => {
          setIsModalOpen(false);
          setSelectedInstituicao(null);
        }}
      />
    </div>
  );
}
