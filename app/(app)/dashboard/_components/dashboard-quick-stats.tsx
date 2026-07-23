import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target } from "lucide-react";

type Props = {
  materiasActuales: number;
  actividadesPendientes: number;
};
export function DashboardQuickStats({ materiasActuales, actividadesPendientes }: Props) {
  return (
    <>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-chart-2" />
          </div>
          <div>
            <p className="text-3xl font-bold">{materiasActuales}</p>
            <p className="text-xs text-muted-foreground">Materias activas</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-chart-4" />
          </div>
          <div>
            <p className="text-3xl font-bold">{actividadesPendientes}</p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
