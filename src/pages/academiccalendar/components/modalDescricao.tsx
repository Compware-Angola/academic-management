import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface DescriptionModalProps {
  title?: string;
  description: string;
}

export function DescriptionModal({
  title = "Descrição completa",
  description,
}: DescriptionModalProps) {
  return (
    <Dialog>
      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
        <DialogTrigger>
          <Eye className="h-4 w-4" />
        </DialogTrigger>
      </Button>

      <DialogContent
        className="
          fixed
          left-[50%]
          top-[50%]
          z-[9999]
          w-[90vw]
          max-w-lg
          translate-x-[-50%]
          translate-y-[-50%]
          rounded-lg
        "
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto break-words text-sm">
          {description}
        </div>
      </DialogContent>
    </Dialog>
  );
}
