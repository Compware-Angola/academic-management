// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Save, X, AlertCircle, Loader2, List } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { useToast } from "@/hooks/use-toast";
// import ScheduleGrid from "./ScheduleGrid";
// import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
// import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
// import { useCursos } from "@/hooks/use-cursos";
// import { useQueryPeriod } from "@/hooks/period/use-query-period";
// import { useQueryTemposDisponiveis } from "@/hooks/tempos/use-query-tempos-disponiveis";
// import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
// import { FormSelect } from "../../../components/common/FormSelect";
// import { useSaveHorario } from "@/hooks/horario/use-save-horario";
// import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
// import { useQueryModalidade } from "@/hooks/modalidade/use-query-modalidade";
// import {
//   AulaPayload,
//   SaveHorarioPayload,
// } from "@/services/horario/save-horario.service";

// import { Input } from "@/components/ui/input";
// import { useNextScheduleDesignation } from "@/hooks/horario/use-next-schedule-designation";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useQueryTeacherByUC } from "@/hooks/teacher/use-query-teacher-uc";
// import { useQueryTipoDeSalas } from "@/hooks/salas/use-query-tipo-de-sala";
// import { useAvailableRooms } from "@/hooks/salas/use-rooms-avaliable";

// /* -----------------------------------
//    CONSTANTES E UTILS
// ----------------------------------- */

// const requiredFields = [
//   { key: "designacao", label: "Designação do Horário" },
//   { key: "capacidade", label: "Capacidade" },
//   { key: "anoLetivo", label: "Ano Letivo" },
//   { key: "semestre", label: "Semestre" },
//   { key: "periodo", label: "Período" },
//   { key: "curso", label: "Curso" },
//   { key: "docente", label: "Docente" },
//   { key: "tipoAula", label: "Tipo de Aula" },
//   { key: "sala", label: "Sala" },
//   { key: "unidadeCurricular", label: "Unidade Curricular" },
//   { key: "modalidade", label: "Modalidade" },
// ];

// const isEmpty = (v: unknown) => v === null || v === undefined || v === "";

// export default function CreateSchedule() {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   /* ---------- STATES ----------- */
//   const [formData, setFormData] = useState({
//     anoLetivo: "",
//     semestre: "",
//     periodo: "",
//     curso: "",
//     unidadeCurricular: "",
//     modalidade: "",
//     classes: "",
//     apenasPrimeiroAno: "",
//     designacao: "",
//     capacidade: "",
//     docente: "",
//     tipoAula: "",
//     sala: "",
//   });

//   const [aulas, setAulas] = useState<AulaPayload[]>([]);

//   /* ---------- QUERIES ----------- */
//   const { data: academicYear, isLoading: isLoadingAcademicYear } =
//     useQueryAnoAcademico();
//   const { data: teachers = [], isLoading: isLoadingTeacher } =
//     useQueryTeacherByUC(formData.unidadeCurricular);
//   const { data: tipoDeSalas = [] } = useQueryTipoDeSalas();
//   const { data: semestres, isLoading: isLoadingSemestres } =
//     useQuerySemestres();
//   const { data: salas, isLoading: isLoadingSala } = useAvailableRooms({
//     anoLectivo: Number(formData.anoLetivo),

//     tipoAula: Number(formData?.tipoAula),
//     periodo: Number(formData?.periodo),
//   });
//   const { data: cursos, isLoading: isLoadingCurso } = useCursos();
//   const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

//   const { data: temposDisponiveis = [] } = useQueryTemposDisponiveis({
//     anoLectivo: Number(formData.anoLetivo),
//     periodo: Number(formData.periodo),
//   });

//   const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
//     useQueryDisciplinaWithFilter({
//       classe: formData.classes,
//       curso: formData.curso,
//       semestre: formData.semestre,
//     });
//   const { data: designacao } = useNextScheduleDesignation(
//     formData.curso
//       ? gerarSiglaCurso(
//           cursos.find((c) => c.codigo.toString() === formData.curso)
//             ?.designacao || "",
//         )
//       : undefined,
//     formData.classes,
//     formData.unidadeCurricular
//       ? unidadesCurriculares.find(
//           (c) => c.pk.toString() === formData.unidadeCurricular,
//         )?.codigo || ""
//       : "",
//     Number(formData.periodo),
//     Number(formData.anoLetivo),
//   );

//   const { data: classes = [], isLoading: isLoadingClasses } =
//     useQueryClassFilterByCurso({ curso: formData.curso });
//   const { data: modalidade = [], isLoading: isLoadingModalidade } =
//     useQueryModalidade();
//   /* ---------- COLISÃO ----------- */

//   const saveHorario = useSaveHorario();
//   useEffect(() => {}, [formData, aulas]);

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       designacao: designacao || "",
//     }));
//   }, [designacao]);

//   /* ---------- VALIDAR FORM ----------- */
//   const validateForm = () => {
//     for (const field of requiredFields) {
//       if (isEmpty(formData[field.key as keyof typeof formData])) {
//         toast({
//           variant: "destructive",
//           title: "Campo obrigatório",
//           description: `Preencha: ${field.label}`,
//         });
//         return false;
//       }
//     }

//     if (!aulas.length) {
//       toast({
//         variant: "destructive",
//         title: "Horário vazio",
//         description: "Selecione pelo menos uma aula.",
//       });
//       return false;
//     }

//     return true;
//   };

//   const isFormComplete =
//     requiredFields.every(
//       (f) => !isEmpty(formData[f.key as keyof typeof formData]),
//     ) && aulas.length > 0;

//   /* ---------- SUBMIT ----------- */
//   const handleResetHorario = () => {
//     setFormData({
//       anoLetivo: "",
//       semestre: "",
//       periodo: "",
//       curso: "",
//       unidadeCurricular: "",
//       modalidade: "",
//       classes: "",
//       apenasPrimeiroAno: "",
//       capacidade: "",
//       designacao: "",
//       docente: "",
//       tipoAula: "",
//       sala: "",
//     });
//     setAulas([]);
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const payload: SaveHorarioPayload = {
//       anoLectivo: Number(formData.anoLetivo),
//       semestre: Number(formData.semestre),
//       periodo: Number(formData.periodo),
//       curso: Number(formData.curso),
//       unidadeCurricular: Number(formData.unidadeCurricular),
//       modalidade: Number(formData.modalidade),
//       aulas,
//       apenasPrimeiroAno: Number(formData.apenasPrimeiroAno),
//       capacidade: Number(formData.capacidade),
//       designacao: formData.designacao,
//       estadoHorario: 2,
//       docente: Number(formData.docente),
//       tipoAula: Number(formData.tipoAula),
//       sala: Number(formData.sala),
//       turma: 0,
//       obs: "",
//     };

//     try {
//       await saveHorario.mutateAsync(payload);

//       toast({
//         title: "Sucesso",
//         description: "Horário criado com sucesso",
//       });

//       navigate("/horarios/listar");
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro ao criar horário",
//         description: "Verifique os dados e tente novamente",
//       });
//     }
//   };

//   /* ---------- UI ----------- */
//   return (
//     <div className="flex-1 space-y-6 p-8">
//       {/* BREADCRUMB */}
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
//           </BreadcrumbItem>

//           <BreadcrumbSeparator />

//           <BreadcrumbItem>
//             <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
//           </BreadcrumbItem>

//           <BreadcrumbSeparator />

//           <BreadcrumbItem>
//             <BreadcrumbPage>Criar Horário</BreadcrumbPage>
//           </BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>

//       {/* FORM */}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* GRID DE CAMPOS */}
//         <div className="grid md:grid-cols-4 gap-4">
//           {/* ANO */}
//           <FormSelect
//             disabled={isLoadingAcademicYear}
//             loading={isLoadingAcademicYear}
//             label="Ano Letivo"
//             value={formData.anoLetivo}
//             onChange={(v) => setFormData({ ...formData, anoLetivo: v })}
//             options={academicYear?.filter(
//               (ay) => ay.estado.toLowerCase() === "activo",
//             )}
//             map={(a) => ({
//               key: a.codigo,
//               label: a.designacao,
//               value: a.codigo,
//             })}
//           />
//           <FormSelect
//             disabled={
//               isLoadingPeriodos ||
//               isLoadingAcademicYear ||
//               formData.anoLetivo === ""
//             }
//             loading={isLoadingPeriodos}
//             label="Período"
//             value={formData.periodo}
//             onChange={(v) => setFormData({ ...formData, periodo: v })}
//             options={periodos}
//             map={(p) => ({
//               key: p.codigo,
//               label: p.designacao,
//               value: p.codigo,
//             })}
//           />

//           {/* SEMESTRE */}
//           <FormSelect
//             disabled={isLoadingSemestres}
//             loading={isLoadingSemestres}
//             label="Semestre"
//             value={formData.semestre}
//             onChange={(v) => setFormData({ ...formData, semestre: v })}
//             options={semestres}
//             map={(s) => ({
//               key: s.codigo,
//               label: s.designacao,
//               value: s.codigo,
//             })}
//           />

//           {/* CURSO */}
//           <FormSelect
//             disabled={isLoadingCurso}
//             loading={isLoadingCurso}
//             label="Curso"
//             value={formData.curso}
//             onChange={(v) =>
//               setFormData({
//                 ...formData,
//                 curso: v,
//                 unidadeCurricular: "",
//                 designacao: "",
//                 classes: "",
//               })
//             }
//             options={cursos}
//             map={(c) => ({
//               key: c.codigo,
//               label: c.designacao,
//               value: c.codigo,
//             })}
//           />
//           <FormSelect
//             label="Ano Curricular"
//             value={formData.classes}
//             disabled={isLoadingClasses || !formData.curso}
//             onChange={(v) => setFormData({ ...formData, classes: v })}
//             options={classes}
//             map={(c) => ({
//               key: c.codigo,
//               label: c.designacao,
//               value: c.codigo,
//             })}
//             loading={isLoadingClasses}
//           />

//           {/* PERÍODO */}

//           {/* UC */}
//           <FormSelect
//             label="Unidade Curricular"
//             value={formData.unidadeCurricular}
//             disabled={
//               isLoadingUC ||
//               !formData.semestre ||
//               !formData.curso ||
//               !formData.classes
//             }
//             onChange={(v) =>
//               setFormData({ ...formData, unidadeCurricular: v, designacao: "" })
//             }
//             options={unidadesCurriculares}
//             map={(u) => ({
//               key: u.pk,
//               label: u.descricao,
//               value: u.pk,
//             })}
//             loading={isLoadingUC}
//           />

//           {/* MODALIDADE */}
//           <FormSelect
//             label="Modalidade"
//             value={formData.modalidade}
//             disabled={isLoadingModalidade}
//             onChange={(v) => setFormData({ ...formData, modalidade: v })}
//             options={modalidade}
//             map={(m) => ({
//               key: m.pkModalidade,
//               label: m.designacao,
//               value: m.pkModalidade,
//             })}
//             loading={isLoadingModalidade}
//           />
//           <FormSelect
//             label="Reservada para novos estudantes"
//             value={formData.apenasPrimeiroAno}
//             onChange={(v) => setFormData({ ...formData, apenasPrimeiroAno: v })}
//             options={onlyFirstYear}
//             map={(m) => ({
//               key: m.value,
//               label: m.label,
//               value: m.value,
//             })}
//           />
//           <div className="">
//             <Label>Designação do Horário</Label>
//             <Input
//               readOnly
//               placeholder="Ex: Horário LEI 1º Ano - Manhã"
//               value={formData.designacao}
//               onChange={(e) =>
//                 setFormData({ ...formData, designacao: e.target.value })
//               }
//             />
//           </div>

//           {/* CAPACIDADE */}
//           <div>
//             <Label>Capacidade</Label>
//             <Input
//               type="number"
//               min={0}
//               placeholder="Ex: 40"
//               value={formData.capacidade}
//               onChange={(e) =>
//                 setFormData({ ...formData, capacidade: e.target.value })
//               }
//             />
//           </div>
//           <FormSelect
//             label="Docente"
//             value={formData.docente}
//             disabled={isLoadingTeacher}
//             onChange={(v) => setFormData({ ...formData, docente: v })}
//             options={teachers}
//             map={(t) => ({
//               key: t.pk,
//               label: t.nomeCompleto,
//               value: t.pk,
//             })}
//             loading={isLoadingTeacher}
//           />

//           {/* TIPO DE AULA */}
//           <div>
//             <Label>Tipo de Aula</Label>
//             <Select
//               value={formData.tipoAula}
//               onValueChange={(v) => setFormData({ ...formData, tipoAula: v })}
//             >
//               <SelectTrigger className="w-full ">
//                 <SelectValue placeholder="Escolha o tipo" />
//               </SelectTrigger>
//               <SelectContent>
//                 {tipoDeSalas.map((tipo) => (
//                   <SelectItem
//                     key={tipo.pkTipoAula}
//                     value={tipo.pkTipoAula.toString()}
//                   >
//                     {tipo.designacao}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* SALA */}
//           <div>
//             <Label>Sala</Label>
//             <Select
//               value={formData.sala}
//               onValueChange={(v) => setFormData({ ...formData, sala: v })}
//             >
//               <SelectTrigger
//                 disabled={Boolean(formData.tipoAula) === false || isLoadingSala}
//                 className="w-full "
//               >
//                 <SelectValue
//                   placeholder={
//                     <>
//                       {" "}
//                       {isLoadingSala ? (
//                         <span className="flex gap-2 items-center">
//                           Carregando <Loader2 className="animate-spin" />
//                         </span>
//                       ) : (
//                         "Selecione Salas"
//                       )}
//                     </>
//                   }
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 {salas?.map((sala) => (
//                   <SelectItem key={sala.salaid} value={sala.salaid.toString()}>
//                     {sala.sala}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* GRID DE HORÁRIOS */}
//         {temposDisponiveis.length > 0 &&
//           !!formData.anoLetivo &&
//           !!formData.anoLetivo &&
//           !!formData.periodo &&
//           !!formData.semestre &&
//           !!formData.unidadeCurricular &&
//           !!formData.modalidade && (
//             <ScheduleGrid
//               scheduleData={temposDisponiveis}
//               onChange={setAulas}
//             />
//           )}

//         {/* BOTÕES */}
//         <div className="flex justify-end gap-3 pt-6 border-t">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => {
//               navigate("/horarios/listar");
//             }}
//           >
//             <List className="mr-2 h-4 w-4" />
//             Listar Horário
//           </Button>
//           <Button type="button" variant="outline" onClick={handleResetHorario}>
//             <X className="mr-2 h-4 w-4" />
//             Cancelar
//           </Button>

//           <Button
//             type="submit"
//             disabled={!isFormComplete || saveHorario.isPending}
//           >
//             {saveHorario.isPending ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando
//               </>
//             ) : (
//               <>
//                 <Save className="mr-2 h-4 w-4" /> Guardar Horário
//               </>
//             )}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
// const onlyFirstYear = [
//   { value: 0, label: "Sim" },
//   { value: 1, label: "Não" },
// ];
// const STOP_WORDS = ["e", "de", "do", "da", "dos", "das"];

// function gerarSiglaCurso(nome: string) {
//   return nome
//     .split(" ")
//     .filter((p) => !STOP_WORDS.includes(p.toLowerCase()))
//     .map((p) => p[0].toUpperCase())
//     .join("");
// }
