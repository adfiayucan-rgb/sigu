import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string | undefined) {
  console.log(dateString);
  
  if (!dateString) return "";

  const date = new Date(dateString);
  
  // getTimezoneOffset() devuelve la diferencia en minutos (ej. 300 para Colombia)
  // Multiplicamos por 60000 para pasar de minutos a milisegundos
  const offset = date.getTimezoneOffset() * 60000;
  
  // Creamos una nueva fecha ajustada restando el offset
  const localDate = new Date(date.getTime() - offset);

  // Ahora el .toISOString() devolverá tu hora local exacta
  // Ejemplo: "2026-03-01T07:00:00.000Z" -> Cortamos a "2026-03-01T07:00"
  return localDate.toISOString().slice(0, 16);
};