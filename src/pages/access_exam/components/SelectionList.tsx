import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LatexText } from "@/util/LatexText";

function parseIdValues(value: string) {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isInteger(id) && id > 0)
    .filter((id, index, ids) => ids.indexOf(id) === index);
}

function toggleDelimitedId(value: string, id: number, selected: boolean) {
  const ids = parseIdValues(value);
  const nextIds = selected
    ? [...ids, id].filter((item, index, items) => items.indexOf(item) === index)
    : ids.filter((item) => item !== id);

  return nextIds.join(", ");
}

type SelectionListProps<T> = {
  value: string;
  items: T[];
  isLoading: boolean;
  emptyMessage: string;
  getId: (item: T) => number;
  getLabel: (item: T) => string;
  onChange: (value: string) => void;
};

export function SelectionList<T>({
  value,
  items,
  isLoading,
  emptyMessage,
  getId,
  getLabel,
  onChange,
}: SelectionListProps<T>) {
  const selectedIds = parseIdValues(value);

  if (isLoading) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        A carregar...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="rounded-md border h-44 w-full overflow-auto">
      {/* <ScrollArea className="h-44"> */}
        <div className="space-y-1 p-2">
          {items.map((item) => {
            const id = getId(item);
            const checked = selectedIds.includes(id);

            return (
              <label
                key={id}
                className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/60"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(nextChecked) =>
                    onChange(toggleDelimitedId(value, id, nextChecked === true))
                  }
                />
                <LatexText text={getLabel(item)} />
                {/* <span className="leading-5">{getLabel(item)}</span> */}
              </label>
            );
          })}
        </div>
      {/* </ScrollArea> */}
    </div>
  );
}
