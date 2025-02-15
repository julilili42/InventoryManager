// app-sidebar.tsx
import { PackageSearch, UserSearch, FolderSearch } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar/sidebar";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "Articles",
    url: "/articles",
    icon: PackageSearch,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: UserSearch,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: FolderSearch,
  },
];

export function AppSidebar() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div>
            <SidebarGroupLabel className="text-lg font-semibold">
              Inventory Manager
            </SidebarGroupLabel>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <div>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a
                          href={item.url}
                          className={`text-lg font-medium flex items-center gap-2 p-2 rounded-md ${
                            isActive
                              ? "bg-gray-100 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="size-6" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
