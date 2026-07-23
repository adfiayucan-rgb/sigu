"use client";
import { ActividadChip } from "@/components/actividad/actividad-chip";
import { Badge } from "@/components/ui/badge";
import { ActividadConMateria } from "@/lib/types";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "motion/react";

const MAX_VISIBLE = 2;

interface CalendarDayButtonProps {
  dateKey: string;
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  actividades: ActividadConMateria[];
  onActividadClick: (actividad: ActividadConMateria) => void;
  onToggleComplete: (actividad: ActividadConMateria) => void;
  onDayClick: (dateKey: string) => void;
}

export function CalendarDayButton({
  dateKey,
  day,
  isToday,
  isCurrentMonth,
  actividades,
  onActividadClick,
  onToggleComplete,
  onDayClick,
}: CalendarDayButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: dateKey });

  const visible = expanded ? actividades : actividades.slice(0, MAX_VISIBLE);
  const overflow = actividades.length - MAX_VISIBLE;

  return (
    <div
      ref={setNodeRef}
      className={[
        "flex flex-col gap-1 p-2 min-h-26 transition-colors duration-100",
        isToday ? "bg-[rgba(0,0,0,0.04)]" : "",
        !isCurrentMonth ? "opacity-30" : "",
        isOver ? "bg-blue-50" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Day number row */}
      <div className="flex items-center justify-between w-full cursor-pointer" onClick={() => onDayClick(dateKey)}>
        <span
          className={[
            "text-[12px] leading-4",
            isToday ? "font-bold" : isCurrentMonth ? "font-bold" : "font-medium text-muted-foreground",
          ].join(" ")}
        >
          {day}
        </span>
        {isToday && (
          //   <span className="bg-[#dae2fd] text-black text-[9px] font-bold leading-[13.5px] px-[4px] rounded-[2px]">
          //     HOY
          //   </span>
          <Badge variant={"secondary"}>HOY</Badge>
        )}
      </div>

      {/* Activity chips */}
      <motion.div layout className="flex flex-col gap-0.75 w-full">
        <AnimatePresence initial={false}>
          {visible.map((act) => (
            <motion.div
              key={act.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ActividadChip actividad={act} onClick={onActividadClick} onToggleComplete={onToggleComplete} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* +N more / collapse toggle */}
        {!expanded && overflow > 0 && (
          <button
            className="text-left text-[10px] text-[#3b82f6] font-semibold pl-0.5 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
          >
            +{overflow} más
          </button>
        )}
        {expanded && actividades.length > MAX_VISIBLE && (
          <button
            className="text-left text-[10px] text-[#45464d] font-medium pl-0.5 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(false);
            }}
          >
            Ver menos
          </button>
        )}
      </motion.div>
    </div>
  );
}
