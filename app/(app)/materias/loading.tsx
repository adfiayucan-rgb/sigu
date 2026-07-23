import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";

export default function MateriasLoadingPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Skeleton className="h-8 w-18.25" />
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
              <Skeleton className="h-8 w-18.25" />
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
              <Skeleton className="h-8 w-18.25" />
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
              <Skeleton className="h-8 w-18.25" />
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
