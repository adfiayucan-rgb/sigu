"use client";

import { HorarioConMateria } from "@/lib/types";
import { HorarioStats } from "./horario-stats";
import { HorarioGrid } from "./horario-grid";

type HorarioViewProps = {
  horarios: HorarioConMateria[];
};
export function HorarioView({ horarios }: HorarioViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <HorarioStats horarios={horarios} />
      <HorarioGrid horarios={horarios}/>
    </div>
  );
}
