import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserDropdown } from "./SidebarUserDropdown";

export const PrimarySidebar = () => {
  return (
    <Sidebar collapsible="icon" className="bg-white">
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserDropdown />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
