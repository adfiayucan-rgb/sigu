"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MateriaFormDialog } from "./materia-form-dialog";
import { Plus } from "lucide-react";

export function MateriaNewButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        <Plus data-icon="inline-start" /> Nueva materia
      </Button>
      <MateriaFormDialog mode="create" open={open} onOpenChange={setOpen} />
    </>
  );
}
