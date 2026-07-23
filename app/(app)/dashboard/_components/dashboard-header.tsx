import { Skeleton } from "@/components/ui/skeleton";
import { getSemestreActual } from "@/lib/semestres/queries";
import { differenceInDays } from "date-fns";
import { Suspense } from "react";

export function DashboardHeader() {
  // const getGreeting = () => {
  //   const hour = new Date().getHours();
    
  //   if (hour < 12) return "Buenos días";
  //   if (hour < 18) return "Buenas tardes";
  //   return "Buenas noches";
  // };
  
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight text-balance">Buenos días</h1>
      <Suspense fallback={<Skeleton className="mt-1 h-5 w-40" />}>
        <SemestreActual />
      </Suspense>
    </div>
  );
}

async function SemestreActual() {
  const { nombre, fecha_fin } = await getSemestreActual();
  const diasRestantes = differenceInDays(fecha_fin, new Date());

  return (
    <p className="text-sm text-muted-foreground">
      {nombre
        ? `${nombre} ${diasRestantes !== null && diasRestantes > 0 ? `- ${diasRestantes} días restantes` : ""}`
        : "Sin semestre activo"}
    </p>
  );
}
