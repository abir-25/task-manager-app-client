import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

export const SidebarUserDropdown = () => {
  const queryClient = useQueryClient();
  const userInfo = useGlobalStore(s => s.userInfo)
  const logOut = useGlobalStore(s => s.clearStore)
  const { isMobile } = useSidebar()
  const navigate = useNavigate();

  return (
    <SidebarMenu className="hover:bg-accent rounded-lg">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userInfo?.profileImgUrl || undefined} alt={userInfo?.name || 'profile image'} />
                <AvatarFallback className="rounded-lg capitalize">{userInfo?.name?.[0] || userInfo?.email[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userInfo?.name}</span>
                <span className="truncate text-xs">{userInfo?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userInfo?.profileImgUrl || undefined} alt={userInfo?.name || 'profile image'} />
                  <AvatarFallback className="rounded-lg capitalize">{userInfo?.name?.[0] || userInfo?.email[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userInfo?.name}</span>
                  <span className="truncate text-xs">{userInfo?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              navigate('/profile-settings')
            }} className="cursor-pointer">
              <BadgeCheck />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              logOut();
              queryClient.clear();
              setThemeColor(DEFAULT_THEME_COLOR);
              navigate('/login')
            }} className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
