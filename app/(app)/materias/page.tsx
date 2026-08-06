import { getMaterias, getMateriaConHorarioYActividades } from "@/lib/materias/queries";
import { MateriaStats } from "./_components/materia-stats";
import { MateriaList } from "./_components/materia-list";
import { Materia } from "@/lib/types/materia";

export default async function MateriasPage() {
  const materias = await getMateriaConHorarioYActividades();

  return (
    <>
      <MateriaStats />
      <MateriaList materias={materias} />
    </>
  );
}
