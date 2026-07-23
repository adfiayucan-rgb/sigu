import { ActividadFormData, actividadSchema, crearActividadPorDefecto } from "@/app/(app)/calendario/schemas";
import { ActividadConMateria, MateriaSelect, TIPOS_ACTIVIDAD } from "@/lib/types";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActividadFormState, createActividadAction, updateActividadAction } from "@/actions/actividad";
import { useActionState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

const initialState: ActividadFormState = { message: "", success: false };

type Props = {
  materias: MateriaSelect[];
  fecha?: string;
  horaInicio?: string;
  onPending: (pending: boolean) => void;
  onSuccess: () => void;
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

export function ActividadForm({ materias, fecha, horaInicio, mode, actividad, onPending, onSuccess }: Props) {
  const fechaInicial = fecha ? fecha : format(new Date(), "yyyy-MM-dd");
  const horaInicial = horaInicio ? horaInicio : "";

  const form = useForm<ActividadFormData>({
    resolver: zodResolver(actividadSchema),
    defaultValues: actividad ?? crearActividadPorDefecto(fechaInicial, horaInicial),
  });

  const { control } = form;

  const action = mode === "edit" ? updateActividadAction.bind(null, actividad.id) : createActividadAction;
  const [state, dispatch, pending] = useActionState(action, initialState);
  const [, startTransition] = useTransition();

  const onSubmit = (data: ActividadFormData) => {
    startTransition(() => {
      dispatch(data);
    });
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      form.reset(mode === "create" ? crearActividadPorDefecto(fechaInicial, horaInicial) : actividad);
      onSuccess();
    }

    if (!state.success && state.message) {
      toast.error(state.message, { duration: 5000 });
      console.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    onPending(pending);
  }, [pending, onPending]);

  return (
    <>
      <form id="actividad-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="p-3">
          {/* Titulo & Descripcion */}
          <FieldSet className="w-full">
            <FieldLegend>Información general</FieldLegend>
            <FieldDescription>Describe la actividad para poder identificarla fácilmente.</FieldDescription>
            <FieldGroup>
              <Controller
                control={control}
                name="titulo"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="titulo">Título</FieldLabel>
                    <Input
                      id="titulo"
                      placeholder="Ej. Entregar informe de laboratorio"
                      aria-invalid={fieldState.invalid || undefined}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              {/* Descripción */}
              <Controller
                control={control}
                name="descripcion"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
                    <Textarea
                      id="descripcion"
                      rows={3}
                      placeholder="Detalles opcionales de la actividad"
                      aria-invalid={fieldState.invalid || undefined}
                      {...field}
                      value={field.value ?? ""}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* Fecha y horario */}
          <FieldSet className="w-full ">
            <FieldLegend>Fecha y horario</FieldLegend>
            <FieldDescription>
              Especifica el día y el intervalo de tiempo en que tendrá lugar la actividad.
            </FieldDescription>
            <FieldGroup>
              {/* Fecha de entrega */}
              <Controller
                control={control}
                name="fecha_entrega"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="fecha_entrega">Fecha de entrega</FieldLabel>
                    <Input id="fecha_entrega" type="date" aria-invalid={fieldState.invalid || undefined} {...field} />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                {/* Hora inicio */}
                <Controller
                  control={control}
                  name="hora_inicio"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="hora_inicio">Hora inicio</FieldLabel>
                      <Input id="hora_inicio" type="time" {...field} />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                {/* Hora fin */}
                <Controller
                  control={control}
                  name="hora_fin"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="hora_fin">Hora fin</FieldLabel>
                      <Input id="hora_fin" type="time" {...field} />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          {/* Materia y tipo */}
          <FieldSet className="w-full">
            <FieldLegend>Clasificación</FieldLegend>
            <FieldDescription>Asocia la actividad a una materia y selecciona su tipo.</FieldDescription>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="materia_id"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="materia_id">Materia</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="materia_id"
                          className="w-full"
                          aria-invalid={fieldState.invalid || undefined}
                        >
                          <SelectValue placeholder="Selecciona una materia" />
                        </SelectTrigger>
                        <SelectContent>
                          {materias?.map((materia) => (
                            <SelectItem key={materia.id} value={materia.id}>
                              {materia.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="tipo"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="tipo">Tipo</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="tipo" className="w-full" aria-invalid={fieldState.invalid || undefined}>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_ACTIVIDAD.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>

          {/* Completada */}
          <Controller
            control={control}
            name="completada"
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id="completada"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <FieldLabel htmlFor="completada">Marcar como completada</FieldLabel>
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </>
  );
}
