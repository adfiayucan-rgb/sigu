import { Skeleton } from "@/components/ui/skeleton";

export function CalendarioSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-6 flex-1 min-h-0">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-75" />
          <Skeleton className="h-9 w-53.25" />
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-2 md:items-end justify-between w-full mb-4">
          <Skeleton className="h-9 w-78" />
          <Skeleton className="h-9 w-44.5" />
        </div>
        <Skeleton className="h-141 w-287.5" />
      </div>
    </>
  );
}
