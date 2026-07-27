import { MateriaFormDataImport } from "../schemas";
import { IMPORT_ALERTS, MateriaImportAlertData } from "./types";

export function crearAlertaImportacion(
  materiasNuevas: MateriaFormDataImport[],
  materiasExistentes: string[],
  pdfCargado: boolean,
  procesandoPdf: boolean
): MateriaImportAlertData | null {
  
  console.log("materias existentes", materiasExistentes);
  console.log("materias nuevas", materiasNuevas);
  console.log("procesando pdf: ", procesandoPdf);
  
  if (!pdfCargado || procesandoPdf) return null;
  if (materiasNuevas.length === 0 && materiasExistentes.length === 0) return { ...IMPORT_ALERTS.extractError };
  if (materiasNuevas.length === 0 && materiasExistentes.length > 0)
    return {
      ...IMPORT_ALERTS.allDuplicated,
      description: "Todas las materias del PDF ya existen en tu plan de estudio.",
    };
  if (materiasExistentes.length > 0)
    return {
      ...IMPORT_ALERTS.duplicated,
      items: materiasExistentes,
    };
  return null;
}
