// lib/utils/format-date.ts

import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

export enum DateFormat {
  LONG = "LONG", // 15 de noviembre de 2024
  CLASSIC = "CLASSIC", // 15 de Noviembre, 2024
  COMPACT = "COMPACT", // 15 nov. 2024
  MONTH_YEAR = "MONTH_YEAR", // Noviembre 2024
  SHORT = "SHORT", // 15/11/2024
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function formatDate(date: string, formatType: DateFormat = DateFormat.LONG) {
  const value = parse(date, "yyyy-MM-dd", new Date());

  switch (formatType) {
    case DateFormat.LONG:
      return format(date, "d 'de' MMMM 'de' yyyy", {
        locale: es,
      });

    case DateFormat.CLASSIC:
      return capitalize(
        format(value, "d 'de' MMMM, yyyy", {
          locale: es,
        }),
      );

    case DateFormat.COMPACT:
      return format(value, "d MMM. yyyy", {
        locale: es,
      });

    case DateFormat.MONTH_YEAR:
      return capitalize(
        format(value, "MMMM yyyy", {
          locale: es,
        }),
      );

    case DateFormat.SHORT:
      return format(value, "dd/MM/yyyy", {
        locale: es,
      });

    default:
      return format(value, "PPP", {
        locale: es,
      });
  }
}
