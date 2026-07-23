
import { ActividadConMateria } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { Calendar, ClipboardCheck, MapPin, Notebook, Pencil, Shapes, Trash2 } from "lucide-react";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { hexToRgba } from "@/lib/utils";
import { Button } from "../ui/button";
import { DateFormat, formatDate } from "@/lib/format-date";
import { formatTimeRange } from "@/lib/format-date-range";

type Props = {
  actividad: ActividadConMateria;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (actividad: ActividadConMateria) => void;
  onEdit: (actividad: ActividadConMateria) => void;
};

export function ActividadDetail({ actividad, open, onOpenChange, onDelete, onEdit }: Props) {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Detalle de Actividad</SheetTitle>
          </SheetHeader>

          <FieldGroup className="flex-1 no-scrollbar overflow-y-auto p-8">
            <Badge
              style={{
                backgroundColor: hexToRgba(actividad.materia.color_hex, 0.15),
                color: actividad.materia.color_hex,
              }}
            >
              {actividad.materia.nombre}
            </Badge>

            <FieldSet>
              <FieldLegend className="text-2xl!">{actividad.titulo}</FieldLegend>
              <FieldDescription>{actividad.descripcion}</FieldDescription>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Informacion General</FieldLegend>
                  <FieldGroup>
                    <ItemGroup className="max-w-sm">
                      {actividad.hora_inicio && actividad.hora_fin && (
                        <Item>
                          <ItemMedia variant="icon">
                            <Calendar color="blue" />
                          </ItemMedia>
                          <ItemContent className="gap-1">
                            <ItemTitle>FECHA Y HORA</ItemTitle>
                            <ItemDescription>
                              {formatDate(actividad.fecha_entrega, DateFormat.COMPACT)}{" · "}
                              {formatTimeRange(actividad.hora_inicio, actividad.hora_fin)}
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      )}

                      {actividad.lugar && (
                        <Item>
                          <ItemMedia variant="icon">
                            <MapPin />
                          </ItemMedia>
                          <ItemContent className="gap-1">
                            <ItemTitle>UBICACIÓN</ItemTitle>
                            <ItemDescription>Aula 302 - Edificio de Ciencias</ItemDescription>
                          </ItemContent>
                        </Item>
                      )}

                      <Item>
                        <ItemMedia variant="icon">
                          <Shapes />
                        </ItemMedia>
                        <ItemContent className="gap-1">
                          <ItemTitle>TIPO DE ACTIVIDAD</ItemTitle>
                          <ItemDescription>{actividad.tipo}</ItemDescription>
                        </ItemContent>
                      </Item>

                      <Item>
                        <ItemMedia variant="icon">
                          <ClipboardCheck />
                        </ItemMedia>
                        <ItemContent className="gap-1">
                          <ItemTitle>ESTADO</ItemTitle>
                          <ItemDescription>{actividad.completada ? "Completada" : "Pendiente"} </ItemDescription>
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                  </FieldGroup>
                </FieldSet>

                <Alert>
                  <Notebook />
                  <AlertTitle>Notas.</AlertTitle>
                  <AlertDescription>
                    <ul>
                      <li>Subir archivo en formato PDF.</li>
                      <li>Incluir bibliografía en formato APA.</li>
                      <li>Máximo 10 páginas de contenido.</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>

          <SheetFooter>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => onEdit(actividad)}>
                <Pencil data-icon="inline-start" /> Editar
              </Button>
              <SheetClose asChild>
                <Button className="flex-1" variant="destructive" onClick={() => onDelete(actividad)}>
                  <Trash2 data-icon="inline-start" /> Eliminar
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
