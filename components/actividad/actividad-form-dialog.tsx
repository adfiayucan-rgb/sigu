"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActividadForm } from "./actividad-form";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MateriaParaSelect } from "@/lib/types/materia";
import { ActividadConMateria } from "@/lib/types/actividad";

type View = "dialog" | "sheet";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fecha?: string;
  horaInicio?: string;
  materias: MateriaParaSelect[];
  view?: View;
} & (
  | {
      mode: "create";
      actividad?: undefined;
    }
  | {
      mode: "edit";
      actividad: ActividadConMateria;
    }
);

export function ActividadFormDialog({
  mode,
  view = "dialog",
  materias,
  fecha,
  horaInicio,
  actividad,
  open,
  onOpenChange,
}: Props) {
  const [pending, setPending] = useState(false);
  return (
    <>
      {view === "sheet" ? (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{mode === "edit" ? "Editar actividad" : "Nueva actividad"}</SheetTitle>
              <SheetDescription>
                {mode === "edit"
                  ? "Modifica los datos de la actividad y guarda los cambios."
                  : "Completa el formulario para agregar una nueva actividad."}
              </SheetDescription>
            </SheetHeader>

            <div className="no-scrollbar overflow-y-auto px-4">
              {mode === "create" ? (
                <ActividadForm
                  mode="create"
                  materias={materias}
                  onPending={(pending) => setPending(pending)}
                  onSuccess={() => onOpenChange(false)}
                  fecha={fecha}
                  horaInicio={horaInicio}
                />
              ) : (
                <ActividadForm
                  mode="edit"
                  actividad={actividad}
                  materias={materias}
                  onPending={(pending) => setPending(pending)}
                  onSuccess={() => onOpenChange(false)}
                />
              )}
            </div>

            <SheetFooter>
              <div className="flex gap-2">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </SheetClose>

                <Button type="submit" form="actividad-form" disabled={pending} className="flex-1">
                  {pending && <Spinner data-icon="inline-start" />}
                  {pending ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{mode === "edit" ? "Editar actividad" : "Nueva actividad"}</DialogTitle>
              <DialogDescription>
                {mode === "edit"
                  ? "Modifica los datos de la actividad y guarda los cambios."
                  : "Completa el formulario para agregar una nueva actividad."}
              </DialogDescription>
            </DialogHeader>

            <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
              {mode === "create" ? (
                <ActividadForm
                  mode="create"
                  materias={materias}
                  onPending={(pending) => setPending(pending)}
                  onSuccess={() => onOpenChange(false)}
                  fecha={fecha}
                  horaInicio={horaInicio}
                />
              ) : (
                <ActividadForm
                  mode="edit"
                  actividad={actividad}
                  materias={materias}
                  onPending={(pending) => setPending(pending)}
                  onSuccess={() => onOpenChange(false)}
                />
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="actividad-form" disabled={pending}>
                {pending && <Spinner data-icon="inline-start" />}
                {pending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
