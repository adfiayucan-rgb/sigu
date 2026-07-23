import { getMateriasParaSelect } from "@/lib/materias/queries";
import { getActividades } from "@/lib/actividades/queries";
import { Suspense } from "react";
import { CalendarioSkeleton } from "./_components/calendario-skeleton";
import { CalendarioView } from "./_components/calendario-view";

export default async function CalendarioPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-1 mb-5">
          <h1 className="text-[30px] font-semibold tracking-[-0.45px] leading-9.75">Vista de Calendario</h1>
          <p className="text-[14px] text-muted-foreground leading-5.25">Actividades Académicas</p>
        </header>
        <Suspense fallback={<CalendarioSkeleton />}>
          <Actividades />
        </Suspense>
      </main>
    </>
  );
}

async function Actividades() {
  const [actividades, materias] = await Promise.all([getActividades(), getMateriasParaSelect()]);
  return <CalendarioView initialActividades={actividades} materias={materias} />;
}
