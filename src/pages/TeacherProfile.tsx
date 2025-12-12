import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building,
  GraduationCap,
  Edit,
} from "lucide-react";

import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";
import { useAuth } from "@/hooks/use-auth";
import { useQueryListSchedules } from "@/hooks/horario/use-query-horarios-by-teacher";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

export interface TeacherInfo {
  name: string;
  employeeId: string | number;
  email: string;
  phone: string;
  phone2: string;
  department: string;
  category: string;
  office: string;
  hireDate: string;
  birthDate: string;
  address: string;
}

const TeacherProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  // Queries
  const {
    data: academicYear,
    isLoading: isLoadingAcademicYear,
    isError: isErrorAcademicYear,
  } = useQueryAnoAcademico();

  const {
    data: teacherInfoData,
    isLoading: teacherInfoDataLoading,
    isError: teacherInfoError,
  } = useQueryTeacherProfile(user?.user_id);

  // Ano letivo ativo
  const activeYear = academicYear?.find(
    (ay) => ay.estado.toLowerCase() === "activo"
  );

  const {
    data: turmData,
    isLoading: isLoadingTurmaData,
    isError: isErrorTurma,
    refetch: refetchTurma,
  } = useQueryListSchedules({
    teacherId: teacherInfoData?.codigo_docente,
    anoLectivo: activeYear?.codigo,
    
  });

  // Estado local do perfil
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    phone2: "",
    department: "",
    category: "",
    office: "",
    hireDate: "",
    birthDate: "",
    address: "",
  });

  // Preenche os dados quando chegam
  useEffect(() => {
    if (teacherInfoData) {
      setTeacherInfo({
        name: teacherInfoData.nome || "",
        employeeId: teacherInfoData.n_mecanografico || "",
        email: teacherInfoData.email || "",
        phone: teacherInfoData.contacto_1 || "",
        phone2: teacherInfoData.contacto_2 || "",
        department: teacherInfoData.faculdade_designacao || "",
        category: teacherInfoData.descricao_categoria || "",
        office: teacherInfoData.escalao || "",
        hireDate: teacherInfoData.data_inicio_docente || "",
        birthDate: teacherInfoData.data_nascimento || "",
        address: teacherInfoData.endereco || "",
      });
    }
  }, [teacherInfoData]);

  const initials = teacherInfo.name
    ? teacherInfo.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "";

  const handleSave = () => {
    toast({
      title: "Alterações guardadas!",
      description: "Os dados do docente foram atualizados com sucesso.",
    });
    setIsEditing(false);
  };

  // Estados globais
  const isLoading = isLoadingAcademicYear || teacherInfoDataLoading || isLoadingTurmaData;
  const hasError = isErrorAcademicYear || teacherInfoError || isErrorTurma;

  // ================== LOADING SKELETON ==================
  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <Skeleton className="h-40 w-40 rounded-full mx-auto" />
              <div className="text-center space-y-3">
                <Skeleton className="h-7 w-56 mx-auto" />
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="pt-6 space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ================== ERRO GLOBAL ==================
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-6 p-8">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Erro a processar informações do perfil</h2>
          <p className="text-muted-foreground max-w-md">
            Não foi possível carregar os dados do docente. Verifique a sua ligação à internet ou tente novamente.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  // ================== RENDER PRINCIPAL ==================
  return (
    <div className="space-y-8 p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil do Docente</h1>
          <p className="text-muted-foreground">
            Visualize e edite as suas informações profissionais
          </p>
        </div>
        {/* <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Cancelar" : "Editar Dados"}
        </Button> */}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Foto + Info Rápida */}
        <Card>
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="h-40 w-40 border-4 border-background">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                  {initials || "NA"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-2xl font-semibold">{teacherInfo.name}</h3>
              <p className="text-sm text-muted-foreground">
                Nº Mec: {teacherInfo.employeeId || "N/A"}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Briefcase className="h-4 w-4" />
                <span>{teacherInfo.category || "N/A"}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                <span>{teacherInfo.department || "N/A"}</span>
              </div>
            </div>

            <Button className="w-full" variant="outline" disabled={!isEditing}>
              Alterar Foto
            </Button>
          </CardContent>
        </Card>

        {/* Informações Detalhadas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            {isEditing && <CardDescription>Campos editáveis estão ativos.</CardDescription>}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Pessoal</TabsTrigger>
                <TabsTrigger value="professional">Profissional</TabsTrigger>
                <TabsTrigger value="classes">Horários</TabsTrigger>
              </TabsList>

              {/* PESSOAL */}
              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={teacherInfo.name}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Institucional</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={teacherInfo.email}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone Principal</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={teacherInfo.phone}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone2">Telefone Alternativo</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone2"
                        value={teacherInfo.phone2}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, phone2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birth">Data de Nascimento</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="birth"
                        value={teacherInfo.birthDate ? new Date(teacherInfo.birthDate).toLocaleDateString("pt-AO") : ""}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, birthDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        value={teacherInfo.address}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* PROFISSIONAL */}
              <TabsContent value="professional" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nº de Funcionário</Label>
                    <Input value={teacherInfo.employeeId} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Input
                      value={teacherInfo.category}
                      disabled={!isEditing}
                      onChange={(e) => setTeacherInfo({ ...teacherInfo, category: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Faculdade / Departamento</Label>
                    <Input value={teacherInfo.department} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Escalão</Label>
                    <Input
                      value={teacherInfo.office}
                      disabled={!isEditing}
                      onChange={(e) => setTeacherInfo({ ...teacherInfo, office: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Data de Admissão</Label>
                    <Input
                      value={teacherInfo.hireDate ? new Date(teacherInfo.hireDate).toLocaleDateString("pt-AO") : ""}
                      disabled
                    />
                  </div>
                </div>
              </TabsContent>

              {/* HORÁRIOS */}
              <TabsContent value="classes" className="pt-4">
                {isLoadingTurmaData ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-28 w-full rounded-lg" />
                    ))}
                  </div>
                ) : turmData?.horarios && turmData.horarios.length > 0 ? (
                  <div className="space-y-4">
                    {turmData.horarios.map((cls) => (
                      <div
                        key={cls.codigo_horario}
                        className="flex items-center gap-4 rounded-lg border bg-card p-5 transition-all hover:shadow-md"
                      >
                        <GraduationCap className="h-12 w-12 text-primary" />
                        <div className="flex-1">
                          <p className="font-semibold text-lg">
                            {cls.codigo_grade} – {cls.grade}
                          </p>
                          <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                            <p>• Horário: {cls.horario}</p>
                            <p>• Sala: {cls.sala}</p>
                            {cls.docente && <p>• Docente: {cls.docente}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 py-16 text-center">
                    <div className="rounded-full bg-muted p-5 mb-4">
                      <GraduationCap className="h-14 w-14 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">Nenhum horário encontrado</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      Não existem turmas ou horários atribuídos ao docente no ano lectivo ativo.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Botões de edição */}
            {isEditing && (
              <div className="mt-8 flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  Guardar Alterações
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherProfile;