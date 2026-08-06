"use client";

import { MateriaCard } from "@/components/materias/materia-card";
import { MateriaEmpty } from "./materia-empty";
import { useState } from "react";
import { MateriaDeleteDialog } from "./materia-delete-dialog";
import { MateriaFormDialog } from "./materia-form-dialog";
import type { Materia, MateriaConHorarioYActividades } from "@/lib/types/materia";

type Props = {
  materias: MateriaConHorarioYActividades[];
};

export function MateriaList({ materias }: Props) {
  const [selectedMateria, setSelectedMateria] = useState<Materia | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (materia: Materia) => {
    setSelectedMateria(materia);
    setEditOpen(true);
  };

  const handleDelete = (materia: Materia) => {
    setSelectedMateria(materia);
    setDeleteOpen(true);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {materias.length === 0 ? (
        <MateriaEmpty />
      ) : (
        materias.map((materia) => (
          <MateriaCard key={materia.id} materia={materia} onDelete={handleDelete} onEdit={handleEdit} />
        ))
      )}

      {selectedMateria && (
        <>
          <MateriaDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} materia={selectedMateria} />
          <MateriaFormDialog
            mode="edit"
            materia={selectedMateria}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
        </>
      )}
    </div>
  );
}
