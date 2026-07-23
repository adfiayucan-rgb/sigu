import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { getHorariosConMateria } from "@/lib/horario/queries";
import { HorarioView } from "./_components/horario-view";
import { HorarioSkeleton } from "./_components/horario-skeleton";

export default function HorarioPage() {
  return (
    <>
      <Suspense fallback={<HorarioSkeleton />}>
        <Horarios />
      </Suspense>
    </>
  );
}

async function Horarios() {
  const horarios = await getHorariosConMateria();
  console.log(horarios);

  return <HorarioView horarios={horarios} />;
}
