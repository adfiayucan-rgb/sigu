import { Skeleton } from "@/components/ui/skeleton";
import { getSemestreActual } from "@/lib/semestres/queries";
import { Suspense } from "react";

export async function HorarioHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-balance">Horario de Clases</h1>
        <Suspense fallback={<Skeleton className="mt-1 h-5 w-40" />}>
            <SemestreActual />
        </Suspense>
      </div>
    </div>
  );
}

async function SemestreActual() {
  const { nombre } = await getSemestreActual();

  return <p className="text-sm text-muted-foreground">{nombre}</p>;
}
