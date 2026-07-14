const kzFullFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
})

const kzCompactFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
})

const countFormatter = new Intl.NumberFormat("pt-AO")

/** Valor completo, ex: "145.885.246 Kz" — usado em totais, tooltips, etc. */
export function formatKz(value: number) {
    return kzFullFormatter.format(value ?? 0)
}

/** Valor compacto, ex: "145,9 mi Kz" — usado em eixos de gráfico, cards pequenos. */
export function formatKzCompact(value: number) {
    return kzCompactFormatter.format(value ?? 0)
}

/** Contagem simples, ex: "1.234" */
export function formatCount(value: number) {
    return countFormatter.format(value ?? 0)
}