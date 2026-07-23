import { HorarioConMateria } from "@/lib/types";
import { timeToMinutes } from "@/lib/utils-time";
import { Clock, MapPin } from "lucide-react";

type Props = {
  horario: HorarioConMateria;
};
export function HorarioChip({ horario }: Props) {
  const startMinutes = timeToMinutes(horario.hora_inicio);
  const endMinutes = timeToMinutes(horario.hora_fin);
  const durationMinutes = endMinutes - startMinutes;

  const startHour = Math.floor(startMinutes / 60);
  const startOffset = (startMinutes % 60) / 60;

  const top = (startHour - 6 + startOffset) * 64; // 64px per hour
  const height = (durationMinutes / 60) * 64;

  return (
    <div
      className="absolute left-1 right-1 rounded-lg p-2 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] shadow-sm"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: horario.materia.color_hex || "#3b82f6",
        minHeight: "48px",
      }}
    >
      <div className="flex flex-col h-full text-white">
        <span className="font-semibold text-xs leading-tight truncate">{horario.materia?.nombre}</span>
        <span className="text-[10px] opacity-90 flex items-center gap-1 mt-0.5">
          <Clock className="h-2.5 w-2.5" />
          {horario.hora_inicio.slice(0, 5)} - {horario.hora_fin.slice(0, 5)}
        </span>
        {horario.salon && height > 60 && (
          <span className="text-[10px] opacity-90 flex items-center gap-1 mt-auto">
            <MapPin className="h-2.5 w-2.5" />
            {horario.salon}
          </span>
        )}
      </div>
    </div>
  );
}
