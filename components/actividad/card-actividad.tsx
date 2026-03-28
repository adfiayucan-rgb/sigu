import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Trash2,
  Zap,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { differenceInHours, format } from "date-fns";
import { useOptimistic, useState, useTransition } from "react";
import { deleteActividadAction, FormState, toggleActividad } from "@/actions/actividad";
import { Actividad, ActividadConMateria } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { formatearA12Horas } from "@/lib/utils";

interface Props {
  actividad: ActividadConMateria;
  handleAddActividad: (actividad: ActividadConMateria) => void;
  onMutate: () => Promise<any>;
  onEliminar: ({ success, data }: FormState) => void;
}

const tipoConfig: Record<Actividad["tipo"], { icon: React.ComponentType<any>; className: string }> = {
  "Parcial 1": {
    icon: FileText,
    className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  },
  "Parcial 2": {
    icon: FileText,
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  "Parcial 3": {
    icon: FileText,
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  Final: {
    icon: GraduationCap,
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
  },
  Tarea: {
    icon: ClipboardList,
    className:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700",
  },
  Quiz: {
    icon: Zap,
    className:
      "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950 dark:text-fuchsia-300 dark:border-fuchsia-800",
  },
};

export function CardActividad({ actividad, handleAddActividad, onMutate, onEliminar }: Props) {
  const [showDeleteActividad, setShowDeleteActividad] = useState(false);
  const [isPending, startTransition] = useTransition();
  const config = tipoConfig[actividad.tipo];
  const TipoIcon = config.icon;

  const [optimisticCompleted, addOptimisticToggle] = useOptimistic(
    actividad.completada,
    (state, newState: boolean) => newState,
  );

  const handleToggleCheck = async () => {
    const nextValue = !optimisticCompleted;

    startTransition(async () => {
      addOptimisticToggle(nextValue); // Cambia visualmente YA

      try {
        // Pasamos el valor final (nextValue) para evitar confusiones
        await toggleActividad(actividad.id, nextValue);
        await onMutate();
        // await mutateActividades(); // Actualizamos la lista de actividades
      } catch (error) {
        // Si entra aquí, useOptimistic automáticamente devolverá el check a su estado original
        console.error("Error al actualizar, revirtiendo UI");
      }
    });
  };

  const handleDelete = async () => {
    onEliminar(await deleteActividadAction(actividad.id));
  };

  const hoursLeft = differenceInHours(new Date(actividad.fecha_entrega), new Date());
  const isUrgent = hoursLeft > 0 && hoursLeft < 24;

  return (
    <div
      className="group relative rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
      key={actividad.id}
    >
      {/* Accent bar */}
      <div
        className={`absolute top-0 left-0 h-full w-1 rounded-l-xl`}
        style={{ backgroundColor: actividad.materia.color_hex }}
      />

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* Status icon */}
        <Checkbox
          className="mt-0.5 shrink-0"
          checked={optimisticCompleted}
          onCheckedChange={handleToggleCheck}
          disabled={isPending}
          aria-label={optimisticCompleted ? "Marcar como pendiente" : "Marcar como completada"}
        />
        {/* </input> */}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Top row: title + dropdown */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-semibold leading-snug text-foreground ${
                optimisticCompleted ? "line-through opacity-50" : ""
              }`}
            >
              {actividad.titulo}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="shrink-0">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Opciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => handleAddActividad(actividad)}>
                  <Pencil />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setShowDeleteActividad(true)}>
                  <Trash2 />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subject */}
          <div className="mt-1 flex items-center gap-1.5">
            <BookOpen className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{actividad.materia.nombre}</span>
          </div>

          {/* Bottom row: badge + date */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`gap-1 text-[11px] font-medium ${config.className}`}          
            >
              <TipoIcon className="size-3" />
              {actividad.tipo}
            </Badge>

            <span
              className={`inline-flex items-center gap-1 text-xs ${
                false ? "font-medium text-destructive-foreground" : "text-muted-foreground"
              }`}
            >
              <Clock className="size-3" />
              {formatearA12Horas(format(new Date(actividad.fecha_entrega), "HH:mm"))}
              {false && ( // TODO: Implement this
                <span className="ml-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive-foreground">
                  Vencida
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteActividad} onOpenChange={setShowDeleteActividad}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {/* <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia> */}
            <AlertDialogTitle>¿Eliminar {actividad.titulo.trim()}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente {actividad.titulo} de la lista de actividades. ¿Estás seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete()}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
