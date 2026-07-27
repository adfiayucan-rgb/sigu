import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MateriaImportar } from "./materia-importar";
import { Button } from "@/components/ui/button";
import { BookUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MateriaImportarDialog({ open, onOpenChange }: Props) {
  const [pending, setPending] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  // Al padre le puede llegar un onOpenChange(false) "fantasma" justo
  // después de cerrar el AlertDialog anidado (por el manejo de foco entre
  // los dos overlays de Radix). Este ref absorbe esa llamada sin bloquear
  // cierres legítimos posteriores.
  const suppressParentCloseRef = useRef(false);

  // Evita que hasChanges quede "pegado" de una importación anterior
  // la próxima vez que se abra el diálogo.
  useEffect(() => {
    if (!open) setHasChanges(false);
  }, [open]);

  const handleAlertOpenChange = (next: boolean) => {
    if (!next) {
      suppressParentCloseRef.current = true;
      setTimeout(() => {
        suppressParentCloseRef.current = false;
      }, 0);
    }
    setOpenAlert(next);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (suppressParentCloseRef.current) return;

    if (nextOpen) {
      onOpenChange(true);
      return;
    }

    if (hasChanges) {
      setOpenAlert(true);
      return;
    }

    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar materias</DialogTitle>
            <DialogDescription>
              Selecciona el archivo PDF con tu reporte de materias. Revisaremos la información extraída para que
              puedas verificarla antes de importarla.
            </DialogDescription>
          </DialogHeader>
          <MateriaImportar
            onPendingChange={setPending}
            onSuccess={() => onOpenChange(false)}
            onHasChange={setHasChanges}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" form="materias-importar" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : <BookUp data-icon="inline-start" />}
              {pending ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openAlert} onOpenChange={handleAlertOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar importación?</AlertDialogTitle>
            <AlertDialogDescription>
              Se perderá el archivo seleccionado y todas las materias importadas que aún no hayas guardado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir importando</AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}