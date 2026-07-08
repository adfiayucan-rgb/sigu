"use client";


import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MateriaWithDetails } from "@/lib/types";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { MateriaDeleteDialog } from "./materia-delete-dialog";
import { MateriaFormDialog } from "./materia-form-dialog";

export function MateriaRowActions({ materia }: { materia: MateriaWithDetails }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"} aria-label="Acciones de la materia">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setTimeout(() => setEditOpen(true), 0);
              }}
            >
              <Edit />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                setTimeout(() => setDeleteOpen(true), 0);
              }}
            >
              <Trash2 color="red" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <MateriaDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} materia={materia} />
      <MateriaFormDialog
        mode="edit"
        materia={materia}
        open={editOpen}
        onOpenChange={setEditOpen}
        semestreId={materia.semestre_id}
      />
    </>
  );
}
