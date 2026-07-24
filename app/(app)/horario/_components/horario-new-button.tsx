"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { HorarioFormDialog } from "./horario-form-dialog";

export function HorarioNewButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="cursor-pointer" onClick={() => setOpen(true)}>
        <Plus data-icon="inline-start" /> Añadir horario
      </Button>

      <HorarioFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
