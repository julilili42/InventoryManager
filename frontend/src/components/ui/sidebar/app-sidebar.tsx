// app-sidebar.tsx
import { PackageSearch, UserSearch, FolderSearch } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            <SidebarGroupLabel className="text-lg font-semibold">
              Inventory Manager
            </SidebarGroupLabel>
          </motion.div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: 0.05 * index }}
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="text-lg font-medium">
                        <item.icon className="size-6" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
