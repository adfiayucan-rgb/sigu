export const IMPORT_ALERTS = {
  duplicated: {
    variant: "warning",
    title: "Algunas materias ya existen",
    description: "Las siguientes materias no se importarán porque ya existen en tu plan de estudio.",
  },

  allDuplicated: {
    variant: "warning",
    title: "No hay materias para importar",
  },

  validationError: {
    variant: "error",
    title: "Se encontraron errores",
  },

  databaseError: {
    variant: "error",
    title: "Error al importar las materias",
  },

  extractError: {
    variant: "error",
    title: "No se pudieron obtener las materias del pdf",
    description: "",
  },

  emptyFile: {
    variant: "error",
    title: "Sin pdf cargado",
    description: "No hay pdf cargado, debe cargar el pdf de las materias para poder importar",
  },

  success: {
    variant: "success",
    title: "Materias importadas",
  },
} as const;


export type MateriaImportAlertData = {
  variant: "success" | "warning" | "error";
  title: string;
  description: string;
  items?: string[];
};
