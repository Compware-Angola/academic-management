"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangeFilterProps {
    value: DateRange | undefined
    onChangeValue: (range: DateRange | undefined) => void
    className?: string
}

export function DateRangeFilter({
    value,
    onChangeValue,
    className,
}: DateRangeFilterProps) {
    return (
        <Popover>
            <PopoverTrigger asChild >
                <Button
                    id="date-range"
                    variant="outline"
                    size="sm"
                    className={
                        cn(
                            "justify-start text-left font-normal",
                            !value && "text-muted-foreground",
                            className
                        )
                    }
                >
                    <CalendarIcon className="mr-2 size-4" />
                    {
                        value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "dd/MM/yyyy", { locale: pt })} —{" "}
                                    {format(value.to, "dd/MM/yyyy", { locale: pt })}
                                </>
                            ) : (
                                format(value.from, "dd/MM/yyyy", { locale: pt })
                            )
                        ) : (
                            <span>Selecionar período </span>
                        )}
                </Button>
            </PopoverTrigger>
            < PopoverContent className="w-auto p-0" align="end" >
                <Calendar
                    mode="range"
                    defaultMonth={value?.from}
                    selected={value}
                    onSelect={onChangeValue}
                    numberOfMonths={2}
                    locale={pt}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}