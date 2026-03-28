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


/**
 * Convierte una hora en formato 24h (HH:mm) a 12h (hh:mm AM/PM)
 * @param hora24 Ejemplo: "16:30" o "00:15"
 * @returns Ejemplo: "4:30 PM" o "12:15 AM"
 */
export const formatearA12Horas = (hora24: string): string => {
  if (!hora24) return "Hora no definida";

  // Dividimos el string por los dos puntos
  let [horas, minutos] = hora24.split(':').map(Number);

  // Determinamos si es AM o PM
  const periodo = horas >= 12 ? 'p.m.' : 'a.m.';

  // Convertimos la hora al formato 12
  // El residuo de horas % 12 nos da la hora en base 12
  // Si el resultado es 0 (medianoche o mediodía), lo transformamos a 12
  horas = horas % 12 || 12;

  // Agregamos un cero inicial a los minutos si es necesario (ej: 4:05 en lugar de 4:5)
  const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;

  return `${horas}:${minutosFormateados} ${periodo}`;
};