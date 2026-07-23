import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHorariosByDay } from "@/lib/horario/queries";
import { Horario } from "@/lib/types";
import { formatearA12Horas } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { Suspense } from "react";

const DIAS_LABEL: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

type Props = {
  clasesHoy: Horario[];
};

export function DashboardTodaySchedule() {
  const today = new Date().getDay();

  return (
    <Card className="lg:col-span-2 bg-linear-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium">Hoy, {DIAS_LABEL[today ?? 1]}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {format(new Date(), "d MMM", { locale: es })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Cargando...</div>}>
          <ClasesHoy />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function ClasesHoy() {
  const today = new Date().getDay();
  const clasesHoy = await getHorariosByDay(today);

  return (
    <div>
      {clasesHoy.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No tienes clases programadas hoy.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {clasesHoy.map((h) => (
            <div key={h.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
              <div className="h-10 w-1 rounded-full" style={{ backgroundColor: h.materia.color_hex }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{h.materia.nombre}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatearA12Horas(h.hora_inicio.slice(0, 5))} - {formatearA12Horas(h.hora_fin.slice(0, 5))}
                  </span>
                  {h.salon && (
                    <>
                      <span className="text-muted-foreground/50">|</span>
                      <span>{h.salon}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
