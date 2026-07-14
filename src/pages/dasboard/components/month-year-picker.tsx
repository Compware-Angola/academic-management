import {
    Calendar1,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import React from "react"

const monthYearFormatter = new Intl.DateTimeFormat("pt-AO", {
    month: "long",
    year: "numeric",
})

const monthShortFormatter = new Intl.DateTimeFormat("pt-AO", {
    month: "short",
})

const MONTH_LABELS = Array.from({ length: 12 }, (_, i) => {
    const label = monthShortFormatter.format(new Date(2000, i, 1))
    return label.charAt(0).toUpperCase() + label.slice(1).replace(".", "")
})

export function formatMonthYear(date: Date) {
    const label = monthYearFormatter.format(date)
    return label.charAt(0).toUpperCase() + label.slice(1)
}

interface MonthYearPickerProps {
    date: Date
    onChange: (date: Date) => void
}

export function MonthYearPicker({ date, onChange }: MonthYearPickerProps) {
    const [open, setOpen] = React.useState(false)
    const [viewYear, setViewYear] = React.useState(date.getFullYear())

    React.useEffect(() => {
        if (open) setViewYear(date.getFullYear())
    }, [open, date])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[180px] justify-between text-left font-normal"
                >
                    <span className="truncate">{formatMonthYear(date)}</span>
                    <Calendar1 className="size-4 shrink-0 opacity-60" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
                <div className="mb-2 flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setViewYear((y) => y - 1)}
                        aria-label="Ano anterior"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm font-semibold tabular-nums">
                        {viewYear}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setViewYear((y) => y + 1)}
                        aria-label="Próximo ano"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    {MONTH_LABELS.map((label, index) => {
                        const isSelected =
                            date.getFullYear() === viewYear &&
                            date.getMonth() === index
                        return (
                            <Button
                                key={label}
                                type="button"
                                variant={isSelected ? "default" : "ghost"}
                                size="sm"
                                className="h-8 px-0 text-xs font-medium"
                                onClick={() => {
                                    onChange(new Date(viewYear, index, 1))
                                    setOpen(false)
                                }}
                            >
                                {label}
                            </Button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}

