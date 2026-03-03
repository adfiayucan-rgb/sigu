"use client";

import { useState, useMemo } from "react";
import { useActividades } from "@/lib/hooks";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { AddActividadDialog } from "@/components/materias/add-actividad-dialog";
import { ActividadConMateria, ActividadResponse } from "@/lib/types";
import { CardActividad } from "@/components/actividad/card-actividad";
import { FormState } from "@/actions/actividad";
import { toast } from "sonner";

export default function CalendarioPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddActividad, setShowAddActividad] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<ActividadConMateria | undefined>(undefined);

  const { data: actividades, isLoading, mutate: mutateActividades } = useActividades();

  const datesWithEvents = useMemo(() => {
    const dates = new Set<string>();
    actividades?.forEach((a) => {
      dates.add(format(new Date(a.fecha_entrega), "yyyy-MM-dd"));
    });
    return dates;
  }, [actividades]);

  const selectedActividades = useMemo(() => {
    if (!selectedDate) return [];
    return actividades?.filter((a) => isSameDay(new Date(a.fecha_entrega), selectedDate));
  }, [selectedDate, actividades]);

  const modifiers = useMemo(() => {
    return {
      hasEvent: (date: Date) => datesWithEvents.has(format(date, "yyyy-MM-dd")),
    };
  }, [datesWithEvents]);

  const modifiersClassNames = {
    hasEvent:
      "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary",
  };

  const handleAddActividad = (actividad?: ActividadConMateria) => {
    setSelectedActividad(actividad);
    setShowAddActividad(true);
  };

  const handleOnSuccessActividad = (dbActividad: ActividadResponse) => {
    mutateActividades((current: any) => {
      if (!current) return [dbActividad];

      // Buscamos si ya existe en la lista actual
      const existe = current.some((a: any) => a.id === dbActividad.id);

      if (existe) {
        // Caso EDITAR
        return current.map((a: any) => (a.id === dbActividad.id ? dbActividad : a));
      } else {
        // Caso CREAR
        return [dbActividad, ...current];
      }
    }, false);

    setShowAddActividad(false);
    setSelectedActividad(undefined);
  };

  const handleEliminarActividad = async (state: FormState) => {
    if (state.success && state.data) {
      mutateActividades((currentData) => {
        return currentData?.filter((act) => act.id !== state.data);
      });
      toast.success("Actividad eliminada con éxito");
    } else {
      toast.error(state.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Calendario</h1>
        <p className="text-sm text-muted-foreground">Vista mensual de entregas y examenes</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 rounded-lg" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={es}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="rounded-md w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center text-sm font-medium">
                {selectedDate ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es }) : "Selecciona una fecha"}
                <Button onClick={() => handleAddActividad()}>Agregar Actividad</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {!selectedActividades || selectedActividades.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Sin actividades para este dia</p>
              ) : (
                selectedActividades.map((a) => {
                  return (
                    <CardActividad
                      key={a.id}
                      actividad={a}
                      handleAddActividad={handleAddActividad}
                      onMutate={mutateActividades}
                      onEliminar={(a) => handleEliminarActividad(a)}
                    />
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <AddActividadDialog
        open={showAddActividad}
        onOpenChange={setShowAddActividad}
        onSuccess={(dbActividad) => handleOnSuccessActividad(dbActividad)}
        actividad={selectedActividad}
        selectedDate={selectedDate}
      />
    </div>
  );
}
