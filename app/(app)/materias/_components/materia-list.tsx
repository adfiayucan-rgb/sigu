import { MateriaCard } from "@/components/materias/materia-card";
import { MateriaWithDetails } from "@/lib/types";
import { MateriaEmpty } from "./materia-empty";

type Props = {
  materias: MateriaWithDetails[];
};

export function MateriaList({ materias }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {materias.length === 0 ? (
        <MateriaEmpty />
      ) : (
        materias.map((materia) => <MateriaCard key={materia.id} materia={materia} />)
      )}
    </div>
  );
}
