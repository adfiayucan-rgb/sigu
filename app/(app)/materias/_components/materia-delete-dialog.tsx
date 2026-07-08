import { DeleteModal } from "@/components/delete-modal";
import { deleteMateriaAction } from "../actions";
import { MateriaWithDetails } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  materia: MateriaWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MateriaDeleteDialog({ materia, open, onOpenChange }: Props) {
  const { id, nombre } = materia;

  async function handleDelete() {
    const { success, message } = await deleteMateriaAction(id);
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
        title={`¿Eliminar ${nombre}?`}
        description="Esta acción no se puede deshacer. La materia se borrará
            permanentemente."
        onConfirm={handleDelete}
      />
    </>
  );
}
