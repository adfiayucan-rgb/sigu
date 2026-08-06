import { Badge } from "@/components/ui/badge";
import { HorarioConMateria } from "@/lib/types/horario";
import { timeToMinutes } from "@/lib/utils-time";
import { Calendar, Clock } from "lucide-react";

type Props = {
  horarios: HorarioConMateria[];
};
export function HorarioStats({ horarios }: Props) {
  const totalHoras = horarios.reduce((acc, h) => {
    const start = timeToMinutes(h.hora_inicio);
    const end = timeToMinutes(h.hora_fin);

    return acc + (end - start) / 60;
  }, 0);

  return (
    <div className="flex justify-end gap-3">
      <Badge variant="secondary">
        <Calendar data-icon="inline-start" />
        {horarios.length} clases/semana
      </Badge>
      <Badge variant="secondary">
        <Clock data-icon="inline-start"/>
        {totalHoras.toFixed(0)}h semanales
      </Badge>
    </div>
  );
}
