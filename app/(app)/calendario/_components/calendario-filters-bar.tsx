import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { SearchIcon } from "lucide-react";
import type { MateriaParaSelect } from "@/lib/types/materia";
import type { FiltrosState } from "@/lib/types/common";

type Props = {
  filtros: FiltrosState;
  onBusqueda: (q: string) => void;
  onToggleMateria: (m: string[]) => void;
  onClearFiltros: () => void;
  materias: MateriaParaSelect[];
};
export function CalendarioFiltersBar({ filtros, materias, onBusqueda, onClearFiltros, onToggleMateria }: Props) {
  const hasFiltros = filtros.busqueda || filtros.materias.length > 0;
  const anchor = useComboboxAnchor();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-50 max-w-75">
        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Buscar actividades..."
            value={filtros.busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Subject filter pills */}
      <Combobox items={materias.map((m) => m.nombre)} multiple value={filtros.materias} onValueChange={onToggleMateria}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {filtros.materias.map((item) => (
              <ComboboxChip key={item}>{item}</ComboboxChip>
            ))}
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Filtrar por materias" />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      
      {hasFiltros && (
        <button onClick={onClearFiltros} className="text-[12px] underline cursor-pointer">
          Limpiar
        </button>
      )}
    </div>
  );
}
