import { getMaterias } from "@/lib/materias/queries";
import { Suspense } from "react";

export function HorarioLegend() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Materias />
    </Suspense>
  );
}

async function Materias() {
  const materias = await getMaterias();

  return (
    <section className="flex flex-wrap gap-3 justify-center items-center mt-4">
      {materias.map(({ id, nombre, color_hex }) => (
        <div key={id} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color_hex }} />
          <span className="text-sm text-muted-foreground">{nombre}</span>
        </div>
      ))}
    </section>
  );
}
