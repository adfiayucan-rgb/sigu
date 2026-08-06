import { ActividadesPorDia } from "./calendario-view";
import { addDays, format, isToday, isWeekend, startOfWeek } from "date-fns";
import { useRef } from "react";
import { DAY_START_HOUR, durationToHeight, HOURS, SLOT_HEIGHT, timeToTop } from "@/lib/utils-time";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "motion/react";
import { hexToRgba } from "@/lib/utils";
import { ActividadConMateria } from "@/lib/types/actividad";

const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

// ─── Draggable activity block ─────────────────────────────────────────────────
function ActividadBlock({
  actividad,
  onClick,
  onToggleComplete,
}: {
  actividad: ActividadConMateria;
  onClick: (a: ActividadConMateria) => void;
  onToggleComplete: (a: ActividadConMateria) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: actividad.id,
    data: { actividad },
  });

  const top = actividad.hora_inicio ? timeToTop(actividad.hora_inicio) : 0;
  const height =
    actividad.hora_inicio && actividad.hora_fin
      ? durationToHeight(actividad.hora_inicio, actividad.hora_fin)
      : SLOT_HEIGHT;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="absolute left-0.5 right-0.5 rounded-lg overflow-hidden border-l-[3px] cursor-grab active:cursor-grabbing select-none"
      style={{
        top,
        height,
        backgroundColor: hexToRgba(actividad.materia.color_hex, 0.15),
        borderColor: actividad.materia.color_hex,
        opacity: isDragging ? 0.4 : actividad.completada ? 0.6 : 1,
        zIndex: isDragging ? 50 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();

        if (isDragging) return;

        onClick(actividad);
      }}
    >
      <div className="flex flex-col px-1.5 py-1 h-full">
        {actividad.hora_inicio && actividad.hora_fin && (
          <span className="text-[9px] leading-3" style={{ color: actividad.materia.color_hex }}>
            {actividad.hora_inicio} - {actividad.hora_fin}
          </span>
        )}
        <span
          className={["text-[11px] font-bold leading-3.5 truncate", actividad.completada ? "line-through" : ""].join(
            " ",
          )}
          style={{ color: actividad.materia.color_hex }}
        >
          {actividad.titulo}
        </span>
        {/* {height > 40 && actividad.lugar && (
          <span className="text-[9px] leading-3 truncate" style={{ color: actividad.materia.color_hex }}>
            {actividad.lugar}
          </span>
        )} */}
        {height > 56 && actividad.es_examen && (
          <span
            className="mt-auto text-[8px] font-bold tracking-wide px-1 py-px rounded-[2px] self-start"
            style={{ backgroundColor: actividad.materia.color_hex, color: "white" }}
          >
            EXAMEN
          </span>
        )}
      </div>
      {/* complete toggle */}
      <button
        className="absolute top-1 right-1 size-3 rounded-full border flex items-center justify-center"
        style={{
          borderColor: actividad.materia.color_hex,
          backgroundColor: actividad.completada ? hexToRgba(actividad.materia.color_hex, 0.15) : "transparent",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(actividad);
        }}
      >
        {actividad.completada && (
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
            <path d="M1.5 3.5l1.5 1.5L5.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Droppable day column ─────────────────────────────────────────────────────
function DayColumn({
  day,
  actividades,
  onClick,
  onToggleComplete,
  onActividadClick,
}: {
  day: Date;
  actividades: ActividadConMateria[];
  onClick: (day: Date, hour: number) => void;
  onToggleComplete: (a: ActividadConMateria) => void;
  onActividadClick: (a: ActividadConMateria) => void;
}) {
  const dateKey = format(day, "yyyy-MM-dd");
  const { setNodeRef, isOver } = useDroppable({ id: dateKey });

  const handleColumnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hour = Math.floor(y / SLOT_HEIGHT) + DAY_START_HOUR;
    onClick(day, hour);
  };

  return (
    <div
      ref={setNodeRef}
      className="relative border-r last:border-r-0 cursor-pointer"
      style={{
        height: SLOT_HEIGHT * HOURS.length,
        backgroundColor: isOver ? "rgba(219,234,254,0.15)" : undefined,
        transition: "background-color 0.15s",
      }}
      onClick={handleColumnClick}
    >
      {/* Hour grid lines */}
      {HOURS.map((_, i) => (
        <div key={i} className="absolute left-0 right-0 border-t" style={{ top: i * SLOT_HEIGHT }} />
      ))}
      {/* Half-hour lines */}
      {HOURS.map((_, i) => (
        <div
          key={`half-${i}`}
          className="absolute left-0 right-0 border-t border-dashed"
          style={{ top: i * SLOT_HEIGHT + SLOT_HEIGHT / 2 }}
        />
      ))}

      {/* Activities */}
      <AnimatePresence>
        {actividades.map((act) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-x-0"
          >
            <ActividadBlock actividad={act} onClick={onActividadClick} onToggleComplete={onToggleComplete} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Current time indicator ───────────────────────────────────────────────────
function CurrentTimeIndicator() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes() - DAY_START_HOUR * 60;
  if (mins < 0 || mins > HOURS.length * 60) return null;
  const top = (mins / 60) * SLOT_HEIGHT;
  return (
    <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top }}>
      <div className="flex items-center">
        <div className="size-2 rounded-full bg-red-500 -ml-1 shrink-0" />
        <div className="flex-1 h-[1.5px] bg-red-500" />
      </div>
    </div>
  );
}

type Props = {
  currentDate: Date;
  actividadesPorDia: ActividadesPorDia;
  onActividadClick: (a: ActividadConMateria) => void;
  onToggleComplete: (a: ActividadConMateria) => void;
  onDayHourClick: (day: Date, hour: number) => void;
};

export function CalendarioVistaSemanal({
  currentDate,
  actividadesPorDia,
  onActividadClick,
  onDayHourClick,
  onToggleComplete,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Monday-start week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden w-full">
      {/* Day headers */}
      <div className="flex border-b sticky top-0 z-20">
        {/* Time gutter spacer */}
        <div className="w-14 shrink-0 border-r" />
        {days.map((day, i) => {
          const today = isToday(day);
          const weekend = isWeekend(day);
          return (
            <div key={i} className="flex-1 flex flex-col items-center py-2 border-r last:border-r-0">
              <span
                className={["text-[11px] font-bold uppercase leading-3.5", weekend ? "text-red-500" : ""].join(" ")}
              >
                {DIAS_SEMANA[i]}
              </span>
              <span
                className={[
                  "text-[20px] font-bold leading-7 mt-px",
                  today ? "text-[#1d4ed8] underline underline-offset-4 decoration-2" : weekend ? "text-red-500" : "",
                ].join(" ")}
              >
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
        <div className="flex">
          {/* Time labels */}
          <div className="w-14 shrink-0 border-r relative">
            {HOURS.map((h) => (
              <div key={h} className="flex items-start justify-end pr-2" style={{ height: SLOT_HEIGHT }}>
                <span className="text-[11px] leading-none -mt-1.75">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
            <div className="relative col-span-7 grid" style={{ gridTemplateColumns: `repeat(7, 1fr)` }}>
              {/* Today current time indicator */}
              {days.map((day, i) =>
                isToday(day) ? (
                  <div key={`time-${i}`} className="relative" style={{ gridColumn: i + 1 }}>
                    <CurrentTimeIndicator />
                  </div>
                ) : null,
              )}
            </div>
            {days.map((day, i) => {
              const key = format(day, "yyyy-MM-dd");
              const actsForDay = (actividadesPorDia[key] ?? []).filter((a) => a.hora_inicio && a.hora_fin);
              return (
                <DayColumn
                  key={i}
                  day={day}
                  actividades={actsForDay}
                  onClick={onDayHourClick}
                  onToggleComplete={onToggleComplete}
                  onActividadClick={onActividadClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
