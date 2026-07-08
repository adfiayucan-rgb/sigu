import { getSemestreActual } from "@/lib/semestres/queries";
import { MateriaNewButton } from "./materia-new-button";

export async function MateriaHeader() {
  const { id, nombre } = await getSemestreActual();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-balance">Mis Materias</h1>
        <p className="text-sm text-muted-foreground">
          {id ? nombre : "Selecciona un semestre en Ajustes"}
        </p>
      </div>
      <MateriaNewButton semestreId={id} />
    </div>
  );
}
