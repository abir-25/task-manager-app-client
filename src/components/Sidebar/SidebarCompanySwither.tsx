import { ChevronsUpDown, Loader2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DEFAULT_THEME_COLOR, setThemeColor } from "@/lib/theme"
import { cn } from "@/lib/utils"
import { GET_ORG_INFO_WITH_ID, organizationQueryService } from "@/service/queries/organization.queries"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export const SidebarCompanySwitcher = () => {
  const queryClient = useQueryClient();
  const { data: orgList, isLoading } = organizationQueryService.useOrganizationList();
  const currentOrg = useGlobalStore(s => s.currentOrganization)
  const setCurrentOrg = useGlobalStore(s => s.updateCurrentOrganization)
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu className="hover:bg-accent rounded-lg">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentOrg?.logoUrl || ''} alt={currentOrg?.title || 'company image'} />
                  <AvatarFallback className="rounded-lg capitalize">{currentOrg?.title[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentOrg?.title}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-sm text-muted-foreground">
              Organizations
            </DropdownMenuLabel>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              orgList && orgList?.organizationList?.length > 0 && orgList.organizationList.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => {
                    setCurrentOrg(org);
                    setThemeColor(org?.color || DEFAULT_THEME_COLOR);
                    queryClient.invalidateQueries({
                      queryKey: [GET_ORG_INFO_WITH_ID, org.id]
                    })
                  }}
                  className={cn('gap-2 p-2 cursor-pointer', org.id === currentOrg?.id && 'bg-accent')}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={org?.logoUrl || undefined} alt={org?.title || 'company image'} />
                      <AvatarFallback className="rounded-lg capitalize">{org?.title[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  {org.title}
                </DropdownMenuItem>
              ))

            )}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
