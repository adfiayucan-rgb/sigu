import { AlertCircleIcon, CheckCircle2Icon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "motion/react";
import { MateriaImportAlertData } from "../../utils/types";



const variants = {
  success: {
    icon: CheckCircle2Icon,
    className: "border-green-500/50 text-green-700 dark:text-green-400",
  },
  warning: {
    icon: TriangleAlertIcon,
    className: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400",
  },
  error: {
    icon: AlertCircleIcon,
    className: "border-destructive/50 text-destructive",
  },
} satisfies Record<
  MateriaImportAlertData["variant"],
  {
    icon: React.ElementType;
    className: string;
  }
>;

type Props = {
  alert: MateriaImportAlertData;
};
export function MateriaImportAlert({ alert }: Props) {
  const { icon: Icon, className } = variants[alert.variant];

  return (
    <motion.div
      key="alert"
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Alert className={className}>
        <Icon className="h-4 w-4" />

        <AlertTitle>{alert.title}</AlertTitle>

        <AlertDescription className="space-y-3">
          <p>{alert.description}</p>

          {alert.items && alert.items.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {alert.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
