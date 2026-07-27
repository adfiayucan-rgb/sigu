import { getSemestreActual } from "@/lib/semestres/queries";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MateriaNewButton } from "./materia-new-button";
import { MateriaButtonImportar } from "./_import/materia-button-importar";

export async function MateriaHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-balance">Mis Materias</h1>
        <Suspense fallback={<Skeleton className="mt-1 h-5 w-30" />}>
          <SemestreActual />
        </Suspense>
      </div>
      <div className="flex gap-2">
        <MateriaButtonImportar />
        <MateriaNewButton />
      </div>
    </div>
  );
}

async function SemestreActual() {
  const { id, nombre } = await getSemestreActual();
  return <p className="text-sm text-muted-foreground">{id ? nombre : "Selecciona un semestre en Ajustes"}</p>;
}
