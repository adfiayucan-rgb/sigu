"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MateriaFormDialog } from "./materia-form-dialog";

export function MateriaNewButton({ semestreId }: { semestreId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Nueva materia</Button>
      {/* //TODO: QUITAR EL SEMESTREID */}
      <MateriaFormDialog mode="create" open={open} onOpenChange={setOpen} semestreId={semestreId} />
    </>
  );
}
