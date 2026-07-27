import { AnimatePresence, motion } from "motion/react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Spinner } from "@/components/ui/spinner";
import { FileIcon, XIcon } from "lucide-react";

type Props = {
    pendingUpload: boolean
    name: string,
    size: number,
    onClearImport: () => void;
}

export function MateriaImportAttachment({pendingUpload, name, size, onClearImport} : Props) {
    return (
        <motion.div
            key="attachment"
            layout
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Attachment state={pendingUpload ? "uploading" : "done"} className="w-full">
              <AttachmentMedia>
                <AnimatePresence mode="wait">
                  {pendingUpload ? (
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Spinner />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <FileIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </AttachmentMedia>

              <AttachmentContent>
                <AttachmentTitle>{name}</AttachmentTitle>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={pendingUpload ? "processing" : "done"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <AttachmentDescription>
                      {pendingUpload ? "Procesando PDF..." : `PDF · ${(size / 1024).toFixed(1)} KB`}
                    </AttachmentDescription>
                  </motion.div>
                </AnimatePresence>
              </AttachmentContent>

              <AttachmentActions>
                <AttachmentAction disabled={pendingUpload} onClick={onClearImport} aria-label="Eliminar PDF">
                  <XIcon />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          </motion.div>
    )
}