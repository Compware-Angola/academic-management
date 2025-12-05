import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // <- adiciona este componente se ainda não tiveres
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  Edit,
  CalendarDays,
  Building,
} from "lucide-react";
import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";
import { useAuth } from "@/hooks/use-auth";
import UpcomingEventsCard from "./dasboard/components/UpcomingEventsCard";

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

  const { data: teacherInfoData, isLoading: teacherInfoDataLoading } = useQueryTeacherProfile(user?.user_id);

  // Estado inicial com valores vazios → evita flash nos cards
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

  // Preenche apenas quando os dados chegam
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

  // Dados de exemplo (podes substituir por hook real depois)
  const upcomingEvents = [
    { title: "Reunião de Departamento", date: "2025-11-28", time: "14:30", type: "reuniao" },
    { title: "Prazo de Lançamento de Notas P1", date: "2025-12-05", time: "23:59", type: "prazo" },
    { title: "Formação Pedagógica", date: "2025-12-10", time: "09:00–17:00", type: "formacao" },
    { title: "Avaliação por Pares", date: "2026-01-15", time: "", type: "avaliacao" },
  ];

  const handleSave = () => {
    toast({
      title: "Alterações guardadas!",
      description: "Os dados do docente foram atualizados com sucesso.",
    });
    setIsEditing(false);
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "reuniao":   return <Badge variant="default">Reunião</Badge>;
      case "prazo":     return <Badge variant="destructive">Prazo</Badge>;
      case "formacao":  return <Badge variant="secondary">Formação</Badge>;
      case "avaliacao": return <Badge variant="outline">Avaliação</Badge>;
      default:          return <Badge>Evento</Badge>;
    }
  };

  const initials = teacherInfo.name
    ? teacherInfo.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "";

  // Skeleton enquanto carrega
  if (teacherInfoDataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <Skeleton className="h-40 w-40 rounded-full mx-auto" />
              <div className="space-y-3 text-center">
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="pt-6 space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil do Docente</h1>
          <p className="text-muted-foreground">Gerencie as suas informações profissionais</p>
        </div>
        {/*
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {isEditing ? "Cancelar" : "Editar Dados"}
        </Button>
        */}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card da Foto + Info rápida */}
        <Card className="lg:col-span-1">
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

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{teacherInfo.name || "Carregando..."}</h3>
              <p className="text-sm text-muted-foreground">{teacherInfo.employeeId || "N/A"}</p>
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

        {/* Informações detalhadas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            {isEditing && <CardDescription>Campos editáveis estão ativos.</CardDescription>}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Pessoal</TabsTrigger>
                <TabsTrigger value="professional">Profissional</TabsTrigger>
              </TabsList>

              {/* Dados Pessoais */}
              <TabsContent value="personal" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.name}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Institucional</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={teacherInfo.email}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone Principal</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.phone}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone Alternativo</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.phone2}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, phone2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.birthDate}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, birthDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Endereço</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        value={teacherInfo.address}
                        disabled={!isEditing}
                        onChange={(e) => setTeacherInfo({ ...teacherInfo, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Dados Profissionais */}
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
            </Tabs>

            {isEditing && (
              <div className="mt-6 flex gap-3">
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