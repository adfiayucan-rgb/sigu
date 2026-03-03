"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Actividad, ActividadConMateria, ActividadResponse } from "@/lib/types";
import { FormActividad } from "../form-actividad";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";

interface Props {
  actividad?: ActividadConMateria;
  open: boolean;
  selectedDate?: Date;
  onOpenChange: (open: boolean) => void;
  onSuccess: (dbActividad: ActividadResponse) => void;
}

export function AddActividadDialog({ actividad, open, selectedDate, onOpenChange, onSuccess }: Props) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{actividad ? "Editar Actividad" : "Nueva Actividad"}</SheetTitle>
          <div className="p-4">
            <FormActividad
              actividad={actividad}
              onSuccess={onSuccess}
              selectedDate={selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm") : undefined}
            />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actividad ? "Editar Actividad" : "Nueva Actividad"}</DialogTitle>
        </DialogHeader>
        <FormActividad
          actividad={actividad}
          selectedDate={selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm") : undefined}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
