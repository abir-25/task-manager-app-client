import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export const SidebarSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* Company Switcher Skeleton */}
      <SidebarHeader className="px-2 py-4">
        <SidebarMenu className="hover:bg-accent/50 rounded-lg transition-colors">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-3">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-muted/80">
                <Skeleton className="h-9 w-9 rounded-lg animate-pulse" />
              </div>
              <div className="grid flex-1 gap-1 text-left">
                <Skeleton className="h-4 w-32 animate-pulse" />
                <Skeleton className="h-3 w-24 animate-pulse" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation Skeleton */}
      <SidebarContent className="px-2">
        {/* Primary Navigation Group */}
        <SidebarGroup className="pb-4">
          <SidebarMenu>
            {Array.from({ length: 3 }).map((_, index) => (
              <SidebarMenuItem key={`primary-${index}`}>
                <SidebarMenuButton className="gap-3 py-2">
                  <Skeleton className={cn("h-5 w-5 animate-pulse", {
                    "opacity-60": index > 0,
                  })} />
                  <Skeleton className={cn("h-4 w-28 animate-pulse", {
                    "opacity-60": index > 0,
                  })} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Secondary Navigation Group */}
        <SidebarGroup className="pb-4">
          <div className="mb-2 px-4">
            <Skeleton className="h-3 w-16 animate-pulse opacity-70" />
          </div>
          <SidebarMenu>
            {Array.from({ length: 4 }).map((_, index) => (
              <SidebarMenuItem key={`secondary-${index}`}>
                <SidebarMenuButton className="gap-3 py-2">
                  <Skeleton className={cn("h-5 w-5 animate-pulse opacity-50", {
                    "opacity-40": index > 0,
                  })} />
                  <Skeleton className={cn("h-4 w-24 animate-pulse opacity-50", {
                    "opacity-40": index > 0,
                  })} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Skeleton */}
      <SidebarGroup className="mt-auto px-2 pb-4">
        <SidebarMenu className="hover:bg-accent/50 rounded-lg transition-colors">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="gap-3">
              <div className="relative">
                <Skeleton className="h-9 w-9 rounded-full animate-pulse" />
                <Skeleton className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background animate-pulse" />
              </div>
              <div className="grid flex-1 gap-1 text-left">
                <Skeleton className="h-4 w-28 animate-pulse" />
                <Skeleton className="h-3 w-20 animate-pulse opacity-70" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
} 