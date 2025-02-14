import { useEffect, useState } from "react";
import { AppSidebar } from "./components/ui/sidebar/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar/sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(
    () => localStorage.getItem("sidebar_state") === "true"
  );

  useEffect(() => {
    localStorage.setItem("sidebar_state", String(isOpen));
  }, [isOpen]);

  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
}
