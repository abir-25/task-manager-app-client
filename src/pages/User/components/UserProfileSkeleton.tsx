import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const UserProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-[250px] bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[180px] relative z-10">
        {/* Profile Header Skeleton */}
        <div className="flex justify-end mb-6">
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Profile Card Skeleton */}
          <div className="col-span-12 md:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 text-center">
                <Skeleton className="h-32 w-32 mx-auto rounded-full" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-6 w-48 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards Skeleton */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            {/* Personal Information Card Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-6 text-slate-800">
                <Skeleton className="h-6 w-48" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(6)].map((_, idx) => (
                  <Card key={idx} className="border-primary/10">
                    <CardHeader>
                      <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
