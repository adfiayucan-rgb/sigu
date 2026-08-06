import { MateriaParaSelect } from "@/lib/types/materia";


type Props = {
    materias: MateriaParaSelect[]
}
export function CalendarioLegend({materias} : Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-2">
      {materias.map(({ id, nombre, color_hex }) => (
        <div key={id} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: color_hex }}
          />
          <span className="text-[13px] text-[#45464d]">{nombre}</span>
        </div>
      ))}
    </div>
  );
}
