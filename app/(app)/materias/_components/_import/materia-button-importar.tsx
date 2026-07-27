"use client";

import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { MateriaImportarDialog } from "./materia-importar-dialog";
import { useState } from "react";

export function MateriaButtonImportar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(true)}>
        <Import data-icon="inline-start" /> Importar materias
      </Button>

      <MateriaImportarDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
