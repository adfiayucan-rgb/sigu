import { ActividadConMateria, Horario, Materia } from "@/lib/types";
import { DashboardTodaySchedule } from "./dashboard-today-schedule";
import { DashboardQuickStats } from "./dashboard-quick-stats";
import { QuickTaskWidget } from "@/components/dashboard/quick-task-widget";
import { getClaseActual } from "@/lib/horario/queries";
import { Suspense } from "react";
import { UrgentWidget } from "@/components/dashboard/urgent-widget";
import { GradeOverview } from "@/components/dashboard/grade-overview";
import { ProgressChart } from "@/components/dashboard/progress-chart";

type Props = {
  materias: Materia[];
  actividades: ActividadConMateria[];
};
export async function DashboardView({ actividades, materias }: Props) {
  const actividadesPendientes = actividades.filter((a) => !a.completada).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardTodaySchedule />
        <DashboardQuickStats materiasActuales={materias.length} actividadesPendientes={actividadesPendientes} />
      </div>

      {/* Quick Task Widget */}
      <Suspense fallback={<div>Cargando...</div>}>
        <ClaseActual />
      </Suspense>

      {/* Main Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UrgentWidget actividades={actividades} />
        <GradeOverview materias={materias} actividades={actividades} />
        <ProgressChart actividades={actividades} />
      </div>
    </div>
  );
}

async function ClaseActual() {
  const claseActual = await getClaseActual();
  return <QuickTaskWidget claseActual={claseActual} />;
}
