"use client";

import { ActividadConMateria, MateriaSelect } from "@/lib/types";
import { CalendarioPicker } from "./calendario-picker";
import { useState } from "react";
import { ActividadViewList } from "@/components/actividad/actividad-view-list";

type Props = {
  actividades: ActividadConMateria[];
  materias: MateriaSelect[];
};
export function CalendarioGridView({ actividades, materias }: Props) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(new Date());
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <CalendarioPicker actividades={actividades} onFechaSeleccionada={(date) => setFechaSeleccionada(date)} />
        <ActividadViewList actividades={actividades} fechaSeleccionada={fechaSeleccionada} materias={materias} />
      </div>
    </>
  );
}
