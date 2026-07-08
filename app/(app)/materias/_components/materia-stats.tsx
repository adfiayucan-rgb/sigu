import { Card, CardContent } from "@/components/ui/card";
import { MateriaWithDetails } from "@/lib/types";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";

type Props = {
  materias: MateriaWithDetails[];
};

export function MateriaStats({ materias }: Props) {
  const totalCreditos = materias.reduce((acc, m) => acc + m.creditos, 0);
  const actividadesCompletadas = materias.reduce((acc, m) => acc + m.actividades.filter((a) => a.completada).length, 0);
  const actividadesPendientes = materias.reduce((acc, m) => acc + m.actividades.filter((a) => !a.completada).length, 0);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{materias.length}</p>
            <p className="text-xs text-muted-foreground">Materias</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-chart-2/5 border-chart-2/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-chart-2" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalCreditos}</p>
            <p className="text-xs text-muted-foreground">Créditos</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-chart-1/5 border-chart-1/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-chart-1" />
          </div>
          <div>
            <p className="text-2xl font-bold">{actividadesCompletadas}</p>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-chart-4/5 border-chart-4/20">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-chart-4" />
          </div>
          <div>
            <p className="text-2xl font-bold">{actividadesPendientes}</p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
