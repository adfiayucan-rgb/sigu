import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

import { useActionState, useEffect } from "react";
import { actions } from "@/actions";
import { ActividadConMateria, ActividadResponse, TIPOS_ACTIVIDAD } from "@/lib/types";
import { useMaterias } from "@/lib/hooks";
import { FormState } from "@/actions/actividad";
import { FormError } from "@/components/form-error";
import { toast } from "sonner";
import { LoadingButton } from "@/components/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  actividad?: ActividadConMateria;
  selectedDate?: string;
  onSuccess: (dbActividad: ActividadResponse) => void;
}

export function FormActividad({ actividad, selectedDate, onSuccess }: Props) {
  const { data: materias, isLoading: lm } = useMaterias();
  const initialState: FormState = { message: null, errors: {}, data: null };

  const [state, formAction, isPending] = useActionState(actions.actividad.saveActividad, initialState);

  useEffect(() => {
    if (!state.message) return;

    const hasErrors = state.errors && Object.keys(state.errors).length > 0;

    if (hasErrors) {
      // Caso de error de validación o lógica
      toast.error(state.message);
    } else if (state.data) {
      // Caso de éxito
      toast.success(state.message);

      // Aquí podrías usar state.data para algo extra
      console.log("Datos guardados:", state.data);
      onSuccess(state.data as ActividadResponse);
    } else {
      toast.warning(state.message);
    }
  }, [state]); // Se dispara cada vez que el state cambia

  return (
    <form action={formAction}>
      {lm ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-15 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-15 rounded-lg" />
            <Skeleton className="h-15 rounded-lg" />
          </div>
          <Skeleton className="h-15 rounded-lg" />
          <Skeleton className="h-22 rounded-lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <input type="text" name="id" defaultValue={state.fields?.id ?? actividad?.id} hidden readOnly />
          <div className="grid gap-2">
            <Label htmlFor="titulo">Titulo</Label>
            <Input
              id="titulo"
              name="titulo"
              defaultValue={state.fields?.titulo ?? actividad?.titulo}
              placeholder="Examen parcial de algebra"
              required
            />
            <FormError errors={state.errors?.titulo} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid col-span-1 gap-2">
              <Label>Tipo</Label>
              <Select value={actividad?.tipo} name="tipo">
                <SelectTrigger className="w-full">
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
              {/* <FormError errors={state.errors?.tipo} /> */}
            </div>
            <div className="grid col-span-1 gap-2">
              <Label htmlFor="materia">Materia</Label>
              <Select value={actividad?.materia_id} name="materia_id">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {materias?.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <FormError errors={state.errors?.materia_id} /> */}
            </div>
          </div>

          {state.errors?.tipo || state.errors?.materia_id ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid col-span-1 gap-2">
                <FormError errors={state.errors?.tipo} />
              </div>
              <div className="grid col-span-1 gap-2">
                <FormError errors={state.errors?.materia_id} />
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="grid gap-2">
            <Label htmlFor="fecha">Fecha de Entrega</Label>
            <Input
              id="fecha"
              name="fecha_entrega"
              type="datetime-local"
              defaultValue={formatDateTime(state.fields?.fecha_entrega ?? actividad?.fecha_entrega ?? selectedDate)}
            />
            <FormError errors={state.errors?.fecha_entrega} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              defaultValue={state.fields?.descripcion ?? actividad?.descripcion}
              placeholder="Descripción de la actividad"
            />
          </div>
          <LoadingButton type="submit" isLoading={isPending} loadingText={actividad ? "Actualizando..." : "Creando..."}>
            {actividad ? "Actualizar Actividad" : "Crear Actividad"}
          </LoadingButton>
        </div>
      )}
    </form>
  );
}
