import { useStudentDetail } from "@/hooks/students/use-query-students";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Award,
  Calendar as CalendarIcon,
  TrendingUp,
} from "lucide-react";
import { buildImageAssets } from "@/util/build-image-assets";

type Props = {
  matricula: string;
};

function getEstadoBadge(estado: string) {
  switch (estado) {
    case "Activo":
      return <Badge className="bg-green-500 hover:bg-green-600">Activo</Badge>;
    case "Inactivo":
      return <Badge variant="destructive">Inactivo</Badge>;
    case "Suspenso":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">Suspenso</Badge>
      );
    default:
      return <Badge variant="secondary">{estado}</Badge>;
  }
}

export function StudentProfileHeader({ matricula }: Props) {
  const { data: student, isLoading } = useStudentDetail(matricula);

  if (isLoading || !student) {
    return (
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const photoUrl = buildImageAssets(student.foto);
  const initials =
    student.nome_completo
      ?.trim()
      .split(/\s+/)
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) ?? "??";

  const isBolseiro = true;
  const bolsaMock = {
    instituicao: "Governo Provincial de Luanda",
    tipoBolsa: "Integral",
    percentagem: 100,
    valorMensal: 150000,
    dataInicio: "2021-02-01",
    dataFim: "2025-06-30",
    estado: "Ativa",
    mediaAproveitamento: 16.5,
  };

  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-32 w-32 ring-4 ring-amber-100 dark:ring-amber-900">
            <AvatarImage
              src={photoUrl}
              alt={student.nome_completo || "Foto do estudante"}
              key={photoUrl}
            />
            <AvatarFallback className="text-3xl font-medium bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-wrap">
              <h1 className="text-2xl font-bold">{student.nome_completo}</h1>
              {getEstadoBadge(student.estado)}

              {isBolseiro && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 px-3 py-1">
                  <Award className="h-4 w-4" />
                  Bolseiro
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>
                  <strong>Matrícula:</strong> {student.codigo_matricula}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>
                  <strong>Curso:</strong> {student.curso}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>Ano:</strong> {student.classe}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{student.contacto || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{student.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{student.morada || "Luanda"}</span>
              </div>
            </div>

            {/* === Seção da Bolsa - Mais Rica e Bonita === */}
            {isBolseiro && (
              <div className="mt-5 p-5 bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-700">Bolsa de Estudo</h3>
                    <p className="text-xs text-amber-600">Activa • Excelente desempenho</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Instituição</p>
                    <p className="font-medium">{bolsaMock.instituicao}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Tipo de Bolsa</p>
                    <p className="font-medium text-green-700">
                      {bolsaMock.tipoBolsa} ({bolsaMock.percentagem}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Valor Mensal</p>
                    <p className="font-semibold text-lg">
                      {bolsaMock.valorMensal.toLocaleString("pt-AO")} Kz
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Média de Aproveitamento</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{bolsaMock.mediaAproveitamento}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {new Date(bolsaMock.dataInicio).toLocaleDateString("pt-AO")} —{" "}
                      {new Date(bolsaMock.dataFim).toLocaleDateString("pt-AO")}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    {bolsaMock.estado}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}