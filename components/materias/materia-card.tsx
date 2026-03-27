"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Pencil, Clock, MapPin } from "lucide-react";
import type { Materia, ActividadConMateria, Horario, DIAS_SEMANA } from "@/lib/types";

const DIAS_LABEL: Record<number, string> = {
  0: 'Dom',
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb',
}

function calcularGrading(actividades: ActividadConMateria[]) {
  const parciales = actividades.filter((a) => ["Parcial 1", "Parcial 2", "Parcial 3"].includes(a.tipo));
  const final = actividades.find((a) => a.tipo === "Final");

  const pesoPorParcial = 70 / 3;
  let acumulado70 = 0;
  let porcentajeCubierto = 0;

  parciales.forEach((p) => {
    if (p.nota !== null) {
      const peso = p.porcentaje_manual ?? pesoPorParcial;
      acumulado70 += (p.nota / 5) * peso;
      porcentajeCubierto += peso;
    }
  });

  let acumuladoTotal = acumulado70;
  if (final?.nota !== null && final?.nota !== undefined) {
    acumuladoTotal += (final.nota / 5) * 30;
    porcentajeCubierto += 30;
  }

  const notaProyectada = porcentajeCubierto > 0 ? (acumuladoTotal / porcentajeCubierto) * 5 : 0;

  // Calculate minimum final exam grade to pass (3.0)
  const notaMinAprobacion = 3.0;
  const faltaPara3 = (notaMinAprobacion / 5) * 100 - acumulado70;
  const notaFinalNecesaria = faltaPara3 > 0 ? (faltaPara3 / 30) * 5 : 0;

  return {
    acumulado70,
    porcentajeCubierto,
    notaProyectada,
    notaFinalNecesaria: Math.min(Math.max(notaFinalNecesaria, 0), 5),
    parciales,
    final,
  };
}

export function MateriaCard({
  materia,
  actividades,
  horarios = [],
  onAddActividad,
  onEditMateria,
  onDeleteMateria,
}: {
  materia: Materia;
  actividades: ActividadConMateria[];
  horarios?: Horario[];
  onAddActividad: () => void;
  onEditMateria: () => void;
  onDeleteMateria: () => void;
}) {
  const { acumulado70, porcentajeCubierto, notaProyectada, notaFinalNecesaria, parciales } =
    calcularGrading(actividades);

  return (
    <Card className="relative overflow-hidden group">
      <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: materia.color_hex }} />
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: materia.color_hex }}
          >
            {materia.nombre.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{materia.nombre}</CardTitle>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs font-normal">
                {materia.creditos} créditos
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddActividad}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEditMateria}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onDeleteMateria}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Horarios */}
        {horarios.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {horarios.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                <Clock className="h-3 w-3" />
                <span className="font-medium">{DIAS_LABEL[h.dia]}</span>
                <span>{h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}</span>
                {h.salon && (
                  <>
                    <MapPin className="h-3 w-3 ml-1" />
                    <span>{h.salon}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Grade summary */}
        <div className="grid grid-cols-3 gap-3 text-center bg-muted/30 rounded-lg p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Acumulado 70%</span>
            <span className="text-xl font-bold" style={{ color: materia.color_hex }}>{acumulado70.toFixed(1)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Proyectada</span>
            <span className="text-xl font-bold">{porcentajeCubierto > 0 ? notaProyectada.toFixed(1) : "--"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Necesitas Final</span>
            <span
              className={`text-xl font-bold ${notaFinalNecesaria > 4.5 ? "text-destructive" : notaFinalNecesaria > 3.5 ? "text-chart-4" : "text-primary"}`}
            >
              {parciales.filter((p) => p.nota !== null).length > 0 ? notaFinalNecesaria.toFixed(1) : "--"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progreso evaluaciones</span>
            <span className="font-medium">{Math.min(porcentajeCubierto, 100).toFixed(0)}%</span>
          </div>
          <Progress value={Math.min(porcentajeCubierto, 100)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
