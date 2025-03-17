import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarCompanySwitcher } from "./SidebarCompanySwither";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserDropdown } from "./SidebarUserDropdown";

export const PrimarySidebar = () => {
  return (
    <Sidebar collapsible="icon" className="bg-white">
      <SidebarHeader>
        <SidebarCompanySwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserDropdown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
