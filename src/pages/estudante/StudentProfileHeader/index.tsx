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

  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={photoUrl}
              alt={student.nome_completo || "Foto do estudante"}
              key={photoUrl}
            />
            <AvatarFallback className="text-3xl font-medium bg-linear-to-br from-gray-100 to-gray-200 text-gray-600">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-2xl font-bold">{student.nome_completo}</h1>
              {getEstadoBadge(student.estado)}
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
                <span>{student.morada}, Luanda</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
