import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  view: string;
  onViewChange: (view: string) => void;
};

export function CalendarioViewToggle({ view, onViewChange }: Props) {
  return (
    <ToggleGroup variant={"outline"} type="single" value={view} onValueChange={(value) => onViewChange(value)}>
      <ToggleGroupItem value="dia">Día</ToggleGroupItem>
      <ToggleGroupItem value="semana">Semana</ToggleGroupItem>
      <ToggleGroupItem value="mes">Mes</ToggleGroupItem>
    </ToggleGroup>
  );
}
