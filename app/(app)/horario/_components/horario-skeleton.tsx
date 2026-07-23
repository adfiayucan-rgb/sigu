import { Skeleton } from "@/components/ui/skeleton";

export function HorarioSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end gap-3">
        <Skeleton className="w-27.75 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
      <Skeleton className="h-175 rounded-xl" />
    </div>
  );
}
