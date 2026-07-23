import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo } from "react";

type Props = {
  view: string;
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
};

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function CalendarioMesNavegacion({ currentDate, view, onCurrentDateChange }: Props) {
  const navigatePrev = useCallback(() => {
    if (view === "mes") onCurrentDateChange(subMonths(currentDate, 1));
    else if (view === "semana") onCurrentDateChange(subWeeks(currentDate, 1));
    else onCurrentDateChange(subDays(currentDate, 1));
  }, [view, currentDate, onCurrentDateChange]);

  const navigateNext = useCallback(() => {
    if (view === "mes") onCurrentDateChange(addMonths(currentDate, 1));
    else if (view === "semana") onCurrentDateChange(addWeeks(currentDate, 1));
    else onCurrentDateChange(addDays(currentDate, 1));
  }, [view, currentDate, onCurrentDateChange]);

  const years = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  }, [currentDate]);

  const handleMonthChange = (month: string) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(1);
    nextDate.setMonth(Number(month));
    nextDate.setDate(
      Math.min(currentDate.getDate(), new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()),
    );

    onCurrentDateChange(nextDate);
  };

  const handleYearChange = (year: string) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(1);
    nextDate.setFullYear(Number(year));
    nextDate.setDate(
      Math.min(currentDate.getDate(), new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()),
    );

    onCurrentDateChange(nextDate);
  };

  return (
    <div className="flex items-center gap-2">
      <ButtonGroup>
        <Button onClick={navigatePrev} variant="outline" size="icon" className="cursor-pointer">
          <ChevronLeft />
        </Button>

        {/* Mes */}
        <Select value={currentDate.getMonth().toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-36 rounded-none border-x-0">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {MONTHS.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Año */}
        <Select value={currentDate.getFullYear().toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-24 rounded-none border-l-0">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={navigateNext} variant="outline" size="icon" className="cursor-pointer">
          <ChevronRight />
        </Button>
      </ButtonGroup>
    </div>
  );
}
