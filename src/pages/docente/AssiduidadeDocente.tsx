import AulaNormalContent from "../assiduidade/components/AulaNormalContent";

export default function AssiduidadeDocente() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Assiduidade Docente
          </h1>
          <p className="text-muted-foreground mt-1">
            Marcar assiduidade do docente
          </p>
        </div>
      </div>
      <AulaNormalContent />
    </div>
  );
}
