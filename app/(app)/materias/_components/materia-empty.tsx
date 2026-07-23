import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { BookPlus } from "lucide-react";
import { MateriaNewButton } from "./materia-new-button";
// import { getSemestreActual } from "@/lib/semestres/queries";


export async function MateriaEmpty() {
  // const { id } = await getSemestreActual();
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
      <EmptyContent>
        
      </EmptyContent>
    </Empty>
  );
}
