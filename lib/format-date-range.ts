// lib/utils/format-time-range.ts

import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

export enum TimeRangeFormat {
  /**
   * 6:38–7:38 p. m.
   */
  COMPACT = "COMPACT",

  /**
   * 6:38 p. m. - 7:38 p. m.
   */
  CLASSIC = "CLASSIC",

  /**
   * 18:38 - 19:38
   */
  MILITARY = "MILITARY",
}

/**
 * Formatea un rango de horas.
 *
 * La hora de inicio y fin deben estar en formato de 24 horas (`HH:mm:ss`).
 *
 * ## Formatos disponibles
 *
 * - `TimeRangeFormat.COMPACT`
 *   ```text
 *   6:38–7:38 p. m.
 *   ```
 *
 * - `TimeRangeFormat.CLASSIC`
 *   ```text
 *   6:38 p. m. - 7:38 p. m.
 *   ```
 *
 * - `TimeRangeFormat.MILITARY`
 *   ```text
 *   18:38 - 19:38
 *   ```
 *
 * @param startTime Hora de inicio (`HH:mm:ss`).
 * @param endTime Hora de fin (`HH:mm:ss`).
 * @param formatType Formato del rango de horas.
 * @returns Rango de horas formateado.
 */
export function formatTimeRange(
  startTime: string,
  endTime: string,
  formatType: TimeRangeFormat = TimeRangeFormat.COMPACT
): string {
  const start = parse(startTime, "HH:mm:ss", new Date());
  const end = parse(endTime, "HH:mm:ss", new Date());

  switch (formatType) {
    case TimeRangeFormat.COMPACT: {
      const startPeriod = format(start, "aaaa", { locale: es });
      const endPeriod = format(end, "aaaa", { locale: es });

      if (startPeriod === endPeriod) {
        return `${format(start, "h:mm", {
          locale: es,
        })}–${format(end, "h:mm", {
          locale: es,
        })} ${endPeriod}`;
      }

      return `${format(start, "h:mm aaaa", {
        locale: es,
      })}–${format(end, "h:mm aaaa", {
        locale: es,
      })}`;
    }

    case TimeRangeFormat.CLASSIC:
      return `${format(start, "h:mm aaaa", {
        locale: es,
      })} - ${format(end, "h:mm aaaa", {
        locale: es,
      })}`;

    case TimeRangeFormat.MILITARY:
      return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;

    default:
      return `${format(start, "h:mm aaaa", {
        locale: es,
      })} - ${format(end, "h:mm aaaa", {
        locale: es,
      })}`;
  }
}