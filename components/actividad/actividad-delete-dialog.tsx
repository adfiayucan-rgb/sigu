import { Actividad } from "@/lib/types";
import { DeleteModal } from "../delete-modal";
import { deleteActividadAction } from "@/actions/actividad";
import { toast } from "sonner";

type Props = {
  id: string;
  titulo: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ActividadDeleteDialog({ id, titulo, open, onOpenChange }: Props) {
  async function handleDelete() {
    const { success, message } = await deleteActividadAction(id);

    if (success) {
      toast.success(message);
      onOpenChange(false);
    } else {
      toast.error(message);
      console.error(message);
    }
  }
  return (
    <>
      <DeleteModal
        open={open}
        onOpenChange={onOpenChange}
        title="¿Deseas eliminar la actividad?"
        description={`Esta acción no se puede deshacer. La actividad "${titulo}" se borrará
            permanentemente.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
