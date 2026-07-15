export function formatNumber(value: number) {
    return new Intl.NumberFormat("pt-PT").format(value ?? 0)
}