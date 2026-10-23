import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const formatDOP = (amount: number | string): string => {
  const validAmount = isNaN(Number(amount)) ? 0 : Number(amount);
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
  }).format(validAmount).replace('DOP', 'RD$');
};
