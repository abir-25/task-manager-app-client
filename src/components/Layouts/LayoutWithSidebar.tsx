import { PrimarySidebar } from "@/components/Sidebar/PrimarySidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DEFAULT_THEME_COLOR, setThemeColor } from "@/lib/theme";
import { useGlobalStore } from "@/store/global-store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const LayoutWithSidebar = () => {
  const isSidebarExpanded = useGlobalStore((S) => S.isSidebarExpanded);
  const toggleSidebar = useGlobalStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const userInfo = useGlobalStore((s) => s.userInfo);
  const logout = useGlobalStore((s) => s.clearStore);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userInfo || !userInfo?.jwToken) {
      logout();
      queryClient.clear();
      setThemeColor(DEFAULT_THEME_COLOR);
      navigate("/login");
      return;
    }
  }, [userInfo]);

  return (
    <SidebarProvider
      defaultOpen
      open={isSidebarExpanded}
      onOpenChange={toggleSidebar}
    >
      <PrimarySidebar />
      <SidebarInset className="w-full bg-white h-full overflow-y-hidden">
        <div className="relative w-full h-[calc(100vh-80px)] overflow-y-auto">
          <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-gray-50/80 to-zinc-100/50">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-soft-light" />
          </div>

          <div className="relative px-4 w-full h-full">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
