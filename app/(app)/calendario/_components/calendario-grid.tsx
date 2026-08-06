import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { ActividadesPorDia } from "./calendario-view";

import { CalendarDayButton } from "./calendar-day-button";
import { ActividadConMateria } from "@/lib/types/actividad";

const DIAS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

interface CalendarioGridProps {
  currentDate: Date;
  actividadesPorDia: ActividadesPorDia;
  onActividadClick: (actividad: ActividadConMateria) => void;
  onToggleComplete: (actividad: ActividadConMateria) => void;
  onDayClick: (dateKey: string) => void;
}

export function CalendarioVistaMensual({
  currentDate,
  actividadesPorDia,
  onActividadClick,
  onDayClick,
  onToggleComplete,
}: CalendarioGridProps) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden w-full">
      {/* Header row */}
      <div className="grid grid-cols-7 bg-muted border-b">
        {DIAS.map((dia) => (
          <div key={dia} className="flex items-center justify-center py-3 border-r last:border-r-0">
            <span className="text-[12px] font-bold leading-4">{dia}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const key = format(day, "yyyy-MM-dd");
          const actividades = actividadesPorDia[key] ?? [];
          const currentMonth = isSameMonth(day, currentDate);
          const today = isToday(day);
          const isLastCol = (i + 1) % 7 === 0;
          const isLastRow = i >= days.length - 7;

          return (
            <div
              key={key}
              className={[
                "relative",
                !isLastCol ? "border-r" : "",
                !isLastRow ? "border-b" : "",
                today ? "shadow-[inset_0_0_0_2px_black]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <CalendarDayButton
                dateKey={key}
                day={day.getDate()}
                isToday={today}
                isCurrentMonth={currentMonth}
                actividades={actividades}
                onActividadClick={onActividadClick}
                onDayClick={onDayClick}
                onToggleComplete={onToggleComplete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
