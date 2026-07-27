import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "motion/react";

type Props = {
  rows?: number;
};

export function MateriaTableImportSkeleton({ rows = 5 }: Props) {
  return (
    <motion.div
      key="skeleton"
      className="overflow-hidden rounded-md border"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Créditos</TableHead>
            <TableHead>Color</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-56" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-5 w-10" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-6 w-6 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
