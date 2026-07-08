import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { MateriaFormData } from "../../materias/schemas";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIAS_SEMANA } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HorarioFieldArray() {
  const {
    control,
    formState: { errors },
  } = useFormContext<MateriaFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "horarios",
  });

  return (
    <div className="space-y-3">
      <FieldSet>
        <FieldLegend>Horarios</FieldLegend>
        <FieldDescription>Todos los horarios registrados para esta materia</FieldDescription>
        <FieldGroup>
          {fields.map((field, index) => {
            return (
              <Card key={field.id}>
                <CardHeader>
                  <CardTitle>Horario N° {index + 1}</CardTitle>
                  <CardDescription>Define el día y el bloque de tiempo asignado para esta sesión.</CardDescription>
                  <CardAction>
                    <Button onClick={() => remove(index)} variant={"ghost"}>
                      <X />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <FieldGroup >
                    {/* Dia */}
                    <Controller
                      name={`horarios.${index}.dia`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="dia">Dia</FieldLabel>
                          <Select
                            name={field.name}
                            value={field.value ? field.value.toString() : "1"}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="dia" aria-invalid={fieldState.invalid}>
                              <SelectValue placeholder="Día" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {DIAS_SEMANA.map((d) => (
                                <SelectItem key={d.value} value={d.value.toString()}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    ></Controller>

                    <Field className="grid grid-cols-1 md:grid-cols-2">
                      {/* Hora de inicio */}
                      <Controller
                        name={`horarios.${index}.hora_inicio`}
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="hora_inicio">Hora de inicio</FieldLabel>
                            <Input
                              {...field}
                              id="hora_inicio"
                              type="time"
                              placeholder="Hora de inicio"
                              autoComplete="off"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      ></Controller>

                      {/* Hora de fin */}
                      <Controller
                        name={`horarios.${index}.hora_fin`}
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="hora_fin">Hora de fin</FieldLabel>
                            <Input
                              {...field}
                              id="hora_fin"
                              type="time"
                              placeholder="Hora de fin"
                              autoComplete="off"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      ></Controller>
                    </Field>

                    {/* Sala */}
                    <Controller
                      name={`horarios.${index}.salon`}
                      control={control}
                      defaultValue={""}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="salon">Salón</FieldLabel>
                          <Input
                            {...field}
                            id="salon"
                            placeholder="Opcional"
                            autoComplete="off"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    ></Controller>
                  </FieldGroup>
                </CardContent>
              </Card>
            );
          })}

          <Button
            type="button"
            variant={"outline"}
            onClick={() => append({ dia: 1, hora_inicio: "", hora_fin: "", salon: "", materia_id: "" })}
          >
            <Plus /> Agregar horario
          </Button>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
