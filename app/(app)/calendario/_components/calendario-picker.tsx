"use client"

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActividadConMateria } from "@/lib/types/actividad";
import { parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useMemo, useState } from "react";

type Props = {
  actividades: ActividadConMateria[];
  onFechaSeleccionada: (date: Date) => void;
};

export function CalendarioPicker({ actividades, onFechaSeleccionada }: Props) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());

  const diasConActividad = useMemo(() => actividades.map((a) => parseISO(a.fecha_entrega)), [actividades]);

  function handleSelect(date: Date | undefined) {
    if (!date) return;

    setFechaSeleccionada(date);
    onFechaSeleccionada(date)
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Calendario</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            required
            locale={es}
            selected={fechaSeleccionada}
            onSelect={handleSelect}
            modifiers={{ tieneActividad: diasConActividad }}
            modifiersClassNames={{
              tieneActividad:
                "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
            }}
            className="w-full [--cell-size:--spacing(9)]"
          />
        </CardContent>
      </Card>
    </>
  );
}
