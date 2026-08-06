import { useState } from "react";
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { useDraggable, useDroppable, useDndMonitor } from "@dnd-kit/core";
import {
  addMinutesToTime,
  DAY_START_HOUR,
  deltaYToMinutes,
  durationToHeight,
  HOURS,
  SLOT_HEIGHT,
  timeToTop,
} from "@/lib/utils-time";
import { hexToRgba } from "@/lib/utils";
import { ActividadesPorDia } from "./calendario-view";
import { AnimatePresence, motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { ActividadConMateria } from "@/lib/types/actividad";

// ─── Draggable activity block ─────────────────────────────────────────────────
function ActividadBlockDia({
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
      className="absolute left-1 right-1 rounded-[6px] overflow-hidden border-l-4 cursor-grab active:cursor-grabbing select-none"
      style={{
        top,
        height,
        backgroundColor: hexToRgba(actividad.materia.color_hex, 0.15),
        borderColor: actividad.materia.color_hex,
        opacity: isDragging ? 0.25 : actividad.completada ? 0.6 : 1,
        transition: "opacity 0.1s",
      }}
      onClick={() => onClick(actividad)}
    >
      <div className="flex flex-col px-3 py-2 h-full">
        {actividad.hora_inicio && actividad.hora_fin && (
          <span className="text-[12px] leading-4" style={{ color: actividad.materia.color_hex }}>
            {actividad.hora_inicio} – {actividad.hora_fin}
          </span>
        )}
        <span
          className={["text-[15px] font-bold leading-5", actividad.completada ? "line-through" : ""].join(" ")}
          style={{ color: actividad.materia.color_hex }}
        >
          {actividad.titulo}
        </span>
        {/* {actividad.lugar && (
          <span className="text-[12px] leading-4 mt-0.5" style={{ color: actividad.materia.color_hex }}>
            {actividad.lugar}
          </span>
        )} */}
        {actividad.materia && (
          <span
            className="text-[11px] leading-3.5 mt-auto opacity-70"
            style={{ color: actividad.materia.color_hex }}
          >
            {actividad.materia.nombre}
          </span>
        )}
      </div>
      <button
        className="absolute top-2 right-2 size-4 rounded-full border-2 flex items-center justify-center"
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
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Ghost slot (shown while dragging in this column) ────────────────────────
function GhostSlot({ actividad, deltaY }: { actividad: ActividadConMateria; deltaY: number }) {
  if (!actividad.hora_inicio || !actividad.hora_fin) return null;
  const mins = deltaYToMinutes(deltaY);
  const newInicio = addMinutesToTime(actividad.hora_inicio, mins);
  const newFin = addMinutesToTime(actividad.hora_fin, mins);
  const top = timeToTop(newInicio);
  const height = durationToHeight(newInicio, newFin);

  return (
    <div
      className="absolute left-1 right-1 rounded-[6px] border-l-4 border-dashed pointer-events-none z-5"
      style={{
        top,
        height,
        borderColor: actividad.materia.color_hex,
        backgroundColor: hexToRgba(actividad.materia.color_hex, 0.15),
        opacity: 0.5,
      }}
    >
      <div className="px-3 py-1.5">
        <span className="text-[12px] font-semibold" style={{ color: actividad.materia.color_hex }}>
          {newInicio} – {newFin}
        </span>
        <p className="text-[13px] font-bold mt-0.5" style={{ color: actividad.materia.color_hex }}>
          {actividad.titulo}
        </p>
      </div>
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
        <div className="size-2.5 rounded-full bg-red-500 -ml-1.25 shrink-0" />
        <div className="flex-1 h-0.5 bg-red-500" />
      </div>
    </div>
  );
}

// ─── VistaDiaria ─────────────────────────────────────────────────────────────
interface VistaDiariaProps {
  currentDate: Date;
  actividadesPorDia: ActividadesPorDia;
  onActividadClick: (a: ActividadConMateria) => void;
  onToggleComplete: (a: ActividadConMateria) => void;
  onHourClick: (day: Date, hour: number) => void;
}

export function CalendarioVistaDiaria({
  currentDate,
  actividadesPorDia,
  onActividadClick,
  onToggleComplete,
  onHourClick,
}: VistaDiariaProps) {
  const today = isToday(currentDate);
  const dateKey = format(currentDate, "yyyy-MM-dd");
  const { setNodeRef, isOver } = useDroppable({ id: dateKey });

  // Live drag tracking
  const [dragging, setDragging] = useState<{ act: ActividadConMateria; deltaY: number } | null>(null);

  useDndMonitor({
    onDragStart(e) {
      const act = e.active.data.current?.actividad as ActividadConMateria | undefined;
      if (act) setDragging({ act, deltaY: 0 });
    },
    onDragMove(e) {
      const act = e.active.data.current?.actividad as ActividadConMateria | undefined;
      if (act) setDragging({ act, deltaY: e.delta.y });
    },
    onDragEnd() {
      setDragging(null);
    },
    onDragCancel() {
      setDragging(null);
    },
  });

  const actividades = (actividadesPorDia[dateKey] ?? []).filter((a) => a.hora_inicio && a.hora_fin);
  const allDay = actividadesPorDia[dateKey]?.filter((a) => !a.hora_inicio) ?? [];

  const dayLabel = format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es });
  const dayLabelCap = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

  const handleColumnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't open modal if clicking on an activity
    if ((e.target as HTMLElement).closest("[data-activity]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hour = Math.floor(y / SLOT_HEIGHT) + DAY_START_HOUR;
    onHourClick(currentDate, hour);
  };

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden w-full">
      {/* Day header */}
      <div className=" border-b px-6 py-3.5 flex items-center gap-3">
        <span className={["text-[18px] font-semibold capitalize", today ? "text-primary" : ""].join(" ")}>
          {dayLabelCap}
        </span>
        {today && <Badge variant="secondary">HOY</Badge>}
        <span className="ml-auto text-[12px] text-[#6b7280]">
          {actividades.length} actividad{actividades.length !== 1 ? "es" : ""}
        </span>
      </div>

      {/* All-day events */}
      {allDay.length > 0 && (
        <div className="border-b px-6 py-2.5 flex gap-2 flex-wrap items-center">
          <span className="text-[11px] text-muted-foreground font-medium mr-1">Todo el día</span>
          {allDay.map((act) => (
            <div
              key={act.id}
              className="px-2 py-0.5 rounded-lg text-[12px] font-semibold cursor-pointer border-l-[3px] hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: hexToRgba(act.materia.color_hex, 0.15),
                borderColor: act.materia.color_hex,
                color: act.materia.color_hex,
              }}
              onClick={() => onActividadClick(act)}
            >
              {act.titulo}
            </div>
          ))}
        </div>
      )}

      {/* Time grid */}
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <div className="flex">
          {/* Time labels */}
          <div className="w-16 shrink-0 border-r ">
            {HOURS.map((h) => (
              <div key={h} className="flex items-start justify-end pr-2" style={{ height: SLOT_HEIGHT }}>
                <span className="text-[11px] text-[#6b7280] leading-none -mt-1.75">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Column */}
          <div
            ref={setNodeRef}
            className="flex-1 relative"
            style={{
              height: SLOT_HEIGHT * HOURS.length,
              backgroundColor: isOver ? "rgba(219,234,254,0.12)" : undefined,
              transition: "background-color 0.1s",
              cursor: "cell",
            }}
            onClick={handleColumnClick}
          >
            {/* Hour lines */}
            {HOURS.map((_, i) => (
              <div key={i} className="absolute left-0 right-0 border-t" style={{ top: i * SLOT_HEIGHT }} />
            ))}
            {/* Half-hour lines */}
            {HOURS.map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 border-t border-dashed "
                style={{ top: i * SLOT_HEIGHT + SLOT_HEIGHT / 2 }}
              />
            ))}

            {today && <CurrentTimeIndicator />}

            {/* Ghost slot */}
            {dragging && <GhostSlot actividad={dragging.act} deltaY={dragging.deltaY} />}

            {/* Activities */}
            <AnimatePresence>
              {actividades.map((act) => (
                <motion.div
                  key={act.id}
                  data-activity
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="absolute inset-x-0"
                >
                  <ActividadBlockDia actividad={act} onClick={onActividadClick} onToggleComplete={onToggleComplete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
