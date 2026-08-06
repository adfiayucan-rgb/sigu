import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MateriaConHorarioYActividades } from "@/lib/types/materia";

import { Edit, MoreVertical, Trash2 } from "lucide-react";


type Props = {
  materia: MateriaConHorarioYActividades;
  onEdit: (materia: MateriaConHorarioYActividades) => void;
  onDelete: (materia: MateriaConHorarioYActividades) => void;
};
export function MateriaRowActions({ materia, onDelete, onEdit }: Props) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"} aria-label="Acciones de la materia">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(materia)}>
              <Edit />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(materia)}>
              <Trash2 color="red" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
