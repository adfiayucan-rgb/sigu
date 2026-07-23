import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HorarioConMateria } from "@/lib/types";
import { HORAS } from "@/lib/utils-time";
import { HorarioChip } from "./horario-chip";

const DIAS = [
  { value: 1, label: "Lunes", short: "Lun" },
  { value: 2, label: "Martes", short: "Mar" },
  { value: 3, label: "Miércoles", short: "Mié" },
  { value: 4, label: "Jueves", short: "Jue" },
  { value: 5, label: "Viernes", short: "Vie" },
  { value: 6, label: "Sábado", short: "Sáb" },
];

type Props = {
  horarios: HorarioConMateria[];
};

export function HorarioGrid({ horarios }: Props) {
  const today = new Date().getDay();

  const horariosPorDia = () => {
    const grouped: Record<number, HorarioConMateria[]> = {};

    DIAS.forEach(({ value }) => {
      grouped[value] = [];
    });

    horarios.forEach((horario) => {
      grouped[horario.dia]?.push(horario);
    });

    return grouped;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">Vista Semanal</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <div className="min-w-200">
            {/* Header */}
            <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-1 mb-2">
              <div className="text-xs font-medium text-muted-foreground text-center py-2">Hora</div>
              {DIAS.map((dia) => (
                <div
                  key={dia.value}
                  className={`text-xs font-medium text-center py-2 rounded-lg ${
                    dia.value === today ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="hidden sm:inline">{dia.label}</span>
                  <span className="sm:hidden">{dia.short}</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-1">
              {/* Time column */}
              <div className="flex flex-col">
                {HORAS.map((hora) => (
                  <div key={hora} className="h-16 text-[11px] text-muted-foreground text-right pr-2 pt-0.5">
                    {hora.toString().padStart(2, "0")}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DIAS.map((dia) => (
                <div key={dia.value} className={`relative border-l ${dia.value === today ? "bg-primary/5" : ""}`}>
                  {/* Hour lines */}
                  {HORAS.map((hora) => (
                    <div key={hora} className="h-16 border-t border-dashed border-border/50" />
                  ))}
                  {/* Horarios */}
                  {horariosPorDia()[dia.value].map((h) => (
                    <HorarioChip key={h.id} horario={h}/>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
