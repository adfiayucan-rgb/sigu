"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MateriaConHorarios } from "@/lib/types";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createMateria, MateriaFormState, updateMateria } from "../actions";
import { MateriaForm } from "./materia-form";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MateriaFormData, materiaSchema } from "../schemas";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const initialState: MateriaFormState = { success: false, message: "" };

type MateriaFormDialogProps = (
  | { mode: "create"; materia?: undefined; semestreId: string }
  | { mode: "edit"; materia: MateriaConHorarios; semestreId: string }
) & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function MateriaFormDialog({ mode, materia, semestreId, open, onOpenChange }: MateriaFormDialogProps) {
  const emptyDefaults: MateriaFormData = {
    nombre: "",
    color_hex: "",
    creditos: 1,
    semestre_id: semestreId,
    horarios: [{ id: "", dia: 1, hora_inicio: "", hora_fin: "", salon: "", materia_id: "" }],
  };

  const defaultValues: MateriaFormData =
    mode === "edit"
      ? {
          nombre: materia.nombre,
          color_hex: materia.color_hex,
          creditos: materia.creditos,
          semestre_id: materia.semestre_id,
          horarios: materia.horarios.map((h) => ({
            id: h.id,
            dia: h.dia,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
            materia_id: h.materia_id,
            salon: h.salon,
          })),
        }
      : emptyDefaults;

  const action = mode === "edit" ? updateMateria.bind(null, materia.id) : createMateria;
  const [state, dispatch, pending] = useActionState(action, initialState);

  const form = useForm<MateriaFormData>({
    resolver: zodResolver(materiaSchema),
    defaultValues: defaultValues,
  });

  function onValid(data: MateriaFormData) {
    startTransition(() => {
      dispatch(data);
    });
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onOpenChange(false);
      form.reset(mode === "create" ? emptyDefaults : materia);
    }

    if (!state.success && state.message) {
      toast.error(state.message, { duration: 5000 });
      console.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear nueva materia" : "Editar materia"}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            id="materia-form"
            onSubmit={form.handleSubmit(onValid)}
            className="no-scrollbar max-h-[70vh] overflow-y-auto px-4 py-2"
          >
            <FieldGroup>
              <MateriaForm state={state} pending={pending} />
            </FieldGroup>
          </form>
        </FormProvider>
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
