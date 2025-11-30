import { Info } from "lucide-react";

type Item = {
  sigla: string;
  descricao: string;
};

type Props = {
  items: Item[];
};

export function Legend({ items }: Props) {
  return (
    <div className="flex items-start gap-3 bg-muted/40 border rounded-lg p-3 text-sm mb-4">
      <Info className="w-4 h-4 mt-1 text-muted-foreground" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.sigla} className="flex gap-1">
            <span className="font-semibold text-foreground">{item.sigla}</span>
            <span className="text-muted-foreground">– {item.descricao}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
