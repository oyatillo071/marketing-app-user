import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string) {
  const currencyMap: Record<string, { symbol: string; rate: number; decimals: number }> = {
    USD: { symbol: "$", rate: 1, decimals: 2 },
    RUB: { symbol: "₽", rate: 80, decimals: 0 },
    UZS: { symbol: "UZS", rate: 12000, decimals: 0 },
    KZT: { symbol: "₸", rate: 450, decimals: 0 },
    KGS: { symbol: "KGS", rate: 90, decimals: 0 },
    TJS: { symbol: "TJS", rate: 12, decimals: 0 },
    CNY: { symbol: "¥", rate: 7, decimals: 2 },
  }

  const { symbol, rate, decimals } = currencyMap[currency] || currencyMap.USD

  // Convert amount based on currency rate
  const convertedAmount = amount * rate

  // Format with proper spacing between currency symbol and amount
  return `${symbol} ${convertedAmount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}
