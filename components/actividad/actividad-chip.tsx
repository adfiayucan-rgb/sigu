
import { hexToRgba } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "motion/react";
import { CSS } from "@dnd-kit/utilities";
import { ActividadConMateria } from "@/lib/types/actividad";

interface ActividadChipProps {
  actividad: ActividadConMateria;
  onClick: (actividad: ActividadConMateria) => void;
  onToggleComplete?: (actividad: ActividadConMateria) => void;
}

export function ActividadChip({ actividad, onClick, onToggleComplete }: ActividadChipProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: actividad.id,
    data: {
      actividad,
    },
  });
  return (
    <motion.div
      className="relative rounded-[2px] w-full cursor-pointer group"
      onClick={() => onClick(actividad)}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        backgroundColor: hexToRgba(
          actividad.materia.color_hex,
          0.15
        ),
        opacity: isDragging
          ? 0.4
          : actividad.completada
            ? 0.6
            : 1,
      }}
    >
      <div
        className="absolute inset-0 rounded-[2px] border-l-[3px] pointer-events-none"
        style={{ borderColor: actividad.materia.color_hex }}
      />
      <div className="flex items-center overflow-hidden pl-2.25 pr-1.5 py-0.5 gap-1">
        {onToggleComplete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(actividad);
            }}
            className="shrink-0 size-2.5 rounded-full border flex items-center justify-center"
            style={{
              borderColor: actividad.materia.color_hex,
              backgroundColor: actividad.completada ? hexToRgba(actividad.materia.color_hex, 0.15) : "transparent",
            }}
          >
            {actividad.completada && (
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path d="M1 3l1.5 1.5L5 1.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
        <span
          className={[
            "text-[10px] font-semibold leading-3.75 truncate whitespace-nowrap",
            actividad.completada ? "line-through" : "",
          ].join(" ")}
          style={{ color: actividad.materia.color_hex }}
        >
          {actividad.titulo}
        </span>

        {/* //TODO: Futura implementacion */}
        {/* {actividad.recordatorio?.activo && (
          <span className="shrink-0 text-[8px]" title="Recordatorio activo">
            🔔
          </span>
        )}
        {actividad.recurrencia?.activa && (
          <span className="shrink-0 text-[8px]" title="Actividad recurrente">
            🔁
          </span>
        )} */}
      </div>
    </motion.div>
  );
}
