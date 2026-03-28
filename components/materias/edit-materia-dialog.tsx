"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLORES_MATERIA, DIAS_SEMANA, type Materia, type Horario } from "@/lib/types";
import { toast } from "sonner";
import { Plus, Trash2, Clock } from "lucide-react";

type HorarioLocal = {
  id?: string;
  dia: number;
  hora_inicio: string;
  hora_fin: string;
  salon: string;
  isNew?: boolean;
};

export function EditMateriaDialog({
  open,
  onOpenChange,
  materia,
  horarios,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materia: Materia;
  horarios: Horario[];
  onSuccess: () => void;
}) {
  const [nombre, setNombre] = useState(materia.nombre);
  const [creditos, setCreditos] = useState(materia.creditos.toString());
  const [colorHex, setColorHex] = useState(materia.color_hex);
  const [horariosLocal, setHorariosLocal] = useState<HorarioLocal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNombre(materia.nombre);
      setCreditos(materia.creditos.toString());
      setColorHex(materia.color_hex);
      setHorariosLocal(
        horarios.map((h) => ({
          id: h.id,
          dia: h.dia,
          hora_inicio: h.hora_inicio.slice(0, 5),
          hora_fin: h.hora_fin.slice(0, 5),
          salon: h.salon || "",
        })),
      );
    }
  }, [open, materia, horarios]);

  const addHorario = () => {
    setHorariosLocal((prev) => [...prev, { dia: 1, hora_inicio: "08:00", hora_fin: "10:00", salon: "", isNew: true }]);
  };

  const removeHorario = (index: number) => {
    setHorariosLocal((prev) => prev.filter((_, i) => i !== index));
  };

  const updateHorario = (index: number, field: keyof HorarioLocal, value: string | number) => {
    setHorariosLocal((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update materia
      const materiaRes = await fetch(`/api/materias/${materia.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          creditos: parseInt(creditos),
          color_hex: colorHex,
        }),
      });
      if (!materiaRes.ok) throw new Error("Error al actualizar materia");

      // Delete removed horarios
      const currentIds = horariosLocal.filter((h) => h.id).map((h) => h.id);
      const deletedHorarios = horarios.filter((h) => !currentIds.includes(h.id));
      for (const h of deletedHorarios) {
        await fetch(`/api/horarios/${h.id}`, { method: "DELETE" });
      }

      // Add new horarios
      const newHorarios = horariosLocal.filter((h) => h.isNew || !h.id);
      for (const h of newHorarios) {
        await fetch("/api/horarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materia_id: materia.id,
            dia: h.dia,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
            salon: h.salon || null,
          }),
        });
      }

      // Update horarios
      const updateHorarios = horariosLocal.filter((h) => {
        const original = horarios.find((h) => h.id === h.id);

        return (
          original &&
          (original.dia !== h.dia ||
            original.hora_inicio.slice(0, 5) !== h.hora_inicio ||
            original.hora_fin.slice(0, 5) !== h.hora_fin ||
            original.salon ||
            "" !== h.salon)
        );
      });

      for (const h of updateHorarios) {
        await fetch(`/api/horarios/${h.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            materia_id: materia.id,
            dia: h.dia,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
            salon: h.salon || null,
          }),
        });
      }

      toast.success("Materia actualizada");
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Error al actualizar materia");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Materia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Calculo II"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="creditos">Creditos</Label>
            <Input
              id="creditos"
              type="number"
              min={1}
              max={10}
              value={creditos}
              onChange={(e) => setCreditos(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORES_MATERIA.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorHex(c)}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    colorHex === c ? "scale-125 ring-2 ring-ring ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Horarios Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horario de Clases
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={addHorario}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar
              </Button>
            </div>

            {horariosLocal.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                Sin horario registrado. Agrega las clases semanales.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {horariosLocal.map((h, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Clase {idx + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeHorario(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <Select value={h.dia.toString()} onValueChange={(v) => updateHorario(idx, "dia", parseInt(v))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Día" />
                          </SelectTrigger>
                          <SelectContent>
                            {DIAS_SEMANA.map((d) => (
                              <SelectItem key={d.value} value={d.value.toString()}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Input
                          type="time"
                          value={h.hora_inicio}
                          onChange={(e) => updateHorario(idx, "hora_inicio", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="time"
                          value={h.hora_fin}
                          onChange={(e) => updateHorario(idx, "hora_fin", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="Salón (opcional)"
                          value={h.salon}
                          onChange={(e) => updateHorario(idx, "salon", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
