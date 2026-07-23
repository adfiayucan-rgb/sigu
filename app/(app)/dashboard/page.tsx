
import { Suspense } from "react";
import { DashboardHeader } from "./_components/dashboard-header";
import { getMaterias } from "@/lib/materias/queries";
import { getActividadesConMateria } from "@/lib/actividades/queries";
import { DashboardView } from "./_components/dashboard-view";
import { DashboardSkeleton } from "./_components/dashboard-skeleton";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

async function Dashboard() {
  const [materias, actividades] = await Promise.all([getMaterias(), getActividadesConMateria()]);

  return <DashboardView actividades={actividades} materias={materias} />;
}
