import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, CreditCard, CheckCircle, Clock, Save, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Interfaces
interface AnoLetivo {
  id: string;
  designacao: string;
  inicio_1_semestre: string;
  fim_1_semestre: string;
  inicio_2_semestre: string;
  fim_2_semestre: string;
  estado: string;
}

interface TipoCandidatura {
  codigo: string;
  designacao: string;
}

export default function Parameters() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filtros
  const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState<string>("");
  const [tipoCandidaturaSelecionado, setTipoCandidaturaSelecionado] = useState<string>("1");

  // Dados da API
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([]);
  const [tiposCandidatura, setTiposCandidatura] = useState<TipoCandidatura[]>([]);

  // APIs reais
  const API_ANOS_LETIVOS = "http://34.202.163.85:8080/ords/cmpdev/academic-year/all";
  const API_TIPOS_CANDIDATURA = "http://34.202.163.85:8080/ords/cmpdev/uma/tipo-candidatura/all";

  // Carregar anos letivos
  const fetchAnosLetivos = async () => {
    try {
      const res = await axios.get(API_ANOS_LETIVOS);
      const data = res.data.anolectivos || [];

      // Mapear para a estrutura correta
      const mapped: AnoLetivo[] = data.map((item: any) => ({
        id: item.codigo,
        designacao: item.designacao,
        inicio_1_semestre: item.inicio_1_semestre || "2025-09-08",
        fim_1_semestre: item.fim_1_semestre || "2026-01-24",
        inicio_2_semestre: item.inicio_2_semestre || "2026-02-17",
        fim_2_semestre: item.fim_2_semestre || "2026-07-04",
        estado: item.estado,
      }));

      // Ordenar do mais recente para o mais antigo
      const ordenados = mapped.sort((a, b) => Number(b.id) - Number(a.id));
      setAnosLetivos(ordenados);

      // Selecionar o mais recente ou o ativo
      const ativoOuRecente = ordenados.find(a => !a.estado.toLowerCase().includes("desactiv")) || ordenados[0];
      if (ativoOuRecente) setAnoLetivoSelecionado(ativoOuRecente.designacao);
    } catch (err) {
      toast({ title: "Erro ao carregar anos letivos", variant: "destructive" });
    }
  };

  // Carregar tipos de candidatura
  const fetchTiposCandidatura = async () => {
    try {
      const res = await axios.get(API_TIPOS_CANDIDATURA);
      const data = res.data.tipo_candidaturas || [];
      setTiposCandidatura(data);
      // Default: Licenciatura
      const licenciatura = data.find((t: any) => t.codigo === 1);
      if (licenciatura) setTipoCandidaturaSelecionado("1");
    } catch (err) {
      toast({ title: "Erro ao carregar tipos de candidatura", variant: "destructive" });
    }
  };

  // Inicialização
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchAnosLetivos(), fetchTiposCandidatura()]);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Parâmetros salvos com sucesso!" });
    }, 1000);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-AO");
  };

  const calcularDias = (inicio: string, fim: string) => {
    const diff = new Date(fim).getTime() - new Date(inicio).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  const getEstadoBadge = (estado: string) => {
    const lower = estado.toLowerCase();
    if (lower.includes("pago") || lower.includes("paid")) {
      return <Badge className="bg-success/10 text-success"><CheckCircle className="w-3 h-3 mr-1" /> Pago</Badge>;
    }
    if (lower.includes("ativo") || lower.includes("active")) {
      return <Badge className="bg-primary/10 text-primary"><Clock className="w-3 h-3 mr-1" /> Ativo</Badge>;
    }
    if (lower.includes("vencer")) {
      return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" /> A Vencer</Badge>;
    }
    return <Badge variant="secondary">{estado}</Badge>;
  };

  // Dados simulados de vagas e mensalidades (depois virão da API)
  const vagas = [
    { curso: "Engenharia Informática", periodo: "1º Semestre", vagas: 120 },
    { curso: "Engenharia Informática", periodo: "2º Semestre", vagas: 115 },
    { curso: "Gestão", periodo: "1º Semestre", vagas: 80 },
    { curso: "Direito", periodo: "1º Semestre", vagas: 90 },
  ];

  const mensalidades = [
    { tipo: "Mensalidade", prestacao: "Janeiro 2026", dataLimite: "2026-01-20", estado: "active" },
    { tipo: "Mensalidade", prestacao: "Fevereiro 2026", dataLimite: "2026-02-20", estado: "active" },
    { tipo: "Propina Completa", prestacao: "Anual 2025-2026", dataLimite: "2025-10-15", estado: "paid" },
  ];

  const anoAtual = anosLetivos.find(a => a.designacao === anoLetivoSelecionado);
  const tipoCandidaturaNome = tiposCandidatura.find(t => t.codigo === tipoCandidaturaSelecionado)?.designacao || "Licenciatura";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parâmetros do Calendário Académico"
        subtitle="Home / Calendário Académico / Parâmetros"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => { fetchAnosLetivos(); fetchTiposCandidatura(); }}>
              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Novo Ano"}
            </Button>
          </>
        }
      />

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>Selecione o ano letivo e tipo de candidatura</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Ano Letivo</Label>
                <Select value={anoLetivoSelecionado} onValueChange={setAnoLetivoSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano letivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {anosLetivos.map((ano) => (
                      <SelectItem key={ano.id} value={ano.designacao}>
                        <div className="flex items-center justify-between w-full">
                          <span>{ano.designacao}</span>
                          {!ano.estado.toLowerCase().includes("desactiv") && (
                            <Badge variant="outline" className="ml-2 text-xs">Ativo</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Candidatura</Label>
                <Select value={tipoCandidaturaSelecionado} onValueChange={setTipoCandidaturaSelecionado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCandidatura.map((t) => (
                      <SelectItem key={t.codigo} value={t.codigo}>
                        {t.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Título dinâmico */}
      {!loading && anoAtual && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">
            {tipoCandidaturaNome} — {anoAtual.designacao}
          </h2>
          <p className="text-muted-foreground">Parâmetros académicos e financeiros</p>
        </div>
      )}

      <Tabs defaultValue="anoLetivo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="anoLetivo">Calendário</TabsTrigger>
          <TabsTrigger value="vagas">Vagas</TabsTrigger>
          <TabsTrigger value="mensalidade">Mensalidades</TabsTrigger>
        </TabsList>

        {/* ABA 1: Calendário */}
        <TabsContent value="anoLetivo" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Períodos Letivos — {anoAtual?.designacao}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading || !anoAtual ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Fim</TableHead>
                      <TableHead>Duração</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">1º Semestre</TableCell>
                      <TableCell>{formatarData(anoAtual.inicio_1_semestre)}</TableCell>
                      <TableCell>{formatarData(anoAtual.fim_1_semestre)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {calcularDias(anoAtual.inicio_1_semestre, anoAtual.fim_1_semestre)} dias
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">2º Semestre</TableCell>
                      <TableCell>{formatarData(anoAtual.inicio_2_semestre)}</TableCell>
                      <TableCell>{formatarData(anoAtual.fim_2_semestre)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {calcularDias(anoAtual.inicio_2_semestre, anoAtual.fim_2_semestre)} dias
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 2: Vagas */}
        <TabsContent value="vagas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vagas Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Vagas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vagas.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{v.curso}</TableCell>
                      <TableCell>{v.periodo}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{v.vagas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: Mensalidades */}
        <TabsContent value="mensalidade" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Mensalidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prestação</TableHead>
                    <TableHead>Data Limite</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mensalidades.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{m.tipo}</TableCell>
                      <TableCell>{m.prestacao}</TableCell>
                      <TableCell>{formatarData(m.dataLimite)}</TableCell>
                      <TableCell>{getEstadoBadge(m.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}