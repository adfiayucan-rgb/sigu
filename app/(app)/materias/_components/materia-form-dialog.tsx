"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Materia } from "@/lib/types";
import { useState } from "react";
import { MateriaForm } from "./materia-form";
import { Spinner } from "@/components/ui/spinner";

type MateriaFormDialogProps = ({ mode: "create"; materia?: undefined } | { mode: "edit"; materia: Materia }) & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function MateriaFormDialog({ mode, materia, open, onOpenChange }: MateriaFormDialogProps) {
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear nueva materia" : "Editar materia"}</DialogTitle>
        </DialogHeader>
        {mode === "create" ? (
          <MateriaForm
            mode="create"
            onPending={(p) => setPending(p)}
            onSuccess={() => onOpenChange(false)}
          />
        ) : (
          <MateriaForm
            materia={materia}
            mode="edit"
            onPending={(p) => setPending(p)}
            onSuccess={() => onOpenChange(false)}
          />
        )}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" form="materia-form" disabled={pending}>
            {pending && <Spinner data-icon="inline-start" />}
            {pending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
