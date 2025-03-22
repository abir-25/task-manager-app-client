import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TaskListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-screen">
      {[1, 2, 3].map((index) => (
        <div key={index} className="bg-gray-100 p-3">
          <Skeleton className="h-6 w-35 bg-gray-200 mb-3" />
          <Card key={index + 1} className="rounded-sm mb-2 border-0 shadow-xs">
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full mt-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
          <Card key={index + 2} className="rounded-sm mb-2 border-0 shadow-xs">
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full mt-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
          <Card key={index + 3} className="rounded-sm mb-2 border-0 shadow-xs">
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full mt-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
          <Card key={index + 4} className="rounded-sm mb-2 border-0 shadow-xs">
            <CardHeader>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full mt-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  );
};
