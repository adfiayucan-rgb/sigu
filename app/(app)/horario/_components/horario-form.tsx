import { Controller, useForm } from "react-hook-form";
import { crearHorarioPorDefecto, HorarioFormData, horarioSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHorarioAction, updateHorarioAction } from "../actions";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMaterias } from "@/lib/hooks";
import { ActionState } from "@/lib/types/action";
import { Horario } from "@/lib/types/horario";
import { DIAS_SEMANA } from "@/lib/constants/common";

const estadoInicial: ActionState = { success: false, message: "" };

type Props = {
  horario?: Horario | null;
  onPendingChange: (isPending: boolean) => void;
  onSuccess?: () => void;
};

export function HorarioForm({ horario, onPendingChange, onSuccess }: Props) {
  const { data: materias, error, isLoading: lm } = useMaterias();

  const form = useForm<HorarioFormData>({
    resolver: zodResolver(horarioSchema),
    defaultValues: horario ?? crearHorarioPorDefecto(),
  });

  const { control } = form;

  const isEditing = !!horario;

  const action = isEditing ? updateHorarioAction.bind(null, horario.id) : createHorarioAction;
  const [state, dispatch, pending] = useActionState(action, estadoInicial);

  function onValid(data: HorarioFormData) {
    startTransition(() => {
      dispatch(data);
    });
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      if (onSuccess) onSuccess();
      form.reset(isEditing ? horario : crearHorarioPorDefecto());
    }

    if (!state.success && state.message) {
      toast.error(state.message, { duration: 5000 });
      console.error(state.message);
    }
  }, [state]);

  useEffect(() => {
    onPendingChange(pending);
  }, [pending, onPendingChange]);

  return (
    <form id="horario-form" onSubmit={form.handleSubmit(onValid)}>
      <FieldGroup>
        {/* Dia */}
        <Controller
          name={"dia"}
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
            name={"hora_inicio"}
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
            name="hora_fin"
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

        <Field className="grid grid-cols-1 md:grid-cols-2">
          {/* Materias */}
          <Controller
            control={control}
            name="materia_id"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="materia_id">Materia</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="materia_id" className="w-full" aria-invalid={fieldState.invalid || undefined}>
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
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Sala */}
          <Controller
            name="salon"
            control={control}
            defaultValue={""}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="salon">Salón</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="salon"
                  placeholder="Opcional"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          ></Controller>
        </Field>
      </FieldGroup>
    </form>
  );
}
