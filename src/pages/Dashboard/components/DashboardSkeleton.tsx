import { Skeleton } from "@/components/ui/skeleton";

export const TaskStatusReportSkeleton = () => (
  <div className="rounded-xl border bg-card text-card-foreground shadow">
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  </div>
);
