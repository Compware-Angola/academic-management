import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Home,
  Search,
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";
import { useListInstituicao } from "@/hooks/financa/use-listar-todas-instituicao";
import { useListInstituicaoTipo } from "@/hooks/financa/use-listar-instituicao";
import { useCreateInstituicao } from "@/hooks/financa/use-create-instituicao";
import { Instituicao } from "@/services/finance/listar-todas-instituicao.service";
import { InstituitionEditModal } from "../components/InstituitionEditModal";

export default function TodasInstituicoes() {
  const { toast } = useToast();

  const [editInstituition, setEditInstituition] = useState<Instituicao | null>(null);
  

  // ----- Paginação -----
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; 


  // Pesquisa
  const [searchType, setSearchType] = useState("instituicao"); // ou "nif"
  const [searchInput, setSearchInput] = useState("");
  const [searchParams, setSearchParams] = useState({
    instituicao: "",
    nif: ""
  });

  // Modal e formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    instituicao: "",
    nif: "",
    contacto: "",
    endereco: "",
    sigla: "",
    tipo_instituicao: ""
  });

  // Hooks
      const { data, isLoading } = useListInstituicao({
        instituicao: searchParams.instituicao || undefined,
        nif: searchParams.nif || undefined,
        });

      const { data: tiposInstituicao = [] } = useListInstituicaoTipo();
      const { mutateAsync: createInstituicao, isPending } = useCreateInstituicao();

      const instituicoes = data?.items ?? [];
  
  
    // Lista completa retornada da API
      const allItems = data?.items ?? [];

      // Calcular índices de início e fim
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Itens que serão mostrados na tabela
      const paginatedItems = allItems.slice(startIndex, endIndex);

      // Total de páginas
      const totalPages = Math.ceil(allItems.length / itemsPerPage);




  // ✅ PESQUISA CORRIGIDA (NÃO ENVIA instituiçao + nif AO MESMO TEMPO)
  
        const handleSearch = () => {
        const value = searchInput.trim();

              if (!value) {
                setSearchParams({ instituicao: "", nif: "" });
                setCurrentPage(1);
                return;
              }

                  setSearchParams({
                    instituicao: searchType === "instituicao" ? value : "",
                    nif: searchType === "nif" ? value : ""
                  });

                  setCurrentPage(1);
              };



  // Criar instituição
  const handleSubmit = async () => {
    if (
      !formData.instituicao ||
      !formData.nif ||
      !formData.sigla ||
      !formData.tipo_instituicao
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    await createInstituicao({
      payload: {
        instituicao: formData.instituicao,
        nif: formData.nif,
        tipoInstituicaoId: Number(formData.tipo_instituicao),
        contacto: formData.contacto || undefined,
        endereco: formData.endereco || undefined,
        sigla: formData.sigla || undefined
      }
    });

    toast({
      title: "Sucesso",
      description: "Instituição criada com sucesso!"
    });

    setFormData({
      instituicao: "",
      nif: "",
      contacto: "",
      endereco: "",
      sigla: "",
      tipo_instituicao: ""
    });

    setIsModalOpen(false);
    setCurrentPage(1);
  };

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

      {/* Pesquisa */}
      
          <div className="flex gap-2 max-w-lg">
              <Input
                placeholder={
                  searchType === "nif"
                    ? "Digite o NIF"
                    : "Digite o nome da instituição"
                }
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />

              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instituicao">Instituição</SelectItem>
                  <SelectItem value="nif">NIF</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
          </div>


      {/* Criar */}
      <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
        <Plus className="h-4 w-4" />
        Nova Instituição
      </Button>

      {/* Tabela */}
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
                                              {/* Botão Editar */}
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditInstituition(item)}
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

          {/* Paginação */}
              {instituicoes.length > 0 && (
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, instituicoes.length)} de {instituicoes.length} registos
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" /> Anterior
                  </Button>

                  <span className="text-sm px-3 py-1">
                    Página {currentPage} de {Math.ceil(instituicoes.length / itemsPerPage) || 1}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= Math.ceil(instituicoes.length / itemsPerPage)}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Próxima <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}


        </CardContent>
      </Card>

      {/* Modal Criar */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Instituição</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Instituição"
              value={formData.instituicao}
              onChange={(e) =>
                setFormData({ ...formData, instituicao: e.target.value })
              }
            />
            <Input
              placeholder="Sigla"
              value={formData.sigla}
              onChange={(e) =>
                setFormData({ ...formData, sigla: e.target.value })
              }
            />
            <Input
              placeholder="Contacto"
              value={formData.contacto}
              onChange={(e) =>
                setFormData({ ...formData, contacto: e.target.value })
              }
            />
            <Input
              placeholder="NIF"
              value={formData.nif}
              onChange={(e) =>
                setFormData({ ...formData, nif: e.target.value })
              }
            />

            <Input
              placeholder="Endereço"
              value={formData.endereco}
              onChange={(e) =>
                setFormData({ ...formData, endereco: e.target.value })
              }
            />

            <Select
              value={formData.tipo_instituicao}
              onValueChange={(v) =>
                setFormData({ ...formData, tipo_instituicao: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Instituição" />
              </SelectTrigger>
              <SelectContent>
                {tiposInstituicao.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isPending}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Nova Modal de edição */}
            {editInstituition && (
              <InstituitionEditModal
                instituicao={editInstituition}
                open={!!editInstituition}
                onOpenChange={(open) => !open && setEditInstituition(null)}
                // Opcional: callback após sucesso para refetch
              />
            )}
    </div>
  );
}
