import { getMateriasConDetalles } from "@/lib/materias/queries";
import { MateriaStats } from "./_components/materia-stats";
import { MateriaList } from "./_components/materia-list";

export default async function MateriasPage() {
  const materias = await getMateriasConDetalles();

  return (
    <>
      <MateriaStats />
      <MateriaList materias={materias} />
    </>
  );
}
