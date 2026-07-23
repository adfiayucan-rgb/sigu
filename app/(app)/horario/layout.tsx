// horario/layout.tsx

import { HorarioHeader } from "./_components/horario-header";
import { HorarioLegend } from "./_components/horario-legend";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HorarioHeader />
      {children}
      <HorarioLegend />
    </>
  );
}