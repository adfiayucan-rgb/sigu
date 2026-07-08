"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useTransition } from "react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
};

export function DeleteModal({ open, title, description, onConfirm, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await onConfirm();
        onOpenChange(false);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent >
        <AlertDialogHeader>
          {/* <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia> */}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel >Cancelar</AlertDialogCancel>
          <AlertDialogAction  onClick={handleConfirm} disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
