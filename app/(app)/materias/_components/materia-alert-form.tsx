import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MateriaAlertForm({errors} : {errors: Record<string, string[]>}) {
    
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Error en el formulario</AlertTitle>
      <AlertDescription>
        Hay problemas con los datos de la materia. Por favor, revisa los campos marcados en rojo e intenta de nuevo.
      </AlertDescription>
    </Alert>
  );
}
