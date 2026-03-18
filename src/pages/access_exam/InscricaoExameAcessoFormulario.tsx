import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Upload, CheckCircle, Send, User, BookOpen, School, Clock } from "lucide-react";
import { toast } from "sonner";
import { ThemeSwitcher } from "@/components/theme-switcher";

const InscricaoExameAcessoFormulario = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codigoReferencia] = useState(
    `EA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")}`
  );

  const [formData, setFormData] = useState({
    // Dados pessoais
    nomeCompleto: "",
    dataNascimento: "",
    sexo: "",
    estadoCivil: "",
    nacionalidade: "",
    bilheteIdentidade: "",
    telefone: "",
    telefoneEmergencia: "",
    email: "",
    morada: "",
    nomePai: "",
    nomeMae: "",
    profissaoPai: "",
    profissaoMae: "",
    // Dados académicos
    escola: "",
    anoConclucao: "",
    mediaFinal: "",
    // Escolha de curso
    curso: "",
    cursoOpcional1: "",
    cursoOpcional2: "",
    // Período/turno
    turno: "",
    turnoOpcional: "",
    tipoCandidatura: "",
  });

  const [ficheiros, setFicheiros] = useState<{ [key: string]: File | null }>({
    bilhete: null,
    certificado: null,
    fotografia: null,
    comprovativoPagamento: null,
  });

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFicheiro(field: string, file: File | null) {
    setFicheiros((prev) => ({ ...prev, [field]: file }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const obrigatorios = ["nomeCompleto", "dataNascimento", "sexo", "bilheteIdentidade", "email", "telefone", "escola", "mediaFinal", "curso", "turno", "tipoCandidatura"];
    const faltam = obrigatorios.filter((f) => !formData[f as keyof typeof formData]);

    if (faltam.length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Inscrição enviada com sucesso!");
    }, 1500);
  }

  if (submitted) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4 ">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-10 pb-10 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold">Inscrição Submetida!</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              A sua inscrição para o Exame de Acesso foi recebida com sucesso. Guarde o código de referência abaixo.
            </p>
            <div className="bg-muted rounded-lg px-6 py-3 inline-block">
              <p className="text-xs text-muted-foreground mb-1">Código de referência</p>
              <p className="font-mono font-bold text-lg">{codigoReferencia}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Receberá uma confirmação no email <strong>{formData.email}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4 ">
      <div className="max-w-3xl mx-auto space-y-6">

<div className="flex justify-end">
  <ThemeSwitcher />
</div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Inscrição — Exame de Acesso</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Preencha o formulário abaixo para submeter a sua inscrição. Os campos marcados com <span className="text-red-500">*</span> são obrigatórios.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Dados Pessoais
              </CardTitle>
              <CardDescription>Informações de identificação e contacto</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo <span className="text-red-500">*</span></Label>
                <Input id="nomeCompleto" placeholder="Ex: João Manuel da Silva" value={formData.nomeCompleto} onChange={(e) => handleChange("nomeCompleto", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento <span className="text-red-500">*</span></Label>
                <Input id="dataNascimento" type="date" value={formData.dataNascimento} onChange={(e) => handleChange("dataNascimento", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Sexo <span className="text-red-500">*</span></Label>
                <Select value={formData.sexo} onValueChange={(v) => handleChange("sexo", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado Civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(v) => handleChange("estadoCivil", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacionalidade">Nacionalidade</Label>
                <Input id="nacionalidade" placeholder="Ex: Angolana" value={formData.nacionalidade} onChange={(e) => handleChange("nacionalidade", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bilheteIdentidade">Nº Bilhete de Identidade <span className="text-red-500">*</span></Label>
                <Input id="bilheteIdentidade" placeholder="Ex: 000000000LA000" value={formData.bilheteIdentidade} onChange={(e) => handleChange("bilheteIdentidade", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone <span className="text-red-500">*</span></Label>
                <Input id="telefone" placeholder="+244 9XX XXX XXX" value={formData.telefone} onChange={(e) => handleChange("telefone", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoneEmergencia">Telefone de Emergência</Label>
                <Input id="telefoneEmergencia" placeholder="+244 9XX XXX XXX" value={formData.telefoneEmergencia} onChange={(e) => handleChange("telefoneEmergencia", e.target.value)} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="exemplo@email.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="morada">Morada Completa</Label>
                <Input id="morada" placeholder="Rua, nº, Bairro, Município" value={formData.morada} onChange={(e) => handleChange("morada", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomePai">Nome do Pai</Label>
                <Input id="nomePai" placeholder="Nome completo do pai" value={formData.nomePai} onChange={(e) => handleChange("nomePai", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeMae">Nome da Mãe</Label>
                <Input id="nomeMae" placeholder="Nome completo da mãe" value={formData.nomeMae} onChange={(e) => handleChange("nomeMae", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Profissão do Pai</Label>
                <Select value={formData.profissaoPai} onValueChange={(v) => handleChange("profissaoPai", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desconhecida/não tem">Desconhecida/não tem</SelectItem>
                    <SelectItem value="Funcionário Público">Funcionário Público</SelectItem>
                    <SelectItem value="Comerciante">Comerciante</SelectItem>
                    <SelectItem value="Docente">Docente</SelectItem>
                    <SelectItem value="Médico">Médico</SelectItem>
                    <SelectItem value="Engenheiro">Engenheiro</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Profissão da Mãe</Label>
                <Select value={formData.profissaoMae} onValueChange={(v) => handleChange("profissaoMae", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Desconhecida/não tem">Desconhecida/não tem</SelectItem>
                    <SelectItem value="Funcionária Pública">Funcionária Pública</SelectItem>
                    <SelectItem value="Comerciante">Comerciante</SelectItem>
                    <SelectItem value="Docente">Docente</SelectItem>
                    <SelectItem value="Médica">Médica</SelectItem>
                    <SelectItem value="Enfermeira">Enfermeira</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          {/* Dados Académicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <School className="h-5 w-5 text-primary" />
                Dados Académicos
              </CardTitle>
              <CardDescription>Informações sobre o ensino secundário</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="escola">Escola de Proveniência <span className="text-red-500">*</span></Label>
                <Input id="escola" placeholder="Ex: Escola Secundária do Kilamba" value={formData.escola} onChange={(e) => handleChange("escola", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anoConclucao">Ano de Conclusão</Label>
                <Input id="anoConclucao" type="number" min="2000" max={new Date().getFullYear()} placeholder={`Ex: ${new Date().getFullYear()}`} value={formData.anoConclucao} onChange={(e) => handleChange("anoConclucao", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaFinal">Média Final (0 — 20) <span className="text-red-500">*</span></Label>
                <Input id="mediaFinal" type="number" min="0" max="20" step="0.1" placeholder="Ex: 14.5" value={formData.mediaFinal} onChange={(e) => handleChange("mediaFinal", e.target.value)} />
              </div>

            </CardContent>
          </Card>

          {/* Escolha de Curso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Escolha de Curso
              </CardTitle>
              <CardDescription>Indique o curso principal e até 2 opcionais por ordem de preferência</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2 space-y-2">
                <Label>Curso Principal <span className="text-red-500">*</span></Label>
                <Select value={formData.curso} onValueChange={(v) => handleChange("curso", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar curso" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiopneumologia">Cardiopneumologia</SelectItem>
                    <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                    <SelectItem value="Análises Clínicas e Saúde Pública">Análises Clínicas e Saúde Pública</SelectItem>
                    <SelectItem value="Enfermagem">Enfermagem</SelectItem>
                    <SelectItem value="Medicina">Medicina</SelectItem>
                    <SelectItem value="Farmácia">Farmácia</SelectItem>
                    <SelectItem value="Engenharia Informática">Engenharia Informática</SelectItem>
                    <SelectItem value="Engenharia Civil">Engenharia Civil</SelectItem>
                    <SelectItem value="Gestão de Empresas">Gestão de Empresas</SelectItem>
                    <SelectItem value="Direito">Direito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Curso Opcional 1</Label>
                <Select value={formData.cursoOpcional1} onValueChange={(v) => handleChange("cursoOpcional1", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar curso" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiopneumologia">Cardiopneumologia</SelectItem>
                    <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                    <SelectItem value="Análises Clínicas e Saúde Pública">Análises Clínicas e Saúde Pública</SelectItem>
                    <SelectItem value="Enfermagem">Enfermagem</SelectItem>
                    <SelectItem value="Medicina">Medicina</SelectItem>
                    <SelectItem value="Farmácia">Farmácia</SelectItem>
                    <SelectItem value="Engenharia Informática">Engenharia Informática</SelectItem>
                    <SelectItem value="Engenharia Civil">Engenharia Civil</SelectItem>
                    <SelectItem value="Gestão de Empresas">Gestão de Empresas</SelectItem>
                    <SelectItem value="Direito">Direito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Curso Opcional 2</Label>
                <Select value={formData.cursoOpcional2} onValueChange={(v) => handleChange("cursoOpcional2", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar curso" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiopneumologia">Cardiopneumologia</SelectItem>
                    <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                    <SelectItem value="Análises Clínicas e Saúde Pública">Análises Clínicas e Saúde Pública</SelectItem>
                    <SelectItem value="Enfermagem">Enfermagem</SelectItem>
                    <SelectItem value="Medicina">Medicina</SelectItem>
                    <SelectItem value="Farmácia">Farmácia</SelectItem>
                    <SelectItem value="Engenharia Informática">Engenharia Informática</SelectItem>
                    <SelectItem value="Engenharia Civil">Engenharia Civil</SelectItem>
                    <SelectItem value="Gestão de Empresas">Gestão de Empresas</SelectItem>
                    <SelectItem value="Direito">Direito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          {/* Período / Turno */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Período e Tipo de Candidatura
              </CardTitle>
              <CardDescription>Seleccione o turno e o tipo de candidatura</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Turno <span className="text-red-500">*</span></Label>
                <Select value={formData.turno} onValueChange={(v) => handleChange("turno", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar turno" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diurno">Diurno</SelectItem>
                    <SelectItem value="Nocturno">Nocturno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Turno Opcional</Label>
                <Select value={formData.turnoOpcional} onValueChange={(v) => handleChange("turnoOpcional", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar turno" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diurno">Diurno</SelectItem>
                    <SelectItem value="Nocturno">Nocturno</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>Tipo de Candidatura <span className="text-red-500">*</span></Label>
                <Select value={formData.tipoCandidatura} onValueChange={(v) => handleChange("tipoCandidatura", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                    <SelectItem value="Mestrado">Mestrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          {/* Upload de Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-primary" />
                Documentos
              </CardTitle>
              <CardDescription>Faça o upload dos documentos obrigatórios em formato PDF ou imagem</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {[
                { key: "bilhete", label: "Bilhete de Identidade", obrigatorio: true },
                { key: "certificado", label: "Certificado de Habilitações", obrigatorio: true },
                { key: "fotografia", label: "Fotografia tipo passe", obrigatorio: true },
                { key: "comprovativoPagamento", label: "Comprovativo de Pagamento", obrigatorio: true },
              ].map((doc) => (
                <div key={doc.key} className="space-y-2">
                  <Label>
                    {doc.label} {doc.obrigatorio && <span className="text-red-500">*</span>}
                  </Label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                    {ficheiros[doc.key] ? (
                      <p className="text-sm font-medium text-primary">{ficheiros[doc.key]?.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">Clique para seleccionar</p>
                        <p className="text-xs text-muted-foreground">PDF ou imagem até 5MB</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFicheiro(doc.key, e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              ))}

            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>A enviar...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submeter Inscrição
                </>
              )}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InscricaoExameAcessoFormulario;