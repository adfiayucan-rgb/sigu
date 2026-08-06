"use client";

import { Controller, useForm } from "react-hook-form";
import { crearMateriaPorDefecto, MateriaFormData, materiaSchema } from "../schemas";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MateriaAlertForm } from "./materia-alert-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { createMateriaAction, MateriaFormState, updateMateriaAction } from "../actions";
import { toast } from "sonner";
import type { Materia } from "@/lib/types/materia";
import { COLORES_MATERIA } from "@/lib/constants/materia";

const initialState: MateriaFormState = { success: false, message: "" };

type Props = ({ mode: "create"; materia?: undefined } | { mode: "edit"; materia: Materia }) & {
  onPending: (pending: boolean) => void;
  onSuccess: () => void;
};

export function MateriaForm({ mode, materia, onPending, onSuccess }: Props) {
  const form = useForm<MateriaFormData>({
    resolver: zodResolver(materiaSchema),
    defaultValues: materia ?? crearMateriaPorDefecto(),
  });

  const { control } = form;

  const action = mode === "edit" ? updateMateriaAction.bind(null, materia.id) : createMateriaAction;
  const [state, dispatch, pending] = useActionState(action, initialState);

  function onValid(data: MateriaFormData) {
    startTransition(() => {
      dispatch(data);
    });
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onSuccess();
      form.reset(mode === "create" ? crearMateriaPorDefecto() : materia);
    }

    if (!state.success && state.message) {
      toast.error(state.message, { duration: 5000 });
      console.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    onPending(pending);
  }, [pending, onPending]);

  const hasServerErrors = !!state.errors;

  return (
    <form id="materia-form" onSubmit={form.handleSubmit(onValid)}>
      <FieldGroup>
        {/* Erros */}
        {hasServerErrors && <MateriaAlertForm errors={state.errors ?? {}} />}

        {/* Codigo */}
        <Controller
          name="codigo"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="codigo">Código</FieldLabel>
              <Input
                {...field}
                id="codigo"
                placeholder="Ej. - 1193376"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>

        {/* Nombre */}
        <Controller
          name="nombre"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
              <Input
                {...field}
                id="nombre"
                placeholder="El nombre de la materia"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>

        {/* Creditos */}
        <Controller
          name="creditos"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="creditos">Creditos</FieldLabel>
              <Input
                {...field}
                id="creditos"
                type="number"
                min={1}
                max={4}
                placeholder="El creditos de la materia"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        ></Controller>
        {/* Color */}
        <Controller
          name="color_hex"
          control={control}
          render={({ field, fieldState }) => (
            <FieldSet aria-invalid={fieldState.invalid}>
              <FieldLegend>Colores</FieldLegend>
              <FieldDescription>Selecciona un color para esta materia</FieldDescription>
              <ToggleGroup
                className="grid grid-cols-3 md:grid-cols-5"
                spacing={4}
                type="single"
                value={field.value}
                onValueChange={field.onChange}
                size={"lg"}
                variant={"outline"}
              >
                {COLORES_MATERIA.map((c) => (
                  <ToggleGroupItem
                    key={c}
                    className="flex items-center justify-center size-16 data-[state=on]:ring-2 data-[state=on]:ring-offset-2 data-[state=on]:ring-black"
                    value={c}
                    aria-label={c}
                    aria-invalid={fieldState.invalid}
                  >
                    <span className="h-8 w-8 rounded-full border border-gray-300" style={{ backgroundColor: c }} />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        ></Controller>
      </FieldGroup>
    </form>
  );
}
