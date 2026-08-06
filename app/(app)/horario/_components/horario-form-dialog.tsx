"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HorarioForm } from "./horario-form";
import { Horario } from "@/lib/types/horario";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  horario?: Horario | null;
};

export function HorarioFormDialog({ open, onOpenChange, horario }: Props) {
  const [pending, setPending] = useState(false);
  const isEdit = !!horario;
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar actividad" : "Nueva actividad"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Modifica los datos de la actividad y guarda los cambios."
                : "Completa el formulario para agregar una nueva actividad."}
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
            <HorarioForm
              horario={horario}
              onPendingChange={(p) => setPending(p)}
              onSuccess={() => onOpenChange(false)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="horario-form" disabled={pending}>
              {pending && <Spinner data-icon="inline-start" />}
              {pending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
