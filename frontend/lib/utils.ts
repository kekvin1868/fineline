import type { Updater } from "@tanstack/vue-table"
import type { ClassValue } from "clsx"
import type { Ref } from "vue"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value
    = typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

/**
 * Format number as Indonesian Rupiah (IDR)
 * @param amount - The numeric amount to format
 * @param showSign - Whether to show + or - prefix for income/expense
 * @returns Formatted IDR string
 */
export function formatIDR(amount: number, showSign: boolean = false): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  
  const absAmount = Math.abs(amount)
  const formatted = formatter.format(absAmount)
  
  if (showSign) {
    const sign = amount >= 0 ? '+' : ''
    return `${sign}${formatted}`
  }
  
  return formatted
}

export function cookieParser(cookieString: string): Record<string, string> {
  const cookieValue = cookieString.split('; ').reduce((acc, curr) => {
    const [key, value] = curr.split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  return cookieValue
}
