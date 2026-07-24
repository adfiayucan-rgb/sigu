"use client";

import { MateriaCard } from "@/components/materias/materia-card";
import { MateriaWithDetails } from "@/lib/types";
import { MateriaEmpty } from "./materia-empty";
import { useState } from "react";
import { MateriaDeleteDialog } from "./materia-delete-dialog";
import { MateriaFormDialog } from "./materia-form-dialog";

type Props = {
  materias: MateriaWithDetails[];
};

export function MateriaList({ materias }: Props) {
  const [selectedMateria, setSelectedMateria] = useState<MateriaWithDetails | undefined>(undefined);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (materia: MateriaWithDetails) => {
    setSelectedMateria(materia);
    setEditOpen(true);
  };

  const handleDelete = (materia: MateriaWithDetails) => {
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
