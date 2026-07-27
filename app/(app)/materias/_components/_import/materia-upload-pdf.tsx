"use client";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";
import { motion } from "motion/react";

type Props = {
  onSeleccionarPdf: (file: File) => void;
};

export function MateriaUploadPdf({ onSeleccionarPdf }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const abrirSelectorArchivo = () => {
    inputRef.current?.click();
  };

  const handleSeleccionarPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pdf = e.target.files?.[0];
    if (!pdf) return;

    onSeleccionarPdf(pdf);
  };

  return (
    <>
      <Input ref={inputRef} type="file" accept="application/pdf" onChange={handleSeleccionarPdf} className="hidden" />

      <motion.div
        key="upload"
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Empty className="border border-dashed" onClick={abrirSelectorArchivo}>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UploadIcon />
            </EmptyMedia>

            <EmptyTitle>Importa tus materias desde un PDF</EmptyTitle>

            <EmptyDescription>
              Selecciona el PDF exportado por la universidad para extraer automáticamente tus materias y revisarlas
              antes de agregarlas.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                abrirSelectorArchivo();
              }}
            >
              Seleccionar PDF
            </Button>
          </EmptyContent>
        </Empty>
      </motion.div>
    </>
  );
}
