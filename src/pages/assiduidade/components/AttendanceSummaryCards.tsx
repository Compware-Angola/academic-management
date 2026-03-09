type Props = {
  total: number;
  pendentes: number;
  faltas: number;
  presencas: number;
};

function CardItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export default function AttendanceSummaryCards({ total, pendentes, faltas, presencas }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <CardItem label="Total de aulas" value={total} />
      <CardItem label="Pendentes" value={pendentes} />
      <CardItem label="Faltas" value={faltas} />
      <CardItem label="Presenças" value={presencas} />
    </div>
  );
}