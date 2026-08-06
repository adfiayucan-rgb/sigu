"use client";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { CalendarioVistaMensual } from "./calendario-grid";
import { ActividadFormDialog } from "@/components/actividad/actividad-form-dialog";
import { CalendarioVistaSemanal } from "./calendario-vista-semanal";
import { AnimatePresence, motion } from "motion/react";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { hexToRgba } from "@/lib/utils";
import { toggleActividadCompletada, updateActividadFechaAction } from "@/actions/actividad";
import { toast } from "sonner";
import { CalendarioFiltersBar } from "./calendario-filters-bar";
import { CalendarioMesNavegacion } from "./calendario-mes-navegacion";
import { CalendarioLegend } from "./calendario-legend";
import { CalendarioViewToggle } from "./calendario-view-toggle";
import { ActividadDetail } from "@/components/actividad/actividad-detail";
import { ActividadDeleteDialog } from "@/components/actividad/actividad-delete-dialog";
import { CalendarioVistaDiaria } from "./calendario-vista-diaria";
import { addMinutesToTime, deltaYToMinutes } from "@/lib/utils-time";
import { ActividadConMateria } from "@/lib/types/actividad";
import { MateriaParaSelect } from "@/lib/types/materia";
import { FiltrosState } from "@/lib/types/common";

// ─── Drag overlay chip ────────────────────────────────────────────────────────
function DragChip({
  actividad,
  previewTime,
}: {
  actividad: ActividadConMateria;
  previewTime?: { inicio: string; fin: string };
}) {
  return (
    <div
      className="rounded-lg border-l-[3px] shadow-xl opacity-95 min-w-30 overflow-hidden"
      style={{
        backgroundColor: hexToRgba(actividad.materia.color_hex, 0.15),
        borderColor: actividad.materia.color_hex,
      }}
    >
      <div className="px-2 py-1 flex flex-col gap-px">
        {previewTime && (
          <span className="text-[10px] font-medium" style={{ color: actividad.materia.color_hex }}>
            {previewTime.inicio} – {previewTime.fin}
          </span>
        )}
        <span className="text-[11px] font-bold" style={{ color: actividad.materia.color_hex }}>
          {actividad.titulo}
        </span>
        {/* {actividad.lugar && (
          <span className="text-[10px]" style={{ color: actividad.materia.color_hex }}>
            {actividad.lugar}
          </span>
        )} */}
      </div>
    </div>
  );
}

export type ActividadesPorDia = Record<string, ActividadConMateria[]>;

type Props = {
  initialActividades: ActividadConMateria[];
  materias: MateriaParaSelect[];
};
export function CalendarioView({ initialActividades, materias }: Props) {
  const [actividades, setActividades] = useState<ActividadConMateria[]>(initialActividades);
  const [currentDate, setCurrentDate] = useState(() => new Date()); // Nov 2024 to match design
  const [selectedActividad, setSelectedActividad] = useState<ActividadConMateria | null>(null);
  const [modalFecha, setModalFecha] = useState("");
  const [selectedHora, setSelectedHora] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [view, setView] = useState("mes");
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [draggedActivity, setDraggedActivity] = useState<ActividadConMateria | null>(null);
  const [filtros, setFiltros] = useState<FiltrosState>({ busqueda: "", materias: [] });

  // ── Sensors for DnD ──
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // ── Group by day (after filters) ──
  const actividadesVisibles = useMemo(() => {
    return actividades.filter((a) => {
      if (filtros.busqueda.trim()) {
        const q = filtros.busqueda.toLowerCase();

        const coincideBusqueda =
          a.titulo.toLowerCase().includes(q) ||
          a.materia.nombre.toLowerCase().includes(q) ||
          a.descripcion?.toLowerCase().includes(q);

        if (!coincideBusqueda) return false;
      }

      if (filtros.materias.length > 0 && !filtros.materias.includes(a.materia.nombre)) {
        return false;
      }

      return true;
    });
  }, [actividades, filtros]);

  const actividadesPorDia = useMemo<ActividadesPorDia>(() => {
    return actividadesVisibles.reduce<ActividadesPorDia>((acc, act) => {
      if (!acc[act.fecha_entrega]) acc[act.fecha_entrega] = [];
      acc[act.fecha_entrega].push(act);
      return acc;
    }, {});
  }, [actividadesVisibles]);

  const handleActividadClick = (actividad: ActividadConMateria) => {
    setSelectedActividad(actividad);
    setSheetOpen(true);
  };

  const handleEliminar = (actividad: ActividadConMateria) => {
    setDeleteOpen(true);
  };

  const handleDayHourClick = (day: Date, hour: number) => {
    const h = String(hour).padStart(2, "0");
    setModalFecha(format(day, "yyyy-MM-dd"));
    setSelectedHora(`${h}:00`);
    setCreateOpen(true);
  };

  const handleDayClick = (dateKey: string) => {
    setModalFecha(dateKey);
    setCreateOpen(true);
    // setModalHora("");
    // setModalOpen(true);
  };

  const handleEdit = (actividad: ActividadConMateria) => {
    setSheetOpen(false);
    setEditOpen(true);
  };

  const handleToggleComplete = async (a: ActividadConMateria) => {
    const estadoOriginal = a.completada;

    // Actualización optimista
    setActividades((prev) => prev.map((act) => (act.id === a.id ? { ...act, completada: !estadoOriginal } : act)));

    // Persistencia en la DB
    const { success, message } = await toggleActividadCompletada(a.id, !estadoOriginal);

    if (!success) {
      // Revertimos el cambio
      setActividades((prev) => prev.map((act) => (act.id === a.id ? { ...act, completada: estadoOriginal } : act)));
      toast.error(message);
      console.error(message);
      return;
    }
    toast.success(message);
  };

  // ── DnD ──
  const handleDragStart = (event: DragStartEvent) => {
    const act = event.active.data.current?.actividad as ActividadConMateria | undefined;
    setDraggedActivity(act ?? null);
    setDragDelta({ x: 0, y: 0 });
  };

  const handleDragMove = (event: DragMoveEvent) => {
    setDragDelta({ x: event.delta.x, y: event.delta.y });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setDraggedActivity(null);
    setDragDelta({ x: 0, y: 0 });

    const { active, over, delta } = event;
    const act = active.data.current?.actividad as ActividadConMateria | undefined;

    if (!act) return;

    const previousActividades = actividades;

    let updateData: {
      fecha_entrega?: string;
      hora_inicio: string | null;
      hora_fin: string | null;
    } = {
      hora_fin: null, hora_inicio: null
    };

    // ========= Vista mensual =========
    // !ERROR: Hay que tener el encuenta la hora al momento de mover
    if (view === "mes") {
      if (!over) return;

      const newDateKey = String(over.id);

      if (!/^\d{4}-\d{2}-\d{2}$/.test(newDateKey) || newDateKey === act.fecha_entrega) {
        return;
      }

      updateData.fecha_entrega = newDateKey;

      setActividades((prev) =>
        prev.map((a) =>
          a.id === act.id
            ? {
                ...a,
                fecha_entrega: newDateKey,
              }
            : a,
        ),
      );
    }

    // ========= Vista semanal =========
    else if (view === "semana") {
      const deltaMinutes = deltaYToMinutes(delta.y);

      let newDateKey = act.fecha_entrega;

      if (over) {
        const overId = String(over.id);

        if (/^\d{4}-\d{2}-\d{2}$/.test(overId)) {
          newDateKey = overId;
        }
      }

      const newInicio = act.hora_inicio ? addMinutesToTime(act.hora_inicio, deltaMinutes) : null;

      const newFin = act.hora_fin ? addMinutesToTime(act.hora_fin, deltaMinutes) : null;

      if (newDateKey === act.fecha_entrega && deltaMinutes === 0) {
        return;
      }

      updateData = {
        fecha_entrega: newDateKey,
        hora_inicio: newInicio,
        hora_fin: newFin,
      };

      setActividades((prev) =>
        prev.map((a) =>
          a.id === act.id
            ? {
                ...a,
                fecha_entrega: newDateKey,
                hora_inicio: newInicio,
                hora_fin: newFin,
              }
            : a,
        ),
      );
    }

    // ========= Vista diaria =========
    else if (view === "dia") {
      const deltaMinutes = deltaYToMinutes(delta.y);

      if (deltaMinutes === 0) return;

      const newInicio = act.hora_inicio ? addMinutesToTime(act.hora_inicio, deltaMinutes) : null;

      const newFin = act.hora_fin ? addMinutesToTime(act.hora_fin, deltaMinutes) : null;

      updateData = {
        hora_inicio: newInicio,
        hora_fin: newFin,
      };

      setActividades((prev) =>
        prev.map((a) =>
          a.id === act.id
            ? {
                ...a,
                hora_inicio: newInicio,
                hora_fin: newFin,
              }
            : a,
        ),
      );
    }

    const { success, message } = await updateActividadFechaAction(act.id, updateData);

    if (!success) {
      setActividades(previousActividades);
      toast.error(message);
      console.error(message);
    } else toast.success(message);
  };

  useEffect(() => {
    setActividades(initialActividades);
  }, [initialActividades]);

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-6  flex-1 min-h-0">
          {/* Header */}

          {/* Filters */}
          <CalendarioFiltersBar
            filtros={filtros}
            materias={materias}
            onBusqueda={(q) => setFiltros((f) => ({ ...f, busqueda: q }))}
            onToggleMateria={(m) =>
              setFiltros((f) => {
                return { ...f, materias: m };
              })
            }
            onClearFiltros={() => setFiltros({ busqueda: "", materias: [] })}
          />

          {/* Calendar views */}
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex-1"
            >
              <div className="flex flex-col-reverse md:flex-row gap-2 md:items-end justify-between w-full mb-4">
                {/* Month navigation */}
                <CalendarioMesNavegacion currentDate={currentDate} onCurrentDateChange={setCurrentDate} view={view} />
                {/* View toggle */}
                <CalendarioViewToggle view={view} onViewChange={setView} />
                {/* <div className="flex items-center gap-[8px] shrink-0">
                </div> */}
              </div>
              {view === "mes" && (
                <CalendarioVistaMensual
                  currentDate={currentDate}
                  actividadesPorDia={actividadesPorDia}
                  onActividadClick={handleActividadClick}
                  onToggleComplete={handleToggleComplete}
                  onDayClick={handleDayClick}
                />
              )}

              {view === "semana" && (
                <CalendarioVistaSemanal
                  currentDate={currentDate}
                  actividadesPorDia={actividadesPorDia}
                  onActividadClick={handleActividadClick}
                  onDayHourClick={handleDayHourClick}
                  onToggleComplete={handleToggleComplete}
                />
              )}

              {view === "dia" && (
                <CalendarioVistaDiaria
                  currentDate={currentDate}
                  actividadesPorDia={actividadesPorDia}
                  onActividadClick={handleActividadClick}
                  onToggleComplete={handleToggleComplete}
                  onHourClick={handleDayHourClick}
                />
              )}

              {/* Legend */}
              <CalendarioLegend materias={materias} />
            </motion.div>
          </AnimatePresence>
        </div>
        {selectedActividad && (
          <ActividadDetail
            actividad={selectedActividad}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            onDelete={handleEliminar}
            onEdit={handleEdit}
          />
        )}

        {selectedActividad && (
          <ActividadFormDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            materias={materias}
            mode="edit"
            actividad={selectedActividad}
          />
        )}

        <ActividadFormDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          materias={materias}
          mode="create"
          fecha={modalFecha}
          horaInicio={selectedHora}
        />

        {selectedActividad && (
          <ActividadDeleteDialog
            id={selectedActividad.id}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            titulo={selectedActividad.titulo}
          />
        )}

        {/* DnD drag overlay */}
        <DragOverlay dropAnimation={null}>
          {draggedActivity &&
            (() => {
              const isTimeView = view === "semana" || view === "dia";
              let previewTime: { inicio: string; fin: string } | undefined;
              if (isTimeView && draggedActivity.hora_inicio && draggedActivity.hora_fin) {
                const mins = deltaYToMinutes(dragDelta.y);
                previewTime = {
                  inicio: addMinutesToTime(draggedActivity.hora_inicio, mins),
                  fin: addMinutesToTime(draggedActivity.hora_fin, mins),
                };
              }
              return <DragChip actividad={draggedActivity} previewTime={previewTime} />;
            })()}
        </DragOverlay>
      </DndContext>
    </>
  );
}
