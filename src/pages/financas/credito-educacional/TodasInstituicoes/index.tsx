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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  Search,
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";

import { useCreateInstituicao } from "@/hooks/financa/use-create-instituicao";
import { Instituicao } from "@/services/financas/instituicao/fetch-instituicao.service";
import { InstituitionEditModal } from "../../components/InstituitionEditModal";
import { useQueryFetchInstituicao } from "@/hooks/financas/instituicao/use-query-fetch-instituicao";
import { useDebounce } from "@/hooks/use-debounce";
import { InstituitionModal } from "./components/InstituitionModal";

export default function TodasInstituicoes() {
  const [selectedInstituicao, setSelectedInstituicao] =
    useState<Instituicao | null>(null);

  const [instituicaoInput, setInstituicaoInput] = useState("");
  const [nifInput, setNifInput] = useState("");
  const [filters, setFilters] = useState({
    instituicao: "",
    nif: "",
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

  useEffect(() => {
    setFilters({
      instituicao: debouncedInstituicao,
      nif: debouncedNif,
    });

    setPageUrl(undefined);
  }, [debouncedInstituicao, debouncedNif]);

  const instituicoes = data?.items ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
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
        onOpenChange={setIsModalOpen}
        instituicao={selectedInstituicao}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
          setSelectedInstituicao(null);
        }}
      />
    </div>
  );
}
