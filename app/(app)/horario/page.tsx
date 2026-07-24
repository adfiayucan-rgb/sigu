import { getHorariosConMateria } from "@/lib/horario/queries";
import { HorarioStats } from "./_components/horario-stats";
import { HorarioGrid } from "./_components/horario-grid";

export default async function HorarioPage() {
  const horarios = await getHorariosConMateria();
  return (
    <div className="flex flex-col gap-6">
      <HorarioStats horarios={horarios} />
      <HorarioGrid horarios={horarios} />
    </div>
  );
}
