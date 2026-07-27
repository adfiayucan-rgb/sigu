"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { createMateriasAction, procesarMateriasPdf } from "../../actions";
import { MateriaTableImport } from "./materia-table-import";
import { MateriaFormData } from "../../schemas";
import { MateriaImportAlert } from "./materia-import-alert";
import { MateriaUploadPdf } from "./materia-upload-pdf";
import { AnimatePresence, motion } from "motion/react";
import { MateriaImportAttachment } from "./materia-import-attachment";
import { MateriaTableImportSkeleton } from "./materia-import-table-skeleton";
import { IMPORT_ALERTS, MateriaImportAlertData } from "../../utils/types";
import { crearAlertaImportacion } from "../../utils/crear-alerta-importacion";
import { formatZodArrayErrorsToItems } from "@/lib/utils";

type Props = {
  onPendingChange: (pending: boolean) => void;
  onSuccess: () => void;
  onHasChange: (hasChange: boolean) => void;
};

export function MateriaImportar({ onSuccess, onPendingChange, onHasChange }: Props) {
  // Estado del archivo
  const [archivoPdf, setArchivoPdf] = useState<File | null>(null);

  // Estado de las materias
  const [materiasNuevas, setMateriasNuevas] = useState<MateriaFormData[]>([]);
  const [materiasExistentes, setMateriasExistentes] = useState<string[]>([]);

  // Estado de la interfaz
  const [alertaManual, setAlertaManual] = useState<MateriaImportAlertData | null>(null);

  // Estado de la importación
  // const [importandoMaterias, iniciarImportacion] = useTransition();
  const [importandoMaterias, setImportandoMaterias] = useState(false)
  const [procesandoPdf, setProcesandoPdf] = useState(false);

  const handleImportarMaterias = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!archivoPdf) {
      setAlertaManual({ ...IMPORT_ALERTS.emptyFile });
      return;
    }

    setImportandoMaterias(true)
    try {
      const { success, message, title ,errors } = await createMateriasAction(materiasNuevas);
  
      if (!success) {
        setAlertaManual({
          title: title ?? "Error al crear las materias",
          variant: "error",
          description: message,
          items: formatZodArrayErrorsToItems(errors),
        });
        console.error(message, errors);
        return;
      }
  
      toast.success(message);
      onSuccess();    
    } finally {
      setImportandoMaterias(false);
    }

  };

  const reiniciarImportacion = () => {
    setArchivoPdf(null);
    setMateriasNuevas([]);
    setMateriasExistentes([]);
    setAlertaManual(null);
  };

  async function procesarPdf(pdf: File) {
    setAlertaManual(null);
    setProcesandoPdf(true);
    setArchivoPdf(pdf);

    try {
      const resultado = await procesarMateriasPdf(pdf);
      if (!resultado.success) {
        setAlertaManual({
          title: "Error al procesar el PDF",
          description: resultado.message,
          variant: "error",
        });
        return;
      }

      if (!resultado.data) {
        setAlertaManual({ ...IMPORT_ALERTS.extractError });
        return;
      }

      const { materiasExistentes, materiasNuevas } = resultado.data;

      setMateriasExistentes(materiasExistentes);
      setMateriasNuevas(materiasNuevas);
    } finally {
      setProcesandoPdf(false);
    }
  }

  const hayCambios = archivoPdf !== null || materiasNuevas.length > 0 || materiasExistentes.length > 0;
  const alertaDerivada = crearAlertaImportacion(materiasNuevas, materiasExistentes, archivoPdf !== null, procesandoPdf);
  const alertaActual = alertaManual ?? alertaDerivada;

  useEffect(() => {
    onHasChange(hayCambios);
  }, [hayCambios, onHasChange]);

  // Escuchamos el pending al momento de subir el pdf
  useEffect(() => {
    onPendingChange(importandoMaterias);
  }, [importandoMaterias, onPendingChange]);

  const mostrarTabla = !procesandoPdf && materiasNuevas.length > 0;

  return (
    <motion.form
      id="materias-importar"
      layout
      className="space-y-6 no-scrollbar max-h-[60vh] overflow-y-auto"
      onSubmit={handleImportarMaterias}
    >
      <AnimatePresence mode="wait">{alertaActual && <MateriaImportAlert alert={alertaActual} />}</AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {archivoPdf && (
          <MateriaImportAttachment
            name={archivoPdf.name}
            size={archivoPdf.size}
            onClearImport={reiniciarImportacion}
            pendingUpload={procesandoPdf}
          />
        )}
        {!archivoPdf && <MateriaUploadPdf onSeleccionarPdf={procesarPdf} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {procesandoPdf && <MateriaTableImportSkeleton rows={4} />}
        {mostrarTabla && <MateriaTableImport materias={materiasNuevas} onDataChange={setMateriasNuevas} />}
      </AnimatePresence>
    </motion.form>
  );
}
