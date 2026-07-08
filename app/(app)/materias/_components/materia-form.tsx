"use client";

import { Controller, useFormContext } from "react-hook-form";
import { MateriaFormData } from "../schemas";
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
import { COLORES_MATERIA } from "@/lib/types";
import { MateriaFormState } from "../actions";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HorarioFieldArray } from "../../horario/_components/horario-field-array";
import { MateriaAlertForm } from "./materia-alert-form";

type Props = {
  state: MateriaFormState;
  pending: boolean;
};

export function MateriaForm({ state, pending }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<MateriaFormData>();

  const hasServerErrors = !!state.errors;


  return (
    <div>
      <FieldGroup>
        {/* Erros */}
        {hasServerErrors && <MateriaAlertForm errors={state.errors ?? {}} />}

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

        {/* Horario Section */}
        <HorarioFieldArray />
      </FieldGroup>
    </div>
  );
}
