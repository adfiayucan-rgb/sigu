import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { BookPlus } from "lucide-react";

export function MateriaEmpty() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookPlus />
        </EmptyMedia>
        <EmptyTitle>Comienza tu semestre</EmptyTitle>
        <EmptyDescription>
          Tu lista de materias está vacía. Añade tus asignaturas para empezar a gestionar tus actividades y tareas.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  );
}
