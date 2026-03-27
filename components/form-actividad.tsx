import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";

import { useActionState, useEffect, useState } from "react";
import { actions } from "@/actions";
import { ActividadConMateria, ActividadResponse, TIPOS_ACTIVIDAD } from "@/lib/types";
import { useMaterias } from "@/lib/hooks";
import { FormState } from "@/actions/actividad";
import { FormError } from "@/components/form-error";
import { toast } from "sonner";
import { LoadingButton } from "@/components/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface Props {
  actividad?: ActividadConMateria;
  selectedDate?: string;
  onSuccess: (dbActividad: ActividadResponse) => void;
}

const TIPOS_CON_NOTA = ['Parcial 1', 'Parcial 2', 'Parcial 3', 'Final', 'Quiz']

export function FormActividad({ actividad, selectedDate, onSuccess }: Props) {
  const { data: materias, isLoading: lm } = useMaterias();
  const initialState: FormState = { message: null, errors: {}, data: null };
  const [tipoSeleccionado, setTipoSeleccionado] = useState(actividad?.tipo || '');
  const [nota, setNota] = useState<string>(actividad?.nota?.toString() || '');

  const [state, formAction, isPending] = useActionState(actions.actividad.saveActividad, initialState);

  const mostrarNota = TIPOS_CON_NOTA.includes(tipoSeleccionado);

  useEffect(() => {
    if (!state.message) return;

    const hasErrors = state.errors && Object.keys(state.errors).length > 0;

    if (hasErrors) {
      toast.error(state.message);
    } else if (state.data) {
      toast.success(state.message);
      onSuccess(state.data as ActividadResponse);
    } else {
      toast.warning(state.message);
    }
  }, [state]);

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
          <input type="text" name="nota" value={nota || ''} hidden readOnly />
          
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
              <Select 
                value={tipoSeleccionado} 
                name="tipo"
                onValueChange={setTipoSeleccionado}
              >
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
          ) : null}

          {/* Nota section for exams */}
          {mostrarNota && (
            <Card className="border-chart-4/30 bg-chart-4/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-chart-4" />
                  </div>
                  <div className="flex-1 grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="nota-input" className="text-sm font-medium">
                        Calificación Obtenida
                      </Label>
                      <span className="text-xs text-muted-foreground">Opcional - Puedes agregarla después</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id="nota-input"
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        placeholder="Ej: 4.2"
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Deja vacío si aún no tienes el resultado. Podrás actualizarlo luego.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
