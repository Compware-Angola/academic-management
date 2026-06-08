import { useStudentDetail, useStudentInfoBolsa } from "@/hooks/students/use-query-students";
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
  Clock,
  CheckCircle,
  AlertTriangle,

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
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Suspenso</Badge>;
    default:
      return <Badge variant="secondary">{estado}</Badge>;
  }
}

export function StudentProfileHeader({ matricula }: Props) {
  const { data: student, isLoading } = useStudentDetail(matricula);
  const { data: bolsaInfo, isLoading: isLoadingInfoBolsa } = useStudentInfoBolsa(matricula);

  if (isLoading || !student || isLoadingInfoBolsa) {
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

  const isBolseiro = bolsaInfo?.isBolseiro === true;

  return (
    <Card className="flex-1">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-32 w-32 ring-4 ring-[oklch(0.86_0.055_25)] dark:ring-[oklch(0.32_0.055_25)]">
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
              {student.regime && (
                <Badge
                  variant="outline"
                  className="capitalize font-medium border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                >
                  {student.regime}
                </Badge>
              )}

              {isBolseiro && (
                <Badge
                  className="text-white flex items-center gap-1.5 px-3 py-1"
                  style={{ background: "linear-gradient(to right, oklch(0.68 0.13 25), oklch(0.60 0.13 25))" }}
                >
                  <Award className="h-4 w-4" />
                  Bolseiro
                </Badge>
              )}

            </div>




            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span><strong>Matrícula:</strong> {student.codigo_matricula}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span><strong>Curso:</strong> {student.curso}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span><strong>Ano:</strong> {student.classe}</span>
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

            {/* === Seção da Bolsa com Dados Reais === */}

            {isBolseiro && bolsaInfo && (
              <div className="mt-5 p-5 rounded-xl border bg-[oklch(0.97_0.015_25)] dark:bg-[oklch(0.22_0.025_25)] border-[oklch(0.88_0.045_25)] dark:border-[oklch(0.32_0.045_25)] relative">

                {/* ALERTA NO CANTO SUPERIOR DIREITO */}
                <div className="absolute top-5 right-5">
                  {bolsaInfo.instituicao_pagou ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 shadow-sm">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verificado
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 shadow-sm">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      A Instituição não Pagou ou está em Análise
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-4 pr-40"> {/* pr-40 para dar espaço ao alerta */}
                  <div
                    className="p-3 rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, oklch(0.62 0.118 25), oklch(0.54 0.120 25))" }}
                  >
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[oklch(0.38_0.090_25)] dark:text-[oklch(0.88_0.055_25)]">
                      Bolsa de Estudo
                    </h3>
                    <p className="text-sm text-[oklch(0.54_0.120_25)] dark:text-[oklch(0.72_0.090_25)]">
                      {bolsaInfo.bolsa || "Bolsa Ativa"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Tipo de Desconto</p>
                    <p className="font-medium text-emerald-700 dark:text-emerald-400">
                      {bolsaInfo.tipo_desconto?.toLocaleLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Valor do Desconto</p>
                    <p className="font-semibold text-lg">
                      {bolsaInfo?.valor_desconto}
                      {bolsaInfo?.sigla === "DESC_PERC" ? "%" : " Kz"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Nome da Bolsa</p>
                    <p className="font-medium">{bolsaInfo.bolsa}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Instituição</p>
                    <p className="font-medium">{bolsaInfo.instituicao || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-[oklch(0.86_0.055_25)] dark:border-[oklch(0.28_0.055_25)]">
                  <div className="flex items-center gap-2">
                    <span>Período de Validade</span>
                    <span>{bolsaInfo.semestre === 3 ? 'Anual' : bolsaInfo.semestre + " semestre"}</span>
                    <span>{bolsaInfo.ano_lectivo}</span>
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">
                      {new Date(bolsaInfo.data_inicio_bolsa).toLocaleDateString("pt-AO")} —{" "}
                      {new Date(bolsaInfo.data_fim_bolsa).toLocaleDateString("pt-AO")}
                    </span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    Ativa
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