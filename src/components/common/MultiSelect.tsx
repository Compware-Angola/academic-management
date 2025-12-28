"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
export function OverflowBehaviorMultiSelect() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Label>Frameworks</Label>
        <MultiSelect defaultValues={["next.js"]}>
          <MultiSelectTrigger className="w-full">
            <MultiSelectValue overflowBehavior={"cutoff"} />
          </MultiSelectTrigger>
          <MultiSelectContent>
            <MultiSelectGroup>
              <MultiSelectItem value="next.js">Next.js</MultiSelectItem>
              <MultiSelectItem value="sveltekit">SvelteKit</MultiSelectItem>
              <MultiSelectItem value="nuxt.js">Nuxt.js</MultiSelectItem>
              <MultiSelectItem value="remix">Remix</MultiSelectItem>
              <MultiSelectItem value="astro">Astro</MultiSelectItem>
              <MultiSelectItem value="vue">Vue.js</MultiSelectItem>
              <MultiSelectItem value="react">React</MultiSelectItem>
            </MultiSelectGroup>
          </MultiSelectContent>
        </MultiSelect>
      </div>
    </div>
  );
}
