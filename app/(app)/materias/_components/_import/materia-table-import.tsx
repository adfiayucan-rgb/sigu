"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MateriaFormData } from "../../schemas";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLORES_MATERIA } from "@/lib/types";
import { motion } from "motion/react";

interface Props {
  materias: MateriaFormData[];
  onDataChange: Dispatch<SetStateAction<MateriaFormData[]>>;
}

export function MateriaTableImport({ materias, onDataChange }: Props) {
  const columns = useMemo<ColumnDef<MateriaFormData>[]>(
    () => [
      {
        id: "fila",
        header: "Fila",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "codigo",
        header: "Código"
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
      },
      {
        accessorKey: "creditos",
        header: "Créditos",
      },
      {
        accessorKey: "color_hex",
        header: "Color",
        cell: ({ getValue, row, column, table }) => (
          <Select onValueChange={(e) => table.options.meta?.updateData(row.index, column.id, e)}>
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
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-6 w-6 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: materias,
    columns,
    getCoreRowModel: getCoreRowModel(),

    meta: {
      updateData: (rowIndex, columnId, value) => {
        onDataChange((old) =>
          old.map((row, index) =>
            index === rowIndex
              ? {
                  ...row,
                  [columnId]: value,
                }
              : row,
          ),
        );
      },
    },
  });

  return (
    <motion.div
      key="table"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-md border"
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
