import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Home, File } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

type NavLink = {
  name: string;
  url: string;
  icon: React.ElementType;
};

const navlinks: NavLink[] = [
  {
    name: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    name: "Tasks",
    url: "/tasks",
    icon: File,
  },
];

export const SidebarNav = () => {
  const location = useLocation();

  const isActive = (url: string) => {
    const pathName = location.pathname;

    if (url === "/" && pathName === "/") {
      return true;
    }
    return url !== "/" && pathName.startsWith(url);
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navlinks.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              className={cn(
                "hover:bg-accent",
                isActive(item.url) && "bg-accent font-medium"
              )}
            >
              <NavLink to={item.url}>
                <item.icon className="mr-2" />
                {item.name}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
