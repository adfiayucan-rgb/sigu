"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MateriaFormData } from "../../schemas";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLORES_MATERIA } from "@/lib/constants/materia";

export const columns: ColumnDef<MateriaFormData>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    
    // cell: ({ row }) => (
    //   <Input
    //     value={row.original.nombre}
    //     onChange={(e) => {
    //       // actualizar la materia
    //     }}
    //   />
    // ),
  },
  {
    accessorKey: "creditos",
    header: "Créditos",
    // cell: ({ row }) => (
    //   <Input
    //     type="number"
    //     value={row.original.creditos}
    //     onChange={(e) => {
    //       // actualizar créditos
    //     }}
    //   />
    // ),
  },
  {
    accessorKey: "color_hex",
    header: "Color",
    cell: ({ row }) => (
      <Select>
        <SelectTrigger
          className="w-full h-12" // Puedes ajustar el ancho y alto según tu diseño          
        >
          <SelectValue placeholder="Elige" />
        </SelectTrigger>

        <SelectContent>
          {/* Contenedor de los items. Puedes usar una grid si tienes muchos colores y quieres que se vea tipo paleta */}
          <div className="grid grid-cols-4 gap-2 p-2 sm:grid-cols-1 sm:gap-0 sm:p-0">
            {COLORES_MATERIA.map((c) => (
              <SelectItem
                key={c}
                value={c}
                // shadcn añade un checkmark por defecto.
                // Ajustamos el padding para que el color quede bien alineado.
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-6 w-6 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                  {/* Opcional: mostrar el código hex o nombre del color. Puedes borrar este span si solo quieres el círculo */}
                  {/* <span className="text-sm font-medium uppercase text-muted-foreground hidden sm:block">{c}</span> */}
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    ),
  },
];
